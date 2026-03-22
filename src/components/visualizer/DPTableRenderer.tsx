import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import clsx from 'clsx';

interface DPTableData { table: number[]; n: number; label: string; }

export const DPTableRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data || !(state.data as DPTableData).table) return null;

  const { table, n } = state.data as DPTableData;
  const { activeIndices, operationType } = state;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-1">Fibonacci DP Table</h3>
        <p className="text-sm text-text-secondary">Bottom-up computation: F(n) = F(n-1) + F(n-2)</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-full">
        <AnimatePresence>
          {table.slice(0, n + 1).map((val, index) => {
            const isActive = activeIndices.includes(index);
            const isFilled = val !== 0 || index === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={clsx(
                  "flex flex-col items-center gap-1 p-1",
                )}
              >
                {/* Index label */}
                <span className="text-[10px] font-mono text-text-secondary/60">F({index})</span>
                
                {/* Cell */}
                <div className={clsx(
                  "w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center font-mono font-bold text-lg border-2 transition-all duration-300",
                  isActive && operationType === OperationType.COMPARE
                    ? "bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                    : isActive && operationType === OperationType.OVERWRITE
                    ? "bg-brand/20 border-brand-light text-brand-light shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-110"
                    : isFilled
                    ? "bg-surface/60 border-surface text-white"
                    : "bg-surface/20 border-surface/50 text-text-secondary/40"
                )}>
                  {isFilled ? val : '—'}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
});
DPTableRenderer.displayName = 'DPTableRenderer';
