import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { buildPathFromPrev, generateRandomGraph, GraphData } from './shared';

export const generateUCSStates = (source = 0, nodeCount = 6): AlgorithmResult<GraphData> => {
  const { nodes, edges } = generateRandomGraph(nodeCount);
  const target = nodes.length - 1;
  const visited = Array(nodes.length).fill(false);
  const prev: Array<number | null> = Array(nodes.length).fill(null);
  const distances = Array(nodes.length).fill(Infinity);
  distances[source] = 0;
  
  // A simple priority queue implementation where we sort on enqueue
  const pq: { node: number; cost: number }[] = [{ node: source, cost: 0 }];
  const states: AlgorithmState<GraphData>[] = [];
  let step = 0;

  const record = (
    operationType: OperationType,
    current: number | null,
    activeIndices: number[],
    message: string,
    path: number[] = []
  ) => {
    states.push({
      data: {
        algorithm: 'ucs',
        nodes: [...nodes],
        edges: [...edges],
        distances: [...distances],
        visited: [...visited],
        current,
        path: [...path],
        source,
        target,
        queue: pq.map(i => i.node), // visual queue representation
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: {
          pq: pq.map((item) => `${nodes[item.node].label}(${item.cost})`).join(', ') || 'empty',
        },
      },
    });
  };

  record(
    OperationType.VISIT,
    source,
    [source],
    `Starting UCS from ${nodes[source].label} with cost 0. The Priority Queue orders nodes by cumulative cost.`
  );

  while (pq.length > 0) {
    // pop the lowest cost node
    pq.sort((a, b) => a.cost - b.cost);
    const { node, cost } = pq.shift()!;
    
    if (visited[node]) continue;
    
    visited[node] = true;
    record(
      OperationType.VISIT,
      node,
      [node],
      `Dequeued ${nodes[node].label} (Cost: ${cost}).`
    );

    if (node === target) {
      const path = buildPathFromPrev(prev, target);
      record(
        OperationType.DONE,
        node,
        path,
        `Target ${nodes[target].label} reached with optimal cost ${cost}! Path: ${path.map(i => nodes[i].label).join(' -> ')}.`,
        path
      );
      return {
        states,
        timeComplexity: 'O(b^(1+C*/e))',
        spaceComplexity: 'O(b^(1+C*/e))',
      };
    }

    const neighbors = edges.filter(e => e.from === node);
    for (const edge of neighbors) {
      const neighbor = edge.to;
      record(
        OperationType.COMPARE,
        node,
        [node, neighbor],
        `Inspecting edge ${nodes[node].label} -> ${nodes[neighbor].label} (weight: ${edge.weight}).`
      );
      
      const newCost = cost + edge.weight;
      if (!visited[neighbor] && newCost < distances[neighbor]) {
        distances[neighbor] = newCost;
        prev[neighbor] = node;
        pq.push({ node: neighbor, cost: newCost });
        
        record(
          OperationType.OVERWRITE,
          neighbor,
          [neighbor],
          `Found a shorter path to ${nodes[neighbor].label} (New cost: ${newCost}). Enqueuing.`
        );
      }
    }
  }

  record(
    OperationType.DONE,
    null,
    [],
    `UCS complete. ${nodes[target].label} is unreachable.`
  );

  return {
    states,
    timeComplexity: 'O(b^(1+C*/e))',
    spaceComplexity: 'O(b^(1+C*/e))',
  };
};
