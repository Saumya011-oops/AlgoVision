import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background rounded-xl border border-red-900/30 p-8">
          <div className="flex flex-col items-center text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500/70 mb-4" />
            <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <p className="text-sm text-text-secondary mb-6">
              The visualization engine encountered an unexpected exception while processing this algorithm.
            </p>
            <div className="bg-surface/50 p-4 rounded-lg border border-surface text-left w-full overflow-auto max-h-32 shadow-inner">
              <code className="text-xs text-red-300 font-mono">
                {this.state.error?.message || 'Unknown Execution Error'}
              </code>
            </div>
            <button 
              className="mt-6 px-6 py-2 bg-red-950 hover:bg-red-900 text-red-200 rounded-lg text-sm font-medium transition-colors border border-red-900/50"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
