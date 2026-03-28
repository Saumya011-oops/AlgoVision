import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { buildPathFromPrev, generateRandomGraph, GraphData } from './shared';

export const generateAStarStates = (source = 0, nodeCount = 6): AlgorithmResult<GraphData> => {
  const { nodes, edges } = generateRandomGraph(nodeCount);
  const target = nodes.length - 1;
  const visited = Array(nodes.length).fill(false);
  const prev: Array<number | null> = Array(nodes.length).fill(null);
  const gCosts = Array(nodes.length).fill(Infinity);
  gCosts[source] = 0;
  
  const heuristic = (n: number) => {
    // using actual distance from layout for a realistic heuristic
    const dx = nodes[n].x - nodes[target].x;
    const dy = nodes[n].y - nodes[target].y;
    // Scale down heuristic to be comparable or admissible with edge weights
    return Math.sqrt(dx * dx + dy * dy) / 40; 
  };

  const allHeuristics = nodes.map((_, i) => Math.round(heuristic(i)));

  const pq: { node: number; f: number; g: number; h: number }[] = [
    { node: source, g: 0, h: heuristic(source), f: heuristic(source) }
  ];
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
        algorithm: 'a-star',
        nodes: [...nodes],
        edges: [...edges],
        distances: [...gCosts], // showing gCost in distances array
        visited: [...visited],
        current,
        path: [...path],
        source,
        target,
        queue: pq.map(i => i.node),
        parent: [...prev],
        heuristics: [...allHeuristics],
      },
      activeIndices,
      operationType,
      metadata: {
        stepNumber: step++,
        message,
        variables: {
          pq: pq.map((item) => `${nodes[item.node].label}(f:${Math.round(item.f)})`).join(', ') || 'empty',
        },
      },
    });
  };

  record(OperationType.VISIT, source, [source], `Starting A* from ${nodes[source].label}. PQ ordered by f(n) = g(n) + h(n).`);

  while (pq.length > 0) {
    pq.sort((a, b) => a.f - b.f);
    const { node, f, g, h } = pq.shift()!;
    
    if (visited[node]) continue;
    visited[node] = true;
    
    record(OperationType.VISIT, node, [node], `Dequeued ${nodes[node].label} (f:${Math.round(f)} = g:${Math.round(g)} + h:${Math.round(h)}).`);

    if (node === target) {
      const path = buildPathFromPrev(prev, target);
      record(OperationType.DONE, node, path, `Target reached with optimal path: ${path.map(i => nodes[i].label).join(' -> ')}.`, path);
      return { states, timeComplexity: 'O(E)', spaceComplexity: 'O(V)' };
    }

    const neighbors = edges.filter(e => e.from === node);
    for (const edge of neighbors) {
      const neighbor = edge.to;
      record(OperationType.COMPARE, node, [node, neighbor], `Inspecting ${nodes[neighbor].label} (weight: ${edge.weight}).`);
      
      const tentativeG = g + edge.weight;
      if (!visited[neighbor] && tentativeG < gCosts[neighbor]) {
        gCosts[neighbor] = tentativeG;
        prev[neighbor] = node;
        const hCost = heuristic(neighbor);
        const fCost = tentativeG + hCost;
        pq.push({ node: neighbor, g: tentativeG, h: hCost, f: fCost });
        
        record(OperationType.OVERWRITE, neighbor, [neighbor], `Found better path to ${nodes[neighbor].label}. g=${Math.round(tentativeG)}, f=${Math.round(fCost)}. Enqueuing.`);
      }
    }
  }

  record(OperationType.DONE, null, [], `Search exhausted.`);
  return { states, timeComplexity: 'O(E)', spaceComplexity: 'O(V)' };
};
