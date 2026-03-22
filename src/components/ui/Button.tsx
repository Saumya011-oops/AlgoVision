import React, { ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        children,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        className,
        disabled,
        ...props
      },
      ref
    ) => {
      const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-[--color-brand] disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
      
      const variants = {
        primary: 'bg-brand hover:bg-brand-light text-white shadow-lg shadow-brand/20 border border-brand/50',
        secondary: 'bg-surface hover:bg-surface-hover text-text-primary border border-surface-border',
        ghost: 'hover:bg-surface/50 text-text-secondary hover:text-text-primary',
        danger: 'bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900/80',
      };

      const sizes = {
        sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
        md: 'h-10 px-4 py-2 text-sm rounded-lg gap-2',
        lg: 'h-12 px-8 text-base rounded-xl gap-2',
        icon: 'h-10 w-10 rounded-lg justify-center',
      };

      return (
        <motion.button
          ref={ref}
          whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
          whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
          className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {!isLoading && leftIcon}
          <>{children}</>
          {!isLoading && rightIcon}
        </motion.button>
      );
    }
  )
);
Button.displayName = 'Button';
