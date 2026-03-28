import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { buildPathFromPrev, generateRandomGraph, GraphData } from './shared';

export const generateBestFirstStates = (source = 0, nodeCount = 6): AlgorithmResult<GraphData> => {
  const { nodes, edges } = generateRandomGraph(nodeCount);
  const target = nodes.length - 1;
  const visited = Array(nodes.length).fill(false);
  const prev: Array<number | null> = Array(nodes.length).fill(null);
  
  const heuristic = (n: number) => {
    const dx = nodes[n].x - nodes[target].x;
    const dy = nodes[n].y - nodes[target].y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const pq: { node: number; h: number }[] = [{ node: source, h: heuristic(source) }];
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
        algorithm: 'best-first',
        nodes: [...nodes],
        edges: [...edges],
        distances: Array(nodes.length).fill(Infinity),
        visited: [...visited],
        current,
        path: [...path],
        source,
        target,
        queue: pq.map(i => i.node),
        parent: [...prev],
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: {
          pq: pq.map((item) => `${nodes[item.node].label}(h:${Math.round(item.h)})`).join(', ') || 'empty',
        },
      },
    });
  };

  record(OperationType.VISIT, source, [source], `Starting Best First Search. Priority Queue is ordered by heuristic h(n) estimation to target.`);

  while (pq.length > 0) {
    pq.sort((a, b) => a.h - b.h);
    const { node, h } = pq.shift()!;
    
    if (visited[node]) continue;
    visited[node] = true;
    
    record(OperationType.VISIT, node, [node], `Dequeued ${nodes[node].label} (h: ${Math.round(h)}).`);

    if (node === target) {
      const path = buildPathFromPrev(prev, target);
      record(OperationType.DONE, node, path, `Target reached! Path: ${path.map(i => nodes[i].label).join(' -> ')}.`, path);
      return { states, timeComplexity: 'O(b^m)', spaceComplexity: 'O(b^m)' };
    }

    const neighbors = edges.filter(e => e.from === node);
    for (const edge of neighbors) {
      const neighbor = edge.to;
      record(OperationType.COMPARE, node, [node, neighbor], `Inspecting ${nodes[neighbor].label}.`);
      
      if (!visited[neighbor]) {
        if (prev[neighbor] === null) prev[neighbor] = node;
        const hCost = heuristic(neighbor);
        pq.push({ node: neighbor, h: hCost });
        
        record(OperationType.OVERWRITE, neighbor, [neighbor], `Enqueuing ${nodes[neighbor].label} with h=${Math.round(hCost)}.`);
      }
    }
  }

  record(OperationType.DONE, null, [], `Search exhausted.`);
  return { states, timeComplexity: 'O(b^m)', spaceComplexity: 'O(b^m)' };
};
