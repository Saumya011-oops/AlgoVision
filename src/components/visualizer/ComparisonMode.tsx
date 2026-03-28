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
import { useComparisonStore } from '../../store/comparisonStore';
import { DataPattern, generateArray } from '../../utils/algorithmRunner';
import { generateBubbleSortStates } from '../../algorithms/sorting/bubbleSort';
import { generateHeapSortStates } from '../../algorithms/sorting/heapSort';
import { generateMergeSortStates } from '../../algorithms/sorting/mergeSort';
import { generateQuickSortStates } from '../../algorithms/sorting/quickSort';
import { generateSelectionSortStates } from '../../algorithms/sorting/selectionSort';
import { generateBFSStates } from '../../algorithms/graph/bfs';
import { generateDFSStates } from '../../algorithms/graph/dfs';
import { generateDijkstraStates } from '../../algorithms/graph/dijkstra';
import { generateBellmanFordStates } from '../../algorithms/graph/bellmanFord';
import { generateUCSStates } from '../../algorithms/graph/ucs';
import { generateDLSStates } from '../../algorithms/graph/dls';
import { generateIDDFSStates } from '../../algorithms/graph/iddfs';
import { generateBidirectionalStates } from '../../algorithms/graph/bidirectional';
import { generateBestFirstStates } from '../../algorithms/graph/bestFirst';
import { generateAStarStates } from '../../algorithms/graph/aStar';
import { generatePreorderStates } from '../../algorithms/tree/preorder';
import { generateInorderStates } from '../../algorithms/tree/inorder';
import { generatePostorderStates } from '../../algorithms/tree/postorder';
import { countOperationMetrics } from '../../utils/metrics';
import { AlgorithmState } from '../../types/AlgorithmState';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ComparisonCanvas } from './ComparisonCanvas';

// ─── Algorithm groups ────────────────────────────────────────────────────────
// Only algorithms that have logical comparisons within their group are included.
// BST Insert, DP, String algorithms are excluded — no meaningful same-category peer.

const GROUPS: Record<string, { label: string; algos: { id: string; name: string }[] }> = {
  sorting: {
    label: 'Sorting',
    algos: [
      { id: 'bubble-sort',   name: 'Bubble Sort' },
      { id: 'selection-sort',name: 'Selection Sort' },
      { id: 'heap-sort',     name: 'Heap Sort' },
      { id: 'quick-sort',    name: 'Quick Sort' },
      { id: 'merge-sort',    name: 'Merge Sort' },
    ],
  },
  'graph-search': {
    label: 'Graph Search',
    algos: [
      { id: 'bfs',           name: 'Breadth-First Search' },
      { id: 'dfs',           name: 'Depth-First Search' },
      { id: 'dijkstra',      name: 'Dijkstra' },
      { id: 'bellman-ford',  name: 'Bellman-Ford' },
      { id: 'ucs',           name: 'Uniform Cost Search' },
      { id: 'best-first',    name: 'Best-First Search' },
      { id: 'a-star',        name: 'A* Search' },
      { id: 'dls',           name: 'Depth-Limited Search' },
      { id: 'iddfs',         name: 'Iterative Deepening DFS' },
      { id: 'bidirectional', name: 'Bidirectional Search' },
    ],
  },
  'tree-traversal': {
    label: 'Tree Traversal',
    algos: [
      { id: 'preorder',  name: 'Preorder' },
      { id: 'inorder',   name: 'Inorder' },
      { id: 'postorder', name: 'Postorder' },
    ],
  },
};

const getGroupId = (algoId: string): string | null => {
  for (const [groupId, group] of Object.entries(GROUPS)) {
    if (group.algos.some(a => a.id === algoId)) return groupId;
  }
  return null;
};

// ─── Run algorithm ────────────────────────────────────────────────────────────

const runAlgo = (id: string, size: number, sharedArr?: number[]) => {
  const arr = sharedArr ?? generateArray(size, 'random');
  const gs = Math.max(5, Math.min(8, size));
  const ts = Math.max(5, Math.min(12, size));
  switch (id) {
    case 'bubble-sort':    return generateBubbleSortStates(arr);
    case 'selection-sort': return generateSelectionSortStates(arr);
    case 'heap-sort':      return generateHeapSortStates(arr);
    case 'quick-sort':     return generateQuickSortStates(arr);
    case 'merge-sort':     return generateMergeSortStates(arr);
    case 'bfs':            return generateBFSStates(0, gs);
    case 'dfs':            return generateDFSStates(0, gs);
    case 'dijkstra':       return generateDijkstraStates(0, gs);
    case 'bellman-ford':   return generateBellmanFordStates(0, gs);
    case 'ucs':            return generateUCSStates(0, gs);
    case 'dls':            return generateDLSStates(0, gs, Math.floor(gs / 2));
    case 'iddfs':          return generateIDDFSStates(0, gs);
    case 'bidirectional':  return generateBidirectionalStates(0, gs);
    case 'best-first':     return generateBestFirstStates(0, gs);
    case 'a-star':         return generateAStarStates(0, gs);
    case 'preorder':       return generatePreorderStates(ts);
    case 'inorder':        return generateInorderStates(ts);
    case 'postorder':      return generatePostorderStates(ts);
    default:               return generateBubbleSortStates(arr);
  }
};

// ─── Pattern buttons (sorting only) ──────────────────────────────────────────
const patternButtons: { value: DataPattern; icon: React.ReactNode; label: string }[] = [
  { value: 'random',  icon: <Shuffle className="w-3 h-3" />,   label: 'Random' },
  { value: 'sorted',  icon: <ArrowUpAZ className="w-3 h-3" />, label: 'Sorted' },
  { value: 'reverse', icon: <ArrowDownAZ className="w-3 h-3" />, label: 'Reverse' },
];

// ─── AlgoSelector ─────────────────────────────────────────────────────────────
const AlgoSelector = ({
  value,
  onChange,
  compatibleGroupId,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  compatibleGroupId: string | null;
  label: string;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">{label}</span>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="cursor-pointer rounded-lg border border-surface bg-surface/60 px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
    >
      {Object.entries(GROUPS).map(([gid, group]) => {
        // If we have a compatibility constraint, disable groups that don't match
        if (compatibleGroupId && gid !== compatibleGroupId) return null;
        return (
          <optgroup key={gid} label={group.label}>
            {group.algos.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </optgroup>
        );
      })}
    </select>
  </div>
);

// ─── Metric summary ───────────────────────────────────────────────────────────
const MetricsSummary = ({
  label,
  metrics,
  isLeader,
}: {
  label: string;
  metrics: ReturnType<typeof countOperationMetrics>;
  isLeader: boolean;
}) => (
  <div className={clsx('rounded-xl border px-4 py-3', isLeader ? 'border-emerald-400/40 bg-emerald-500/8' : 'border-surface bg-background/35')}>
    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-primary">{label}</div>
    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
      {[
        { label: 'Steps', value: metrics.steps },
        { label: 'Compares', value: metrics.comparisons },
        { label: 'Swaps', value: metrics.swaps },
        { label: 'Ops', value: metrics.totalOperations },
      ].map(m => (
        <div key={m.label} className="rounded-lg bg-panel/60 px-2 py-2">
          <div className="text-[9px] uppercase tracking-wider text-text-secondary">{m.label}</div>
          <div className="mt-0.5 font-mono text-sm font-bold text-text-primary">{m.value}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
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

  const leftGroupId  = getGroupId(leftAlgoId);
  const rightGroupId = getGroupId(rightAlgoId);
  const isSortingGroup = leftGroupId === 'sorting';

  // Auto-fix right algo when left changes to an incompatible group
  const handleSetLeftAlgo = useCallback((id: string) => {
    setLeftAlgo(id);
    const newGroupId = getGroupId(id);
    if (newGroupId && newGroupId !== getGroupId(rightAlgoId)) {
      const firstOther = GROUPS[newGroupId].algos.find(a => a.id !== id);
      if (firstOther) setRightAlgo(firstOther.id);
    }
  }, [rightAlgoId, setLeftAlgo, setRightAlgo]);

  const handleSetRightAlgo = useCallback((id: string) => {
    setRightAlgo(id);
    const newGroupId = getGroupId(id);
    if (newGroupId && newGroupId !== getGroupId(leftAlgoId)) {
      const firstOther = GROUPS[newGroupId].algos.find(a => a.id !== id);
      if (firstOther) setLeftAlgo(firstOther.id);
    }
  }, [leftAlgoId, setLeftAlgo, setRightAlgo]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && (!leftDone || !rightDone)) {
      interval = setInterval(stepForward, playbackSpeedMs);
    } else if (isPlaying && leftDone && rightDone) {
      pause();
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying, leftDone, rightDone, playbackSpeedMs, stepForward, pause]);

  const handleRun = useCallback(() => {
    resetPlayback();
    if (isSortingGroup) {
      const sharedArr = generateArray(inputSize, dataPattern);
      setLeftStates(runAlgo(leftAlgoId, inputSize, [...sharedArr]).states);
      setRightStates(runAlgo(rightAlgoId, inputSize, [...sharedArr]).states);
    } else {
      setLeftStates(runAlgo(leftAlgoId, inputSize).states);
      setRightStates(runAlgo(rightAlgoId, inputSize).states);
    }
  }, [dataPattern, inputSize, isSortingGroup, leftAlgoId, resetPlayback, rightAlgoId, setLeftStates, setRightStates]);

  const leftState  = (leftStates[leftIndex]   ?? null) as AlgorithmState<unknown> | null;
  const rightState = (rightStates[rightIndex]  ?? null) as AlgorithmState<unknown> | null;

  const winner = useMemo(() => {
    if (!hasStarted) return null;
    const ls = leftDone  ? totalLeftMetrics.totalOperations  : leftMetrics.totalOperations;
    const rs = rightDone ? totalRightMetrics.totalOperations : rightMetrics.totalOperations;
    if (ls === rs) return 'tie';
    return ls < rs ? 'left' : 'right';
  }, [hasStarted, leftDone, leftMetrics.totalOperations, rightDone, rightMetrics.totalOperations, totalLeftMetrics.totalOperations, totalRightMetrics.totalOperations]);

  const getName = (id: string) => {
    for (const group of Object.values(GROUPS)) {
      const found = group.algos.find(a => a.id === id);
      if (found) return found.name;
    }
    return id.replace(/-/g, ' ');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col gap-2 overflow-auto p-3">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-surface pb-1">
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="w-5 h-5 text-brand-light" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">Comparison Mode</h1>
            <p className="text-xs text-text-secondary">Side-by-side algorithm analysis — only same-category algorithms can be compared</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AlgoSelector value={leftAlgoId}  onChange={handleSetLeftAlgo}  compatibleGroupId={null}        label="Left" />
          <span className="text-xs font-bold text-text-secondary">vs</span>
          <AlgoSelector value={rightAlgoId} onChange={handleSetRightAlgo} compatibleGroupId={leftGroupId} label="Right" />

          {/* Size slider */}
          <div className="flex items-center gap-2 rounded-lg border border-surface bg-surface/40 px-3 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-text-secondary" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">Size</span>
            <input type="range" min={4} max={16} value={inputSize}
              onChange={e => setInputSize(Number(e.target.value))}
              className="h-1 w-16 cursor-pointer accent-brand" />
            <span className="w-5 text-center font-mono text-xs font-bold text-text-primary">{inputSize}</span>
          </div>

          {/* Pattern (sorting only) */}
          {isSortingGroup && (
            <div className="flex items-center overflow-hidden rounded-lg border border-surface">
              {patternButtons.map(({ value, icon, label }) => (
                <button key={value} onClick={() => setDataPattern(value)}
                  className={clsx('flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-all',
                    dataPattern === value ? 'border-brand/30 bg-brand/20 text-brand-light' : 'bg-surface/30 text-text-secondary hover:bg-surface/60')}>
                  {icon}{label}
                </button>
              ))}
            </div>
          )}

          <Button variant="primary" onClick={handleRun} className="text-sm">
            <Zap className="mr-1 h-3.5 w-3.5" />
            Run Comparison
          </Button>
        </div>
      </header>

      {/* Group mismatch warning */}
      {leftGroupId && rightGroupId && leftGroupId !== rightGroupId && (
        <div className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs text-orange-300">
          ⚠ These algorithms are from different categories and cannot be meaningfully compared. Select two algorithms from the same category.
        </div>
      )}

      {/* Winner bar */}
      {hasStarted && (
        <Card className="flex items-center justify-between gap-3 border border-surface bg-panel/50 px-4 py-3">
          <div className="text-xs text-text-secondary">
            {leftDone && rightDone ? 'Winner' : 'Current leader'}:{' '}
            <span className="font-semibold text-text-primary">
              {winner === 'tie' ? 'Tie' : winner === 'left' ? getName(leftAlgoId) : getName(rightAlgoId)}
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
      )}

      {/* Visualization panels */}
      <section className="grid min-h-[45vh] flex-1 grid-cols-2 gap-2">
        {/* Left panel */}
        <Card className={clsx('relative flex flex-col overflow-hidden border-2 transition-all',
          winner === 'left' ? 'border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-surface')}>
          {winner === 'left' && (
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <Trophy className="w-3 h-3" /> Leader
            </div>
          )}
          <div className="shrink-0 px-3 pt-2 pb-1">
            <div className="text-sm font-bold capitalize text-text-primary">{getName(leftAlgoId)}</div>
            <div className="text-[10px] text-text-secondary truncate">{leftState?.metadata?.message || (hasStarted ? '' : 'Click "Run Comparison" to start')}</div>
          </div>
          <div className="flex-1 overflow-hidden">
            {hasStarted ? (
              <ComparisonCanvas algorithmId={leftAlgoId} state={leftState} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                Click "Run Comparison" to start
              </div>
            )}
          </div>
          <div className="shrink-0 px-3 py-1 text-center text-[9px] text-text-secondary">
            Step {leftIndex + 1} / {leftStates.length || '—'}
          </div>
        </Card>

        {/* Right panel */}
        <Card className={clsx('relative flex flex-col overflow-hidden border-2 transition-all',
          winner === 'right' ? 'border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-surface')}>
          {winner === 'right' && (
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <Trophy className="w-3 h-3" /> Leader
            </div>
          )}
          <div className="shrink-0 px-3 pt-2 pb-1">
            <div className="text-sm font-bold capitalize text-text-primary">{getName(rightAlgoId)}</div>
            <div className="text-[10px] text-text-secondary truncate">{rightState?.metadata?.message || (hasStarted ? '' : 'Click "Run Comparison" to start')}</div>
          </div>
          <div className="flex-1 overflow-hidden">
            {hasStarted ? (
              <ComparisonCanvas algorithmId={rightAlgoId} state={rightState} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                Click "Run Comparison" to start
              </div>
            )}
          </div>
          <div className="shrink-0 px-3 py-1 text-center text-[9px] text-text-secondary">
            Step {rightIndex + 1} / {rightStates.length || '—'}
          </div>
        </Card>
      </section>

      {/* Metrics */}
      {hasStarted && (
        <section>
          <Card className="grid gap-3 p-3 md:grid-cols-2">
            <MetricsSummary label={getName(leftAlgoId)}  metrics={leftDone  ? totalLeftMetrics  : leftMetrics}  isLeader={winner === 'left'} />
            <MetricsSummary label={getName(rightAlgoId)} metrics={rightDone ? totalRightMetrics : rightMetrics} isLeader={winner === 'right'} />
          </Card>
        </section>
      )}

      {/* Timeline controls */}
      <section>
        <Card className="flex flex-col gap-2 p-3">
          <Slider min={0} max={Math.max(0, maxSteps - 1)} value={currentStep}
            onChange={e => jumpToStep(Number(e.target.value))}
            disabled={!hasStarted} label="Timeline"
            valueDisplay={hasStarted ? `${currentStep + 1} / ${maxSteps}` : '0 / 0'} />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={resetPlayback} disabled={!hasStarted} title="Reset">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={stepBackward} disabled={!hasStarted || currentStep === 0} title="Back">
                <SkipBack className="w-4 h-4" />
              </Button>
              {isPlaying ? (
                <Button variant="primary" size="icon" className="mx-1 w-12" onClick={pause} title="Pause">
                  <Pause className="w-5 h-5" />
                </Button>
              ) : (
                <Button variant="primary" size="icon" className="mx-1 w-12" onClick={play}
                  disabled={!hasStarted || (leftDone && rightDone)} title="Play">
                  <Play className="ml-0.5 w-5 h-5" />
                </Button>
              )}
              <Button variant="secondary" size="icon" onClick={stepForward}
                disabled={!hasStarted || (leftDone && rightDone)} title="Forward">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex w-full max-w-[200px] items-center gap-3">
              <span className="w-12 text-xs font-medium text-text-secondary">Speed</span>
              <Slider min={10} max={1000} step={10}
                value={1010 - playbackSpeedMs}
                onChange={e => setSpeed(1010 - Number(e.target.value))}
                className="flex-1" />
            </div>
          </div>
        </Card>
      </section>
    </motion.div>
  );
});

ComparisonMode.displayName = 'ComparisonMode';
