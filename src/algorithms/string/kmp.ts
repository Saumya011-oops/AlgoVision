import { OperationType, AlgorithmResult, AlgorithmState } from '../../types/AlgorithmState';

export interface KMPData {
  text: string;
  pattern: string;
  textIndex: number;
  patternIndex: number;
  lps: number[];
  matches: number[];
}

export const generateKMPStates = (
  text: string = "ABABDABACDABABCABABABABCABAB",
  pattern: string = "ABABCAB"
): AlgorithmResult<KMPData> => {
  const states: AlgorithmState<KMPData>[] = [];
  let step = 0;

  const record = (ti: number, pi: number, lps: number[], matches: number[], op: OperationType, msg: string) => {
    states.push({
      data: { text, pattern, textIndex: ti, patternIndex: pi, lps: [...lps], matches: [...matches] },
      activeIndices: [ti],
      secondaryIndices: matches,
      operationType: op,
      metadata: { stepNumber: step++, message: msg }
    });
  };

  // Build LPS array
  const lps = Array(pattern.length).fill(0);
  let len = 0, i = 1;

  record(-1, -1, lps, [], OperationType.VISIT, `Building the LPS (Longest Proper Prefix which is also Suffix) table for pattern "${pattern}".`);

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      record(i, len, lps, [], OperationType.OVERWRITE, `LPS[${i}] = ${len}. Characters '${pattern[i]}' and '${pattern[len - 1]}' match.`);
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  record(-1, -1, lps, [], OperationType.VISIT, `LPS table built: [${lps.join(', ')}]. Now searching text for pattern.`);

  // Search
  let ti = 0, pi = 0;
  const matches: number[] = [];

  while (ti < text.length) {
    record(ti, pi, lps, matches, OperationType.COMPARE, `Comparing text[${ti}]='${text[ti]}' with pattern[${pi}]='${pattern[pi]}'`);

    if (text[ti] === pattern[pi]) {
      ti++; pi++;
      if (pi === pattern.length) {
        matches.push(ti - pi);
        record(ti - pi, pi, lps, matches, OperationType.DONE, `Pattern found at index ${ti - pi}! Full match detected.`);
        pi = lps[pi - 1];
      }
    } else {
      if (pi !== 0) {
        record(ti, pi, lps, matches, OperationType.VISIT, `Mismatch! Using LPS to skip. Jumping pattern index from ${pi} to ${lps[pi - 1]}.`);
        pi = lps[pi - 1];
      } else {
        ti++;
      }
    }
  }

  record(ti, pi, lps, matches, OperationType.DONE, `KMP search complete! Found ${matches.length} match(es) at indices: [${matches.join(', ')}].`);

  return {
    states,
    timeComplexity: 'O(N + M)',
    spaceComplexity: 'O(M)',
  };
};
