import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import clsx from 'clsx';

/*
 * Completely rebuilt educational sorting renderer.
 * Uses large card-style boxes instead of bars so values are always readable.
 * Shows pointer arrows, pivot markers, and clear operation labels.
 */

const OP_CONFIG: Record<string, { emoji: string; label: string; bg: string; border: string; text: string }> = {
  [OperationType.COMPARE]: { emoji: '🔍', label: 'Comparing', bg: 'bg-yellow-500/15', border: 'border-yellow-500/40', text: 'text-yellow-400' },
  [OperationType.SWAP]:    { emoji: '🔄', label: 'Swapping',  bg: 'bg-pink-500/15',   border: 'border-pink-500/40',   text: 'text-pink-400' },
  [OperationType.OVERWRITE]:{ emoji: '📍', label: 'Placing',  bg: 'bg-orange-500/15', border: 'border-orange-500/40', text: 'text-orange-400' },
  [OperationType.VISIT]:   { emoji: '👁', label: 'Scanning',  bg: 'bg-blue-500/15',   border: 'border-blue-500/40',   text: 'text-blue-400' },
  [OperationType.DONE]:    { emoji: '✅', label: 'Sorted!',   bg: 'bg-emerald-500/15',border: 'border-emerald-500/40',text: 'text-emerald-400' },
};

export const ArrayRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !Array.isArray(state.data)) {
    return null;
  }

  const { data, activeIndices, secondaryIndices, operationType } = state;
  const msg = state.metadata?.message || '';
  const op = OP_CONFIG[operationType] || OP_CONFIG[OperationType.VISIT];

  return (
    <div className="w-full h-full flex flex-col rounded-2xl relative overflow-hidden">
      
      {/* Top: Operation status bar */}
      <div className={clsx("px-5 py-3 flex items-center gap-3 border-b shrink-0", op.bg, op.border)}>
        <span className="text-xl">{op.emoji}</span>
        <span className={clsx("font-bold text-sm uppercase tracking-wider", op.text)}>{op.label}</span>
        <span className="text-white/70 text-sm flex-1 truncate">{msg}</span>
      </div>

      {/* Middle: The array cards */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 overflow-x-auto">
        <div className="flex items-end gap-2 sm:gap-3">
          <AnimatePresence mode="popLayout">
            {data.map((val: number, index: number) => {
              const isActive = activeIndices.includes(index);
              const isSorted = secondaryIndices?.includes(index);
              const isDone = operationType === OperationType.DONE;

              // Determine card style
              let cardStyle = 'bg-slate-800/80 border-slate-600/50 text-white';
              let shadow = '';
              let label = '';
              let scale = 1;

              if (isDone || isSorted) {
                cardStyle = 'bg-emerald-900/60 border-emerald-500/60 text-emerald-300';
                shadow = 'shadow-[0_0_12px_rgba(16,185,129,0.3)]';
                label = '✓';
              } else if (isActive) {
                scale = 1.1;
                if (operationType === OperationType.COMPARE) {
                  cardStyle = 'bg-yellow-900/50 border-yellow-400 text-yellow-200';
                  shadow = 'shadow-[0_0_20px_rgba(250,204,21,0.4)]';
                  label = '?';
                } else if (operationType === OperationType.SWAP) {
                  cardStyle = 'bg-pink-900/50 border-pink-400 text-pink-200';
                  shadow = 'shadow-[0_0_20px_rgba(236,72,153,0.5)]';
                  label = '⇄';
                } else if (operationType === OperationType.OVERWRITE) {
                  cardStyle = 'bg-orange-900/50 border-orange-400 text-orange-200';
                  shadow = 'shadow-[0_0_20px_rgba(249,115,22,0.5)]';
                  label = '★';
                } else if (operationType === OperationType.VISIT) {
                  cardStyle = 'bg-blue-900/50 border-blue-400 text-blue-200';
                  shadow = 'shadow-[0_0_20px_rgba(59,130,246,0.4)]';
                  label = '→';
                }
              }

              // Height proportional to value for visual context
              const maxVal = Math.max(...data, 1);
              const heightPx = 60 + Math.round((val / maxVal) * 120);

              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0, scale }}
                  transition={{
                    layout: { type: 'spring', stiffness: 400, damping: 30 },
                    scale: { type: 'spring', stiffness: 500, damping: 25 },
                  }}
                  className="flex flex-col items-center gap-1"
                >
                  {/* Label above card */}
                  {isActive && label && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={clsx("text-lg font-bold", isActive && operationType === OperationType.OVERWRITE ? 'text-orange-400' : 'text-white/80')}
                    >
                      {label}
                    </motion.div>
                  )}
                  {!isActive && <div className="h-7" />}

                  {/* The card itself */}
                  <motion.div
                    className={clsx(
                      "relative flex flex-col items-center justify-center rounded-xl border-2 transition-colors",
                      "w-12 sm:w-14 md:w-16",
                      cardStyle, shadow,
                      isActive && "z-10"
                    )}
                    style={{ height: heightPx }}
                  >
                    {/* Inner glare */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    {/* VALUE - large and prominent */}
                    <span className="relative z-10 font-black font-mono text-xl sm:text-2xl md:text-3xl drop-shadow-lg">
                      {val}
                    </span>
                  </motion.div>

                  {/* Index below */}
                  <span className="text-[10px] sm:text-xs font-mono text-slate-500 mt-1">
                    [{index}]
                  </span>

                  {/* Pointer triangle for active elements */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-yellow-400 mt-0.5"
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom: Color legend */}
      <div className="px-5 py-2.5 border-t border-slate-700/50 flex items-center justify-center gap-6 text-[11px] font-medium text-slate-400 shrink-0 bg-slate-900/30">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-500/50 border border-yellow-500"></span> Compare</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-pink-500/50 border border-pink-500"></span> Swap</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-500/50 border border-orange-500"></span> Placed</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/50 border border-emerald-500"></span> Sorted</span>
      </div>
    </div>
  );
});
ArrayRenderer.displayName = 'ArrayRenderer';
