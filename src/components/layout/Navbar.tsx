import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-brand/10 text-brand group-hover:bg-brand/20 transition-colors">
            <Network className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-light transition-colors">
            AlgoVision
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {!isDashboard && (
            <Link to="/dashboard">
              <Button variant="primary" size="sm">
                Start Visualizing
              </Button>
            </Link>
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-text-secondary hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};
