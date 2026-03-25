import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownAZ,
  ArrowRightLeft,
  ArrowUpAZ,
  LayoutPanelTop,
  Shuffle,
  SlidersHorizontal,
  SplitSquareVertical,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { AlgorithmIntro } from '../components/visualizer/AlgorithmIntro';
import { Canvas } from '../components/visualizer/Canvas';
import { CodeSyncPanel } from '../components/visualizer/CodeSyncPanel';
import { ComparisonMode } from '../components/visualizer/ComparisonMode';
import { ControlPanel } from '../components/visualizer/ControlPanel';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { PerformancePanel } from '../components/visualizer/PerformancePanel';
import { Button } from '../components/ui/Button';
import { getAlgorithmDefinition, isSortingAlgorithm } from '../data/algorithmCatalog';
import { useComparisonStore } from '../store/comparisonStore';
import { useExecutionStore } from '../store/executionStore';
import { DataPattern, getInputSizeRange, runAlgorithm } from '../utils/algorithmRunner';

const patternButtons: { value: DataPattern; icon: React.ReactNode; label: string }[] = [
  { value: 'random', icon: <Shuffle className="w-3 h-3" />, label: 'Random' },
  { value: 'sorted', icon: <ArrowUpAZ className="w-3 h-3" />, label: 'Sorted' },
  { value: 'reverse', icon: <ArrowDownAZ className="w-3 h-3" />, label: 'Reverse' },
];

export const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const algorithmId = searchParams.get('algo') || 'quick-sort';
  const definition = getAlgorithmDefinition(algorithmId);
  const sizeRange = getInputSizeRange(algorithmId);
  const { states, setStates, reset } = useExecutionStore();
  const { isComparisonMode, setComparisonMode } = useComparisonStore();

  const [requestedInputSize, setRequestedInputSize] = useState(() => Math.min(8, sizeRange.max));
  const [dataPattern, setDataPattern] = useState<DataPattern>('random');
  const inputSize = Math.min(Math.max(requestedInputSize, sizeRange.min), sizeRange.max);

  useEffect(() => {
    reset();
  }, [algorithmId, reset]);

  const handleGenerate = () => {
    reset();
    const result = runAlgorithm(algorithmId, { size: inputSize, pattern: dataPattern });
    setStates(result.states);
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-background relative">
      <Sidebar />

      <main className="relative flex flex-1 flex-col overflow-hidden md:pl-3">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-surface px-4 py-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-text-primary">{definition.name}</h1>
            <p className="text-xs text-text-secondary">
              {isComparisonMode
                ? 'Switch between focused study and head-to-head comparison'
                : 'Interactive simulation with synced code, explanations, and analytics'}
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-surface bg-panel/50 p-1">
            <button
              onClick={() => setComparisonMode(false)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                !isComparisonMode ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <LayoutPanelTop className="w-4 h-4" />
              Single
            </button>
            <button
              onClick={() => setComparisonMode(true)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isComparisonMode ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <SplitSquareVertical className="w-4 h-4" />
              Comparison
            </button>
          </div>
        </header>

        <div className="relative flex-1 overflow-hidden">
          {isComparisonMode ? (
            <ComparisonMode />
          ) : (
            <AnimatePresence mode="wait">
              {states.length === 0 ? (
                <motion.div
                  key="intro"
                  className="absolute inset-0 h-full w-full"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlgorithmIntro onStart={handleGenerate} algorithmId={algorithmId} />
                </motion.div>
              ) : (
                <motion.div
                  key="visualizer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex h-full flex-col gap-3 overflow-hidden p-3"
                >
                  <section className="flex flex-wrap items-center justify-between gap-3 border-b border-surface pb-1 shrink-0">
                    <div>
                      <h2 className="text-xl font-bold capitalize tracking-tight text-text-primary">
                        {definition.name}
                      </h2>
                      <p className="text-xs text-text-secondary">Interactive Simulation</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 rounded-lg border border-surface bg-surface/40 px-3 py-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-text-secondary" />
                        <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                          {sizeRange.label}
                        </span>
                        <input
                          type="range"
                          min={sizeRange.min}
                          max={sizeRange.max}
                          value={inputSize}
                          onChange={(event) => setRequestedInputSize(Number(event.target.value))}
                          className="h-1 w-16 cursor-pointer accent-brand"
                        />
                        <span className="w-5 text-center font-mono text-xs font-bold text-text-primary">
                          {inputSize}
                        </span>
                      </div>

                      {isSortingAlgorithm(algorithmId) ? (
                        <div className="flex items-center overflow-hidden rounded-lg border border-surface">
                          {patternButtons.map(({ value, icon, label }) => (
                            <button
                              key={value}
                              onClick={() => setDataPattern(value)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-all ${
                                dataPattern === value
                                  ? 'border-brand/30 bg-brand/20 text-brand-light'
                                  : 'bg-surface/30 text-text-secondary hover:bg-surface/60'
                              }`}
                            >
                              {icon}
                              {label}
                            </button>
                          ))}
                        </div>
                      ) : null}

                      <Button variant="secondary" onClick={handleGenerate}>
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Generate New Data
                      </Button>
                    </div>
                  </section>

                  <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
                    {/* Left Pane: Visuals */}
                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                      <section className="relative z-0 min-h-[40vh] lg:min-h-0 flex-1">
                        <Canvas />
                      </section>
                      <section className="shrink-0">
                        <ControlPanel />
                      </section>
                    </div>

                    {/* Right Pane: Code & Details */}
                    <div className="w-full lg:w-[400px] xl:w-[500px] flex flex-col gap-3 shrink-0 overflow-y-auto pr-1 pb-4">
                      <div className="shrink-0 flex flex-col">
                        <CodeSyncPanel algorithmId={algorithmId} />
                      </div>
                      <PerformancePanel
                        algorithmId={algorithmId}
                        inputSize={inputSize}
                        dataPattern={dataPattern}
                      />
                      <ExplanationPanel algorithmId={algorithmId} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
