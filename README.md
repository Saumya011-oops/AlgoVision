# AlgoVision

AlgoVision is an interactive algorithm visualizer built with React, TypeScript, Vite, Framer Motion, and Zustand. It focuses on helping learners understand how algorithms evolve step by step through synchronized visual states, explanations, metrics, and code highlighting.

## What It Includes

- Sorting visualizations for Quick Sort, Merge Sort, Bubble Sort, Selection Sort, and Heap Sort
- Graph visualizations for Dijkstra, Bellman-Ford, and Breadth-First Search
- Dynamic programming visualizations for Fibonacci DP, 0/1 Knapsack, and Longest Common Subsequence
- String algorithm visualizations for KMP and Rabin-Karp
- Single-run playback controls with timeline scrubbing and speed control
- Comparison mode for side-by-side sorting runs on the same input
- Live analytics for comparisons, swaps, visits, writes, and complexity summaries
- Input-size analytics chart showing how operations scale
- Step explanations with "why this step matters" reasoning
- Collapsible code-sync panel with live line highlighting

## Recent Upgrade Summary

This upgrade completed the remaining platform tasks by adding:

- Bellman-Ford, BFS, 0/1 Knapsack, LCS, and Rabin-Karp
- A finished comparison mode with shared playback, live metrics, and winner detection
- A performance analytics panel with operation counters and size-vs-operations charting
- A reusable algorithm catalog for descriptions, complexity info, and code snippets
- A code-sync panel and deeper explanation panel
- Shared runner/worker plumbing for consistent algorithm generation

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- React Router

## Running Locally

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
npm run lint
```

Both commands pass with the current codebase.

## Project Structure

```text
src/
  algorithms/      algorithm state generators
  components/      layout, UI, and visualization components
  data/            algorithm catalog and shared metadata
  hooks/           worker integration hooks
  pages/           landing page and dashboard
  store/           zustand stores for execution and comparison
  utils/           shared runners and metrics helpers
  workers/         algorithm worker entry point
```

## Goal

The project is designed to make algorithm behavior easier to see, compare, and reason about instead of treating execution as a black box.
