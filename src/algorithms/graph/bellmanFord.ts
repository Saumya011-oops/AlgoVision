import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { buildPathFromPrev, formatDistances, generateRandomGraph, GraphData } from './shared';

export const generateBellmanFordStates = (source = 0, nodeCount = 6): AlgorithmResult<GraphData> => {
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
    pass: number,
    path: number[] = []
  ) => {
    states.push({
      data: {
        algorithm: 'bellman-ford',
        nodes: [...nodes],
        edges: [...edges],
        distances: [...distances],
        visited: [...visited],
        current,
        path: [...path],
        source,
        target,
        pass,
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: {
          pass,
          distances: formatDistances(nodes, distances),
        },
      },
    });
  };

  record(
    OperationType.VISIT,
    source,
    [source],
    `Starting Bellman-Ford from ${nodes[source].label}. We will relax every edge up to V-1 times.`,
    0
  );

  for (let pass = 1; pass < nodes.length; pass++) {
    let changed = false;
    record(
      OperationType.VISIT,
      null,
      [],
      `Pass ${pass}: scan every edge and improve any distance that can be shortened.`,
      pass
    );

    for (const edge of edges) {
      if (distances[edge.from] === Infinity) {
        continue;
      }

      const candidate = distances[edge.from] + edge.weight;
      record(
        OperationType.COMPARE,
        edge.from,
        [edge.from, edge.to],
        `Checking ${nodes[edge.from].label} -> ${nodes[edge.to].label}. Candidate distance is ${candidate}.`,
        pass
      );

      if (candidate < distances[edge.to]) {
        distances[edge.to] = candidate;
        prev[edge.to] = edge.from;
        visited[edge.to] = true;
        changed = true;
        record(
          OperationType.OVERWRITE,
          edge.to,
          [edge.to],
          `Distance to ${nodes[edge.to].label} improved to ${candidate} through ${nodes[edge.from].label}.`,
          pass
        );
      }
    }

    if (!changed) {
      record(
        OperationType.DONE,
        null,
        [],
        `No updates happened in pass ${pass}, so the shortest paths are already finalized.`,
        pass,
        buildPathFromPrev(prev, target)
      );
      return {
        states,
        timeComplexity: 'O(VE)',
        spaceComplexity: 'O(V)',
      };
    }
  }

  const path = buildPathFromPrev(prev, target);
  record(
    OperationType.DONE,
    null,
    [],
    `Bellman-Ford complete. Best path to ${nodes[target].label}: ${path.map((index) => nodes[index].label).join(' -> ')}.`,
    nodes.length - 1,
    path
  );

  return {
    states,
    timeComplexity: 'O(VE)',
    spaceComplexity: 'O(V)',
  };
};
