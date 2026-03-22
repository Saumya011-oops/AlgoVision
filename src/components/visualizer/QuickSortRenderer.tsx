import React from 'react';
import { motion } from 'framer-motion';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import clsx from 'clsx';

/*
 * Partition-tree Quick Sort renderer.
 * Shows the array being progressively partitioned:
 * - Each row = one recursion level
 * - Subarrays shrink as pivots (gold) are placed in final positions
 * - Active subarrays glow while being partitioned
 */

interface QSSegment {
  values: number[];
  startIdx: number;
  type: 'subarray' | 'pivot';
  status: 'default' | 'active' | 'partitioning' | 'placed' | 'sorted';
}

interface QSRow { segments: QSSegment[]; }
interface QuickSortTreeData {
  rows: QSRow[];
  currentRowIdx: number;
  originalArray: number[];
}

export const QuickSortRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data || !(state.data as QuickSortTreeData).rows) return null;

  const { rows, currentRowIdx } = state.data as QuickSortTreeData;
  const { operationType } = state;
  const msg = state.metadata?.message || '';

  const opConfig: Record<string, { emoji: string; label: string; color: string }> = {
    [OperationType.VISIT]:     { emoji: '👁', label: 'SCANNING',     color: 'text-blue-400' },
    [OperationType.COMPARE]:   { emoji: '🎯', label: 'PARTITIONING', color: 'text-yellow-400' },
    [OperationType.SWAP]:      { emoji: '🔄', label: 'PIVOT PLACED', color: 'text-orange-400' },
    [OperationType.OVERWRITE]: { emoji: '📊', label: 'LEVEL DONE',   color: 'text-emerald-400' },
    [OperationType.DONE]:      { emoji: '🎉', label: 'COMPLETE',     color: 'text-emerald-400' },
  };
  const op = opConfig[operationType] || opConfig[OperationType.VISIT];

  const getSegmentStyle = (seg: QSSegment) => {
    if (seg.type === 'pivot') {
      if (seg.status === 'sorted') {
        return 'bg-emerald-900/40 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
      }
      return 'bg-amber-900/40 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
    }
    switch (seg.status) {
      case 'active':        return 'bg-yellow-500/15 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)]';
      case 'partitioning':  return 'bg-orange-500/15 border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]';
      case 'sorted':        return 'bg-emerald-500/12 border-emerald-400/50';
      default:              return 'bg-slate-800/60 border-slate-600/40';
    }
  };

  const getTextColor = (seg: QSSegment) => {
    if (seg.type === 'pivot') return seg.status === 'sorted' ? 'text-emerald-300' : 'text-amber-200';
    switch (seg.status) {
      case 'active':        return 'text-yellow-200';
      case 'partitioning':  return 'text-orange-200';
      case 'sorted':        return 'text-emerald-300';
      default:              return 'text-white';
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-2xl">
      {/* Status bar */}
      <div className="px-4 py-2.5 flex items-center gap-3 border-b border-slate-700/50 bg-slate-900/50 shrink-0">
        <span className="text-lg">{op.emoji}</span>
        <span className={clsx("font-bold text-xs uppercase tracking-wider", op.color)}>{op.label}</span>
        <span className="text-white/70 text-xs flex-1 truncate">{msg}</span>
      </div>

      {/* Partition tree */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 px-2 py-3 overflow-auto">
        {rows.map((row, rowIdx) => {
          if (row.segments.length === 0) return null;

          return (
            <React.Fragment key={'row-' + rowIdx}>
              {/* Connecting arrows */}
              {rowIdx > 0 && (
                <div className="flex items-center justify-center text-slate-600/60 shrink-0" style={{ height: 14 }}>
                  <svg width="24" height="14" viewBox="0 0 24 14">
                    <path d="M12 0 L12 10 L8 7 M12 10 L16 7" stroke="currentColor" fill="none" strokeWidth="1.2"/>
                  </svg>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIdx * 0.05 }}
                className="flex items-center justify-center gap-3 shrink-0"
              >
                {/* Row label */}
                <span className="text-[9px] font-mono text-slate-600 w-12 text-right shrink-0">
                  {rowIdx === 0 ? 'start' : 'L' + rowIdx}
                </span>

                {row.segments.map((seg, segIdx) => (
                  <React.Fragment key={'seg-' + rowIdx + '-' + segIdx}>
                    {/* Separator between segments */}
                    {segIdx > 0 && (
                      <div className="w-px h-8 bg-slate-700/30 shrink-0" />
                    )}

                    <div className="flex flex-col items-center">
                      <div className={clsx(
                        "flex rounded-lg border-2 overflow-hidden transition-all duration-200",
                        getSegmentStyle(seg),
                        (seg.status === 'active' || seg.status === 'partitioning') && 'scale-[1.03]'
                      )}>
                        {seg.values.map((val, i) => (
                          <div
                            key={i}
                            className={clsx(
                              "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-mono font-black text-base sm:text-lg",
                              getTextColor(seg),
                              i > 0 && 'border-l border-inherit/30',
                            )}
                          >
                            {val}
                          </div>
                        ))}
                      </div>

                      {/* Label under segment */}
                      <div className="h-4 flex items-center">
                        {seg.type === 'pivot' && seg.status !== 'sorted' && (
                          <span className="text-[9px] font-bold text-amber-400">★ PIVOT</span>
                        )}
                        {seg.status === 'active' && seg.type === 'subarray' && (
                          <span className="text-[9px] font-bold text-yellow-400">▼ ACTIVE</span>
                        )}
                        {seg.status === 'sorted' && (
                          <span className="text-[9px] font-bold text-emerald-400">✓</span>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-slate-700/50 flex items-center justify-center gap-5 text-[10px] font-medium text-slate-400 shrink-0 bg-slate-900/30">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-500/40 border border-yellow-500"></span> Active</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-500"></span> Pivot</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-500/40 border border-orange-500"></span> Partitioning</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500"></span> Sorted</span>
      </div>
    </div>
  );
});
QuickSortRenderer.displayName = 'QuickSortRenderer';
