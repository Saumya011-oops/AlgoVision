import React from 'react';
import { useExecutionStore } from '../../store/executionStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Code2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CodePanelProps {
  codeString: string;
}

export const CodePanel = React.memo(({ codeString }: CodePanelProps) => {
  const { getCurrentState } = useExecutionStore();
  const state = getCurrentState();
  const activeLine = state?.highlightedLine;

  const codeLines = codeString.split('\n');

  return (
    <Card className="flex flex-col h-full bg-[#1e1e1e] border-surface">
      <CardHeader className="py-3 px-4 flex flex-row items-center gap-2 border-b border-surface-border/50">
        <Code2 className="w-4 h-4 text-brand-light" />
        <CardTitle className="text-sm font-medium">Source Code Tracker</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto flex-1 font-mono text-xs md:text-sm">
        <div className="py-4">
          {codeLines.map((line, idx) => {
            const isHighlighted = activeLine === idx;
            return (
              <div 
                key={idx}
                className={twMerge(
                  clsx(
                    "px-4 py-0.5 whitespace-pre border-l-2 transition-colors duration-150",
                    isHighlighted 
                      ? "bg-brand/20 border-brand text-brand-light font-medium" 
                      : "border-transparent text-[#d4d4d4]"
                  )
                )}
              >
                <span className="text-[#858585] w-6 inline-block select-none">{idx + 1}</span>
                {line}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
CodePanel.displayName = 'CodePanel';
