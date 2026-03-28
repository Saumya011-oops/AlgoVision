import React from 'react';
import { AlgorithmState } from '../../types/AlgorithmState';
import { VisualizationStateContext } from '../../contexts/VisualizationStateContext';
import { SortingRenderer } from './SortingRenderer';
import { HeapSortRenderer } from './HeapSortRenderer';
import { QuickSortRenderer } from './QuickSortRenderer';
import { MergeSortRenderer } from './MergeSortRenderer';
import { TreeRenderer } from './TreeRenderer';
import { SearchTreeRenderer } from './SearchTreeRenderer';

const graphAlgorithms = ['dijkstra','bellman-ford','bfs','dfs','ucs','dls','iddfs','bidirectional','best-first','a-star'];
const treeAlgorithms = ['preorder','inorder','postorder'];

interface ComparisonCanvasProps {
  algorithmId: string;
  state: AlgorithmState<unknown> | null;
}

export const ComparisonCanvas = React.memo(({ algorithmId, state }: ComparisonCanvasProps) => {
  const contextValue = React.useMemo(
    () => ({ getCurrentState: () => state }),
    [state]
  );

  const renderContent = () => {
    if (algorithmId === 'quick-sort') return <QuickSortRenderer />;
    if (algorithmId === 'merge-sort') return <MergeSortRenderer />;
    if (algorithmId === 'heap-sort') return <HeapSortRenderer />;
    if (treeAlgorithms.includes(algorithmId)) return <TreeRenderer />;
    if (graphAlgorithms.includes(algorithmId)) return <SearchTreeRenderer />;
    return <SortingRenderer />;
  };

  return (
    <VisualizationStateContext.Provider value={contextValue}>
      <div className="relative w-full h-full overflow-hidden rounded-xl border border-surface bg-background">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10 h-full w-full">
          {renderContent()}
        </div>
      </div>
    </VisualizationStateContext.Provider>
  );
});

ComparisonCanvas.displayName = 'ComparisonCanvas';
