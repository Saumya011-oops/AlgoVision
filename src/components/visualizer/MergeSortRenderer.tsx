import React from 'react';
import { motion } from 'framer-motion';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import clsx from 'clsx';

/*
 * Tree-based Merge Sort renderer.
 * Shows ALL levels of the divide-and-conquer tree simultaneously,
 * scaling cell sizes to fit the entire tree on one page.
 */

interface TreeNode {
  id: string;
  values: number[];
  level: number;
  leftIdx: number;
  rightIdx: number;
  parentId: string | null;
  status: 'hidden' | 'visible' | 'active' | 'merging' | 'sorted';
}

interface MergeSortTreeData {
  nodes: TreeNode[];
  maxLevel: number;
}

export const MergeSortRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data || !(state.data as MergeSortTreeData).nodes) return null;

  const { nodes, maxLevel } = state.data as MergeSortTreeData;
  const { operationType } = state;
  const msg = state.metadata?.message || '';

  // Group visible nodes by level
  const levels: TreeNode[][] = [];
  for (let i = 0; i <= maxLevel; i++) {
    levels[i] = nodes
      .filter(n => n.level === i && n.status !== 'hidden')
      .sort((a, b) => a.leftIdx - b.leftIdx);
  }

  // Scale cells based on tree depth so everything fits
  const cellSize = maxLevel <= 3 ? 'w-12 h-12 text-lg' : 'w-10 h-10 text-base';
  const gapBetweenGroups = maxLevel <= 3 ? 'gap-6' : 'gap-4';

  const opConfig: Record<string, { emoji: string; label: string; color: string }> = {
    [OperationType.VISIT]:     { emoji: '✂️', label: 'SPLITTING', color: 'text-blue-400' },
    [OperationType.COMPARE]:   { emoji: '🔀', label: 'MERGING',   color: 'text-yellow-400' },
    [OperationType.OVERWRITE]: { emoji: '✅', label: 'MERGED',    color: 'text-emerald-400' },
    [OperationType.DONE]:      { emoji: '🎉', label: 'COMPLETE',  color: 'text-emerald-400' },
  };
  const op = opConfig[operationType] || opConfig[OperationType.VISIT];

  const getNodeStyle = (status: string) => {
    switch (status) {
      case 'active':   return 'bg-yellow-500/20 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)]';
      case 'merging':  return 'bg-blue-500/15 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
      case 'sorted':   return 'bg-emerald-500/15 border-emerald-400/60';
      default:         return 'bg-slate-800/60 border-slate-600/40';
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'active':  return 'text-yellow-200';
      case 'merging': return 'text-blue-200';
      case 'sorted':  return 'text-emerald-300';
      default:        return 'text-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':   return <span className="text-[9px] font-bold text-yellow-400">▼ SPLIT</span>;
      case 'merging':  return <span className="text-[9px] font-bold text-blue-400">↑ MERGE</span>;
      case 'sorted':   return <span className="text-[9px] font-bold text-emerald-400">✓</span>;
      default:         return null;
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

      {/* Tree - all levels visible */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 px-2 py-3 overflow-auto">
        {levels.map((levelNodes, levelIdx) => {
          if (levelNodes.length === 0) return null;

          return (
            <React.Fragment key={'level-' + levelIdx}>
              {/* Connecting arrows */}
              {levelIdx > 0 && levels[levelIdx - 1]?.length > 0 && (
                <div className="flex items-center justify-center text-slate-600/60 shrink-0" style={{ height: 14 }}>
                  <svg width="24" height="14" viewBox="0 0 24 14">
                    <path d="M6 0 L6 10 L3 7 M6 10 L9 7" stroke="currentColor" fill="none" strokeWidth="1.2"/>
                    <path d="M18 0 L18 10 L15 7 M18 10 L21 7" stroke="currentColor" fill="none" strokeWidth="1.2"/>
                  </svg>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: levelIdx * 0.03 }}
                className={clsx("flex items-center justify-center shrink-0", gapBetweenGroups)}
              >
                {levelNodes.map((node) => (
                  <div key={node.id} className="flex flex-col items-center">
                    {/* Subarray group */}
                    <div className={clsx(
                      "flex rounded-lg border-2 overflow-hidden transition-all duration-200",
                      getNodeStyle(node.status),
                      (node.status === 'active' || node.status === 'merging') && 'scale-[1.03]'
                    )}>
                      {node.values.map((val, i) => (
                        <div
                          key={node.id + '-' + i}
                          className={clsx(
                            cellSize,
                            "flex items-center justify-center font-mono font-black",
                            getTextColor(node.status),
                            i > 0 && 'border-l border-inherit/30',
                          )}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                    {/* Status badge */}
                    <div className="h-4 flex items-center">
                      {getStatusBadge(node.status)}
                    </div>
                  </div>
                ))}
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-slate-700/50 flex items-center justify-center gap-5 text-[10px] font-medium text-slate-400 shrink-0 bg-slate-900/30">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-500/40 border border-yellow-500"></span> Splitting</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500/40 border border-blue-500"></span> Merging</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500"></span> Sorted</span>
      </div>
    </div>
  );
});
MergeSortRenderer.displayName = 'MergeSortRenderer';
