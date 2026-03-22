import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { QuickSortRenderer } from './QuickSortRenderer';
import { MergeSortRenderer } from './MergeSortRenderer';
import { GraphRenderer } from './GraphRenderer';
import { DPTableRenderer } from './DPTableRenderer';
import { KMPRenderer } from './KMPRenderer';

export const Canvas = React.memo(() => {
  const [searchParams] = useSearchParams();
  const algoId = searchParams.get('algo') || 'quick-sort';

  return (
    <div className="w-full h-full flex items-center justify-center bg-background rounded-xl border border-surface shadow-inner relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Renderer Router */}
      <div className="relative z-10 w-full h-full">
        {algoId === 'quick-sort' ? (
          <QuickSortRenderer />
        ) : algoId === 'merge-sort' ? (
          <MergeSortRenderer />
        ) : algoId === 'dijkstra' || algoId === 'a-star' ? (
          <GraphRenderer />
        ) : algoId === 'fibonacci-dp' ? (
          <DPTableRenderer />
        ) : algoId === 'kmp' ? (
          <KMPRenderer />
        ) : (
          <div className="p-8 text-center text-text-secondary h-full flex items-center justify-center">
            Select an algorithm to begin visualization.
          </div>
        )}
      </div>
    </div>
  );
});
Canvas.displayName = 'Canvas';
