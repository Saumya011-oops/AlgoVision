import React from 'react';
import clsx from 'clsx';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import { GraphData } from '../../algorithms/graph/shared';
import { VisualizationStateContext } from '../../contexts/VisualizationStateContext';

const ALGO_DISPLAY_NAMES: Record<string, string> = {
  bfs: 'Breadth-First Search',
  dfs: 'Depth-First Search',
  dijkstra: 'Dijkstra\'s Algorithm',
  'bellman-ford': 'Bellman-Ford',
  ucs: 'Uniform Cost Search',
  dls: 'Depth-Limited Search',
  iddfs: 'Iterative Deepening DFS',
  bidirectional: 'Bidirectional Search',
  'best-first': 'Best-First Search',
  'a-star': 'A* Search',
};

const opConfig: Record<string, { emoji: string; label: string; color: string }> = {
  [OperationType.VISIT]:     { emoji: '👁', label: 'VISITING',   color: 'text-blue-400' },
  [OperationType.COMPARE]:   { emoji: '⚖️', label: 'INSPECTING', color: 'text-yellow-400' },
  [OperationType.SWAP]:      { emoji: '🔄', label: 'UPDATING',   color: 'text-orange-400' },
  [OperationType.OVERWRITE]: { emoji: '✅', label: 'DISCOVERED', color: 'text-emerald-400' },
  [OperationType.DONE]:      { emoji: '🎉', label: 'COMPLETE',   color: 'text-emerald-400' },
};

export const SearchTreeRenderer = React.memo(() => {
  const ctx = React.useContext(VisualizationStateContext);
  const { getCurrentState } = useExecutionStore();
  const state = ctx ? ctx.getCurrentState() : getCurrentState();

  if (!state || !state.data || !(state.data as GraphData).nodes) return null;

  const data = state.data as GraphData;
  const { nodes, edges, distances, visited, current, path, algorithm, queue, pass, parent, heuristics } = data;
  const { activeIndices, operationType } = state;
  const msg = state.metadata?.message || '';

  const isOnPath = (id: number) => path.includes(id);

  const op = opConfig[operationType] || opConfig[OperationType.VISIT];
  const algoName = ALGO_DISPLAY_NAMES[algorithm] || algorithm.replace(/-/g, ' ');

  // Determine node color for SVG
  const getNodeColors = (nodeId: number) => {
    const isActive = activeIndices.includes(nodeId);
    const isCurrent = current === nodeId;
    const isVisited = visited[nodeId];
    const onPath = isOnPath(nodeId);

    if (operationType === OperationType.DONE && onPath) {
      return { fill: '#052e16', stroke: '#22c55e', text: '#86efac', glow: '#22c55e' };
    }
    if (isCurrent) {
      return { fill: '#2e1065', stroke: '#a78bfa', text: '#ede9fe', glow: '#a78bfa' };
    }
    if (isActive && !isCurrent) {
      return { fill: '#422006', stroke: '#eab308', text: '#fef08a', glow: '#eab308' };
    }
    if (isVisited) {
      return { fill: '#172554', stroke: '#60a5fa', text: '#bfdbfe', glow: null };
    }
    return { fill: '#111827', stroke: '#374151', text: '#6b7280', glow: null };
  };

  // Edge highlighting
  const isEdgeActive = (from: number, to: number) =>
    activeIndices.includes(from) && activeIndices.includes(to);
  const isEdgeOnPath = (from: number, to: number) => {
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === from && path[i + 1] === to) return true;
    }
    return false;
  };
  const isTreeEdge = (from: number, to: number) =>
    parent != null && parent[to] === from;

  // Build parent label for info table
  const getParentLabel = (nodeId: number) => {
    if (!parent) return '-';
    const p = parent[nodeId];
    if (p === null || p === undefined) return nodeId === data.source ? 'root' : '-';
    return nodes[p]?.label ?? '-';
  };

  // Compute scale & offset so tree fits SVG viewBox
  const SVG_W = 640;
  const SVG_H = 420;

  const allX = nodes.map((n) => n.x);
  const allY = nodes.map((n) => n.y);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const treeW = maxX - minX || 1;
  const treeH = maxY - minY || 1;
  const padding = 50;
  const scaleX = (SVG_W - padding * 2) / treeW;
  const scaleY = (SVG_H - padding * 2) / treeH;
  const scale = Math.min(scaleX, scaleY, 1.2);
  const offsetX = padding + (SVG_W - padding * 2 - treeW * scale) / 2 - minX * scale;
  const offsetY = padding + (SVG_H - padding * 2 - treeH * scale) / 2 - minY * scale;

  const cx = (x: number) => x * scale + offsetX;
  const cy = (y: number) => y * scale + offsetY;

  const nodeRadius = nodes.length <= 7 ? 22 : nodes.length <= 9 ? 20 : 18;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Status bar */}
      <div className="px-4 py-2 flex items-center gap-3 border-b border-surface/50 bg-background/50 shrink-0">
        <span className="text-lg">{op.emoji}</span>
        <span className={clsx('font-bold text-xs uppercase tracking-wider', op.color)}>{op.label}</span>
        <span className="text-text-secondary text-xs flex-1 truncate">{msg}</span>
        {typeof pass === 'number' && (
          <span className="text-xs text-text-secondary border border-surface rounded px-2 py-0.5">Pass {pass}</span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* LEFT INFO PANEL */}
        <div className="w-[32%] shrink-0 border-r border-surface/40 flex flex-col bg-background/20 overflow-y-auto">
          {/* Algorithm name */}
          <div className="px-3 py-2 border-b border-surface/30">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-1">Algorithm</div>
            <div className="text-sm font-bold text-text-primary">{algoName}</div>
          </div>

          {/* Queue/Stack */}
          {queue && (
            <div className="px-3 py-2 border-b border-surface/30">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                {algorithm === 'dfs' || algorithm === 'dls' || algorithm === 'iddfs' ? 'Stack' : 'Queue / Frontier'}
              </div>
              <div className="flex flex-wrap gap-1">
                {queue.length === 0 ? (
                  <span className="text-xs text-text-secondary italic">empty</span>
                ) : (
                  queue.map((nid, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-surface/50 border border-surface text-xs font-mono text-text-primary"
                    >
                      {nodes[nid]?.label ?? nid}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Current node */}
          {current !== null && (
            <div className="px-3 py-2 border-b border-surface/30">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-1">Current</div>
              <span className="px-2 py-1 rounded bg-violet-900/40 border border-violet-500/50 text-xs font-mono font-bold text-violet-200">
                {nodes[current]?.label ?? current}
              </span>
            </div>
          )}

          {/* Node table: Node | Parent | g/Dist | [H] | Seen */}
          <div className="px-3 py-2 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-2">Node Info</div>
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="text-text-secondary text-[9px] uppercase">
                  <th className="text-left pb-1 font-semibold">Node</th>
                  <th className="text-left pb-1 font-semibold">Parent</th>
                  <th className="text-left pb-1 font-semibold">{algorithm === 'a-star' ? 'g' : 'Dist'}</th>
                  {algorithm === 'a-star' && heuristics && (
                    <th className="text-left pb-1 font-semibold">H</th>
                  )}
                  <th className="text-left pb-1 font-semibold">Seen</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => {
                  const isCurr = current === node.id;
                  const isVis = visited[node.id];
                  const onPath = isOnPath(node.id);
                  const dist = distances[node.id];
                  const isSeen = isVis || (parent != null && parent[node.id] != null) || node.id === data.source;
                  return (
                    <tr
                      key={node.id}
                      className={clsx(
                        'border-t border-surface/20',
                        isCurr ? 'bg-violet-900/20' : onPath && operationType === OperationType.DONE ? 'bg-emerald-900/20' : ''
                      )}
                    >
                      <td className={clsx('py-0.5 font-bold', isCurr ? 'text-violet-300' : onPath && operationType === OperationType.DONE ? 'text-emerald-300' : isVis ? 'text-blue-300' : 'text-text-secondary')}>
                        {node.label}
                      </td>
                      <td className="py-0.5 text-text-secondary">{getParentLabel(node.id)}</td>
                      <td className="py-0.5 text-text-secondary">{dist === Infinity ? '∞' : dist}</td>
                      {algorithm === 'a-star' && heuristics && (
                        <td className="py-0.5 text-text-secondary">
                          {heuristics[node.id] != null ? heuristics[node.id] : '—'}
                        </td>
                      )}
                      <td className="py-0.5">
                        <span className={clsx('text-[10px] font-bold', isSeen ? 'text-emerald-400' : 'text-text-secondary')}>
                          {isSeen ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-3 py-2 border-t border-surface/30 space-y-1">
            {[
              { color: '#a78bfa', label: 'Current node' },
              { color: '#60a5fa', label: 'Visited' },
              { color: '#22c55e', label: 'Shortest path' },
              { color: '#eab308', label: 'Active edge' },
              { color: '#374151', label: 'Unvisited' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2 text-[10px] text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT TREE VISUALIZATION */}
        <div className="flex-1 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Draw edges */}
            {edges.map((edge, i) => {
              const from = nodes[edge.from];
              const to = nodes[edge.to];
              const fx = cx(from.x);
              const fy = cy(from.y);
              const tx = cx(to.x);
              const ty = cy(to.y);
              const onPath = isEdgeOnPath(edge.from, edge.to);
              const active = isEdgeActive(edge.from, edge.to);
              const treeEdge = isTreeEdge(edge.from, edge.to);

              // Shorten line to not overlap node circles
              const dx = tx - fx;
              const dy = ty - fy;
              const len = Math.sqrt(dx * dx + dy * dy);
              const r = nodeRadius + 2;
              const sx = fx + (dx / len) * r;
              const sy = fy + (dy / len) * r;
              const ex = tx - (dx / len) * r;
              const ey = ty - (dy / len) * r;

              // Mid point for weight label
              const mx = (fx + tx) / 2;
              const my = (fy + ty) / 2;

              let stroke = '#1f2937';
              let strokeW = 1.5;
              let opacity = 0.4;
              if (onPath && operationType === OperationType.DONE) { stroke = '#22c55e'; strokeW = 3; opacity = 1; }
              else if (active) { stroke = '#eab308'; strokeW = 2.5; opacity = 0.9; }
              else if (treeEdge) { stroke = '#4b90c0'; strokeW = 2; opacity = 0.7; }

              return (
                <g key={`edge-${i}`}>
                  <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={stroke} strokeWidth={strokeW} opacity={opacity} />
                  {/* Weight label — only show for weighted algorithms */}
                  {(algorithm === 'dijkstra' || algorithm === 'bellman-ford' || algorithm === 'ucs' || algorithm === 'best-first' || algorithm === 'a-star') && (
                    <g>
                      <rect x={mx - 10} y={my - 8} width="20" height="14" rx="3" fill="#111827" stroke="#374151" strokeWidth="1" opacity="0.85" />
                      <text x={mx} y={my + 3} textAnchor="middle" fontSize="9" fontWeight="bold" fill={active ? '#eab308' : onPath ? '#22c55e' : '#6b7280'} fontFamily="monospace">
                        {edge.weight}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Draw nodes */}
            {nodes.map((node) => {
              const x = cx(node.x);
              const y = cy(node.y);
              const colors = getNodeColors(node.id);
              const isSource = node.id === data.source;
              const isTarget = node.id === data.target;

              return (
                <g key={`node-${node.id}`}>
                  {/* Glow ring for current / active */}
                  {colors.glow && (
                    <circle cx={x} cy={y} r={nodeRadius + 8} fill="none" stroke={colors.glow} strokeWidth="2" opacity="0.35" />
                  )}
                  {/* Source marker ring */}
                  {isSource && (
                    <circle cx={x} cy={y} r={nodeRadius + 4} fill="none" stroke="#818cf8" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 2" />
                  )}
                  <circle cx={x} cy={y} r={nodeRadius} fill={colors.fill} stroke={colors.stroke} strokeWidth="2.5" />
                  {/* Node label */}
                  <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={nodeRadius >= 22 ? 14 : 12} fontWeight="bold" fill={colors.text} fontFamily="monospace">
                    {node.label}
                  </text>
                  {/* Source / Target badge */}
                  {(isSource || isTarget) && (
                    <text x={x} y={y + nodeRadius + 12} textAnchor="middle" fontSize="8" fill={isSource ? '#818cf8' : '#f87171'} fontWeight="bold">
                      {isSource ? 'SRC' : 'TGT'}
                    </text>
                  )}
                  {/* Distance label below node */}
                  {distances[node.id] !== Infinity && !isSource && (
                    <text x={x} y={y + nodeRadius + 22} textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="monospace">
                      d={distances[node.id]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
});

SearchTreeRenderer.displayName = 'SearchTreeRenderer';
