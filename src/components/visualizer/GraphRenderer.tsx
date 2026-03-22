import React from 'react';
import { motion } from 'framer-motion';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import clsx from 'clsx';

interface GraphNode { id: number; x: number; y: number; label: string; }
interface GraphEdge { from: number; to: number; weight: number; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; distances: number[]; visited: boolean[]; current: number | null; path: number[]; }

export const GraphRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data || !(state.data as GraphData).nodes) return null;

  const { nodes, edges, distances, visited, current, path } = state.data as GraphData;
  const { activeIndices, operationType } = state;

  const isOnPath = (id: number) => path.includes(id);
  const isEdgeOnPath = (from: number, to: number) => {
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === from && path[i + 1] === to) return true;
    }
    return false;
  };

  // Scale nodes to fit canvas
  const scale = 0.85;
  const offsetX = 60;
  const offsetY = 30;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 700 420" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
          </marker>
          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#facc15" />
          </marker>
          <marker id="arrowhead-path" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodes[edge.from];
          const to = nodes[edge.to];
          const fx = from.x * scale + offsetX;
          const fy = from.y * scale + offsetY;
          const tx = to.x * scale + offsetX;
          const ty = to.y * scale + offsetY;
          const mx = (fx + tx) / 2;
          const my = (fy + ty) / 2 - 12;

          const active = activeIndices.includes(edge.from) && activeIndices.includes(edge.to);
          const onPath = isEdgeOnPath(edge.from, edge.to);

          // Shorten line to not overlap nodes
          const dx = tx - fx;
          const dy = ty - fy;
          const len = Math.sqrt(dx * dx + dy * dy);
          const r = 28;
          const sfx = fx + (dx / len) * r;
          const sfy = fy + (dy / len) * r;
          const stx = tx - (dx / len) * r;
          const sty = ty - (dy / len) * r;

          return (
            <g key={`edge-${i}`}>
              <line
                x1={sfx} y1={sfy} x2={stx} y2={sty}
                stroke={onPath ? '#22c55e' : active ? '#facc15' : '#6b7280'}
                strokeWidth={onPath ? 3 : active ? 2.5 : 1.5}
                markerEnd={onPath ? 'url(#arrowhead-path)' : active ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                opacity={onPath ? 1 : active ? 0.9 : 0.4}
              />
              <rect x={mx - 12} y={my - 8} width="24" height="16" rx="4" fill="#1e1b2e" stroke="#374151" strokeWidth="1" />
              <text x={mx} y={my + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill={onPath ? '#22c55e' : active ? '#facc15' : '#9ca3af'}>
                {edge.weight}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const cx = node.x * scale + offsetX;
          const cy = node.y * scale + offsetY;
          const isActive = activeIndices.includes(node.id);
          const isCurrent = current === node.id;
          const isVisited = visited[node.id];
          const onPath = isOnPath(node.id);
          const dist = distances[node.id];

          let fill = '#1e1b2e';
          let stroke = '#6b7280';
          let textColor = '#d1d5db';

          if (onPath && operationType === OperationType.DONE) {
            fill = '#065f46'; stroke = '#22c55e'; textColor = '#86efac';
          } else if (isCurrent) {
            fill = '#7c3aed'; stroke = '#a78bfa'; textColor = '#ffffff';
          } else if (isActive) {
            fill = '#854d0e'; stroke = '#facc15'; textColor = '#fef08a';
          } else if (isVisited) {
            fill = '#1e293b'; stroke = '#8b5cf6'; textColor = '#c4b5fd';
          }

          return (
            <g key={`node-${node.id}`}>
              {(isCurrent || onPath) && (
                <circle cx={cx} cy={cy} r="32" fill="none" stroke={onPath ? '#22c55e' : '#a78bfa'} strokeWidth="2" opacity="0.4" filter="url(#glow)" />
              )}
              <circle cx={cx} cy={cy} r="26" fill={fill} stroke={stroke} strokeWidth="2.5" />
              <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill={textColor}>
                {node.label}
              </text>
              {/* Distance label */}
              <text x={cx} y={cy + 42} textAnchor="middle" fontSize="11" fill="#9ca3af" fontFamily="monospace">
                d={dist === Infinity ? '∞' : dist}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});
GraphRenderer.displayName = 'GraphRenderer';
