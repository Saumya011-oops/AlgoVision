import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ArrowRightLeft, BarChart3, PenSquare, TrendingUp, Zap, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useExecutionStore } from '../../store/executionStore';
import { getAlgorithmDefinition } from '../../data/algorithmCatalog';
import { DataPattern, getAnalyticsSampleSizes, runAlgorithm } from '../../utils/algorithmRunner';
import { countOperationMetrics } from '../../utils/metrics';

interface PerformancePanelProps {
  algorithmId: string;
  inputSize: number;
  dataPattern: DataPattern;
}

export const PerformancePanel = React.memo(
  ({ algorithmId, inputSize, dataPattern }: PerformancePanelProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { states, currentIndex } = useExecutionStore();
    const definition = getAlgorithmDefinition(algorithmId);

    const liveMetrics = useMemo(
      () => countOperationMetrics(states, states.length > 0 ? currentIndex : -1),
      [states, currentIndex]
    );

    const chartSamples = useMemo(() => {
      return getAnalyticsSampleSizes(algorithmId).map((size) => {
        const result = runAlgorithm(algorithmId, { size, pattern: dataPattern });
        const metrics = countOperationMetrics(result.states);
        return {
          size,
          operations: Math.max(metrics.totalOperations, result.states.length),
        };
      });
    }, [algorithmId, dataPattern]);

    const maxOperations = Math.max(...chartSamples.map((sample) => sample.operations), 1);
    const progress = states.length > 0 ? (((currentIndex + 1) / states.length) * 100).toFixed(0) : '0';

    return (
      <Card className="bg-surface/30">
        <CardHeader className="flex flex-row items-center gap-2 border-b border-surface/50 py-2 px-3">
          <BarChart3 className="w-3.5 h-3.5 text-brand" />
          <CardTitle className="text-xs font-medium text-text-primary">Performance Analytics</CardTitle>
          <span className="ml-auto mr-1 text-[9px] font-mono text-text-secondary">{progress}% complete</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded((value) => !value)}
            title={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            <ChevronDown
              className={clsx('w-4 h-4 transition-transform text-text-secondary', isExpanded ? 'rotate-0' : '-rotate-90')}
            />
          </Button>
        </CardHeader>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="perf-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="grid gap-3 p-3 lg:grid-cols-[1.1fr_1fr]">
                <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1.5">
              <ComplexityCell label="Best" value={definition.bestTime} color="text-emerald-400" />
              <ComplexityCell label="Average" value={definition.avgTime} color="text-yellow-400" />
              <ComplexityCell label="Worst" value={definition.worstTime} color="text-red-400" />
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <MetricCell
                icon={<ArrowRightLeft className="w-3 h-3" />}
                label="Compares"
                value={liveMetrics.comparisons}
                color="text-yellow-400"
              />
              <MetricCell
                icon={<Zap className="w-3 h-3" />}
                label="Swaps"
                value={liveMetrics.swaps}
                color="text-orange-400"
              />
              <MetricCell
                icon={<TrendingUp className="w-3 h-3" />}
                label="Visits"
                value={liveMetrics.visits}
                color="text-blue-400"
              />
              <MetricCell
                icon={<PenSquare className="w-3 h-3" />}
                label="Writes"
                value={liveMetrics.writes}
                color="text-cyan-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {definition.facts.map((fact) => (
                <div key={fact.label} className="rounded bg-background/50 px-2 py-2">
                  <div className="text-[9px] uppercase tracking-wider text-text-secondary">{fact.label}</div>
                  <div className="mt-0.5 text-xs font-semibold text-text-primary">{fact.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-surface/60 bg-background/35 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                  Input Size vs Operations
                </h4>
                <p className="text-[10px] text-text-secondary">
                  Estimated from regenerated runs for {definition.name}
                </p>
              </div>
              <span className="text-[10px] font-mono text-cyan-300">
                current size {inputSize}
              </span>
            </div>

            <div className="h-40 w-full">
              <svg viewBox="0 0 320 150" className="h-full w-full">
                <line x1="28" y1="124" x2="302" y2="124" stroke="#3f3f46" strokeWidth="1" />
                <line x1="28" y1="16" x2="28" y2="124" stroke="#3f3f46" strokeWidth="1" />

                {chartSamples.map((sample, index) => {
                  const x = 28 + (index * 274) / Math.max(chartSamples.length - 1, 1);
                  const y = 124 - (sample.operations / maxOperations) * 96;
                  return (
                    <g key={`${sample.size}-${sample.operations}`}>
                      <circle cx={x} cy={y} r="3.5" fill="#67e8f9" />
                      <text x={x} y="140" textAnchor="middle" fontSize="9" fill="#a1a1aa">
                        {sample.size}
                      </text>
                      <text x={x} y={Math.max(12, y - 8)} textAnchor="middle" fontSize="9" fill="#e4e4e7">
                        {sample.operations}
                      </text>
                    </g>
                  );
                })}

                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  points={chartSamples
                    .map((sample, index) => {
                      const x = 28 + (index * 274) / Math.max(chartSamples.length - 1, 1);
                      const y = 124 - (sample.operations / maxOperations) * 96;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>
          </div>
        </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  }
);

PerformancePanel.displayName = 'PerformancePanel';

const ComplexityCell = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="rounded bg-background/50 px-2 py-1.5 text-center">
    <div className="text-[9px] uppercase tracking-wider text-text-secondary">{label}</div>
    <div className={clsx('mt-0.5 text-xs font-mono font-bold', color)}>{value}</div>
  </div>
);

const MetricCell = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) => (
  <div className="rounded bg-background/50 px-2 py-1.5 text-center">
    <div className="flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider text-text-secondary">
      <span className={color}>{icon}</span>
      {label}
    </div>
    <motion.div
      key={`${label}-${value}`}
      initial={{ scale: 1.15, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx('mt-0.5 text-sm font-mono font-black', color)}
    >
      {value}
    </motion.div>
  </div>
);
