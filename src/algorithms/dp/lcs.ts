import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';
import { DPMatrixData } from './knapsack';

const buildLCSStrings = (size: number) => {
  const leftPool = 'ALGORITHM';
  const rightPool = 'LOGARITHM';
  const leftLength = Math.max(4, Math.min(7, Math.floor(size / 2)));
  const rightLength = Math.max(4, Math.min(7, Math.floor(size / 2) + 1));

  return {
    left: leftPool.slice(0, leftLength),
    right: rightPool.slice(0, rightLength),
  };
};

export const generateLCSStates = (size = 8): AlgorithmResult<DPMatrixData> => {
  const { left, right } = buildLCSStrings(size);
  const matrix = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));
  const states: AlgorithmState<DPMatrixData>[] = [];
  let step = 0;

  const rowLabels = ['-'].concat(left.split(''));
  const columnLabels = ['-'].concat(right.split(''));

  const record = (
    operationType: OperationType,
    activeCells: Array<[number, number]>,
    message: string
  ) => {
    states.push({
      data: {
        label: 'Longest Common Subsequence',
        matrix: matrix.map((row) => [...row]),
        rowLabels,
        columnLabels,
        activeCells,
        summary: `${left} vs ${right}`,
      },
      activeIndices: activeCells.map(([row, column]) => row * (right.length + 1) + column),
      operationType,
      metadata: {
        stepNumber: step++,
        message,
      },
    });
  };

  record(
    OperationType.VISIT,
    [],
    `Comparing "${left}" and "${right}". Each cell stores the best subsequence length for the two prefixes seen so far.`
  );

  for (let row = 1; row <= left.length; row++) {
    for (let column = 1; column <= right.length; column++) {
      record(
        OperationType.COMPARE,
        [
          [row, column],
          [row - 1, column],
          [row, column - 1],
        ],
        `Compare ${left[row - 1]} and ${right[column - 1]} to decide whether the subsequence can grow here.`
      );

      if (left[row - 1] === right[column - 1]) {
        matrix[row][column] = matrix[row - 1][column - 1] + 1;
        record(
          OperationType.OVERWRITE,
          [
            [row, column],
            [row - 1, column - 1],
          ],
          `Characters match, so we extend the diagonal subsequence length to ${matrix[row][column]}.`
        );
      } else {
        matrix[row][column] = Math.max(matrix[row - 1][column], matrix[row][column - 1]);
        record(
          OperationType.OVERWRITE,
          [
            [row, column],
            [row - 1, column],
            [row, column - 1],
          ],
          `Characters differ, so we keep the better subsequence from the cell above or to the left.`
        );
      }
    }
  }

  record(
    OperationType.DONE,
    [[left.length, right.length]],
    `LCS complete. The longest common subsequence length is ${matrix[left.length][right.length]}.`
  );

  return {
    states,
    timeComplexity: 'O(NM)',
    spaceComplexity: 'O(NM)',
  };
};
