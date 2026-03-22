import { AlgorithmResult } from '../types/AlgorithmState';
import { DataPattern, runAlgorithm } from '../utils/algorithmRunner';

export type WorkerMessageRequest = {
  algorithmId: string;
  payload: {
    size?: number;
    pattern?: DataPattern;
  };
};

export type WorkerMessageResponse = {
  success: boolean;
  result?: AlgorithmResult<unknown>;
  error?: string;
};

self.addEventListener('message', (event: MessageEvent<WorkerMessageRequest>) => {
  const { algorithmId, payload } = event.data;

  try {
    const result = runAlgorithm(algorithmId, {
      size: payload.size ?? 8,
      pattern: payload.pattern ?? 'random',
    });

    self.postMessage({
      success: true,
      result,
    } as WorkerMessageResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Worker computation failed';
    self.postMessage({
      success: false,
      error: message,
    } as WorkerMessageResponse);
  }
});

export {};
