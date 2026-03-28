import { createContext, useContext } from 'react';
import { AlgorithmState } from '../types/AlgorithmState';

interface VisualizationStateContextType {
  getCurrentState: () => AlgorithmState<unknown> | null;
}

export const VisualizationStateContext = createContext<VisualizationStateContextType | null>(null);

// Hook used by ALL renderers - checks context first, falls back to execution store
export const useVisualizationState = () => useContext(VisualizationStateContext);
