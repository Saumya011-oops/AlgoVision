import { OperationType, AlgorithmResult, AlgorithmState } from '../../types/AlgorithmState';

/*
 * Partition-tree Quick Sort state generator.
 * Tracks a TREE showing how the array is progressively partitioned.
 * Each level shows subarrays getting smaller as pivots are placed.
 */

export interface QSSegment {
  values: number[];
  startIdx: number;
  type: 'subarray' | 'pivot';
  status: 'default' | 'active' | 'partitioning' | 'placed' | 'sorted';
}

export interface QSRow {
  segments: QSSegment[];
}

export interface QuickSortTreeData {
  rows: QSRow[];
  currentRowIdx: number;
  originalArray: number[];
}

export const generateQuickSortStates = (initialArray: number[]): AlgorithmResult<QuickSortTreeData> => {
  const arr = [...initialArray];
  const states: AlgorithmState<QuickSortTreeData>[] = [];
  let step = 0;

  // Track rows - each row represents one level of recursion
  // Row 0 = original array
  // Row 1 = after first partition (left | PIVOT | right)
  // Row 2 = after partitioning each subarray, etc.
  const rows: QSRow[] = [
    { segments: [{ values: [...arr], startIdx: 0, type: 'subarray', status: 'default' }] }
  ];

  const snapshot = (rowIdx: number, op: OperationType, msg: string) => {
    const clonedRows = rows.map(r => ({
      segments: r.segments.map(s => ({ ...s, values: [...s.values] }))
    }));
    states.push({
      data: { rows: clonedRows, currentRowIdx: rowIdx, originalArray: [...initialArray] },
      activeIndices: [],
      operationType: op,
      metadata: { stepNumber: step++, message: msg }
    });
  };

  snapshot(0, OperationType.VISIT, 'Starting Quick Sort. The full array of ' + arr.length + ' elements will be partitioned around pivots.');

  // Build the next row from current row by partitioning a specific subarray segment
  const partitionInPlace = (left: number, right: number): number => {
    const pivot = arr[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
      if (arr[j] < pivot) {
        i++;
        const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
    }
    const tmp = arr[i + 1]; arr[i + 1] = arr[right]; arr[right] = tmp;
    return i + 1;
  };

  // Recursive partition that builds the tree rows
  const quickSort = (left: number, right: number, depth: number) => {
    if (left > right) return;

    if (left === right) {
      // Single element - mark as sorted in current row
      updateSegmentStatus(left, right, 'sorted');
      snapshot(depth, OperationType.VISIT, 'Element ' + arr[left] + ' is alone — already sorted.');
      return;
    }

    // Highlight this subarray as active
    updateSegmentStatus(left, right, 'active');
    const pivotVal = arr[right];
    snapshot(depth, OperationType.COMPARE,
      'Partitioning [' + arr.slice(left, right + 1).join(', ') + '] around pivot ' + pivotVal + ' (last element).');

    // Perform partition
    const pi = partitionInPlace(left, right);

    // Mark as partitioning
    updateSegmentStatus(left, right, 'partitioning');
    snapshot(depth, OperationType.SWAP,
      'Pivot ' + pivotVal + ' placed at position ' + pi + '. Left side has smaller elements, right side has larger.');

    // Build the next row: replace this subarray segment with [left..pi-1] + PIVOT + [pi+1..right]
    ensureRow(depth + 1);
    const nextRow = rows[depth + 1];

    // Copy all segments from current row that are NOT this subarray
    if (nextRow.segments.length === 0) {
      // Start from the current row's structure
      for (const seg of rows[depth].segments) {
        if (seg.startIdx === left && seg.type === 'subarray' && seg.values.length === right - left + 1) {
          // Split this segment into parts
          if (pi > left) {
            nextRow.segments.push({
              values: arr.slice(left, pi),
              startIdx: left,
              type: 'subarray',
              status: 'default'
            });
          }
          nextRow.segments.push({
            values: [arr[pi]],
            startIdx: pi,
            type: 'pivot',
            status: 'placed'
          });
          if (pi < right) {
            nextRow.segments.push({
              values: arr.slice(pi + 1, right + 1),
              startIdx: pi + 1,
              type: 'subarray',
              status: 'default'
            });
          }
        } else {
          nextRow.segments.push({ ...seg, values: [...seg.values] });
        }
      }
    } else {
      // Row already has segments from previous partitions at this depth
      // Find and replace the matching subarray segment
      const newSegments: QSSegment[] = [];
      for (const seg of nextRow.segments) {
        if (seg.startIdx === left && seg.type === 'subarray' && seg.values.length === right - left + 1) {
          if (pi > left) {
            newSegments.push({
              values: arr.slice(left, pi),
              startIdx: left,
              type: 'subarray',
              status: 'default'
            });
          }
          newSegments.push({
            values: [arr[pi]],
            startIdx: pi,
            type: 'pivot',
            status: 'placed'
          });
          if (pi < right) {
            newSegments.push({
              values: arr.slice(pi + 1, right + 1),
              startIdx: pi + 1,
              type: 'subarray',
              status: 'default'
            });
          }
        } else {
          newSegments.push(seg);
        }
      }
      nextRow.segments = newSegments;
    }

    // Mark current subarray as done in current row
    updateSegmentStatus(left, right, 'sorted');

    snapshot(depth + 1, OperationType.OVERWRITE,
      'Row updated: ' + nextRow.segments.map(s =>
        s.type === 'pivot' ? '[' + s.values[0] + ']' : s.values.join(', ')
      ).join(' | '));

    // Recurse on left and right subarrays
    if (pi > left) quickSort(left, pi - 1, depth + 1);
    if (pi < right) quickSort(pi + 1, right, depth + 1);
  };

  const ensureRow = (depth: number) => {
    while (rows.length <= depth) {
      rows.push({ segments: [] });
    }
  };

  const updateSegmentStatus = (left: number, right: number, status: QSSegment['status']) => {
    for (const row of rows) {
      for (const seg of row.segments) {
        if (seg.startIdx === left && seg.values.length === right - left + 1 && seg.type === 'subarray') {
          seg.status = status;
        }
      }
    }
  };

  quickSort(0, arr.length - 1, 0);

  // Final state - mark all as sorted
  for (const row of rows) {
    for (const seg of row.segments) {
      seg.status = 'sorted';
    }
  }
  snapshot(rows.length - 1, OperationType.DONE,
    'Quick Sort Complete! Sorted array: [' + arr.join(', ') + ']');

  return {
    states,
    timeComplexity: 'O(N log N) avg, O(N²) worst',
    spaceComplexity: 'O(log N)',
  };
};
