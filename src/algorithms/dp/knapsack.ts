import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';

export interface KnapsackItem {
  label: string;
  weight: number;
  value: number;
}

export interface DPMatrixData {
  label: string;
  matrix: number[][];
  rowLabels: string[];
  columnLabels: string[];
  activeCells: Array<[number, number]>;
  summary: string;
}

const createKnapsackItems = (size: number): { items: KnapsackItem[]; capacity: number } => {
  const itemCount = Math.max(4, Math.min(6, Math.floor(size / 2)));
  const items = Array.from({ length: itemCount }, (_, index) => ({
    label: `I${index + 1}`,
    weight: 1 + ((index * 2 + size) % 5),
    value: 4 + ((index * 3 + size) % 8),
  }));
  const capacity = Math.max(6, Math.min(12, size));
  return { items, capacity };
};

export const generateKnapsackStates = (size = 8): AlgorithmResult<DPMatrixData> => {
  const { items, capacity } = createKnapsackItems(size);
  const dp = Array.from({ length: items.length + 1 }, () => Array(capacity + 1).fill(0));
  const states: AlgorithmState<DPMatrixData>[] = [];
  let step = 0;

  const rowLabels = ['0 items', ...items.map((item) => `${item.label} (${item.weight}w/${item.value}v)`)];
  const columnLabels = Array.from({ length: capacity + 1 }, (_, value) => `${value}`);

  const record = (
    operationType: OperationType,
    activeCells: Array<[number, number]>,
    message: string
  ) => {
    states.push({
      data: {
        label: '0/1 Knapsack',
        matrix: dp.map((row) => [...row]),
        rowLabels,
        columnLabels,
        activeCells,
        summary: `Capacity ${capacity}, ${items.length} items`,
      },
      activeIndices: activeCells.map(([row, column]) => row * (capacity + 1) + column),
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
    `Building a table of best values for capacities 0..${capacity}. Each row decides whether to skip or take the next item.`
  );

  for (let itemIndex = 1; itemIndex <= items.length; itemIndex++) {
    const item = items[itemIndex - 1];

    for (let currentCapacity = 0; currentCapacity <= capacity; currentCapacity++) {
      record(
        OperationType.COMPARE,
        [
          [itemIndex, currentCapacity],
          [itemIndex - 1, currentCapacity],
        ],
        `At row ${item.label} and capacity ${currentCapacity}, start by carrying forward the best value without taking the item.`
      );

      dp[itemIndex][currentCapacity] = dp[itemIndex - 1][currentCapacity];

      if (item.weight <= currentCapacity) {
        const candidate = item.value + dp[itemIndex - 1][currentCapacity - item.weight];
        if (candidate > dp[itemIndex][currentCapacity]) {
          dp[itemIndex][currentCapacity] = candidate;
          record(
            OperationType.OVERWRITE,
            [
              [itemIndex, currentCapacity],
              [itemIndex - 1, currentCapacity - item.weight],
            ],
            `Taking ${item.label} improves the value to ${candidate}, so we update this state.`
          );
          continue;
        }
      }

      record(
        OperationType.VISIT,
        [[itemIndex, currentCapacity]],
        `Skipping ${item.label} remains optimal at capacity ${currentCapacity}.`
      );
    }
  }

  record(
    OperationType.DONE,
    [[items.length, capacity]],
    `Knapsack complete. Maximum value achievable at capacity ${capacity} is ${dp[items.length][capacity]}.`
  );

  return {
    states,
    timeComplexity: 'O(NW)',
    spaceComplexity: 'O(NW)',
  };
};
