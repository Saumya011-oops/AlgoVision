import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { buildPathFromPrev, generateRandomGraph, GraphData } from './shared';

export const generateBFSStates = (source = 0, nodeCount = 6): AlgorithmResult<GraphData> => {
  const { nodes, edges } = generateRandomGraph(nodeCount);
  const adjacency = Array.from({ length: nodes.length }, () => [] as number[]);

  for (const edge of edges) {
    adjacency[edge.from].push(edge.to);
  }

  const target = nodes.length - 1;
  const distances = Array(nodes.length).fill(Infinity);
  const visited = Array(nodes.length).fill(false);
  const prev: Array<number | null> = Array(nodes.length).fill(null);
  const queue: number[] = [source];
  const states: AlgorithmState<GraphData>[] = [];
  let step = 0;

  distances[source] = 0;
  visited[source] = true;

  const record = (
    operationType: OperationType,
    current: number | null,
    activeIndices: number[],
    message: string,
    path: number[] = []
  ) => {
    states.push({
      data: {
        algorithm: 'bfs',
        nodes: [...nodes],
        edges: [...edges],
        distances: [...distances],
        visited: [...visited],
        current,
        path: [...path],
        source,
        target,
        queue: [...queue],
        parent: [...prev],
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: {
          queue: queue.map((index) => nodes[index].label).join(' -> ') || 'empty',
        },
      },
    });
  };

  record(
    OperationType.VISIT,
    source,
    [source],
    `Starting BFS from ${nodes[source].label}. The queue guarantees we explore by distance from the source.`
  );

  while (queue.length > 0) {
    const node = queue.shift()!;
    record(
      OperationType.VISIT,
      node,
      [node],
      `Dequeued ${nodes[node].label}. Its neighbors become the next frontier in breadth-first order.`
    );

    if (node === target) {
      const path = buildPathFromPrev(prev, target);
      record(
        OperationType.DONE,
        node,
        path,
        `Target ${nodes[target].label} reached. BFS shortest path: ${path
          .map((index) => nodes[index].label)
          .join(' -> ')}.`,
        path
      );
      return {
        states,
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
      };
    }

    for (const neighbor of adjacency[node]) {
      record(
        OperationType.COMPARE,
        node,
        [node, neighbor],
        `Inspecting edge ${nodes[node].label} -> ${nodes[neighbor].label}.`
      );

      if (!visited[neighbor]) {
        visited[neighbor] = true;
        distances[neighbor] = distances[node] + 1;
        prev[neighbor] = node;
        queue.push(neighbor);
        record(
          OperationType.OVERWRITE,
          neighbor,
          [neighbor],
          `${nodes[neighbor].label} is discovered at level ${distances[neighbor]} and enqueued for future exploration.`
        );
      }
    }
  }

  record(
    OperationType.DONE,
    null,
    [],
    `BFS complete. ${nodes[target].label} was not reachable from ${nodes[source].label}.`
  );

  return {
    states,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  };
};
