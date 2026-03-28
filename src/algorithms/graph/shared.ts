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
  algorithm: 'dijkstra' | 'bellman-ford' | 'bfs' | 'dfs' | 'ucs' | 'dls' | 'iddfs' | 'bidirectional' | 'best-first' | 'a-star';
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
  parent?: (number | null)[];
  heuristics?: number[];
}

export const generateRandomGraph = (nodeCount = 7): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Node 0 is the root
  nodes.push({ id: 0, x: 0, y: 0, label: labels[0] });

  // Each subsequent node connects to a random existing node (creates a random tree)
  for (let i = 1; i < nodeCount; i++) {
    const parentIdx = Math.floor(Math.random() * i);
    nodes.push({ id: i, x: 0, y: 0, label: labels[i] ?? `N${i}` });
    edges.push({ from: parentIdx, to: i, weight: Math.floor(Math.random() * 9) + 1 });
  }

  // Build children map for tree layout
  const children: number[][] = Array.from({ length: nodeCount }, () => []);
  for (const edge of edges) {
    children[edge.from].push(edge.to);
  }

  // BFS to compute level and position-within-level for each node
  const nodeLevel: number[] = Array(nodeCount).fill(0);
  const posInLevel: number[] = Array(nodeCount).fill(0);
  const levelSizes: number[] = [];
  const bfsQueue: number[] = [0];
  const seen = new Set<number>([0]);

  while (bfsQueue.length > 0) {
    const node = bfsQueue.shift()!;
    const lv = nodeLevel[node];
    if (levelSizes[lv] === undefined) levelSizes[lv] = 0;
    posInLevel[node] = levelSizes[lv]++;
    for (const child of children[node]) {
      if (!seen.has(child)) {
        seen.add(child);
        nodeLevel[child] = lv + 1;
        bfsQueue.push(child);
      }
    }
  }

  // Assign x, y positions in a hierarchical tree layout
  const viewW = 660;
  const numLevels = levelSizes.length;
  const levelHeight = Math.min(90, Math.floor(400 / Math.max(numLevels, 2)));
  const startY = 60;

  for (let i = 0; i < nodeCount; i++) {
    const lv = nodeLevel[i];
    const count = levelSizes[lv];
    nodes[i].x = (viewW / (count + 1)) * (posInLevel[i] + 1);
    nodes[i].y = startY + lv * levelHeight;
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
