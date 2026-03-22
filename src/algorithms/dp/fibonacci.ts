import { OperationType, AlgorithmResult, AlgorithmState } from '../../types/AlgorithmState';

export interface DPTableData {
  table: number[];
  n: number;
  label: string;
}

export const generateFibonacciDPStates = (n: number = 12): AlgorithmResult<DPTableData> => {
  const dp = Array(n + 1).fill(0);
  dp[1] = 1;

  const states: AlgorithmState<DPTableData>[] = [];
  let step = 0;

  const record = (active: number[], op: OperationType, msg: string) => {
    states.push({
      data: { table: [...dp], n, label: 'Fibonacci' },
      activeIndices: active,
      operationType: op,
      metadata: { stepNumber: step++, message: msg }
    });
  };

  record([], OperationType.VISIT, `Computing Fibonacci numbers using Dynamic Programming. Table initialized: dp[0]=0, dp[1]=1.`);
  record([0, 1], OperationType.OVERWRITE, `Base cases set: F(0) = 0, F(1) = 1.`);

  for (let i = 2; i <= n; i++) {
    record([i - 1, i - 2], OperationType.COMPARE, `Looking up dp[${i - 1}] = ${dp[i - 1]} and dp[${i - 2}] = ${dp[i - 2]}`);
    dp[i] = dp[i - 1] + dp[i - 2];
    record([i], OperationType.OVERWRITE, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`);
  }

  record([], OperationType.DONE, `Fibonacci DP Complete! F(${n}) = ${dp[n]}. Built table bottom-up to avoid redundant recomputation.`);

  return {
    states,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
  };
};
