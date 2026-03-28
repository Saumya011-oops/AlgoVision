import React from 'react';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import { HeapSortData } from '../../algorithms/sorting/heapSort';
import { VisualizationStateContext } from '../../contexts/VisualizationStateContext';
import clsx from 'clsx';

function computeHeapTreePositions(n: number, viewWidth: number, startY: number, levelHeight: number) {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    const nodesAtDepth = Math.pow(2, depth);
    const posInRow = i - (nodesAtDepth - 1);
    const x = (viewWidth / (nodesAtDepth + 1)) * (posInRow + 1);
    const y = startY + depth * levelHeight;
    positions.push({ x, y });
  }
  return positions;
}

export const HeapSortRenderer = React.memo(() => {
  const ctx = React.useContext(VisualizationStateContext);
  const { getCurrentState } = useExecutionStore();
  const state = ctx ? ctx.getCurrentState() : getCurrentState();

  if (!state || !state.data) return null;

  const { array, heapSize } = state.data as HeapSortData;
  const { activeIndices, operationType } = state;
  const msg = state.metadata?.message || '';

  if (!array || !Array.isArray(array)) return null;

  const n = array.length;
  const treeDepth = Math.floor(Math.log2(n));
  const nodeRadius = n <= 7 ? 22 : n <= 15 ? 18 : n <= 31 ? 14 : 11;
  const levelHeight = n <= 7 ? 72 : n <= 15 ? 66 : n <= 31 ? 58 : 50;
  const viewW = 700;
  const treeStartY = 36;
  const treeViewH = treeStartY + (treeDepth + 1) * levelHeight + nodeRadius + 10;

  const positions = computeHeapTreePositions(n, viewW, treeStartY, levelHeight);

  const opConfig: Record<string, { emoji: string; label: string; color: string }> = {
    [OperationType.VISIT]:     { emoji: '👁', label: 'SCANNING',  color: 'text-blue-400' },
    [OperationType.COMPARE]:   { emoji: '⚖️', label: 'COMPARING', color: 'text-yellow-400' },
    [OperationType.SWAP]:      { emoji: '🔄', label: 'SWAPPING',  color: 'text-orange-400' },
    [OperationType.OVERWRITE]: { emoji: '✅', label: 'PLACED',    color: 'text-emerald-400' },
    [OperationType.DONE]:      { emoji: '🎉', label: 'COMPLETE',  color: 'text-emerald-400' },
  };
  const op = opConfig[operationType] || opConfig[OperationType.VISIT];

  const getNodeColors = (idx: number) => {
    const isSorted = typeof heapSize === 'number' && idx >= heapSize;
    const isActive = activeIndices.includes(idx);
    if (isSorted) return { fill: '#052e16', stroke: '#22c55e', text: '#86efac', glow: null };
    if (isActive && operationType === OperationType.SWAP)
      return { fill: '#431407', stroke: '#f97316', text: '#fed7aa', glow: '#f97316' };
    if (isActive && operationType === OperationType.COMPARE)
      return { fill: '#422006', stroke: '#eab308', text: '#fef08a', glow: '#eab308' };
    if (isActive)
      return { fill: '#172554', stroke: '#60a5fa', text: '#bfdbfe', glow: '#60a5fa' };
    return { fill: '#0f0f1a', stroke: '#4b5563', text: '#e5e7eb', glow: null };
  };

  const cellW = Math.max(24, Math.min(40, Math.floor(660 / n)));

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-2xl">
      {/* Status bar */}
      <div className="px-4 py-2 flex items-center gap-3 border-b border-surface/50 bg-background/50 shrink-0">
        <span className="text-lg">{op.emoji}</span>
        <span className={clsx('font-bold text-xs uppercase tracking-wider', op.color)}>{op.label}</span>
        <span className="text-text-secondary text-xs flex-1 truncate">{msg}</span>
      </div>

      {/* Array */}
      <div className="shrink-0 px-3 pt-3 pb-2 border-b border-surface/30 bg-background/20">
        <div className="flex items-end gap-px justify-center flex-wrap">
          {array.map((val, idx) => {
            const isSorted = typeof heapSize === 'number' && idx >= heapSize;
            const isActive = activeIndices.includes(idx);
            let cardCls = 'border-surface/50 bg-surface/30 text-text-secondary';
            if (isSorted) cardCls = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-400';
            else if (isActive && operationType === OperationType.SWAP) cardCls = 'border-orange-400 bg-orange-950/40 text-orange-200';
            else if (isActive && operationType === OperationType.COMPARE) cardCls = 'border-yellow-400 bg-yellow-950/40 text-yellow-200';
            else if (isActive) cardCls = 'border-blue-400 bg-blue-950/40 text-blue-200';
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={clsx('flex items-center justify-center rounded border font-mono font-bold transition-all duration-150', cardCls)}
                  style={{ width: cellW, height: cellW, fontSize: cellW <= 28 ? 9 : 11 }}
                >
                  {val}
                </div>
                <span style={{ fontSize: 8 }} className="font-mono text-text-secondary">{idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Binary Heap Tree */}
      <div className="flex-1 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${viewW} ${treeViewH}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edges */}
          {positions.map((pos, idx) => {
            const lc = 2 * idx + 1;
            const rc = 2 * idx + 2;
            return (
              <g key={`edges-${idx}`}>
                {lc < n && (
                  <line
                    x1={pos.x} y1={pos.y}
                    x2={positions[lc].x} y2={positions[lc].y}
                    stroke="#374151" strokeWidth="1.5"
                  />
                )}
                {rc < n && (
                  <line
                    x1={pos.x} y1={pos.y}
                    x2={positions[rc].x} y2={positions[rc].y}
                    stroke="#374151" strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {positions.map((pos, idx) => {
            const colors = getNodeColors(idx);
            return (
              <g key={`node-${idx}`}>
                {colors.glow && (
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={nodeRadius + 7}
                    fill="none"
                    stroke={colors.glow}
                    strokeWidth="2"
                    opacity="0.45"
                  />
                )}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={nodeRadius}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="2"
                />
                <text
                  x={pos.x} y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={nodeRadius >= 18 ? 11 : nodeRadius >= 14 ? 10 : 9}
                  fontWeight="bold"
                  fill={colors.text}
                  fontFamily="monospace"
                >
                  {array[idx]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-4 py-1.5 border-t border-surface/50 flex items-center justify-center gap-5 shrink-0 bg-background/30">
        {[
          { fill: '#422006', stroke: '#eab308', label: 'Comparing' },
          { fill: '#431407', stroke: '#f97316', label: 'Swapping' },
          { fill: '#052e16', stroke: '#22c55e', label: 'Sorted' },
          { fill: '#0f0f1a', stroke: '#4b5563', label: 'Heap' },
        ].map(({ fill, stroke, label }) => (
          <span key={label} className="flex items-center gap-1 text-[10px] font-medium text-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: fill, border: `1.5px solid ${stroke}` }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
});

HeapSortRenderer.displayName = 'HeapSortRenderer';
