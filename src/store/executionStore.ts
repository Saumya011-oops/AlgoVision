import { create } from 'zustand';
import { AlgorithmState, AlgorithmMetadata } from '../types/AlgorithmState';

interface ExecutionState<T> {
  states: AlgorithmState<T>[];
  currentIndex: number;
  isPlaying: boolean;
  playbackSpeedMs: number;
  
  // Computed helpers for UI
  isFinished: boolean;
  progressPercent: number;

  // Actions
  setStates: (newStates: AlgorithmState<T>[]) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToStep: (index: number) => void;
  setSpeed: (ms: number) => void;
  
  // Current view getters
  getCurrentState: () => AlgorithmState<T> | null;
  getMetadata: () => AlgorithmMetadata | null;
}

export const useExecutionStore = create<ExecutionState<unknown>>((set, get) => ({
  states: [],
  currentIndex: 0,
  isPlaying: false,
  playbackSpeedMs: 500, // default half second

  get isFinished() {
    const { states, currentIndex } = get();
    return states.length > 0 && currentIndex >= states.length - 1;
  },

  get progressPercent() {
    const { states, currentIndex } = get();
    if (states.length === 0) return 0;
    return (currentIndex / (states.length - 1)) * 100;
  },

  setStates: (newStates) => set({ states: newStates, currentIndex: 0, isPlaying: false }),
  
  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  reset: () => set({ states: [], currentIndex: 0, isPlaying: false }),
  
  stepForward: () => set((state) => {
    if (state.currentIndex < state.states.length - 1) {
      return { currentIndex: state.currentIndex + 1 };
    }
    return { isPlaying: false }; // Autopause at end
  }),
  
  stepBackward: () => set((state) => ({
    currentIndex: Math.max(0, state.currentIndex - 1)
  })),
  
  jumpToStep: (index) => set((state) => ({
    currentIndex: Math.max(0, Math.min(index, state.states.length - 1))
  })),
  
  setSpeed: (ms) => set({ playbackSpeedMs: Math.max(10, ms) }), // Prevent 0ms locking
  
  getCurrentState: () => {
    const { states, currentIndex } = get();
    return states.length > 0 ? states[currentIndex] : null;
  },

  getMetadata: () => {
    const state = get().getCurrentState();
    return state ? state.metadata : null;
  }
}));
