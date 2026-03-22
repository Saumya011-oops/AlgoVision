import { AlgorithmState, OperationType } from '../types/AlgorithmState';

export interface OperationMetrics {
  steps: number;
  comparisons: number;
  swaps: number;
  visits: number;
  writes: number;
  totalOperations: number;
}

export const countOperationMetrics = (
  states: AlgorithmState<unknown>[],
  upTo = states.length - 1
): OperationMetrics => {
  if (states.length === 0 || upTo < 0) {
    return {
      steps: 0,
      comparisons: 0,
      swaps: 0,
      visits: 0,
      writes: 0,
      totalOperations: 0,
    };
  }

  let comparisons = 0;
  let swaps = 0;
  let visits = 0;
  let writes = 0;

  for (let index = 0; index <= upTo && index < states.length; index++) {
    const operation = states[index].operationType;
    if (operation === OperationType.COMPARE) comparisons += 1;
    if (operation === OperationType.SWAP) swaps += 1;
    if (operation === OperationType.VISIT) visits += 1;
    if (operation === OperationType.OVERWRITE) writes += 1;
  }

  return {
    steps: Math.min(upTo + 1, states.length),
    comparisons,
    swaps,
    visits,
    writes,
    totalOperations: comparisons + swaps + visits + writes,
  };
};
