import { AlgorithmResult } from '../types/AlgorithmState';

export type WorkerMessageRequest = {
  algorithmId: string;
  payload: any;
};

export type WorkerMessageResponse = {
  success: boolean;
  result?: AlgorithmResult<any>;
  error?: string;
};

// In Vite, a worker needs to be imported with ?worker
self.addEventListener('message', async (e: MessageEvent<WorkerMessageRequest>) => {
  const { algorithmId, payload } = e.data;
  
  try {
    // In a real implementation, we would route to the correct algorithm generator here.
    // For now, this is a placeholder standard response structure.
    
    // Simulate some work
    // const states = runAlgorithm(payload);
    
    // Send back success
    self.postMessage({
      success: true,
      result: {
        states: [],
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        executionTimeMs: 0
      }
    } as WorkerMessageResponse);
  } catch (err: any) {
    self.postMessage({
      success: false,
      error: err.message || 'Worker computation threw an unknown error'
    } as WorkerMessageResponse);
  }
});
export {};
