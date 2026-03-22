import React from 'react';
import { useToastStore } from '../../store/toastStore';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default: return <Info className="w-5 h-5 text-brand" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-950/80 border-red-900 text-red-200';
      case 'success': return 'bg-green-950/80 border-green-900 text-green-200';
      case 'warning': return 'bg-yellow-950/80 border-yellow-900 text-yellow-200';
      default: return 'bg-surface/90 border-surface text-text-primary';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={twMerge(
              clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-md",
                getBgClass(toast.type)
              )
            )}
          >
            {getIcon(toast.type)}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
