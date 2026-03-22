import { AlgorithmResult, AlgorithmState, OperationType } from '../../types/AlgorithmState';

export interface StringSearchData {
  text: string;
  pattern: string;
  textIndex: number;
  patternIndex: number;
  matches: number[];
  lps?: number[];
  windowStart?: number;
  windowEnd?: number;
  patternHash?: number;
  windowHash?: number;
}

const buildSearchStrings = (size: number) => {
  const alphabet = 'ABRACADABRA';
  const length = Math.max(10, Math.min(22, size * 2));
  let text = '';

  for (let index = 0; index < length; index++) {
    text += alphabet[index % alphabet.length];
  }

  const patternStart = Math.max(2, Math.floor(length / 3));
  const pattern = text.slice(patternStart, patternStart + Math.max(3, Math.min(5, Math.floor(size / 3))));

  return { text, pattern };
};

export const generateRabinKarpStates = (size = 8): AlgorithmResult<StringSearchData> => {
  const { text, pattern } = buildSearchStrings(size);
  const base = 256;
  const mod = 101;
  const states: AlgorithmState<StringSearchData>[] = [];
  let step = 0;

  const hash = (value: string) => {
    let result = 0;
    for (const char of value) {
      result = (result * base + char.charCodeAt(0)) % mod;
    }
    return result;
  };

  const matches: number[] = [];
  const patternHash = hash(pattern);
  let windowHash = hash(text.slice(0, pattern.length));

  const record = (
    operationType: OperationType,
    windowStart: number,
    textIndex: number,
    patternIndex: number,
    message: string
  ) => {
    states.push({
      data: {
        text,
        pattern,
        textIndex,
        patternIndex,
        matches: [...matches],
        windowStart,
        windowEnd: windowStart + pattern.length - 1,
        patternHash,
        windowHash,
      },
      activeIndices: [textIndex].filter((index) => index >= 0),
      operationType,
      metadata: {
        stepNumber: step++,
        message,
      },
    });
  };

  record(
    OperationType.VISIT,
    0,
    0,
    0,
    `Starting Rabin-Karp. Pattern hash is ${patternHash}; each text window will be compared using a rolling hash first.`
  );

  for (let start = 0; start <= text.length - pattern.length; start++) {
    record(
      OperationType.COMPARE,
      start,
      start,
      0,
      `Comparing window ${start}-${start + pattern.length - 1}. Window hash is ${windowHash}.`
    );

    if (windowHash === patternHash) {
      let matchesExactly = true;
      for (let offset = 0; offset < pattern.length; offset++) {
        record(
          OperationType.COMPARE,
          start,
          start + offset,
          offset,
          `Hash match found, so verify character ${text[start + offset]} against ${pattern[offset]}.`
        );
        if (text[start + offset] !== pattern[offset]) {
          matchesExactly = false;
          break;
        }
      }

      if (matchesExactly) {
        matches.push(start);
        record(
          OperationType.OVERWRITE,
          start,
          start,
          0,
          `Exact match confirmed at index ${start}.`
        );
      }
    }

    if (start < text.length - pattern.length) {
      const outgoing = text.charCodeAt(start);
      const incoming = text.charCodeAt(start + pattern.length);
      let power = 1;
      for (let offset = 1; offset < pattern.length; offset++) {
        power = (power * base) % mod;
      }
      windowHash = (base * (windowHash - outgoing * power) + incoming) % mod;
      if (windowHash < 0) {
        windowHash += mod;
      }
      record(
        OperationType.VISIT,
        start + 1,
        start + 1,
        0,
        `Rolled the hash forward by removing ${text[start]} and adding ${text[start + pattern.length]}.`
      );
    }
  }

  record(
    OperationType.DONE,
    text.length - pattern.length,
    text.length - pattern.length,
    0,
    `Rabin-Karp complete. Matches found at indices: ${matches.join(', ') || 'none'}.`
  );

  return {
    states,
    timeComplexity: 'O(N + M) average, O(NM) worst',
    spaceComplexity: 'O(1)',
  };
};
