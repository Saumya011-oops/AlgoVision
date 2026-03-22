import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, HardDrive } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { getAlgorithmDefinition } from '../../data/algorithmCatalog';

interface IntroProps {
  onStart: () => void;
  algorithmId: string;
}

export const AlgorithmIntro = ({ onStart, algorithmId }: IntroProps) => {
  const definition = getAlgorithmDefinition(algorithmId);

  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-brand to-brand-light opacity-20 blur-2xl" />

          <Card className="relative overflow-hidden border-2 border-surface bg-panel/90 p-10 shadow-2xl md:p-14">
            <div className="relative z-10 grid gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-sm font-semibold text-brand-light">
                  <BookOpen className="w-4 h-4" />
                  Algorithm Overview
                </div>

                <h1 className="text-4xl font-black capitalize tracking-tight text-white md:text-5xl">
                  {definition.name}
                </h1>

                <p className="text-lg font-medium leading-relaxed text-text-secondary">
                  {definition.description}
                </p>

                <div className="pt-4">
                  <Button
                    size="lg"
                    onClick={onStart}
                    className="h-14 w-full px-8 text-lg font-bold shadow-xl shadow-brand/30 transition-all hover:-translate-y-1 hover:shadow-brand/50 md:w-auto"
                  >
                    Start Visualization <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4">
                <div className="flex items-start gap-4 rounded-2xl border border-surface bg-surface/50 p-5 shadow-inner">
                  <div className="shrink-0 rounded-xl bg-red-900/30 p-3 text-red-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Time Complexity</h3>
                    <div className="mt-2 flex flex-col gap-1 font-mono text-sm">
                      <div className="flex justify-between gap-4 text-text-secondary">
                        <span>Best:</span>
                        <span className="text-green-400">{definition.bestTime}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-text-secondary">
                        <span>Average:</span>
                        <span className="text-yellow-400">{definition.avgTime}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-text-secondary">
                        <span>Worst:</span>
                        <span className="text-red-400">{definition.worstTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-surface bg-surface/50 p-5 shadow-inner">
                  <div className="shrink-0 rounded-xl bg-blue-900/30 p-3 text-blue-400">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Space Complexity</h3>
                    <div className="mt-2 font-mono text-sm text-blue-300">
                      {definition.space}
                      <span className="ml-2 text-xs font-sans text-text-secondary">
                        ({definition.spaceNote})
                      </span>
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
