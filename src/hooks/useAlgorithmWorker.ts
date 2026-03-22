import { useState, useCallback, useRef, useEffect } from 'react';
import { AlgorithmResult } from '../types/AlgorithmState';
import { useToastStore } from '../store/toastStore';
import { WorkerMessageRequest, WorkerMessageResponse } from '../workers/algorithm.worker';

export const useAlgorithmWorker = <T>() => {
  const [isComputing, setIsComputing] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // In Vite, new Worker(new URL('...', import.meta.url), { type: 'module' }) is used, 
    // but a ?worker import is cleaner. For absolute dynamic resolving, we can instantiate it directly.
    workerRef.current = new Worker(new URL('../workers/algorithm.worker.ts', import.meta.url), { type: 'module' });
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runAlgorithmAsync = useCallback(
    (algorithmId: string, payload: any): Promise<AlgorithmResult<T>> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          useToastStore.getState().addToast('error', 'Web Worker not initialized.');
          return reject('Web Worker not initialized.');
        }

        setIsComputing(true);
        const timeoutId = setTimeout(() => {
          setIsComputing(false);
          workerRef.current?.terminate(); // Kill runaway thread
          // Restart worker
          workerRef.current = new Worker(new URL('../workers/algorithm.worker.ts', import.meta.url), { type: 'module' });
          useToastStore.getState().addToast('error', 'Algorithm calculation timed out.');
          reject('Timeout');
        }, 10000); // 10s max lock

        workerRef.current.onmessage = (e: MessageEvent<WorkerMessageResponse>) => {
          clearTimeout(timeoutId);
          setIsComputing(false);
          if (e.data.success && e.data.result) {
            resolve(e.data.result);
          } else {
            useToastStore.getState().addToast('error', e.data.error || 'Computation failed.');
            reject(e.data.error);
          }
        };

        workerRef.current.postMessage({ algorithmId, payload } as WorkerMessageRequest);
      });
    },
    []
  );

  return { runAlgorithmAsync, isComputing };
};
