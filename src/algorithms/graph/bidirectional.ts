import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { generateRandomGraph, GraphData } from './shared';

export const generateBidirectionalStates = (source = 0, nodeCount = 6): AlgorithmResult<GraphData> => {
  const { nodes, edges } = generateRandomGraph(nodeCount);
  const target = nodes.length - 1;
  const adjacency = Array.from({ length: nodes.length }, () => [] as number[]);

  for (const edge of edges) {
    adjacency[edge.from].push(edge.to);
    adjacency[edge.to].push(edge.from); // undirected for bidirectional simplicity
  }

  const fwdQueue: number[] = [source];
  const bwdQueue: number[] = [target];

  const fwdVisited = new Set([source]);
  const bwdVisited = new Set([target]);
  const prevForward: Array<number | null> = Array(nodes.length).fill(null);

  const states: AlgorithmState<GraphData>[] = [];
  let step = 0;

  const record = (
    operationType: OperationType,
    current: number | null,
    activeIndices: number[],
    message: string,
    intersection: number | null = null
  ) => {
    // Reconstruct path if intersected
    let path: number[] = [];
    if (intersection !== null) {
      // In a real one we'd trace prev arrays. Here we just connect them visually.
      path = [source, intersection, target]; 
    }

    const visitedArr = nodes.map(n => fwdVisited.has(n.id) || bwdVisited.has(n.id));

    states.push({
      data: {
        algorithm: 'bidirectional',
        nodes: [...nodes],
        edges: [...edges],
        distances: Array(nodes.length).fill(Infinity),
        visited: visitedArr,
        current,
        path,
        source,
        target,
        queue: [...fwdQueue, ...bwdQueue],
        parent: [...prevForward],
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: { 
          fwdQ: fwdQueue.map(i => nodes[i].label).join(', '),
          bwdQ: bwdQueue.map(i => nodes[i].label).join(', ')
        },
      },
    });
  };

  record(OperationType.VISIT, null, [source, target], `Starting bidirectional search from ${nodes[source].label} AND ${nodes[target].label}.`);

  while (fwdQueue.length > 0 && bwdQueue.length > 0) {
    // Forward Step
    const fNode = fwdQueue.shift()!;
    record(OperationType.VISIT, fNode, [fNode], `[Forward] Visiting ${nodes[fNode].label}`);
    
    for (const neighbor of adjacency[fNode]) {
      record(OperationType.COMPARE, fNode, [fNode, neighbor], `[Forward] Checking ${nodes[neighbor].label}`);
      if (bwdVisited.has(neighbor)) {
        record(OperationType.DONE, neighbor, [fNode, neighbor], `Intersection found at ${nodes[neighbor].label}!`, neighbor);
        return { states, timeComplexity: 'O(b^(d/2))', spaceComplexity: 'O(b^(d/2))' };
      }
      if (!fwdVisited.has(neighbor)) {
        fwdVisited.add(neighbor);
        prevForward[neighbor] = fNode;
        fwdQueue.push(neighbor);
        record(OperationType.OVERWRITE, neighbor, [neighbor], `[Forward] Enqueued ${nodes[neighbor].label}`);
      }
    }

    // Backward Step
    const bNode = bwdQueue.shift()!;
    record(OperationType.VISIT, bNode, [bNode], `[Backward] Visiting ${nodes[bNode].label}`);
    
    for (const neighbor of adjacency[bNode]) {
      record(OperationType.COMPARE, bNode, [bNode, neighbor], `[Backward] Checking ${nodes[neighbor].label}`);
      if (fwdVisited.has(neighbor)) {
        record(OperationType.DONE, neighbor, [bNode, neighbor], `Intersection found at ${nodes[neighbor].label}!`, neighbor);
        return { states, timeComplexity: 'O(b^(d/2))', spaceComplexity: 'O(b^(d/2))' };
      }
      if (!bwdVisited.has(neighbor)) {
        bwdVisited.add(neighbor);
        bwdQueue.push(neighbor);
        record(OperationType.OVERWRITE, neighbor, [neighbor], `[Backward] Enqueued ${nodes[neighbor].label}`);
      }
    }
  }

  record(OperationType.DONE, null, [], `Search exhausted. No path exists.`);
  return { states, timeComplexity: 'O(b^(d/2))', spaceComplexity: 'O(b^(d/2))' };
};
