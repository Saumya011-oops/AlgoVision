import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, HardDrive, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface AlgoInfo {
  description: string;
  bestTime: string;
  avgTime: string;
  worstTime: string;
  space: string;
  spaceNote: string;
}

const ALGO_INFO: Record<string, AlgoInfo> = {
  'quick-sort': {
    description: "Quick Sort is a highly efficient, divide-and-conquer sorting algorithm. It works by picking a 'pivot' element and partitioning the array so that smaller elements move to the left and larger to the right, sorting recursively.",
    bestTime: 'O(N log N)', avgTime: 'O(N log N)', worstTime: 'O(N²)',
    space: 'O(log N)', spaceNote: 'call stack overhead',
  },
  'merge-sort': {
    description: "Merge Sort divides the array into halves, recursively sorts each half, and then merges the sorted halves. It guarantees O(N log N) performance in all cases, making it highly predictable.",
    bestTime: 'O(N log N)', avgTime: 'O(N log N)', worstTime: 'O(N log N)',
    space: 'O(N)', spaceNote: 'temporary arrays during merge',
  },
  'dijkstra': {
    description: "Dijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It greedily selects the unvisited node with the smallest distance.",
    bestTime: 'O((V+E) log V)', avgTime: 'O((V+E) log V)', worstTime: 'O(V²)',
    space: 'O(V)', spaceNote: 'distance and visited arrays',
  },
  'fibonacci-dp': {
    description: "Fibonacci using Dynamic Programming computes F(n) bottom-up by storing previously computed values in a table, avoiding the exponential redundancy of naive recursion. A classic introduction to DP.",
    bestTime: 'O(N)', avgTime: 'O(N)', worstTime: 'O(N)',
    space: 'O(N)', spaceNote: 'DP table of size N',
  },
  'kmp': {
    description: "The Knuth-Morris-Pratt (KMP) algorithm searches for a pattern within a text in linear time by preprocessing the pattern into an LPS (Longest Proper Prefix Suffix) table to skip redundant comparisons.",
    bestTime: 'O(N+M)', avgTime: 'O(N+M)', worstTime: 'O(N+M)',
    space: 'O(M)', spaceNote: 'LPS table for pattern',
  },
};

interface IntroProps {
  onStart: () => void;
  title: string;
}

export const AlgorithmIntro = ({ onStart, title }: IntroProps) => {
  const info = ALGO_INFO[title] || ALGO_INFO['quick-sort'];

  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-background">
      <div className="max-w-4xl w-full">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="relative"
        >
          {/* Background Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand to-brand-light blur-2xl opacity-20" />
          
          <Card className="relative p-10 md:p-14 bg-panel/90 shadow-2xl overflow-hidden border-surface border-2">
            
            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand-light text-sm font-semibold border border-brand/20">
                  <BookOpen className="w-4 h-4" />
                  Algorithm Overview
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight capitalize tracking-tight">
                  {title.replace(/-/g, ' ')}
                </h1>
                
                <p className="text-lg text-text-secondary leading-relaxed font-medium">
                  {info.description}
                </p>

                <div className="pt-4">
                  <Button size="lg" onClick={onStart} className="w-full md:w-auto px-8 h-14 text-lg font-bold shadow-brand/30 shadow-xl hover:shadow-brand/50 hover:-translate-y-1 transition-all">
                    Start Visualization <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4 justify-center">
                <div className="bg-surface/50 p-5 rounded-2xl border border-surface flex items-start gap-4 shadow-inner">
                  <div className="p-3 bg-red-900/30 text-red-400 rounded-xl shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Time Complexity</h3>
                    <div className="flex flex-col gap-1 mt-2 font-mono text-sm">
                      <div className="flex justify-between text-text-secondary gap-4"><span>Best:</span> <span className="text-green-400">{info.bestTime}</span></div>
                      <div className="flex justify-between text-text-secondary gap-4"><span>Average:</span> <span className="text-yellow-400">{info.avgTime}</span></div>
                      <div className="flex justify-between text-text-secondary gap-4"><span>Worst:</span> <span className="text-red-400">{info.worstTime}</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface/50 p-5 rounded-2xl border border-surface flex items-start gap-4 shadow-inner">
                  <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl shrink-0">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Space Complexity</h3>
                    <div className="mt-2 font-mono text-sm text-blue-300">
                      {info.space} <span className="text-text-secondary font-sans text-xs ml-2">({info.spaceNote})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
AlgorithmIntro.displayName = 'AlgorithmIntro';
