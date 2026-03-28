import { OperationType } from '../types/AlgorithmState';

export type AlgorithmCategoryId = 'sorting' | 'graph' | 'dp' | 'string' | 'search' | 'tree';

export interface AlgorithmFact {
  label: string;
  value: string;
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  category: AlgorithmCategoryId;
  description: string;
  bestTime: string;
  avgTime: string;
  worstTime: string;
  space: string;
  spaceNote: string;
  facts: AlgorithmFact[];
  code: string;
  defaultHighlightedLines: Partial<Record<OperationType, number>>;
}

const definitions: AlgorithmDefinition[] = [
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    description:
      "Quick Sort is a divide-and-conquer sorting algorithm that partitions the array around a pivot, then recursively sorts the left and right partitions.",
    bestTime: 'O(N log N)',
    avgTime: 'O(N log N)',
    worstTime: 'O(N²)',
    space: 'O(log N)',
    spaceNote: 'call stack overhead',
    facts: [
      { label: 'Type', value: 'Divide & Conquer' },
      { label: 'Stable', value: 'No' },
      { label: 'Strength', value: 'Fast average case' },
    ],
    code: `function quickSort(arr, left, right) {
  if (left >= right) return;

  const pivot = arr[right];
  const pivotIndex = partition(arr, left, right, pivot);

  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);
}

function partition(arr, left, right, pivot) {
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      swap(arr, i, j);
      i++;
    }
  }
  swap(arr, i, right);
  return i;
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 1,
      [OperationType.COMPARE]: 11,
      [OperationType.SWAP]: 12,
      [OperationType.OVERWRITE]: 16,
      [OperationType.DONE]: 7,
    },
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    description:
      'Merge Sort recursively splits the array into halves, sorts each half, and merges them back together in sorted order with predictable performance.',
    bestTime: 'O(N log N)',
    avgTime: 'O(N log N)',
    worstTime: 'O(N log N)',
    space: 'O(N)',
    spaceNote: 'temporary arrays during merge',
    facts: [
      { label: 'Type', value: 'Divide & Conquer' },
      { label: 'Stable', value: 'Yes' },
      { label: 'Strength', value: 'Predictable runtime' },
    ],
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const merged = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) merged.push(left.shift());
    else merged.push(right.shift());
  }
  return [...merged, ...left, ...right];
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 1,
      [OperationType.COMPARE]: 11,
      [OperationType.OVERWRITE]: 14,
      [OperationType.DONE]: 7,
    },
  },
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description:
      "Bubble Sort repeatedly compares adjacent elements and swaps them if they are out of order, causing large elements to bubble toward the end.",
    bestTime: 'O(N)',
    avgTime: 'O(N²)',
    worstTime: 'O(N²)',
    space: 'O(1)',
    spaceNote: 'in-place sorting',
    facts: [
      { label: 'Type', value: 'Comparison Sort' },
      { label: 'Stable', value: 'Yes' },
      { label: 'Strength', value: 'Simple and visual' },
    ],
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let swapped = false;

    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        swapped = true;
      }
    }

    if (!swapped) break;
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 2,
      [OperationType.COMPARE]: 5,
      [OperationType.SWAP]: 6,
      [OperationType.OVERWRITE]: 11,
      [OperationType.DONE]: 11,
    },
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    description:
      'Selection Sort grows a sorted prefix by repeatedly selecting the minimum element from the unsorted suffix and placing it in front.',
    bestTime: 'O(N²)',
    avgTime: 'O(N²)',
    worstTime: 'O(N²)',
    space: 'O(1)',
    spaceNote: 'in-place sorting',
    facts: [
      { label: 'Type', value: 'Comparison Sort' },
      { label: 'Stable', value: 'No' },
      { label: 'Strength', value: 'Few swaps' },
    ],
    code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) swap(arr, i, minIndex);
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 2,
      [OperationType.COMPARE]: 5,
      [OperationType.SWAP]: 10,
      [OperationType.OVERWRITE]: 10,
      [OperationType.DONE]: 10,
    },
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    description:
      'Heap Sort first builds a max-heap, then repeatedly moves the maximum element to the end while restoring the heap property.',
    bestTime: 'O(N log N)',
    avgTime: 'O(N log N)',
    worstTime: 'O(N log N)',
    space: 'O(1)',
    spaceNote: 'uses the array as the heap',
    facts: [
      { label: 'Type', value: 'Heap-based' },
      { label: 'Stable', value: 'No' },
      { label: 'Strength', value: 'Strong worst case' },
    ],
    code: `function heapSort(arr) {
  buildMaxHeap(arr);

  for (let end = arr.length - 1; end > 0; end--) {
    swap(arr, 0, end);
    heapify(arr, 0, end);
  }
}

function heapify(arr, root, size) {
  let largest = root;
  const left = 2 * root + 1;
  const right = 2 * root + 2;

  if (left < size && arr[left] > arr[largest]) largest = left;
  if (right < size && arr[right] > arr[largest]) largest = right;
  if (largest !== root) {
    swap(arr, root, largest);
    heapify(arr, largest, size);
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 1,
      [OperationType.COMPARE]: 13,
      [OperationType.SWAP]: 16,
      [OperationType.OVERWRITE]: 5,
      [OperationType.DONE]: 5,
    },
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    description:
      "Dijkstra's algorithm finds shortest paths from a source by always expanding the unvisited node with the smallest tentative distance.",
    bestTime: 'O((V+E) log V)',
    avgTime: 'O((V+E) log V)',
    worstTime: 'O(V²)',
    space: 'O(V)',
    spaceNote: 'distance and visited tracking',
    facts: [
      { label: 'Type', value: 'Greedy Graph Search' },
      { label: 'Edge Weights', value: 'Non-negative only' },
      { label: 'Output', value: 'Shortest paths' },
    ],
    code: `function dijkstra(graph, source) {
  const dist = Array(graph.size).fill(Infinity);
  const visited = Array(graph.size).fill(false);
  dist[source] = 0;

  for (let i = 0; i < graph.size; i++) {
    const u = getClosestUnvisited(dist, visited);
    if (u === -1) break;

    visited[u] = true;
    for (const edge of graph.edgesFrom(u)) {
      const candidate = dist[u] + edge.weight;
      if (candidate < dist[edge.to]) {
        dist[edge.to] = candidate;
      }
    }
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 6,
      [OperationType.COMPARE]: 11,
      [OperationType.OVERWRITE]: 13,
      [OperationType.DONE]: 15,
    },
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    category: 'graph',
    description:
      'Bellman-Ford relaxes every edge repeatedly, allowing shortest paths to be computed even when negative edge weights are present.',
    bestTime: 'O(VE)',
    avgTime: 'O(VE)',
    worstTime: 'O(VE)',
    space: 'O(V)',
    spaceNote: 'distance and predecessor arrays',
    facts: [
      { label: 'Type', value: 'Relaxation-based' },
      { label: 'Edge Weights', value: 'Negative-safe' },
      { label: 'Output', value: 'Shortest paths' },
    ],
    code: `function bellmanFord(graph, source) {
  const dist = Array(graph.size).fill(Infinity);
  dist[source] = 0;

  for (let pass = 1; pass < graph.size; pass++) {
    let changed = false;
    for (const edge of graph.edges) {
      const candidate = dist[edge.from] + edge.weight;
      if (candidate < dist[edge.to]) {
        dist[edge.to] = candidate;
        changed = true;
      }
    }
    if (!changed) break;
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 4,
      [OperationType.COMPARE]: 7,
      [OperationType.OVERWRITE]: 9,
      [OperationType.DONE]: 13,
    },
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'search',
    description:
      'Breadth-First Search explores the graph level by level using a queue, guaranteeing the shortest path in unweighted graphs.',
    bestTime: 'O(V + E)',
    avgTime: 'O(V + E)',
    worstTime: 'O(V + E)',
    space: 'O(V)',
    spaceNote: 'queue and visited set',
    facts: [
      { label: 'Type', value: 'Traversal' },
      { label: 'Data Structure', value: 'Queue' },
      { label: 'Output', value: 'Level order path' },
    ],
    code: `function bfs(graph, source) {
  const queue = [source];
  const visited = new Set([source]);

  while (queue.length) {
    const node = queue.shift();

    for (const next of graph.neighbors(node)) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 5,
      [OperationType.COMPARE]: 7,
      [OperationType.OVERWRITE]: 9,
      [OperationType.DONE]: 12,
    },
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'search',
    description: 'Depth-First Search explores a graph by going as deep as possible along each branch before backtracking.',
    bestTime: 'O(V + E)',
    avgTime: 'O(V + E)',
    worstTime: 'O(V + E)',
    space: 'O(V)',
    spaceNote: 'recursion stack or explicit stack',
    facts: [
      { label: 'Type', value: 'Uninformed Search' },
      { label: 'Data Structure', value: 'Stack' },
      { label: 'Optimal', value: 'No' },
    ],
    code: `function dfs(graph, source, visited = new Set()) {
  visited.add(source);
  recordVisit(source);

  for (const neighbor of graph.neighbors(source)) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 2,
      [OperationType.COMPARE]: 5,
      [OperationType.DONE]: 9,
    },
  },
  {
    id: 'ucs',
    name: 'Uniform Cost Search',
    category: 'search',
    description: 'Uniform Cost Search expands the least cost node next, guaranteeing optimal paths in weighted graphs.',
    bestTime: 'O(1)',
    avgTime: 'O(b^(1+C*/e))',
    worstTime: 'O(b^(1+C*/e))',
    space: 'O(b^(1+C*/e))',
    spaceNote: 'priority queue overhead',
    facts: [
      { label: 'Type', value: 'Uninformed Search' },
      { label: 'Data Structure', value: 'Priority Queue' },
      { label: 'Optimal', value: 'Yes' },
    ],
    code: `function ucs(graph, source, goal) {
  const pq = new PriorityQueue();
  pq.push(source, 0);
  const costs = { [source]: 0 };

  while (!pq.isEmpty()) {
    const { element: node, priority: cost } = pq.pop();
    if (node === goal) return cost;

    for (const edge of graph.edgesFrom(node)) {
      const newCost = cost + edge.weight;
      if (newCost < (costs[edge.to] ?? Infinity)) {
        costs[edge.to] = newCost;
        pq.push(edge.to, newCost);
      }
    }
  }
}`,
    defaultHighlightedLines: { [OperationType.VISIT]: 7, [OperationType.COMPARE]: 13, [OperationType.DONE]: 18 },
  },
  {
    id: 'dls',
    name: 'Depth-Limited Search',
    category: 'search',
    description: 'Depth-Limited Search is DFS with a maximum depth bound to avoid infinite loops.',
    bestTime: 'O(b)',
    avgTime: 'O(b^l)',
    worstTime: 'O(b^l)',
    space: 'O(bl)',
    spaceNote: 'stack depth limited to L',
    facts: [
      { label: 'Type', value: 'Uninformed Search' },
      { label: 'Limit', value: 'Depth bound' },
      { label: 'Optimal', value: 'No' },
    ],
    code: `function dls(node, target, limit, depth = 0) {
  if (node === target) return true;
  if (depth === limit) return false;

  for (const neighbor of graph.neighbors(node)) {
    if (dls(neighbor, target, limit, depth + 1)) {
      return true;
    }
  }
  return false;
}`,
    defaultHighlightedLines: { [OperationType.VISIT]: 2, [OperationType.COMPARE]: 3, [OperationType.DONE]: 10 },
  },
  {
    id: 'iddfs',
    name: 'Iterative Deepening',
    category: 'search',
    description: 'IDDFS repeatedly runs Depth-Limited Search with increasing depth bounds, combining the low space of DFS with the optimality of BFS.',
    bestTime: 'O(b)',
    avgTime: 'O(b^d)',
    worstTime: 'O(b^d)',
    space: 'O(bd)',
    spaceNote: 'stack bounded by current depth limit',
    facts: [
      { label: 'Type', value: 'Uninformed Search' },
      { label: 'Hybrid', value: 'DFS + BFS traits' },
      { label: 'Optimal', value: 'Yes (unweighted)' },
    ],
    code: `function iddfs(start, target, maxDepth) {
  for (let limit = 0; limit <= maxDepth; limit++) {
    const found = dls(start, target, limit);
    if (found) return true;
  }
  return false;
}`,
    defaultHighlightedLines: { [OperationType.VISIT]: 3, [OperationType.COMPARE]: 4, [OperationType.DONE]: 6 },
  },
  {
    id: 'bidirectional',
    name: 'Bidirectional Search',
    category: 'search',
    description: 'Runs two simultaneous searches—one forward from the root and one backward from the goal—meeting in the middle.',
    bestTime: 'O(1)',
    avgTime: 'O(b^(d/2))',
    worstTime: 'O(b^(d/2))',
    space: 'O(b^(d/2))',
    spaceNote: 'frontiers of both searches',
    facts: [
      { label: 'Type', value: 'Uninformed Search' },
      { label: 'Mechanic', value: 'Two-way expansion' },
      { label: 'Optimal', value: 'Yes' },
    ],
    code: `function bidirectional(start, goal) {
  let fwdQueue = [start], bwdQueue = [goal];
  let fwdVisited = new Set([start]), bwdVisited = new Set([goal]);

  while (fwdQueue.length && bwdQueue.length) {
    expand(fwdQueue, fwdVisited);
    if (intersect(fwdVisited, bwdVisited)) return true;

    expand(bwdQueue, bwdVisited);
    if (intersect(fwdVisited, bwdVisited)) return true;
  }
  return false;
}`,
    defaultHighlightedLines: { [OperationType.VISIT]: 6, [OperationType.COMPARE]: 7, [OperationType.DONE]: 13 },
  },
  {
    id: 'best-first',
    name: 'Best First Search',
    category: 'search',
    description: 'An informed search that expands nodes according to an evaluation function (often a heuristic estimating distance to the goal).',
    bestTime: 'O(1)',
    avgTime: 'O(b^m)',
    worstTime: 'O(b^m)',
    space: 'O(b^m)',
    spaceNote: 'priority queue holds frontier',
    facts: [
      { label: 'Type', value: 'Informed Search' },
      { label: 'Heuristic', value: 'f(n) = h(n)' },
      { label: 'Optimal', value: 'No' },
    ],
    code: `function bestFirstSearch(start, goal, heuristic) {
  const pq = new PriorityQueue();
  pq.push(start, heuristic(start));
  const visited = new Set();

  while (!pq.isEmpty()) {
    const node = pq.pop();
    if (node === goal) return true;
    visited.add(node);

    for (const neighbor of graph.neighbors(node)) {
      if (!visited.has(neighbor)) {
        pq.push(neighbor, heuristic(neighbor));
      }
    }
  }
}`,
    defaultHighlightedLines: { [OperationType.VISIT]: 8, [OperationType.COMPARE]: 13, [OperationType.DONE]: 17 },
  },
  {
    id: 'a-star',
    name: 'A* Search',
    category: 'search',
    description: 'A* evaluates nodes by combining the path cost so far, g(n), and the estimated cost to the goal, h(n).',
    bestTime: 'O(1)',
    avgTime: 'O(E)',
    worstTime: 'O(E)',
    space: 'O(V)',
    spaceNote: 'stores shortest paths to evaluated nodes',
    facts: [
      { label: 'Type', value: 'Informed Search' },
      { label: 'Function', value: 'f(n) = g(n) + h(n)' },
      { label: 'Optimal', value: 'Yes (with admissible h)' },
    ],
    code: `function aStar(start, goal, heuristic) {
  const pq = new PriorityQueue();
  pq.push(start, 0);
  const gCost = { [start]: 0 };

  while (!pq.isEmpty()) {
    const { element: node } = pq.pop();
    if (node === goal) return gCost[node];

    for (const edge of graph.edgesFrom(node)) {
      const tentativeG = gCost[node] + edge.weight;
      if (tentativeG < (gCost[edge.to] ?? Infinity)) {
        gCost[edge.to] = tentativeG;
        const fCost = tentativeG + heuristic(edge.to);
        pq.push(edge.to, fCost);
      }
    }
  }
}`,
    defaultHighlightedLines: { [OperationType.VISIT]: 8, [OperationType.COMPARE]: 13, [OperationType.DONE]: 19 },
  },
  {
    id: 'fibonacci-dp',
    name: 'Fibonacci DP',
    category: 'dp',
    description:
      'Fibonacci DP fills a table bottom-up so each Fibonacci value is computed once and then reused.',
    bestTime: 'O(N)',
    avgTime: 'O(N)',
    worstTime: 'O(N)',
    space: 'O(N)',
    spaceNote: 'single DP table',
    facts: [
      { label: 'Type', value: 'Bottom-up DP' },
      { label: 'State', value: 'Single dimension' },
      { label: 'Output', value: 'F(n)' },
    ],
    code: `function fibonacciDP(n) {
  const dp = Array(n + 1).fill(0);
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 1,
      [OperationType.COMPARE]: 5,
      [OperationType.OVERWRITE]: 5,
      [OperationType.DONE]: 8,
    },
  },
  {
    id: 'knapsack-01',
    name: '0/1 Knapsack',
    category: 'dp',
    description:
      '0/1 Knapsack builds a DP table where each cell decides whether taking the current item improves the best value for the remaining capacity.',
    bestTime: 'O(NW)',
    avgTime: 'O(NW)',
    worstTime: 'O(NW)',
    space: 'O(NW)',
    spaceNote: 'matrix over items and capacity',
    facts: [
      { label: 'Type', value: 'Table DP' },
      { label: 'Decision', value: 'Take vs Skip' },
      { label: 'Output', value: 'Maximum value' },
    ],
    code: `function knapsack01(items, capacity) {
  const dp = Array(items.length + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= items.length; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (items[i - 1].weight <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          items[i - 1].value + dp[i - 1][w - items[i - 1].weight]
        );
      }
    }
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 5,
      [OperationType.COMPARE]: 8,
      [OperationType.OVERWRITE]: 9,
      [OperationType.DONE]: 15,
    },
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'dp',
    description:
      'LCS uses dynamic programming to compare prefixes of two strings and build the longest subsequence shared by both.',
    bestTime: 'O(NM)',
    avgTime: 'O(NM)',
    worstTime: 'O(NM)',
    space: 'O(NM)',
    spaceNote: '2D table over both strings',
    facts: [
      { label: 'Type', value: 'Sequence DP' },
      { label: 'Decision', value: 'Match or skip' },
      { label: 'Output', value: 'Subsequence length' },
    ],
    code: `function lcs(a, b) {
  const dp = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 5,
      [OperationType.COMPARE]: 7,
      [OperationType.OVERWRITE]: 8,
      [OperationType.DONE]: 12,
    },
  },
  {
    id: 'kmp',
    name: 'KMP Search',
    category: 'string',
    description:
      'KMP preprocesses the pattern into an LPS table so mismatches can skip redundant comparisons while keeping the search linear.',
    bestTime: 'O(N + M)',
    avgTime: 'O(N + M)',
    worstTime: 'O(N + M)',
    space: 'O(M)',
    spaceNote: 'LPS preprocessing array',
    facts: [
      { label: 'Type', value: 'Prefix Function Search' },
      { label: 'Preprocessing', value: 'LPS table' },
      { label: 'Output', value: 'All matches' },
    ],
    code: `function kmp(text, pattern) {
  const lps = buildLPS(pattern);
  let i = 0;
  let j = 0;

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) {
        recordMatch(i - j);
        j = lps[j - 1];
      }
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 1,
      [OperationType.COMPARE]: 6,
      [OperationType.OVERWRITE]: 11,
      [OperationType.DONE]: 16,
    },
  },
  {
    id: 'rabin-karp',
    name: 'Rabin-Karp',
    category: 'string',
    description:
      'Rabin-Karp hashes each window of text and compares hashes first, only falling back to character-by-character checking when hashes match.',
    bestTime: 'O(N + M)',
    avgTime: 'O(N + M)',
    worstTime: 'O(NM)',
    space: 'O(1)',
    spaceNote: 'rolling hash variables',
    facts: [
      { label: 'Type', value: 'Rolling Hash Search' },
      { label: 'Preprocessing', value: 'Pattern hash' },
      { label: 'Output', value: 'Candidate windows' },
    ],
    code: `function rabinKarp(text, pattern) {
  const patternHash = hash(pattern);
  let windowHash = hash(text.slice(0, pattern.length));

  for (let start = 0; start <= text.length - pattern.length; start++) {
    if (windowHash === patternHash) {
      if (text.slice(start, start + pattern.length) === pattern) {
        recordMatch(start);
      }
    }

    if (start < text.length - pattern.length) {
      windowHash = rollHash(windowHash, text[start], text[start + pattern.length]);
    }
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 1,
      [OperationType.COMPARE]: 5,
      [OperationType.OVERWRITE]: 11,
      [OperationType.DONE]: 13,
    },
  },
  {
    id: 'bst-insert',
    name: 'BST Insertion',
    category: 'tree',
    description: 'Builds a Binary Search Tree by comparing values to each node and branching left for smaller values, right for larger values.',
    bestTime: 'O(log N)',
    avgTime: 'O(log N)',
    worstTime: 'O(N)',
    space: 'O(N)',
    spaceNote: 'to store N elements',
    facts: [
      { label: 'Type', value: 'Tree Construction' },
      { label: 'Balance', value: 'Unbalanced' },
      { label: 'Sort', value: 'Yields sorted inorder' }
    ],
    code: `function insert(root, val) {
  if (root === null) return new Node(val);
  
  let curr = root;
  while (true) {
    if (val < curr.value) {
      if (curr.left === null) {
        curr.left = new Node(val);
        break;
      }
      curr = curr.left;
    } else {
      if (curr.right === null) {
        curr.right = new Node(val);
        break;
      }
      curr = curr.right;
    }
  }
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 11,
      [OperationType.COMPARE]: 5,
      [OperationType.OVERWRITE]: 7,
      [OperationType.DONE]: 20
    }
  },
  {
    id: 'preorder',
    name: 'Preorder Traversal',
    category: 'tree',
    description: 'Visits the current node first, then recursively traverses the left subtree, and finally the right subtree.',
    bestTime: 'O(N)',
    avgTime: 'O(N)',
    worstTime: 'O(N)',
    space: 'O(H)',
    spaceNote: 'call stack proportional to height',
    facts: [
      { label: 'Type', value: 'Depth-First Search' },
      { label: 'Order', value: 'Root -> Left -> Right' },
      { label: 'Uses', value: 'Copying trees' }
    ],
    code: `function preorder(node) {
  if (node === null) return;
  
  process(node.value);
  preorder(node.left);
  preorder(node.right);
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 5,
      [OperationType.COMPARE]: 2,
      [OperationType.OVERWRITE]: 4,
      [OperationType.DONE]: 7
    }
  },
  {
    id: 'inorder',
    name: 'Inorder Traversal',
    category: 'tree',
    description: 'Recursively traverses the left subtree, visits the current node, then traverses the right subtree.',
    bestTime: 'O(N)',
    avgTime: 'O(N)',
    worstTime: 'O(N)',
    space: 'O(H)',
    spaceNote: 'call stack proportional to height',
    facts: [
      { label: 'Type', value: 'Depth-First Search' },
      { label: 'Order', value: 'Left -> Root -> Right' },
      { label: 'Uses', value: 'Sorted output in BST' }
    ],
    code: `function inorder(node) {
  if (node === null) return;
  
  inorder(node.left);
  process(node.value);
  inorder(node.right);
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 4,
      [OperationType.COMPARE]: 2,
      [OperationType.OVERWRITE]: 5,
      [OperationType.DONE]: 7
    }
  },
  {
    id: 'postorder',
    name: 'Postorder Traversal',
    category: 'tree',
    description: 'Recursively traverses the left subtree, then the right subtree, and finally visits the current node.',
    bestTime: 'O(N)',
    avgTime: 'O(N)',
    worstTime: 'O(N)',
    space: 'O(H)',
    spaceNote: 'call stack proportional to height',
    facts: [
      { label: 'Type', value: 'Depth-First Search' },
      { label: 'Order', value: 'Left -> Right -> Root' },
      { label: 'Uses', value: 'Deleting trees' }
    ],
    code: `function postorder(node) {
  if (node === null) return;
  
  postorder(node.left);
  postorder(node.right);
  process(node.value);
}`,
    defaultHighlightedLines: {
      [OperationType.VISIT]: 4,
      [OperationType.COMPARE]: 2,
      [OperationType.OVERWRITE]: 6,
      [OperationType.DONE]: 8
    }
  }
];

export const ALGORITHM_DEFINITIONS = definitions.reduce<Record<string, AlgorithmDefinition>>((acc, definition) => {
  acc[definition.id] = definition;
  return acc;
}, {});

export const ALGORITHM_CATEGORIES = [
  {
    id: 'sorting' as const,
    name: 'Sorting',
    items: definitions.filter((definition) => definition.category === 'sorting'),
  },
  {
    id: 'graph' as const,
    name: 'Graph Algorithms',
    items: definitions.filter((definition) => definition.category === 'graph'),
  },
  {
    id: 'dp' as const,
    name: 'Dynamic Programming',
    items: definitions.filter((definition) => definition.category === 'dp'),
  },
  {
    id: 'string' as const,
    name: 'String Algorithms',
    items: definitions.filter((definition) => definition.category === 'string'),
  },
  {
    id: 'search' as const,
    name: 'Search Algorithms',
    items: definitions.filter((definition) => definition.category === 'search'),
  },
  {
    id: 'tree' as const,
    name: 'Tree Algorithms',
    items: definitions.filter((definition) => definition.category === 'tree'),
  },
];

export const COMPARISON_SORTING_ALGOS = definitions
  .filter((definition) => definition.category === 'sorting')
  .map(({ id, name }) => ({ id, name }));

export const COMPARISON_GRAPH_ALGOS = definitions
  .filter(d => d.category === 'graph')
  .map(({ id, name }) => ({ id, name }));

export const COMPARISON_TREE_ALGOS = definitions
  .filter(d => d.category === 'tree')
  .map(({ id, name }) => ({ id, name }));

export const ALL_COMPARISON_ALGOS = [
  ...definitions.filter(d => d.category === 'sorting').map(({ id, name }) => ({ id, name, group: 'Sorting' })),
  ...definitions.filter(d => d.category === 'tree').map(({ id, name }) => ({ id, name, group: 'Tree' })),
  ...definitions.filter(d => d.category === 'graph').map(({ id, name }) => ({ id, name, group: 'Graph' })),
];

export const getAlgorithmDefinition = (algorithmId: string) =>
  ALGORITHM_DEFINITIONS[algorithmId] ?? ALGORITHM_DEFINITIONS['quick-sort'];

export const isSortingAlgorithm = (algorithmId: string) =>
  getAlgorithmDefinition(algorithmId).category === 'sorting';

export const isGraphAlgorithm = (algorithmId: string) =>
  getAlgorithmDefinition(algorithmId).category === 'graph';

export const isDynamicProgrammingAlgorithm = (algorithmId: string) =>
  getAlgorithmDefinition(algorithmId).category === 'dp';

export const isStringAlgorithm = (algorithmId: string) =>
  getAlgorithmDefinition(algorithmId).category === 'string';
