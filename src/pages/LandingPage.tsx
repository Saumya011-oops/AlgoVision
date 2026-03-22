import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Server, Zap, BarChart3, Binary } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      
      {/* Abstract Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-brand/10 blur-[120px] rounded-full point-events-none -z-10" />

      <main className="flex-1 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-8 mt-12 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/30 bg-brand/10 text-brand-light text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            <span>v1.0 is now live</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Stop Memorizing Algorithms.<br/>
            <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
              Start Understanding Them.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-text-secondary max-w-2xl"
          >
            Premium interactive visualizations, real-time code execution mapping, and deep-dive analytics designed to build intuition, not rote memory.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto h-14 text-lg">
                Start Visualizing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Problem and Solution Section */}
        <section className="w-full grid md:grid-cols-2 gap-12 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="w-12 h-12 rounded-xl bg-red-900/30 text-red-400 flex items-center justify-center border border-red-900">
              <Binary className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white">The Problem with Traditional Learning</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Students struggle with Data Structures & Algorithms because learning is inherently passive. Tracing recursion trees, complex graph traversals, and dynamic programming tables on paper falls apart when edge cases strike. 
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
             <div className="w-12 h-12 rounded-xl bg-green-900/30 text-green-400 flex items-center justify-center border border-green-900">
              <Server className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white">The AlgoVision Approach</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              We provide time-travel debugging, semantic code-to-visual linking, and high FPS animations allowing you to literally see the algorithm "think." Pause, edit the input, and watch the execution adapt synchronously.
            </p>
          </motion.div>
        </section>

        {/* Features Highlights */}
        <section className="w-full mb-32">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-white">Production-Grade Features</h2>
            <p className="text-text-secondary text-lg">Everything you need to deeply analyze algorithms.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-brand-light">
                <Play className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Time-Travel Engine</h3>
              <p className="text-text-secondary">Step forward, step backward, or jump to any frame in the execution seamlessly. Pause and resume at will.</p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-brand-light">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Performance Analytics</h3>
              <p className="text-text-secondary">Track real-time exact loop counts, recursion depths, and watch O(N log N) graph scaling empirically.</p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-brand-light">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Comparison Race Mode</h3>
              <p className="text-text-secondary">Run Dijkstra vs A* side-by-side traversing the exact same maze to visually prove efficiency differentials.</p>
            </Card>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="w-full border-t border-surface py-8">
        <div className="container mx-auto px-6 flex items-center justify-between text-sm text-text-secondary">
          <p>© 2026 AlgoVision. Built for optimal learning.</p>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            Source Code
          </a>
        </div>
      </footer>
    </div>
  );
};
