import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlgorithmIntro } from '../components/visualizer/AlgorithmIntro';
import { Sidebar } from '../components/layout/Sidebar';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { ControlPanel } from '../components/visualizer/ControlPanel';
import { Canvas } from '../components/visualizer/Canvas';
import { Button } from '../components/ui/Button';
import { useExecutionStore } from '../store/executionStore';
import { generateQuickSortStates } from '../algorithms/sorting/quickSort';
import { generateMergeSortStates } from '../algorithms/sorting/mergeSort';
import { generateDijkstraStates } from '../algorithms/graph/dijkstra';
import { generateFibonacciDPStates } from '../algorithms/dp/fibonacci';
import { generateKMPStates } from '../algorithms/string/kmp';

export const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const algoId = searchParams.get('algo') || 'quick-sort';
  const { states, setStates, reset } = useExecutionStore();

  const handleGenerate = () => {
    reset();
    let result;

    switch (algoId) {
      case 'quick-sort': {
        const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
        result = generateQuickSortStates(arr);
        break;
      }
      case 'merge-sort': {
        const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
        result = generateMergeSortStates(arr);
        break;
      }
      case 'dijkstra': {
        result = generateDijkstraStates(0);
        break;
      }
      case 'fibonacci-dp': {
        result = generateFibonacciDPStates(12);
        break;
      }
      case 'kmp': {
        result = generateKMPStates();
        break;
      }
      default: {
        const arr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 90) + 10);
        result = generateQuickSortStates(arr);
      }
    }

    setStates(result.states);
  };

  // Reset when algorithm changes to show intro screen
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoId]);

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {states.length === 0 ? (
            <motion.div 
               key="intro"
               className="h-full w-full absolute inset-0"
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.3 }}
            >
              <AlgorithmIntro onStart={handleGenerate} title={algoId} />
            </motion.div>
          ) : (
            <motion.div 
               key="visualizer"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="h-full flex flex-col gap-2 p-3 overflow-auto absolute inset-0"
            >
              {/* Header */}
              <header className="flex items-center justify-between pb-1 border-b border-surface shrink-0">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white capitalize">
                    {algoId.replace(/-/g, ' ')}
                  </h1>
                  <p className="text-xs text-text-secondary">Interactive Simulation</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={handleGenerate}>
                    Generate New Data
                  </Button>
                </div>
              </header>
              
              {/* Visualization Canvas - takes majority of space */}
              <section className="flex-1 relative z-0 min-h-[55vh]">
                <Canvas />
              </section>
              
              {/* Controls */}
              <section className="shrink-0">
                <ControlPanel />
              </section>

              {/* Algorithm Insights */}
              <section className="shrink-0">
                <ExplanationPanel />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
