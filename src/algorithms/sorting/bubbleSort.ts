import { OperationType, AlgorithmResult, AlgorithmState } from '../../types/AlgorithmState';

/**
 * Bubble Sort — Step-through state generator.
 * Tracks each comparison and swap with educational messages.
 */

export interface BubbleSortData {
  array: number[];
  sortedBoundary: number; // everything >= this index is sorted
  comparing: [number, number] | null;
  swapped: boolean;
}

export const generateBubbleSortStates = (initialArray: number[]): AlgorithmResult<BubbleSortData> => {
  const arr = [...initialArray];
  const n = arr.length;
  const states: AlgorithmState<BubbleSortData>[] = [];
  let step = 0;

  const snapshot = (op: OperationType, active: number[], msg: string, comparing: [number, number] | null = null, sortedBoundary: number = n) => {
    states.push({
      data: { array: [...arr], sortedBoundary, comparing, swapped: false },
      activeIndices: active,
      operationType: op,
      metadata: { stepNumber: step++, message: msg },
    });
  };

  snapshot(OperationType.VISIT, [], 'Starting Bubble Sort. We will repeatedly pass through the array, swapping adjacent elements if they are out of order.');

  for (let i = 0; i < n - 1; i++) {
    let swappedThisPass = false;

    snapshot(OperationType.VISIT, [], 'Pass ' + (i + 1) + ': Bubbling the largest unsorted element to position ' + (n - 1 - i) + '.', null, n - i);

    for (let j = 0; j < n - 1 - i; j++) {
      snapshot(OperationType.COMPARE, [j, j + 1],
        'Comparing ' + arr[j] + ' and ' + arr[j + 1] + '.' + (arr[j] > arr[j + 1] ? ' ' + arr[j] + ' > ' + arr[j + 1] + ' → swap needed!' : ' Already in order.'),
        [j, j + 1], n - i);

      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = tmp;
        swappedThisPass = true;
        snapshot(OperationType.SWAP, [j, j + 1],
          'Swapped ' + arr[j] + ' and ' + arr[j + 1] + '.', [j, j + 1], n - i);
      }
    }

    snapshot(OperationType.OVERWRITE, [n - 1 - i],
      'Element ' + arr[n - 1 - i] + ' is now in its final sorted position at index ' + (n - 1 - i) + '.', null, n - 1 - i);

    if (!swappedThisPass) {
      snapshot(OperationType.DONE, [],
        'No swaps in this pass — array is already sorted! Early termination.', null, 0);
      return { states, timeComplexity: 'O(N²) worst/avg, O(N) best', spaceComplexity: 'O(1)' };
    }
  }

  snapshot(OperationType.DONE, [], 'Bubble Sort Complete! Sorted: [' + arr.join(', ') + ']', null, 0);

  return { states, timeComplexity: 'O(N²) worst/avg, O(N) best', spaceComplexity: 'O(1)' };
};
