import React from 'react';
import { useExecutionStore } from '../../store/executionStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExplanationPanel = React.memo(() => {
  const { getMetadata } = useExecutionStore();
  const metadata = getMetadata();

  return (
    <Card className="flex flex-col h-full bg-surface/30">
      <CardHeader className="py-3 px-4 flex flex-row items-center gap-2 border-b border-surface/50">
        <BookOpen className="w-4 h-4 text-green-400" />
        <CardTitle className="text-sm font-medium">Algorithm Insights</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
        
        {/* Dynamic Step Explanation */}
        <AnimatePresence mode="popLayout">
          {metadata?.message ? (
            <motion.div
              key={metadata.stepNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-3 bg-brand/10 border border-brand/20 rounded-lg text-sm text-brand-light"
            >
              <span className="font-bold mr-2">Step {metadata.stepNumber + 1}:</span>
              {metadata.message}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-surface/50 rounded-lg text-sm text-text-secondary flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Press Play to see step-by-step contextual explanations of the algorithm's execution strategy.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Variables State */}
        {metadata?.variables && Object.keys(metadata.variables).length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Local Variables</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(metadata.variables).map(([key, value]) => (
                <div key={key} className="p-2 bg-background rounded border border-surface flex flex-col">
                  <span className="text-[10px] text-text-secondary font-mono">{key}</span>
                  <span className="text-sm font-medium text-white font-mono break-all">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
});
ExplanationPanel.displayName = 'ExplanationPanel';
