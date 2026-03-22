import { OperationType, AlgorithmResult, AlgorithmState } from '../../types/AlgorithmState';

/**
 * Selection Sort — Step-through state generator.
 * Tracks min-finding scans and swaps with educational messages.
 */

export interface SelectionSortData {
  array: number[];
  sortedBoundary: number; // everything < this index is sorted
  currentMin: number | null;
  scanRange: [number, number] | null;
}

export const generateSelectionSortStates = (initialArray: number[]): AlgorithmResult<SelectionSortData> => {
  const arr = [...initialArray];
  const n = arr.length;
  const states: AlgorithmState<SelectionSortData>[] = [];
  let step = 0;

  const snapshot = (op: OperationType, active: number[], msg: string, sortedBoundary: number = 0, currentMin: number | null = null) => {
    states.push({
      data: { array: [...arr], sortedBoundary, currentMin, scanRange: null },
      activeIndices: active,
      operationType: op,
      metadata: { stepNumber: step++, message: msg },
    });
  };

  snapshot(OperationType.VISIT, [], 'Starting Selection Sort. For each position, we find the minimum element from the unsorted region and place it.');

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    snapshot(OperationType.VISIT, [i],
      'Round ' + (i + 1) + ': Finding the minimum element in positions ' + i + ' to ' + (n - 1) + '. Current minimum: ' + arr[minIdx] + ' at index ' + minIdx + '.', i, minIdx);

    for (let j = i + 1; j < n; j++) {
      snapshot(OperationType.COMPARE, [minIdx, j],
        'Comparing current min ' + arr[minIdx] + ' with ' + arr[j] + '.' + (arr[j] < arr[minIdx] ? ' New minimum found!' : ' Current min is still smaller.'), i, minIdx);

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      snapshot(OperationType.SWAP, [i, minIdx],
        'Swapping ' + arr[i] + ' (position ' + i + ') with minimum ' + arr[minIdx] + ' (position ' + minIdx + ').', i, minIdx);
      const tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
    }

    snapshot(OperationType.OVERWRITE, [i],
      'Element ' + arr[i] + ' placed at position ' + i + '. Sorted region: [' + arr.slice(0, i + 1).join(', ') + '].', i + 1);
  }

  snapshot(OperationType.DONE, [], 'Selection Sort Complete! Sorted: [' + arr.join(', ') + ']', n);

  return { states, timeComplexity: 'O(N²) all cases', spaceComplexity: 'O(1)' };
};
