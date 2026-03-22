import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import {
  ArrowRightLeft,
  ArrowUpAZ,
  ArrowDownAZ,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Trophy,
  Zap,
} from 'lucide-react';
import { COMPARISON_SORTING_ALGOS } from '../../data/algorithmCatalog';
import { useComparisonStore } from '../../store/comparisonStore';
import { DataPattern, generateArray } from '../../utils/algorithmRunner';
import { generateBubbleSortStates } from '../../algorithms/sorting/bubbleSort';
import { generateHeapSortStates } from '../../algorithms/sorting/heapSort';
import { generateMergeSortStates } from '../../algorithms/sorting/mergeSort';
import { generateQuickSortStates } from '../../algorithms/sorting/quickSort';
import { generateSelectionSortStates } from '../../algorithms/sorting/selectionSort';
import { countOperationMetrics } from '../../utils/metrics';
import { AlgorithmState } from '../../types/AlgorithmState';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const patternButtons: { value: DataPattern; icon: React.ReactNode; label: string }[] = [
  { value: 'random', icon: <Shuffle className="w-3 h-3" />, label: 'Random' },
  { value: 'sorted', icon: <ArrowUpAZ className="w-3 h-3" />, label: 'Sorted' },
  { value: 'reverse', icon: <ArrowDownAZ className="w-3 h-3" />, label: 'Reverse' },
];

const runSortingAlgorithm = (algorithmId: string, input: number[]) => {
  switch (algorithmId) {
    case 'bubble-sort':
      return generateBubbleSortStates(input);
    case 'selection-sort':
      return generateSelectionSortStates(input);
    case 'heap-sort':
      return generateHeapSortStates(input);
    case 'quick-sort':
      return generateQuickSortStates(input);
    case 'merge-sort':
      return generateMergeSortStates(input);
    default:
      return generateBubbleSortStates(input);
  }
};

const MiniArrayView = React.memo(
  ({
    data,
    activeIndices,
    operationType,
  }: {
    data:
      | {
          array?: number[];
          sortedBoundary?: number;
          currentMin?: number | null;
          heapSize?: number;
        }
      | null;
    activeIndices: number[];
    operationType: string;
  }) => {
    if (!data) {
      return <div className="py-8 text-center text-sm text-slate-600">Click "Run Comparison" to start</div>;
    }

    const array = data.array || [];
    if (!Array.isArray(array) || array.length === 0) {
      return <div className="py-4 text-center text-xs text-slate-400">Tree visualization active</div>;
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-1 py-2">
        {array.map((value, index) => {
          const isActive = activeIndices.includes(index);
          const sortsFromLeft = 'currentMin' in data;
          const isSorted =
            typeof data.sortedBoundary === 'number' &&
            (sortsFromLeft ? index < data.sortedBoundary : index >= data.sortedBoundary);

          let background = 'bg-slate-800/60 border-slate-600/40';
          let textColor = 'text-white';

          if (isActive && operationType === 'SWAP') {
            background = 'bg-orange-500/25 border-orange-400';
            textColor = 'text-orange-200';
          } else if (isActive && operationType === 'COMPARE') {
            background = 'bg-yellow-500/20 border-yellow-400';
            textColor = 'text-yellow-200';
          } else if (isActive) {
            background = 'bg-blue-500/20 border-blue-400';
            textColor = 'text-blue-200';
          } else if (isSorted) {
            background = 'bg-emerald-500/15 border-emerald-400/60';
            textColor = 'text-emerald-300';
          }

          return (
            <div
              key={index}
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded border font-mono text-xs font-bold',
                background,
                textColor
              )}
            >
              {value}
            </div>
          );
        })}
      </div>
    );
  }
);

const AlgoSelector = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="cursor-pointer rounded-lg border border-surface bg-surface/60 px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand"
    >
      {COMPARISON_SORTING_ALGOS.map((algorithm) => (
        <option key={algorithm.id} value={algorithm.id}>
          {algorithm.name}
        </option>
      ))}
    </select>
  </div>
);

export const ComparisonMode = React.memo(() => {
  const [inputSize, setInputSize] = useState(8);
  const [dataPattern, setDataPattern] = useState<DataPattern>('random');
  const {
    leftAlgoId,
    rightAlgoId,
    setLeftAlgo,
    setRightAlgo,
    leftStates,
    rightStates,
    setLeftStates,
    setRightStates,
    leftIndex,
    rightIndex,
    isPlaying,
    playbackSpeedMs,
    play,
    pause,
    stepForward,
    stepBackward,
    jumpToStep,
    resetPlayback,
    setSpeed,
    leftMetrics,
    rightMetrics,
  } = useComparisonStore();

  const maxSteps = Math.max(leftStates.length, rightStates.length);
  const currentStep = Math.max(leftIndex, rightIndex);
  const leftDone = leftStates.length > 0 && leftIndex >= leftStates.length - 1;
  const rightDone = rightStates.length > 0 && rightIndex >= rightStates.length - 1;
  const hasStarted = leftStates.length > 0 && rightStates.length > 0;
  const totalLeftMetrics = useMemo(() => countOperationMetrics(leftStates), [leftStates]);
  const totalRightMetrics = useMemo(() => countOperationMetrics(rightStates), [rightStates]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isPlaying && (!leftDone || !rightDone)) {
      interval = setInterval(stepForward, playbackSpeedMs);
    } else if (isPlaying && leftDone && rightDone) {
      pause();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, leftDone, rightDone, playbackSpeedMs, stepForward, pause]);

  const handleRunComparison = useCallback(() => {
    resetPlayback();
    const input = generateArray(inputSize, dataPattern);
    const leftResult = runSortingAlgorithm(leftAlgoId, [...input]);
    const rightResult = runSortingAlgorithm(rightAlgoId, [...input]);
    setLeftStates(leftResult.states);
    setRightStates(rightResult.states);
  }, [
    dataPattern,
    inputSize,
    leftAlgoId,
    resetPlayback,
    rightAlgoId,
    setLeftStates,
    setRightStates,
  ]);

  const leftState = leftStates[leftIndex] || null;
  const rightState = rightStates[rightIndex] || null;

  const winner = useMemo(() => {
    if (!hasStarted) {
      return null;
    }

    const leftScore = leftDone ? totalLeftMetrics.totalOperations : leftMetrics.totalOperations;
    const rightScore = rightDone ? totalRightMetrics.totalOperations : rightMetrics.totalOperations;

    if (leftScore === rightScore) {
      return 'tie';
    }

    return leftScore < rightScore ? 'left' : 'right';
  }, [
    hasStarted,
    leftDone,
    leftMetrics.totalOperations,
    rightDone,
    rightMetrics.totalOperations,
    totalLeftMetrics.totalOperations,
    totalRightMetrics.totalOperations,
  ]);

  const winnerLabel = leftDone && rightDone ? 'Winner' : 'Current leader';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col gap-2 overflow-auto p-3">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-surface pb-1">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="w-5 h-5 text-brand-light" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Comparison Mode</h1>
            <p className="text-xs text-text-secondary">Side-by-side algorithm analysis on identical input</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AlgoSelector value={leftAlgoId} onChange={setLeftAlgo} label="Left" />
          <span className="text-xs font-bold text-text-secondary">vs</span>
          <AlgoSelector value={rightAlgoId} onChange={setRightAlgo} label="Right" />

          <div className="flex items-center gap-2 rounded-lg border border-surface bg-surface/40 px-3 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-text-secondary" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">Size</span>
            <input
              type="range"
              min={4}
              max={16}
              value={inputSize}
              onChange={(event) => setInputSize(Number(event.target.value))}
              className="h-1 w-16 cursor-pointer accent-brand"
            />
            <span className="w-5 text-center font-mono text-xs font-bold text-white">{inputSize}</span>
          </div>

          <div className="flex items-center overflow-hidden rounded-lg border border-surface">
            {patternButtons.map(({ value, icon, label }) => (
              <button
                key={value}
                onClick={() => setDataPattern(value)}
                className={clsx(
                  'flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-all',
                  dataPattern === value
                    ? 'border-brand/30 bg-brand/20 text-brand-light'
                    : 'bg-surface/30 text-text-secondary hover:bg-surface/60'
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <Button variant="primary" onClick={handleRunComparison} className="text-sm">
            <Zap className="mr-1 h-3.5 w-3.5" />
            Run Comparison
          </Button>
        </div>
      </header>

      {hasStarted ? (
        <Card className="flex items-center justify-between gap-3 border border-surface bg-panel/50 px-4 py-3">
          <div className="text-xs text-text-secondary">
            {winnerLabel}:{' '}
            <span className="font-semibold text-white">
              {winner === 'tie'
                ? 'Tie'
                : winner === 'left'
                ? COMPARISON_SORTING_ALGOS.find((algorithm) => algorithm.id === leftAlgoId)?.name
                : COMPARISON_SORTING_ALGOS.find((algorithm) => algorithm.id === rightAlgoId)?.name}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-text-secondary">
            <span className={clsx(winner === 'left' && 'text-emerald-300')}>
              Left ops: {leftDone ? totalLeftMetrics.totalOperations : leftMetrics.totalOperations}
            </span>
            <span className={clsx(winner === 'right' && 'text-emerald-300')}>
              Right ops: {rightDone ? totalRightMetrics.totalOperations : rightMetrics.totalOperations}
            </span>
          </div>
        </Card>
      ) : null}

      <section className="grid min-h-[40vh] flex-1 grid-cols-2 gap-2">
        <PanelCard
          title={leftAlgoId}
          state={leftState}
          stepLabel={`${leftIndex + 1} / ${leftStates.length || '—'}`}
          highlightWinner={winner === 'left'}
        />
        <PanelCard
          title={rightAlgoId}
          state={rightState}
          stepLabel={`${rightIndex + 1} / ${rightStates.length || '—'}`}
          highlightWinner={winner === 'right'}
        />
      </section>

      {hasStarted ? (
        <section>
          <Card className="grid gap-3 p-3 md:grid-cols-2">
            <MetricsSummary
              label={leftAlgoId.replace(/-/g, ' ')}
              metrics={leftDone ? totalLeftMetrics : leftMetrics}
              isLeader={winner === 'left'}
            />
            <MetricsSummary
              label={rightAlgoId.replace(/-/g, ' ')}
              metrics={rightDone ? totalRightMetrics : rightMetrics}
              isLeader={winner === 'right'}
            />
          </Card>
        </section>
      ) : null}

      <section>
        <Card className="flex flex-col gap-2 p-3">
          <Slider
            min={0}
            max={Math.max(0, maxSteps - 1)}
            value={currentStep}
            onChange={(event) => jumpToStep(Number(event.target.value))}
            disabled={!hasStarted}
            label="Timeline"
            valueDisplay={hasStarted ? `${currentStep + 1} / ${maxSteps}` : '0 / 0'}
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={resetPlayback} disabled={!hasStarted} title="Reset">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={stepBackward}
                disabled={!hasStarted || currentStep === 0}
                title="Back"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              {isPlaying ? (
                <Button variant="primary" size="icon" className="mx-1 w-12" onClick={pause} title="Pause">
                  <Pause className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="icon"
                  className="mx-1 w-12"
                  onClick={play}
                  disabled={!hasStarted || (leftDone && rightDone)}
                  title="Play"
                >
                  <Play className="ml-0.5 w-5 h-5" />
                </Button>
              )}
              <Button
                variant="secondary"
                size="icon"
                onClick={stepForward}
                disabled={!hasStarted || (leftDone && rightDone)}
                title="Forward"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex w-full max-w-[200px] items-center gap-3">
              <span className="w-12 text-xs font-medium text-text-secondary">Speed</span>
              <Slider
                min={10}
                max={1000}
                step={10}
                value={1010 - playbackSpeedMs}
                onChange={(event) => setSpeed(1010 - Number(event.target.value))}
                className="flex-1"
              />
            </div>
          </div>
        </Card>
      </section>
    </motion.div>
  );
});

ComparisonMode.displayName = 'ComparisonMode';

const PanelCard = ({
  title,
  state,
  stepLabel,
  highlightWinner,
}: {
  title: string;
  state: AlgorithmState<unknown> | null;
  stepLabel: string;
  highlightWinner: boolean;
}) => (
  <Card
    className={clsx(
      'relative flex flex-col overflow-hidden border-2 p-3 transition-all',
      highlightWinner ? 'border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-surface'
    )}
  >
    {highlightWinner ? (
      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
        <Trophy className="w-3 h-3" />
        Leader
      </div>
    ) : null}
    <div className="mb-1 text-sm font-bold capitalize text-white">{title.replace(/-/g, ' ')}</div>
    <div className="mb-2 text-[10px] text-text-secondary">{state?.metadata?.message || 'Ready to compare'}</div>
    <div className="flex flex-1 items-center justify-center">
      <MiniArrayView
        data={state?.data || null}
        activeIndices={state?.activeIndices || []}
        operationType={state?.operationType || ''}
      />
    </div>
    <div className="mt-1 text-center text-[9px] text-text-secondary">Step {stepLabel}</div>
  </Card>
);

const MetricsSummary = ({
  label,
  metrics,
  isLeader,
}: {
  label: string;
  metrics: ReturnType<typeof countOperationMetrics>;
  isLeader: boolean;
}) => (
  <div
    className={clsx(
      'rounded-xl border px-4 py-3',
      isLeader ? 'border-emerald-400/40 bg-emerald-500/8' : 'border-surface bg-background/35'
    )}
  >
    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-white">{label}</div>
    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
      <MetricPill label="Steps" value={metrics.steps} />
      <MetricPill label="Compares" value={metrics.comparisons} />
      <MetricPill label="Swaps" value={metrics.swaps} />
      <MetricPill label="Ops" value={metrics.totalOperations} />
    </div>
  </div>
);

const MetricPill = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg bg-panel/60 px-2 py-2">
    <div className="text-[9px] uppercase tracking-wider text-text-secondary">{label}</div>
    <div className="mt-0.5 font-mono text-sm font-bold text-white">{value}</div>
  </div>
);
