import { OperationType, AlgorithmResult, AlgorithmState } from '../../types/AlgorithmState';

export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  distances: number[];
  visited: boolean[];
  current: number | null;
  path: number[];
}

const SAMPLE_GRAPH: { nodes: GraphNode[], edges: GraphEdge[] } = {
  nodes: [
    { id: 0, x: 80,  y: 200, label: 'A' },
    { id: 1, x: 250, y: 80,  label: 'B' },
    { id: 2, x: 250, y: 320, label: 'C' },
    { id: 3, x: 420, y: 80,  label: 'D' },
    { id: 4, x: 420, y: 320, label: 'E' },
    { id: 5, x: 580, y: 200, label: 'F' },
  ],
  edges: [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 4, weight: 3 },
    { from: 3, to: 5, weight: 2 },
    { from: 4, to: 3, weight: 1 },
    { from: 4, to: 5, weight: 6 },
  ]
};

export const generateDijkstraStates = (source: number = 0): AlgorithmResult<GraphData> => {
  const { nodes, edges } = SAMPLE_GRAPH;
  const n = nodes.length;
  const dist = Array(n).fill(Infinity);
  const visited = Array(n).fill(false);
  const prev: (number | null)[] = Array(n).fill(null);
  dist[source] = 0;

  const states: AlgorithmState<GraphData>[] = [];
  let step = 0;

  const record = (current: number | null, op: OperationType, active: number[], msg: string, path: number[] = []) => {
    states.push({
      data: {
        nodes: [...nodes],
        edges: [...edges],
        distances: [...dist],
        visited: [...visited],
        current,
        path: [...path],
      },
      activeIndices: active,
      operationType: op,
      metadata: { stepNumber: step++, message: msg, variables: { distances: dist.map((d, i) => `${nodes[i].label}:${d === Infinity ? '∞' : d}`).join(', ') } }
    });
  };

  record(null, OperationType.VISIT, [], `Starting Dijkstra from node ${nodes[source].label}. All distances initialized to ∞ except source.`);

  for (let i = 0; i < n; i++) {
    // Find min unvisited
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!visited[v] && (u === -1 || dist[v] < dist[u])) u = v;
    }
    if (u === -1 || dist[u] === Infinity) break;

    record(u, OperationType.VISIT, [u], `Visiting node ${nodes[u].label} with distance ${dist[u]}. It has the smallest tentative distance among unvisited nodes.`);
    visited[u] = true;

    // Relax neighbors
    for (const edge of edges) {
      if (edge.from === u && !visited[edge.to]) {
        const alt = dist[u] + edge.weight;
        record(u, OperationType.COMPARE, [u, edge.to], `Checking edge ${nodes[u].label} → ${nodes[edge.to].label} (weight ${edge.weight}). Current dist[${nodes[edge.to].label}] = ${dist[edge.to] === Infinity ? '∞' : dist[edge.to]}, new = ${alt}`);

        if (alt < dist[edge.to]) {
          dist[edge.to] = alt;
          prev[edge.to] = u;
          record(u, OperationType.OVERWRITE, [edge.to], `Updated distance of ${nodes[edge.to].label} to ${alt} via ${nodes[u].label}. Shorter path found!`);
        }
      }
    }
  }

  // Build shortest path tree
  const shortestPath: number[] = [];
  let cur: number | null = n - 1;
  while (cur !== null) {
    shortestPath.unshift(cur);
    cur = prev[cur];
  }

  record(null, OperationType.DONE, [], `Dijkstra complete! Shortest path from ${nodes[source].label} to ${nodes[n - 1].label}: ${shortestPath.map(i => nodes[i].label).join(' → ')} (distance: ${dist[n - 1]})`, shortestPath);

  return {
    states,
    timeComplexity: 'O(V²) naive, O((V+E) log V) with priority queue',
    spaceComplexity: 'O(V)',
  };
};
