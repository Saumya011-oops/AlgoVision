import React from 'react';
import clsx from 'clsx';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import { GraphData } from '../../algorithms/graph/shared';

export const GraphRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data || !(state.data as GraphData).nodes) {
    return null;
  }

  const { nodes, edges, distances, visited, current, path, algorithm, queue, pass, parent } =
    state.data as GraphData;
  const { activeIndices, operationType } = state;

  const isNodeOnPath = (nodeId: number) => path.includes(nodeId);
  const isEdgeOnPath = (from: number, to: number) => {
    for (let index = 0; index < path.length - 1; index++) {
      if (path[index] === from && path[index + 1] === to) {
        return true;
      }
    }
    return false;
  };

  const scale = 0.85;
  const offsetX = 60;
  const offsetY = 30;

  const showTraversalTree = (algorithm === 'bfs' || algorithm === 'dfs') && parent != null;

  // Build traversal tree layout when applicable
  let treeNodePositions: { x: number; y: number }[] = [];
  if (showTraversalTree && parent) {
    const source = (state.data as GraphData).source;
    // Group visited nodes by their BFS/DFS level (distance)
    const levelMap = new Map<number, number[]>();
    for (let i = 0; i < nodes.length; i++) {
      if (visited[i] || i === source) {
        const level = distances[i] === Infinity ? 0 : distances[i];
        if (!levelMap.has(level)) levelMap.set(level, []);
        levelMap.get(level)!.push(i);
      }
    }

    const treeW = 320;
    const treeH = 400;
    const levelHeight = 70;
    const startY = 30;

    treeNodePositions = Array(nodes.length).fill({ x: 0, y: 0 });
    for (const [level, nodesAtLevel] of levelMap) {
      const count = nodesAtLevel.length;
      nodesAtLevel.forEach((nodeId, posIdx) => {
        const x = (treeW / (count + 1)) * (posIdx + 1);
        const y = startY + level * levelHeight;
        treeNodePositions[nodeId] = { x, y };
      });
    }
  }

  const getNodeFill = (nodeId: number) => {
    const isActive = activeIndices.includes(nodeId);
    const isCurrent = current === nodeId;
    const isVisited = visited[nodeId];
    const onPath = isNodeOnPath(nodeId);
    if (isCurrent) return { fill: '#7c3aed', stroke: '#c4b5fd' };
    if (onPath && operationType === OperationType.DONE) return { fill: '#064e3b', stroke: '#34d399' };
    if (isActive && !isCurrent) return { fill: '#78350f', stroke: '#facc15' };
    if (isVisited && !isActive && !isCurrent) return { fill: '#1e293b', stroke: '#60a5fa' };
    return { fill: '#1e1b2e', stroke: '#6b7280' };
  };

  return (
    <div className={clsx('relative h-full w-full overflow-hidden', showTraversalTree ? 'flex flex-row' : '')}>
      {/* Info badges */}
      <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
        <div className="rounded-full border border-surface bg-panel/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-primary">
          {algorithm.replace(/-/g, ' ')}
        </div>
        {typeof pass === 'number' ? (
          <div className="rounded-full border border-surface bg-panel/80 px-3 py-1 text-[10px] text-text-secondary">
            Pass {pass}
          </div>
        ) : null}
        {queue ? (
          <div className="rounded-full border border-surface bg-panel/80 px-3 py-1 text-[10px] text-text-secondary">
            Queue: {queue.length > 0 ? queue.map((index) => nodes[index].label).join(' -> ') : 'empty'}
          </div>
        ) : null}
      </div>

      {/* Main graph — 55% width when tree panel shown, full width otherwise */}
      <div className={clsx('h-full', showTraversalTree ? 'w-[55%]' : 'w-full')}>
        <svg className="h-full w-full" viewBox="0 0 700 420" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#facc15" />
            </marker>
            <marker id="arrowhead-path" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
            </marker>
          </defs>

          {edges.map((edge, index) => {
            const from = nodes[edge.from];
            const to = nodes[edge.to];
            const fx = from.x * scale + offsetX;
            const fy = from.y * scale + offsetY;
            const tx = to.x * scale + offsetX;
            const ty = to.y * scale + offsetY;
            const mx = (fx + tx) / 2;
            const my = (fy + ty) / 2 - 12;
            const onPath = isEdgeOnPath(edge.from, edge.to);
            const active = activeIndices.includes(edge.from) && activeIndices.includes(edge.to);
            const dx = tx - fx;
            const dy = ty - fy;
            const length = Math.sqrt(dx * dx + dy * dy);
            const radius = 28;
            const startX = fx + (dx / length) * radius;
            const startY = fy + (dy / length) * radius;
            const endX = tx - (dx / length) * radius;
            const endY = ty - (dy / length) * radius;

            return (
              <g key={`edge-${index}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={onPath ? '#22c55e' : active ? '#facc15' : '#6b7280'}
                  strokeWidth={onPath ? 3 : active ? 2.5 : 1.5}
                  markerEnd={onPath ? 'url(#arrowhead-path)' : active ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  opacity={onPath ? 1 : active ? 0.9 : 0.45}
                />
                <rect
                  x={mx - 12}
                  y={my - 8}
                  width="24"
                  height="16"
                  rx="4"
                  fill="#1e1b2e"
                  stroke="#374151"
                  strokeWidth="1"
                />
                <text
                  x={mx}
                  y={my + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={onPath ? '#22c55e' : active ? '#facc15' : '#9ca3af'}
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {nodes.map((node) => {
            const cx = node.x * scale + offsetX;
            const cy = node.y * scale + offsetY;
            const isActive = activeIndices.includes(node.id);
            const isCurrent = current === node.id;
            const isVisited = visited[node.id];
            const onPath = isNodeOnPath(node.id);
            const distance = distances[node.id];

            return (
              <g key={`node-${node.id}`}>
                {(isCurrent || onPath) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="32"
                    fill="none"
                    stroke={onPath ? '#22c55e' : '#a78bfa'}
                    strokeWidth="2"
                    opacity="0.4"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r="26"
                  className={clsx(
                    isCurrent ? 'fill-violet-600 stroke-violet-300' : '',
                    onPath && operationType === OperationType.DONE ? 'fill-emerald-900 stroke-emerald-400' : '',
                    isActive && !isCurrent ? 'fill-amber-900 stroke-yellow-400' : '',
                    isVisited && !isActive && !isCurrent ? 'fill-slate-800 stroke-brand-light' : '',
                    !isVisited && !isActive && !isCurrent && !onPath ? 'fill-[#1e1b2e] stroke-slate-500' : ''
                  )}
                  strokeWidth="2.5"
                />
                <text
                  x={cx}
                  y={cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="#f4f4f5"
                >
                  {node.label}
                </text>
                <text
                  x={cx}
                  y={cy + 42}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#9ca3af"
                  fontFamily="monospace"
                >
                  d={distance === Infinity ? '∞' : distance}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Traversal Tree panel — only for BFS/DFS */}
      {showTraversalTree && parent && (
        <div className="w-[45%] h-full border-l border-surface/40 flex flex-col bg-background/30">
          <div className="px-3 py-2 border-b border-surface/40 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              Traversal Tree
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 320 400" preserveAspectRatio="xMidYMid meet">
              {/* Tree edges */}
              {nodes.map((node) => {
                const nodeParent = parent[node.id];
                if (nodeParent === null || nodeParent === undefined) return null;
                if (!visited[node.id] && node.id !== (state.data as GraphData).source) return null;
                const from = treeNodePositions[nodeParent];
                const to = treeNodePositions[node.id];
                if (!from || !to) return null;
                return (
                  <line
                    key={`tree-edge-${node.id}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#374151"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                );
              })}

              {/* Tree nodes */}
              {nodes.map((node) => {
                if (!visited[node.id] && node.id !== (state.data as GraphData).source) return null;
                const pos = treeNodePositions[node.id];
                if (!pos) return null;
                const colors = getNodeFill(node.id);
                const onPath = isNodeOnPath(node.id);
                const isCurrent = current === node.id;
                return (
                  <g key={`tree-node-${node.id}`}>
                    {(isCurrent || onPath) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="20"
                        fill="none"
                        stroke={onPath ? '#22c55e' : '#a78bfa'}
                        strokeWidth="1.5"
                        opacity="0.4"
                      />
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="14"
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill="#f4f4f5"
                      fontFamily="monospace"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
});

GraphRenderer.displayName = 'GraphRenderer';
