import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { buildPathFromPrev, formatDistances, generateRandomGraph, GraphData } from './shared';

export const generateDijkstraStates = (source = 0, nodeCount = 6): AlgorithmResult<GraphData> => {
  const { nodes, edges } = generateRandomGraph(nodeCount);
  const distances = Array(nodes.length).fill(Infinity);
  const visited = Array(nodes.length).fill(false);
  const prev: Array<number | null> = Array(nodes.length).fill(null);
  const target = nodes.length - 1;
  const states: AlgorithmState<GraphData>[] = [];
  let step = 0;

  distances[source] = 0;

  const record = (
    operationType: OperationType,
    current: number | null,
    activeIndices: number[],
    message: string,
    path: number[] = []
  ) => {
    states.push({
      data: {
        algorithm: 'dijkstra',
        nodes: [...nodes],
        edges: [...edges],
        distances: [...distances],
        visited: [...visited],
        current,
        path: [...path],
        source,
        target,
        parent: [...prev],
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: {
          distances: formatDistances(nodes, distances),
        },
      },
    });
  };

  record(
    OperationType.VISIT,
    source,
    [source],
    `Starting Dijkstra from ${nodes[source].label}. The source begins at distance 0 while all other nodes start at infinity.`
  );

  for (let count = 0; count < nodes.length; count++) {
    let current = -1;
    for (let node = 0; node < nodes.length; node++) {
      if (!visited[node] && (current === -1 || distances[node] < distances[current])) {
        current = node;
      }
    }

    if (current === -1 || distances[current] === Infinity) {
      break;
    }

    record(
      OperationType.VISIT,
      current,
      [current],
      `${nodes[current].label} has the smallest tentative distance, so it becomes the next settled node.`
    );

    visited[current] = true;

    for (const edge of edges) {
      if (edge.from !== current || visited[edge.to]) {
        continue;
      }

      const candidate = distances[current] + edge.weight;
      record(
        OperationType.COMPARE,
        current,
        [current, edge.to],
        `Relax edge ${nodes[current].label} -> ${nodes[edge.to].label}. Candidate distance is ${candidate}.`
      );

      if (candidate < distances[edge.to]) {
        distances[edge.to] = candidate;
        prev[edge.to] = current;
        record(
          OperationType.OVERWRITE,
          edge.to,
          [edge.to],
          `${nodes[edge.to].label} receives a shorter path through ${nodes[current].label}, so its distance is updated to ${candidate}.`
        );
      }
    }
  }

  const path = buildPathFromPrev(prev, target);
  record(
    OperationType.DONE,
    null,
    [],
    `Dijkstra complete. Best path to ${nodes[target].label}: ${path.map((index) => nodes[index].label).join(' -> ')}.`,
    path
  );

  return {
    states,
    timeComplexity: 'O(V²) naive, O((V+E) log V) with priority queue',
    spaceComplexity: 'O(V)',
  };
};
