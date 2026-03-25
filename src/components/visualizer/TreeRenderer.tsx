import React from 'react';
import clsx from 'clsx';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';
import { TreeData } from '../../algorithms/tree/shared';

export const TreeRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data || !(state.data as TreeData).nodes) {
    return null;
  }

  const { nodes, root, current, visited, path, algorithm } = state.data as TreeData;
  const { activeIndices, operationType } = state;

  const isNodeOnPath = (nodeId: number) => path.includes(nodeId);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
        <div className="rounded-full border border-surface bg-panel/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-primary">
          {algorithm.replace(/-/g, ' ')}
        </div>
      </div>

      <svg className="h-full w-full" viewBox="0 0 700 420" preserveAspectRatio="xMidYMid meet">
        {/* Draw edges first so they appear behind nodes */}
        {nodes.map((node) => {
          const edges = [];
          if (node.left !== null) {
            const leftChild = nodes[node.left];
            edges.push(
              <line
                key={`edge-${node.id}-L`}
                x1={node.x}
                y1={node.y}
                x2={leftChild.x}
                y2={leftChild.y}
                stroke="currentColor"
                className="text-surface"
                strokeWidth="2"
              />
            );
          }
          if (node.right !== null) {
            const rightChild = nodes[node.right];
            edges.push(
              <line
                key={`edge-${node.id}-R`}
                x1={node.x}
                y1={node.y}
                x2={rightChild.x}
                y2={rightChild.y}
                stroke="currentColor"
                className="text-surface"
                strokeWidth="2"
              />
            );
          }
          return edges;
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const isActive = activeIndices.includes(node.id);
          const isCurrent = current === node.id;
          const isVisited = visited.includes(node.id);
          const onPath = isNodeOnPath(node.id);

          return (
            <g key={`node-${node.id}`}>
              {(isCurrent || onPath) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="26"
                  fill="none"
                  stroke="currentColor"
                  className={clsx(
                    onPath ? 'text-emerald-500' : 'text-violet-500'
                  )}
                  strokeWidth="2"
                  opacity="0.4"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                className={clsx(
                  'transition-all duration-300',
                  isCurrent ? 'fill-violet-600 stroke-violet-300' : '',
                  onPath && operationType === OperationType.DONE ? 'fill-emerald-900 stroke-emerald-400' : '',
                  isActive && !isCurrent ? 'fill-amber-900 stroke-yellow-400' : '',
                  isVisited && !isActive && !isCurrent ? 'fill-background stroke-brand-light' : '',
                  !isVisited && !isActive && !isCurrent && !onPath ? 'fill-background stroke-text-secondary' : ''
                )}
                strokeWidth="2.5"
              />
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
                fill="currentColor"
                className="text-text-primary"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

TreeRenderer.displayName = 'TreeRenderer';
