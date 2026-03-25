import { generateFibonacciDPStates } from '../algorithms/dp/fibonacci';
import { generateKnapsackStates } from '../algorithms/dp/knapsack';
import { generateLCSStates } from '../algorithms/dp/lcs';
import { generateBellmanFordStates } from '../algorithms/graph/bellmanFord';
import { generateBFSStates } from '../algorithms/graph/bfs';
import { generateDFSStates } from '../algorithms/graph/dfs';
import { generateUCSStates } from '../algorithms/graph/ucs';
import { generateDLSStates } from '../algorithms/graph/dls';
import { generateIDDFSStates } from '../algorithms/graph/iddfs';
import { generateBidirectionalStates } from '../algorithms/graph/bidirectional';
import { generateBestFirstStates } from '../algorithms/graph/bestFirst';
import { generateAStarStates } from '../algorithms/graph/aStar';
import { generateDijkstraStates } from '../algorithms/graph/dijkstra';
import { generateBubbleSortStates } from '../algorithms/sorting/bubbleSort';
import { generateHeapSortStates } from '../algorithms/sorting/heapSort';
import { generateMergeSortStates } from '../algorithms/sorting/mergeSort';
import { generateQuickSortStates } from '../algorithms/sorting/quickSort';
import { generateSelectionSortStates } from '../algorithms/sorting/selectionSort';
import { generateKMPStates } from '../algorithms/string/kmp';
import { generateRabinKarpStates } from '../algorithms/string/rabinKarp';
import { generateBSTInsertStates } from '../algorithms/tree/bstInsert';
import { generatePreorderStates } from '../algorithms/tree/preorder';
import { generateInorderStates } from '../algorithms/tree/inorder';
import { generatePostorderStates } from '../algorithms/tree/postorder';
import { AlgorithmResult } from '../types/AlgorithmState';
import { getAlgorithmDefinition } from '../data/algorithmCatalog';

export type DataPattern = 'random' | 'sorted' | 'reverse';

export interface AlgorithmRunOptions {
  size: number;
  pattern: DataPattern;
}

export const generateArray = (size: number, pattern: DataPattern): number[] => {
  const array = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);

  if (pattern === 'sorted') {
    return [...array].sort((left, right) => left - right);
  }

  if (pattern === 'reverse') {
    return [...array].sort((left, right) => right - left);
  }

  return array;
};

export const runAlgorithm = (
  algorithmId: string,
  options: AlgorithmRunOptions
): AlgorithmResult<unknown> => {
  const { size, pattern } = options;

  const buildSearchInput = (requestedSize: number) => {
    const alphabet = 'ABABCABABDACABA';
    const length = Math.max(10, Math.min(22, requestedSize * 2));
    let text = '';

    for (let index = 0; index < length; index++) {
      text += alphabet[index % alphabet.length];
    }

    const patternStart = Math.max(1, Math.floor(length / 3));
    const searchPattern = text.slice(patternStart, patternStart + Math.max(3, Math.min(6, Math.floor(requestedSize / 2))));

    return { text, pattern: searchPattern };
  };

  switch (algorithmId) {
    case 'quick-sort':
      return generateQuickSortStates(generateArray(size, pattern));
    case 'merge-sort':
      return generateMergeSortStates(generateArray(size, pattern));
    case 'bubble-sort':
      return generateBubbleSortStates(generateArray(size, pattern));
    case 'selection-sort':
      return generateSelectionSortStates(generateArray(size, pattern));
    case 'heap-sort':
      return generateHeapSortStates(generateArray(size, pattern));
    case 'dijkstra':
      return generateDijkstraStates(0, Math.max(5, Math.min(9, size)));
    case 'bellman-ford':
      return generateBellmanFordStates(0, Math.max(5, Math.min(9, size)));
    case 'bfs':
      return generateBFSStates(0, Math.max(5, Math.min(9, size)));
    case 'dfs':
      return generateDFSStates(0, Math.max(5, Math.min(9, size)));
    case 'ucs':
      return generateUCSStates(0, Math.max(5, Math.min(9, size)));
    case 'dls':
      return generateDLSStates(0, Math.max(5, Math.min(9, size)), Math.max(1, Math.floor(size / 2)));
    case 'iddfs':
      return generateIDDFSStates(0, Math.max(5, Math.min(9, size)));
    case 'bidirectional':
      return generateBidirectionalStates(0, Math.max(5, Math.min(9, size)));
    case 'best-first':
      return generateBestFirstStates(0, Math.max(5, Math.min(9, size)));
    case 'a-star':
      return generateAStarStates(0, Math.max(5, Math.min(9, size)));
    case 'fibonacci-dp':
      return generateFibonacciDPStates(Math.max(5, Math.min(14, size)));
    case 'knapsack-01':
      return generateKnapsackStates(Math.max(6, Math.min(12, size)));
    case 'lcs':
      return generateLCSStates(Math.max(6, Math.min(12, size)));
    case 'kmp': {
      const searchInput = buildSearchInput(size);
      return generateKMPStates(searchInput.text, searchInput.pattern);
    }
    case 'rabin-karp':
      return generateRabinKarpStates(Math.max(6, Math.min(12, size)));
    case 'bst-insert':
      return generateBSTInsertStates(generateArray(Math.max(5, Math.min(15, size)), pattern));
    case 'preorder':
      return generatePreorderStates(Math.max(5, Math.min(15, size)));
    case 'inorder':
      return generateInorderStates(Math.max(5, Math.min(15, size)));
    case 'postorder':
      return generatePostorderStates(Math.max(5, Math.min(15, size)));
    default:
      return runAlgorithm(getAlgorithmDefinition(algorithmId).id, options);
  }
};

export const getInputSizeRange = (algorithmId: string) => {
  switch (algorithmId) {
    case 'dijkstra':
    case 'bellman-ford':
    case 'bfs':
    case 'dfs':
    case 'ucs':
    case 'dls':
    case 'iddfs':
    case 'bidirectional':
    case 'best-first':
    case 'a-star':
      return { min: 5, max: 9, label: 'Nodes' };
    case 'fibonacci-dp':
      return { min: 5, max: 14, label: 'N' };
    case 'knapsack-01':
    case 'lcs':
    case 'rabin-karp':
      return { min: 6, max: 12, label: 'Size' };
    case 'kmp':
      return { min: 6, max: 12, label: 'Text' };
    case 'bst-insert':
    case 'preorder':
    case 'inorder':
    case 'postorder':
      return { min: 5, max: 15, label: 'Nodes' };
    default:
      return { min: 4, max: 16, label: 'Size' };
  }
};

export const getAnalyticsSampleSizes = (algorithmId: string) => {
  switch (algorithmId) {
    case 'dijkstra':
    case 'bellman-ford':
    case 'bfs':
    case 'dfs':
    case 'ucs':
    case 'dls':
    case 'iddfs':
    case 'bidirectional':
    case 'best-first':
    case 'a-star':
      return [5, 6, 7, 8, 9];
    case 'fibonacci-dp':
      return [5, 7, 9, 11, 13];
    case 'knapsack-01':
    case 'lcs':
    case 'rabin-karp':
      return [6, 7, 8, 9, 10, 11, 12];
    case 'kmp':
      return [6, 8, 10, 12];
    case 'bst-insert':
    case 'preorder':
    case 'inorder':
    case 'postorder':
      return [5, 7, 9, 11, 13, 15];
    default:
      return [4, 6, 8, 10, 12, 14, 16];
  }
};
