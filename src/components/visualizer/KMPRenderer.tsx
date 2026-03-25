import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';

interface StringSearchData {
  text: string;
  pattern: string;
  textIndex: number;
  patternIndex: number;
  lps?: number[];
  matches: number[];
  windowStart?: number;
  windowEnd?: number;
  patternHash?: number;
  windowHash?: number;
}

export const KMPRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data || !(state.data as StringSearchData).text) {
    return null;
  }

  const { text, pattern, textIndex, patternIndex, lps, matches, windowStart, windowEnd, patternHash, windowHash } =
    state.data as StringSearchData;
  const { operationType } = state;
  const patternOffset =
    typeof windowStart === 'number' ? windowStart : Math.max(0, textIndex - Math.max(patternIndex, 0));

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 overflow-auto p-6">
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">Text</h4>
        <div className="flex flex-wrap gap-[2px]">
          {text.split('').map((character, index) => {
            const isActive = index === textIndex;
            const isInWindow =
              typeof windowStart === 'number' &&
              typeof windowEnd === 'number' &&
              index >= windowStart &&
              index <= windowEnd;
            const isMatchRange = matches.some(
              (matchIndex) => index >= matchIndex && index < matchIndex + pattern.length
            );

            return (
              <motion.div
                key={`text-${index}`}
                animate={{ scale: isActive ? 1.15 : 1 }}
                className={clsx(
                  'flex h-10 w-8 items-center justify-center rounded-md border font-mono text-sm font-bold transition-all',
                  isActive && operationType === OperationType.COMPARE
                    ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                    : isMatchRange
                    ? 'border-green-400 bg-green-500/20 text-green-300'
                    : isInWindow
                    ? 'border-cyan-400/70 bg-cyan-500/10 text-cyan-500'
                    : 'border-surface bg-surface/40 text-text-primary/80'
                )}
              >
                {character}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-1 flex flex-wrap gap-[2px]">
          {text.split('').map((_, index) => (
            <div key={`text-index-${index}`} className="w-8 text-center text-[9px] font-mono text-text-secondary/50">
              {index}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Pattern (offset: {patternOffset})
        </h4>
        <div className="flex flex-wrap gap-[2px]">
          {Array.from({ length: Math.min(patternOffset, text.length) }).map((_, index) => (
            <div key={`spacer-${index}`} className="h-10 w-8" />
          ))}
          {pattern.split('').map((character, index) => {
            const isActive = index === patternIndex;
            return (
              <motion.div
                key={`pattern-${index}`}
                animate={{ scale: isActive ? 1.15 : 1 }}
                className={clsx(
                  'flex h-10 w-8 items-center justify-center rounded-md border font-mono text-sm font-bold transition-all',
                  isActive && operationType === OperationType.COMPARE
                    ? 'border-brand-light bg-brand/30 text-brand-light shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                    : 'border-surface/60 bg-surface/30 text-text-secondary'
                )}
              >
                {character}
              </motion.div>
            );
          })}
        </div>
      </div>

      {Array.isArray(lps) ? (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">LPS Table</h4>
          <div className="flex flex-wrap gap-[2px]">
            {lps.map((value, index) => (
              <div key={`lps-${index}`} className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded border border-surface bg-surface/40 text-xs font-mono text-text-secondary">
                  {value}
                </div>
                <span className="mt-0.5 text-[9px] font-mono text-text-secondary/50">{pattern[index]}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {typeof patternHash === 'number' && typeof windowHash === 'number' ? (
        <div className="rounded-xl border border-surface bg-panel/40 px-4 py-3 text-sm">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Rolling Hash
          </div>
          <div className="font-mono text-cyan-200">pattern = {patternHash}</div>
          <div className="font-mono text-cyan-100">window = {windowHash}</div>
        </div>
      ) : null}

      {matches.length > 0 ? (
        <div className="text-center text-sm font-semibold text-green-400">
          Matches found at: [{matches.join(', ')}]
        </div>
      ) : null}
    </div>
  );
});

KMPRenderer.displayName = 'KMPRenderer';
