import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useExecutionStore } from '../../store/executionStore';
import { OperationType } from '../../types/AlgorithmState';

interface DPArrayData {
  table: number[];
  n: number;
  label: string;
}

interface DPMatrixData {
  label: string;
  matrix: number[][];
  rowLabels: string[];
  columnLabels: string[];
  activeCells: Array<[number, number]>;
  summary: string;
}

export const DPTableRenderer = React.memo(() => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();

  if (!state || !state.data) {
    return null;
  }

  if ('matrix' in (state.data as DPMatrixData)) {
    const { label, matrix, rowLabels, columnLabels, activeCells, summary } = state.data as DPMatrixData;
    const isActiveCell = (row: number, column: number) =>
      activeCells.some(([activeRow, activeColumn]) => activeRow === row && activeColumn === column);

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 overflow-auto p-6">
        <div className="text-center">
          <h3 className="mb-1 text-lg font-bold text-white">{label}</h3>
          <p className="text-sm text-text-secondary">{summary}</p>
        </div>

        <div className="overflow-auto rounded-2xl border border-surface/70 bg-panel/40 p-4">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${columnLabels.length + 1}, minmax(2.75rem, auto))` }}
          >
            <div />
            {columnLabels.map((columnLabel, column) => (
              <div
                key={`column-${column}`}
                className="text-center text-[10px] font-mono uppercase text-text-secondary"
              >
                {columnLabel}
              </div>
            ))}

            {matrix.map((row, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                <div className="flex items-center justify-center text-[10px] font-mono uppercase text-text-secondary">
                  {rowLabels[rowIndex]}
                </div>
                {row.map((value, columnIndex) => (
                  <motion.div
                    key={`cell-${rowIndex}-${columnIndex}`}
                    animate={{ scale: isActiveCell(rowIndex, columnIndex) ? 1.05 : 1 }}
                    className={clsx(
                      'flex h-11 items-center justify-center rounded-lg border text-sm font-mono font-bold transition-all',
                      isActiveCell(rowIndex, columnIndex) && state.operationType === OperationType.COMPARE
                        ? 'border-yellow-400 bg-yellow-500/20 text-yellow-200'
                        : isActiveCell(rowIndex, columnIndex) &&
                          state.operationType === OperationType.OVERWRITE
                        ? 'border-brand-light bg-brand/25 text-brand-light'
                        : 'border-surface bg-background/50 text-white'
                    )}
                  >
                    {value}
                  </motion.div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!('table' in (state.data as DPArrayData))) {
    return null;
  }

  const { table, n, label } = state.data as DPArrayData;
  const { activeIndices, operationType } = state;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h3 className="mb-1 text-lg font-bold text-white">{label} DP Table</h3>
        <p className="text-sm text-text-secondary">Bottom-up computation with reusable subproblems</p>
      </div>

      <div className="flex max-w-full flex-wrap justify-center gap-2">
        <AnimatePresence>
          {table.slice(0, n + 1).map((value, index) => {
            const isActive = activeIndices.includes(index);
            const isFilled = value !== 0 || index === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex flex-col items-center gap-1 p-1"
              >
                <span className="text-[10px] font-mono text-text-secondary/60">F({index})</span>
                <div
                  className={clsx(
                    'flex h-14 w-14 items-center justify-center rounded-xl border-2 font-mono text-lg font-bold transition-all duration-300 md:h-16 md:w-16',
                    isActive && operationType === OperationType.COMPARE
                      ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                      : isActive && operationType === OperationType.OVERWRITE
                      ? 'scale-110 border-brand-light bg-brand/20 text-brand-light shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                      : isFilled
                      ? 'border-surface bg-surface/60 text-white'
                      : 'border-surface/50 bg-surface/20 text-text-secondary/40'
                  )}
                >
                  {isFilled ? value : '—'}
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
