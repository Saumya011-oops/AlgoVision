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
  algorithm: 'dijkstra' | 'bellman-ford' | 'bfs';
  nodes: GraphNode[];
  edges: GraphEdge[];
  distances: number[];
  visited: boolean[];
  current: number | null;
  path: number[];
  source: number;
  target: number;
  queue?: number[];
  pass?: number;
}

export const generateRandomGraph = (nodeCount = 6): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const nodes: GraphNode[] = [];
  const columns = Math.ceil(nodeCount / 2);

  for (let index = 0; index < nodeCount; index++) {
    const row = index < columns ? 0 : 1;
    const col = index < columns ? index : index - columns;
    nodes.push({
      id: index,
      x: 90 + col * (500 / Math.max(columns - 1, 1)),
      y: row === 0 ? 110 : 290,
      label: labels[index] ?? `N${index}`,
    });
  }

  const edges: GraphEdge[] = [];
  const edgeKey = (from: number, to: number) => `${from}-${to}`;
  const seen = new Set<string>();

  const addEdge = (from: number, to: number, weight = Math.floor(Math.random() * 9) + 1) => {
    const key = edgeKey(from, to);
    if (from === to || seen.has(key)) {
      return;
    }

    seen.add(key);
    edges.push({ from, to, weight });
  };

  for (let index = 0; index < nodeCount - 1; index++) {
    addEdge(index, index + 1);
  }

  const extraEdges = Math.max(2, Math.floor(nodeCount * 1.1));
  for (let count = 0; count < extraEdges; count++) {
    const from = Math.floor(Math.random() * nodeCount);
    let to = Math.floor(Math.random() * nodeCount);
    if (from === to) {
      to = (to + 1) % nodeCount;
    }
    addEdge(from, to);
  }

  return { nodes, edges };
};

export const buildPathFromPrev = (prev: Array<number | null>, target: number) => {
  const path: number[] = [];
  let current: number | null = target;

  while (current !== null) {
    path.unshift(current);
    current = prev[current];
  }

  return path;
};

export const formatDistances = (nodes: GraphNode[], distances: number[]) =>
  distances
    .map((distance, index) => `${nodes[index].label}:${distance === Infinity ? '∞' : distance}`)
    .join(', ');
