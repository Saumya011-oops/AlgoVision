export enum OperationType {
  COMPARE = 'COMPARE',
  SWAP = 'SWAP',
  VISIT = 'VISIT',
  OVERWRITE = 'OVERWRITE',
  DONE = 'DONE',
}

export interface AlgorithmMetadata {
  stepNumber: number;
  recursionDepth?: number;
  variables?: Record<string, string | number | null>;
  message?: string; // Optional context like "Swapping 5 and 2"
}

export interface AlgorithmState<T> {
  data: T; // e.g. number[] for sorting, GraphState for graphs
  activeIndices: number[]; // Elements interacting
  secondaryIndices?: number[]; // e.g., the sorted portion in selection sort
  operationType: OperationType;
  highlightedLine?: number; // Line number in the code block
  metadata: AlgorithmMetadata;
}

// Wrapper for the result of an algorithm's entire execution
export interface AlgorithmResult<T> {
  states: AlgorithmState<T>[];
  timeComplexity: string;
  spaceComplexity: string;
  executionTimeMs?: number; // Real-world time taken to generate
}
