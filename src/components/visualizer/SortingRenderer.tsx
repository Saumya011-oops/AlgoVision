import React from 'react';
import { motion } from 'framer-motion';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import clsx from 'clsx';

/*
 * Generic sorting renderer for Bubble Sort, Selection Sort, Heap Sort.
 * Shows array as large cards with:
 *  - Compared elements highlighted yellow
 *  - Swapped elements highlighted orange
 *  - Sorted boundary elements highlighted green
 *  - Active elements with pointer indicators
 */

interface SortData {
  array: number[];
  sortedBoundary?: number;
  currentMin?: number | null;
  heapSize?: number;
}

export const SortingRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data) return null;

  const { array, sortedBoundary } = state.data as SortData;
  const { activeIndices, operationType } = state;
  const msg = state.metadata?.message || '';

  if (!array || !Array.isArray(array)) return null;

  const opConfig: Record<string, { emoji: string; label: string; color: string }> = {
    [OperationType.VISIT]:     { emoji: '👁', label: 'SCANNING',  color: 'text-blue-400' },
    [OperationType.COMPARE]:   { emoji: '⚖️', label: 'COMPARING', color: 'text-yellow-400' },
    [OperationType.SWAP]:      { emoji: '🔄', label: 'SWAPPING',  color: 'text-orange-400' },
    [OperationType.OVERWRITE]: { emoji: '✅', label: 'PLACED',    color: 'text-emerald-400' },
    [OperationType.DONE]:      { emoji: '🎉', label: 'COMPLETE',  color: 'text-emerald-400' },
  };
  const op = opConfig[operationType] || opConfig[OperationType.VISIT];

  const getCardStyle = (idx: number) => {
    const isActive = activeIndices.includes(idx);
    const sortsFromLeft = 'currentMin' in (state.data as SortData);
    const isHeap = typeof (state.data as SortData).heapSize === 'number';
    const heapSize = (state.data as SortData).heapSize;
    const isSortedLeft = typeof sortedBoundary === 'number' && sortsFromLeft && idx < sortedBoundary;
    const isSortedRight =
      (typeof sortedBoundary === 'number' && !sortsFromLeft && idx >= sortedBoundary) ||
      (typeof heapSize === 'number' && isHeap && idx >= heapSize);

    if (isActive && operationType === OperationType.SWAP) {
      return 'bg-orange-500/25 border-orange-400 shadow-[0_0_14px_rgba(249,115,22,0.4)] scale-105';
    }
    if (isActive && operationType === OperationType.COMPARE) {
      return 'bg-yellow-500/20 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.35)]';
    }
    if (isActive) {
      return 'bg-blue-500/20 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
    }
    if (isSortedLeft || isSortedRight) {
      return 'bg-emerald-500/15 border-emerald-400/60';
    }
    return 'bg-surface/60 border-surface-border/40';
  };

  const getTextColor = (idx: number) => {
    const isActive = activeIndices.includes(idx);
    const sortsFromLeft = 'currentMin' in (state.data as SortData);
    const heapSize = (state.data as SortData).heapSize;
    const isSortedLeft = typeof sortedBoundary === 'number' && sortsFromLeft && idx < sortedBoundary;
    const isSortedRight =
      (typeof sortedBoundary === 'number' && !sortsFromLeft && idx >= sortedBoundary) ||
      (typeof heapSize === 'number' && idx >= heapSize);

    if (isActive && operationType === OperationType.SWAP) return 'text-orange-200';
    if (isActive && operationType === OperationType.COMPARE) return 'text-yellow-200';
    if (isActive) return 'text-blue-200';
    if (isSortedLeft || isSortedRight) return 'text-emerald-300';
    return 'text-text-primary';
  };

  const getIndicator = (idx: number) => {
    if (!activeIndices.includes(idx)) return null;
    if (operationType === OperationType.SWAP) return '⇄';
    if (operationType === OperationType.COMPARE) return '?';
    return '▼';
  };

  // Scale cell sizes based on array length
  const cellClass = array.length <= 8
    ? 'w-12 h-12 text-lg'
    : array.length <= 12
      ? 'w-10 h-10 text-base'
      : 'w-8 h-8 text-sm';

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-2xl">
      {/* Status bar */}
      <div className="px-4 py-2.5 flex items-center gap-3 border-b border-surface/50 bg-background/50 shrink-0">
        <span className="text-lg">{op.emoji}</span>
        <span className={clsx("font-bold text-xs uppercase tracking-wider", op.color)}>{op.label}</span>
        <span className="text-text-secondary text-xs flex-1 truncate">{msg}</span>
      </div>

      {/* Array visualization */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="flex items-end gap-1.5 flex-wrap justify-center">
          {array.map((val, idx) => (
            <motion.div
              key={idx}
              layout
              className="flex flex-col items-center gap-1"
            >
              {/* Indicator */}
              <div className="h-5 flex items-center justify-center">
                {getIndicator(idx) && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx("text-xs font-bold",
                      operationType === OperationType.SWAP ? 'text-orange-400' :
                      operationType === OperationType.COMPARE ? 'text-yellow-400' : 'text-blue-400'
                    )}
                  >
                    {getIndicator(idx)}
                  </motion.span>
                )}
              </div>

              {/* Card */}
              <div className={clsx(
                cellClass,
                "flex items-center justify-center rounded-lg border-2 font-mono font-black transition-all duration-150",
                getCardStyle(idx),
              )}>
                <span className={getTextColor(idx)}>{val}</span>
              </div>

              {/* Index */}
              <span className="text-[9px] font-mono text-text-secondary">{idx}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-surface/50 flex items-center justify-center gap-5 text-[10px] font-medium text-text-secondary shrink-0 bg-background/30">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-500/40 border border-yellow-500"></span> Comparing</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-500/40 border border-orange-500"></span> Swapping</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500"></span> Sorted</span>
      </div>
    </div>
  );
});
SortingRenderer.displayName = 'SortingRenderer';
