import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { buildPathFromPrev, generateRandomGraph, GraphData } from './shared';

export const generateDFSStates = (source = 0, nodeCount = 6): AlgorithmResult<GraphData> => {
  const { nodes, edges } = generateRandomGraph(nodeCount);
  const adjacency = Array.from({ length: nodes.length }, () => [] as number[]);

  for (const edge of edges) {
    adjacency[edge.from].push(edge.to);
  }

  const target = nodes.length - 1;
  const visited = Array(nodes.length).fill(false);
  const prev: Array<number | null> = Array(nodes.length).fill(null);
  const distances = Array(nodes.length).fill(Infinity);
  distances[source] = 0;
  
  const stack: number[] = [source];
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
        algorithm: 'dfs',
        nodes: [...nodes],
        edges: [...edges],
        distances: [...distances],
        visited: [...visited],
        current,
        path: [...path],
        source,
        target,
        queue: [...stack], // reusing queue field for stack
        parent: [...prev],
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: {
          stack: stack.map((index) => nodes[index].label).join(' | ') || 'empty',
        },
      },
    });
  };

  record(
    OperationType.VISIT,
    source,
    [source],
    `Starting DFS from ${nodes[source].label}. The stack explores as deep as possible before backtracking.`
  );

  while (stack.length > 0) {
    const node = stack.pop()!;
    
    if (!visited[node]) {
      visited[node] = true;
      record(
        OperationType.VISIT,
        node,
        [node],
        `Popped and visited ${nodes[node].label}.`
      );

      if (node === target) {
        const path = buildPathFromPrev(prev, target);
        record(
          OperationType.DONE,
          node,
          path,
          `Target ${nodes[target].label} reached. DFS found a path: ${path.map(i => nodes[i].label).join(' -> ')}.`,
          path
        );
        return {
          states,
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V)',
        };
      }

      // Adjacency reversed so that left-most branch is evaluated first conventionally, or just iterate normally.
      for (let i = adjacency[node].length - 1; i >= 0; i--) {
        const neighbor = adjacency[node][i];
        record(
          OperationType.COMPARE,
          node,
          [node, neighbor],
          `Checking neighbor ${nodes[neighbor].label} from ${nodes[node].label}.`
        );
        
        if (!visited[neighbor]) {
          if (prev[neighbor] === null) {
            prev[neighbor] = node;
            distances[neighbor] = distances[node] + 1;
          }
          stack.push(neighbor);
          record(
            OperationType.OVERWRITE,
            neighbor,
            [neighbor],
            `Pushed ${nodes[neighbor].label} to the stack.`
          );
        }
      }
    }
  }

  record(
    OperationType.DONE,
    null,
    [],
    `DFS complete. ${nodes[target].label} was unreached.`
  );

  return {
    states,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  };
};
