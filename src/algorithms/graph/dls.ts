import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { buildPathFromPrev, generateRandomGraph, GraphData } from './shared';

export const generateDLSStates = (source = 0, nodeCount = 6, limit = 2): AlgorithmResult<GraphData> => {
  const { nodes, edges } = generateRandomGraph(nodeCount);
  const target = nodes.length - 1;
  const adjacency = Array.from({ length: nodes.length }, () => [] as number[]);

  for (const edge of edges) {
    adjacency[edge.from].push(edge.to);
  }

  const visited = new Set<number>();
  const prev: Array<number | null> = Array(nodes.length).fill(null);
  
  const stack: { node: number, depth: number }[] = [{ node: source, depth: 0 }];
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
        algorithm: 'dls',
        nodes: [...nodes],
        edges: [...edges],
        distances: Array(nodes.length).fill(Infinity), // Not strictly used in DLS
        visited: nodes.map(n => visited.has(n.id)),
        current,
        path: [...path],
        source,
        target,
        queue: stack.map(s => s.node),
        parent: [...prev],
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: { limit, stack: stack.map(s => `${nodes[s.node].label}(d:${s.depth})`).join(' | ') || 'empty' },
      },
    });
  };

  record(OperationType.VISIT, source, [source], `Starting DLS from ${nodes[source].label} with Depth Limit ${limit}.`);

  while (stack.length > 0) {
    const { node, depth } = stack.pop()!;
    visited.add(node);
    
    record(OperationType.VISIT, node, [node], `Visiting ${nodes[node].label} at depth ${depth}.`);

    if (node === target) {
      const path = buildPathFromPrev(prev, target);
      record(OperationType.DONE, node, path, `Target ${nodes[target].label} reached! Path: ${path.map(i => nodes[i].label).join(' -> ')}.`, path);
      return { states, timeComplexity: 'O(b^l)', spaceComplexity: 'O(bl)' };
    }

    if (depth < limit) {
      for (let i = adjacency[node].length - 1; i >= 0; i--) {
        const neighbor = adjacency[node][i];
        record(OperationType.COMPARE, node, [node, neighbor], `Checking ${nodes[neighbor].label} (depth ${depth + 1}).`);
        
        if (!visited.has(neighbor)) {
          if (prev[neighbor] === null) prev[neighbor] = node;
          stack.push({ node: neighbor, depth: depth + 1 });
          record(OperationType.OVERWRITE, neighbor, [neighbor], `Pushed ${nodes[neighbor].label} to stack.`);
        }
      }
    } else {
      record(OperationType.COMPARE, node, [node], `Depth Limit (${limit}) reached at ${nodes[node].label}. Backtracking.`);
    }
  }

  record(OperationType.DONE, null, [], `DLS complete. Target not found within depth ${limit}.`);
  return { states, timeComplexity: 'O(b^l)', spaceComplexity: 'O(bl)' };
};
