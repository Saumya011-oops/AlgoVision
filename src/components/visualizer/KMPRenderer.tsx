import React from 'react';
import { motion } from 'framer-motion';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import clsx from 'clsx';

interface KMPData { text: string; pattern: string; textIndex: number; patternIndex: number; lps: number[]; matches: number[]; }

export const KMPRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data || !(state.data as KMPData).text) return null;

  const { text, pattern, textIndex, patternIndex, lps, matches } = state.data as KMPData;
  const { operationType } = state;

  // Calculate alignment offset so pattern aligns correctly
  const patternOffset = Math.max(0, textIndex - patternIndex);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-8 overflow-auto">
      {/* Text Row */}
      <div>
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Text</h4>
        <div className="flex gap-[2px] flex-wrap">
          {text.split('').map((ch, i) => {
            const isMatch = matches.includes(i);
            const isActive = i === textIndex;
            const isInMatchRange = matches.some(m => i >= m && i < m + pattern.length);

            return (
              <motion.div
                key={`t-${i}`}
                animate={{ scale: isActive ? 1.15 : 1 }}
                className={clsx(
                  "w-8 h-10 flex items-center justify-center rounded-md font-mono font-bold text-sm border transition-all",
                  isActive && operationType === OperationType.COMPARE
                    ? "bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.4)]"
                    : isInMatchRange
                    ? "bg-green-500/20 border-green-400 text-green-300"
                    : "bg-surface/40 border-surface text-white/80"
                )}
              >
                {ch}
              </motion.div>
            );
          })}
        </div>
        <div className="flex gap-[2px] mt-1 flex-wrap">
          {text.split('').map((_, i) => (
            <div key={`ti-${i}`} className="w-8 text-center text-[9px] font-mono text-text-secondary/50">{i}</div>
          ))}
        </div>
      </div>

      {/* Pattern Row (aligned) */}
      <div>
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Pattern (offset: {patternOffset})</h4>
        <div className="flex gap-[2px] flex-wrap">
          {/* Spacer */}
          {Array.from({ length: Math.min(patternOffset, text.length) }).map((_, i) => (
            <div key={`spacer-${i}`} className="w-8 h-10" />
          ))}
          {pattern.split('').map((ch, i) => {
            const isActive = i === patternIndex;
            return (
              <motion.div
                key={`p-${i}`}
                animate={{ scale: isActive ? 1.15 : 1 }}
                className={clsx(
                  "w-8 h-10 flex items-center justify-center rounded-md font-mono font-bold text-sm border transition-all",
                  isActive && operationType === OperationType.COMPARE
                    ? "bg-brand/30 border-brand-light text-brand-light shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                    : "bg-surface/30 border-surface/60 text-white/60"
                )}
              >
                {ch}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* LPS Table */}
      <div>
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">LPS Table</h4>
        <div className="flex gap-[2px] flex-wrap">
          {lps.map((val, i) => (
            <div key={`lps-${i}`} className="flex flex-col items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded bg-surface/40 border border-surface text-xs font-mono text-white/70">{val}</div>
              <span className="text-[9px] font-mono text-text-secondary/50 mt-0.5">{pattern[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {matches.length > 0 && (
        <div className="text-center text-green-400 font-semibold text-sm">
          Matches found at: [{matches.join(', ')}]
        </div>
      )}
    </div>
  );
});
KMPRenderer.displayName = 'KMPRenderer';
