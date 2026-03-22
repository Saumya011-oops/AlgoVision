import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { ChevronDown, Code2 } from 'lucide-react';
import { getAlgorithmDefinition } from '../../data/algorithmCatalog';
import { useExecutionStore } from '../../store/executionStore';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface CodeSyncPanelProps {
  algorithmId: string;
}

export const CodeSyncPanel = React.memo(({ algorithmId }: CodeSyncPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { getCurrentState } = useExecutionStore();
  const currentState = getCurrentState();
  const definition = getAlgorithmDefinition(algorithmId);

  const activeLine = useMemo(() => {
    if (!currentState) {
      return null;
    }

    if (typeof currentState.highlightedLine === 'number') {
      return currentState.highlightedLine;
    }

    const fallbackLine = definition.defaultHighlightedLines[currentState.operationType];
    return typeof fallbackLine === 'number' ? fallbackLine - 1 : null;
  }, [currentState, definition.defaultHighlightedLines]);

  const codeLines = useMemo(() => definition.code.split('\n'), [definition.code]);

  return (
    <Card className="bg-surface/30">
      <CardHeader className="flex flex-row items-center gap-2 border-b border-surface/50 py-2 px-3">
        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
        <CardTitle className="text-xs font-medium">Code Sync</CardTitle>
        <span className="ml-auto text-[10px] text-text-secondary">
          {activeLine !== null ? `Line ${activeLine + 1}` : 'Waiting for execution'}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsExpanded((value) => !value)}
          title={isExpanded ? 'Collapse code panel' : 'Expand code panel'}
        >
          <ChevronDown
            className={clsx('w-4 h-4 transition-transform', isExpanded ? 'rotate-0' : '-rotate-90')}
          />
        </Button>
      </CardHeader>

      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="code"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="max-h-[340px] overflow-y-auto p-0 font-mono text-xs">
              <div className="py-2">
                {codeLines.map((line, index) => {
                  const isHighlighted = activeLine === index;
                  return (
                    <div
                      key={`${algorithmId}-${index}`}
                      className={clsx(
                        'border-l-2 px-3 py-1 whitespace-pre transition-colors',
                        isHighlighted
                          ? 'border-cyan-400 bg-cyan-500/12 text-cyan-100'
                          : 'border-transparent text-slate-300'
                      )}
                    >
                      <span className="mr-3 inline-block w-6 select-none text-right text-slate-500">
                        {index + 1}
                      </span>
                      {line}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
});

CodeSyncPanel.displayName = 'CodeSyncPanel';
