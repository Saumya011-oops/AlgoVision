import { OperationType, AlgorithmResult, AlgorithmState } from '../../types/AlgorithmState';

/**
 * Heap Sort — Step-through state generator.
 * Tracks heapify operations and extract-max phases with educational messages.
 */

export interface HeapSortData {
  array: number[];
  heapSize: number;
  comparing: [number, number] | null;
}

export const generateHeapSortStates = (initialArray: number[]): AlgorithmResult<HeapSortData> => {
  const arr = [...initialArray];
  const n = arr.length;
  const states: AlgorithmState<HeapSortData>[] = [];
  let step = 0;

  const snapshot = (op: OperationType, active: number[], msg: string, heapSize: number = n) => {
    states.push({
      data: { array: [...arr], heapSize, comparing: null },
      activeIndices: active,
      operationType: op,
      metadata: { stepNumber: step++, message: msg },
    });
  };

  snapshot(OperationType.VISIT, [], 'Starting Heap Sort. First, we build a max-heap from the array.');

  // Build max heap
  const heapify = (size: number, root: number, phase: string) => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size && arr[left] > arr[largest]) largest = left;
    if (right < size && arr[right] > arr[largest]) largest = right;

    if (largest !== root) {
      snapshot(OperationType.COMPARE, [root, largest],
        phase + ': Node ' + arr[root] + ' (i=' + root + ') < child ' + arr[largest] + ' (i=' + largest + '). Swapping to maintain heap property.', size);

      const tmp = arr[root]; arr[root] = arr[largest]; arr[largest] = tmp;

      snapshot(OperationType.SWAP, [root, largest],
        phase + ': Swapped ' + arr[largest] + ' down, ' + arr[root] + ' up. Continuing heapify at index ' + largest + '.', size);

      heapify(size, largest, phase);
    }
  };

  // Build phase
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    snapshot(OperationType.VISIT, [i], 'Build Heap: Heapifying subtree rooted at index ' + i + ' (value ' + arr[i] + ').');
    heapify(n, i, 'Build Heap');
  }

  snapshot(OperationType.OVERWRITE, [], 'Max-heap built! Root ' + arr[0] + ' is the largest. Heap: [' + arr.join(', ') + '].');

  // Extract phase
  for (let i = n - 1; i > 0; i--) {
    snapshot(OperationType.SWAP, [0, i],
      'Extract: Swapping root ' + arr[0] + ' (max) with last unsorted element ' + arr[i] + '. ' + arr[0] + ' moves to its final position ' + i + '.');

    const tmp = arr[0]; arr[0] = arr[i]; arr[i] = tmp;

    snapshot(OperationType.OVERWRITE, [i],
      'Element ' + arr[i] + ' placed at final position ' + i + '. Heap size reduced to ' + i + '. Re-heapifying...', i);

    heapify(i, 0, 'Extract');
  }

  snapshot(OperationType.DONE, [], 'Heap Sort Complete! Sorted: [' + arr.join(', ') + ']', 0);

  return { states, timeComplexity: 'O(N log N) all cases', spaceComplexity: 'O(1)' };
};
