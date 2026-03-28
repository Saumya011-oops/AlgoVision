import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { DPTableRenderer } from './DPTableRenderer';
import { SearchTreeRenderer } from './SearchTreeRenderer';
import { HeapSortRenderer } from './HeapSortRenderer';
import { KMPRenderer } from './KMPRenderer';
import { MergeSortRenderer } from './MergeSortRenderer';
import { QuickSortRenderer } from './QuickSortRenderer';
import { SortingRenderer } from './SortingRenderer';
import { TreeRenderer } from './TreeRenderer';

const genericSortingAlgorithms = ['bubble-sort', 'selection-sort'];
const treeAlgorithms = ['bst-insert', 'preorder', 'inorder', 'postorder'];
const graphAlgorithms = ['dijkstra', 'bellman-ford', 'bfs', 'dfs', 'ucs', 'dls', 'iddfs', 'bidirectional', 'best-first', 'a-star'];
const dynamicProgrammingAlgorithms = ['fibonacci-dp', 'knapsack-01', 'lcs'];
const stringAlgorithms = ['kmp', 'rabin-karp'];

export const Canvas = React.memo(() => {
  const [searchParams] = useSearchParams();
  const algorithmId = searchParams.get('algo') || 'quick-sort';

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-surface bg-background shadow-inner">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 h-full w-full">
        {algorithmId === 'quick-sort' ? (
          <QuickSortRenderer />
        ) : algorithmId === 'merge-sort' ? (
          <MergeSortRenderer />
        ) : algorithmId === 'heap-sort' ? (
          <HeapSortRenderer />
        ) : treeAlgorithms.includes(algorithmId) ? (
          <TreeRenderer />
        ) : genericSortingAlgorithms.includes(algorithmId) ? (
          <SortingRenderer />
        ) : graphAlgorithms.includes(algorithmId) ? (
          <SearchTreeRenderer />
        ) : dynamicProgrammingAlgorithms.includes(algorithmId) ? (
          <DPTableRenderer />
        ) : stringAlgorithms.includes(algorithmId) ? (
          <KMPRenderer />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-text-secondary">
            Select an algorithm to begin visualization.
          </div>
        )}
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';
