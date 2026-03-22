import { create } from 'zustand';
import { AlgorithmState } from '../types/AlgorithmState';
import { countOperationMetrics, OperationMetrics } from '../utils/metrics';

interface ComparisonStore {
  isComparisonMode: boolean;
  toggleComparisonMode: () => void;
  setComparisonMode: (value: boolean) => void;

  leftAlgoId: string;
  rightAlgoId: string;
  setLeftAlgo: (id: string) => void;
  setRightAlgo: (id: string) => void;

  leftStates: AlgorithmState<unknown>[];
  rightStates: AlgorithmState<unknown>[];
  setLeftStates: (states: AlgorithmState<unknown>[]) => void;
  setRightStates: (states: AlgorithmState<unknown>[]) => void;

  leftIndex: number;
  rightIndex: number;

  isPlaying: boolean;
  playbackSpeedMs: number;

  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToStep: (index: number) => void;
  resetPlayback: () => void;
  setSpeed: (ms: number) => void;

  leftMetrics: OperationMetrics;
  rightMetrics: OperationMetrics;
}

const getInitialMetrics = (states: AlgorithmState<unknown>[]) =>
  states.length > 0 ? countOperationMetrics(states, 0) : countOperationMetrics([], -1);

export const useComparisonStore = create<ComparisonStore>((set, get) => ({
  isComparisonMode: false,
  toggleComparisonMode: () =>
    set((state) => ({
      isComparisonMode: !state.isComparisonMode,
      isPlaying: false,
    })),
  setComparisonMode: (value) =>
    set({
      isComparisonMode: value,
      isPlaying: false,
    }),

  leftAlgoId: 'bubble-sort',
  rightAlgoId: 'selection-sort',
  setLeftAlgo: (id) =>
    set({
      leftAlgoId: id,
      leftStates: [],
      leftIndex: 0,
      leftMetrics: countOperationMetrics([], -1),
      isPlaying: false,
    }),
  setRightAlgo: (id) =>
    set({
      rightAlgoId: id,
      rightStates: [],
      rightIndex: 0,
      rightMetrics: countOperationMetrics([], -1),
      isPlaying: false,
    }),

  leftStates: [],
  rightStates: [],
  setLeftStates: (states) =>
    set({
      leftStates: states,
      leftIndex: 0,
      leftMetrics: getInitialMetrics(states),
      isPlaying: false,
    }),
  setRightStates: (states) =>
    set({
      rightStates: states,
      rightIndex: 0,
      rightMetrics: getInitialMetrics(states),
      isPlaying: false,
    }),

  leftIndex: 0,
  rightIndex: 0,

  isPlaying: false,
  playbackSpeedMs: 300,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  stepForward: () => {
    const { leftStates, rightStates, leftIndex, rightIndex } = get();
    const nextLeft = leftStates.length > 0 ? Math.min(leftIndex + 1, leftStates.length - 1) : 0;
    const nextRight = rightStates.length > 0 ? Math.min(rightIndex + 1, rightStates.length - 1) : 0;

    set({
      leftIndex: nextLeft,
      rightIndex: nextRight,
      leftMetrics: countOperationMetrics(leftStates, leftStates.length > 0 ? nextLeft : -1),
      rightMetrics: countOperationMetrics(rightStates, rightStates.length > 0 ? nextRight : -1),
    });
  },

  stepBackward: () => {
    const { leftStates, rightStates, leftIndex, rightIndex } = get();
    const nextLeft = Math.max(leftIndex - 1, 0);
    const nextRight = Math.max(rightIndex - 1, 0);

    set({
      leftIndex: nextLeft,
      rightIndex: nextRight,
      leftMetrics: countOperationMetrics(leftStates, leftStates.length > 0 ? nextLeft : -1),
      rightMetrics: countOperationMetrics(rightStates, rightStates.length > 0 ? nextRight : -1),
    });
  },

  jumpToStep: (index) => {
    const { leftStates, rightStates } = get();
    const nextLeft = leftStates.length > 0 ? Math.min(index, leftStates.length - 1) : 0;
    const nextRight = rightStates.length > 0 ? Math.min(index, rightStates.length - 1) : 0;

    set({
      leftIndex: nextLeft,
      rightIndex: nextRight,
      leftMetrics: countOperationMetrics(leftStates, leftStates.length > 0 ? nextLeft : -1),
      rightMetrics: countOperationMetrics(rightStates, rightStates.length > 0 ? nextRight : -1),
    });
  },

  resetPlayback: () => {
    const { leftStates, rightStates } = get();
    set({
      leftIndex: 0,
      rightIndex: 0,
      isPlaying: false,
      leftMetrics: getInitialMetrics(leftStates),
      rightMetrics: getInitialMetrics(rightStates),
    });
  },

  setSpeed: (ms) => set({ playbackSpeedMs: Math.max(10, ms) }),

  leftMetrics: countOperationMetrics([], -1),
  rightMetrics: countOperationMetrics([], -1),
}));
