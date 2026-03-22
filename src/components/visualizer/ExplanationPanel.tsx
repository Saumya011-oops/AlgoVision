import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, BookOpen, Lightbulb } from 'lucide-react';
import { useExecutionStore } from '../../store/executionStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { getAlgorithmDefinition } from '../../data/algorithmCatalog';
import { OperationType } from '../../types/AlgorithmState';

interface ExplanationPanelProps {
  algorithmId: string;
}

const buildWhyReason = (algorithmId: string, operationType?: OperationType) => {
  const definition = getAlgorithmDefinition(algorithmId);

  switch (operationType) {
    case OperationType.COMPARE:
      return `This comparison gives ${definition.name} the information it needs before committing to a change. The algorithm is protecting its invariant before it mutates data.`;
    case OperationType.SWAP:
      return `The structure is being reordered because the current arrangement violates the rule ${definition.name} is trying to maintain. This move restores local correctness.`;
    case OperationType.OVERWRITE:
      return `A better value or placement has been proven, so the algorithm commits that result into its working state. This is where progress becomes durable.`;
    case OperationType.VISIT:
      return `The active pointer is shifting to the next meaningful state so the algorithm can continue applying the same rule on a smaller or newer frontier.`;
    case OperationType.DONE:
      return `The invariant now holds for the full input, so no more corrective work is required and the final answer can be trusted.`;
    default:
      return `Each step reflects the local rule that drives ${definition.name}. Watching those rules repeat is the fastest way to build intuition.`;
  }
};

export const ExplanationPanel = React.memo(({ algorithmId }: ExplanationPanelProps) => {
  const { getCurrentState, getMetadata } = useExecutionStore();
  const metadata = getMetadata();
  const currentState = getCurrentState();
  const whyReason = metadata?.message ? buildWhyReason(algorithmId, currentState?.operationType) : null;

  return (
    <Card className="flex flex-col bg-surface/30">
      <CardHeader className="flex flex-row items-center gap-2 border-b border-surface/50 py-2 px-3">
        <BookOpen className="w-3.5 h-3.5 text-green-400" />
        <CardTitle className="text-xs font-medium">Algorithm Insights</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 overflow-y-auto p-3">
        <AnimatePresence mode="popLayout">
          {metadata?.message ? (
            <motion.div
              key={metadata.stepNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg border border-brand/20 bg-brand/10 p-3 text-sm text-brand-light"
            >
              <span className="mr-2 font-bold">Step {metadata.stepNumber + 1}:</span>
              {metadata.message}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 rounded-lg bg-surface/50 p-3 text-sm text-text-secondary"
            >
              <AlertCircle className="mt-0.5 w-4 h-4 flex-shrink-0" />
              Press Play to see each step, why it matters, and how the algorithm’s invariant evolves over time.
            </motion.div>
          )}
        </AnimatePresence>

        {whyReason ? (
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/8 p-3">
            <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
              <Lightbulb className="w-3.5 h-3.5" />
              Why This Step Matters
            </div>
            <p className="text-sm leading-relaxed text-slate-200">{whyReason}</p>
          </div>
        ) : null}

        {metadata?.variables && Object.keys(metadata.variables).length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Local Variables
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(metadata.variables).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col rounded border border-surface bg-background p-2"
                >
                  <span className="text-[10px] font-mono text-text-secondary">{key}</span>
                  <span className="break-all font-mono text-sm font-medium text-white">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
});

ExplanationPanel.displayName = 'ExplanationPanel';
