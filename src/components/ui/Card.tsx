import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  glassmorphism?: boolean;
}

export const Card = React.memo(({ className, glassmorphism = true, children, ...props }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={twMerge(
        clsx(
          "rounded-2xl border border-surface shadow-2xl relative overflow-hidden",
          glassmorphism ? "bg-panel/80 backdrop-blur-xl" : "bg-panel",
          className
        )
      )}
      {...props}
    >
      {/* Subtle top glare effect */}
      {glassmorphism ? (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      ) : null}
      <>{children}</>
    </motion.div>
  );
});
Card.displayName = 'Card';

export const CardHeader = ({ className, children }: HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge(clsx("px-6 py-4 flex flex-col space-y-1.5 border-b border-surface/50", className))}>
    {children}
  </div>
);

export const CardTitle = ({ className, children }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={twMerge(clsx("text-lg font-semibold leading-none tracking-tight text-text-primary", className))}>
    {children}
  </h3>
);

export const CardContent = ({ className, children }: HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge(clsx("p-6", className))}>
    {children}
  </div>
);
