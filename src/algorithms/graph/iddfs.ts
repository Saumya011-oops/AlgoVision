import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { buildPathFromPrev, generateRandomGraph, GraphData } from './shared';

export const generateIDDFSStates = (source = 0, nodeCount = 6): AlgorithmResult<GraphData> => {
  const { nodes, edges } = generateRandomGraph(nodeCount);
  const target = nodes.length - 1;
  const adjacency = Array.from({ length: nodes.length }, () => [] as number[]);
  for (const edge of edges) adjacency[edge.from].push(edge.to);

  const states: AlgorithmState<GraphData>[] = [];
  let step = 0;
  let maxDepth = 0;

  const record = (
    operationType: OperationType,
    current: number | null,
    activeIndices: number[],
    message: string,
    stack: number[],
    visited: boolean[],
    path: number[] = []
  ) => {
    states.push({
      data: {
        algorithm: 'iddfs',
        nodes: [...nodes],
        edges: [...edges],
        distances: Array(nodes.length).fill(Infinity),
        visited: [...visited],
        current,
        path: [...path],
        source,
        target,
        queue: [...stack],
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: { maxDepth, stack: stack.map(s => nodes[s].label).join(' | ') || 'empty' },
      },
    });
  };

  const limitSearch = (limit: number): boolean => {
    const stack: { node: number, depth: number }[] = [{ node: source, depth: 0 }];
    const prev: Array<number | null> = Array(nodes.length).fill(null);
    const visitedSet = new Set<number>();
    
    // Convert set to array for rendering
    const getVisArr = () => nodes.map(n => visitedSet.has(n.id));

    record(OperationType.VISIT, source, [source], `Starting iteration with limit = ${limit}`, [source], getVisArr());

    while (stack.length > 0) {
      const { node, depth } = stack.pop()!;
      visitedSet.add(node);
      
      record(OperationType.VISIT, node, [node], `Visiting ${nodes[node].label} (depth ${depth})`, stack.map(s => s.node), getVisArr());

      if (node === target) {
        const path = buildPathFromPrev(prev, target);
        record(OperationType.DONE, node, path, `Target ${nodes[target].label} reached!`, [], getVisArr(), path);
        return true;
      }

      if (depth < limit) {
        for (let i = adjacency[node].length - 1; i >= 0; i--) {
          const neighbor = adjacency[node][i];
          if (!visitedSet.has(neighbor)) {
            if (prev[neighbor] === null) prev[neighbor] = node;
            stack.push({ node: neighbor, depth: depth + 1 });
            record(OperationType.OVERWRITE, neighbor, [neighbor], `Pushed ${nodes[neighbor].label}`, stack.map(s => s.node), getVisArr());
          }
        }
      }
    }
    return false;
  };

  while (maxDepth < nodes.length) {
    if (limitSearch(maxDepth)) {
       return { states, timeComplexity: 'O(b^d)', spaceComplexity: 'O(bd)' };
    }
    maxDepth++;
  }

  states.push({ ...states[states.length - 1], operationType: OperationType.DONE, metadata: { ...states[states.length - 1].metadata, message: `IDDFS complete. Target unreached.`} });
  return { states, timeComplexity: 'O(b^d)', spaceComplexity: 'O(bd)' };
};
