import React, { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: string | number;
}

export const Slider = React.memo(
  React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, valueDisplay, ...props }, ref) => {
      
      const backgroundSize = props.max && props.min 
        ? ((Number(props.value) - Number(props.min)) * 100) / (Number(props.max) - Number(props.min)) 
        : 50;
        
      return (
        <div className={twMerge(clsx("flex flex-col gap-2 w-full", className))}>
          {(label || valueDisplay !== undefined) && (
            <div className="flex justify-between items-center text-sm font-medium">
              {label && <span className="text-text-secondary">{label}</span>}
              {valueDisplay !== undefined && <span className="text-brand-light">{valueDisplay}</span>}
            </div>
          )}
          <input
            type="range"
            ref={ref}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-surface outline-none focus:ring-2 focus:ring-brand/50 transition-shadow"
            style={{
              background: `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${backgroundSize}%, var(--color-surface) ${backgroundSize}%, var(--color-surface) 100%)`
            }}
            {...props}
          />
          <style>{`
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 16px;
              width: 16px;
              border-radius: 50%;
              background: #fff;
              border: 2px solid var(--color-brand);
              box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
              transition: transform 0.1s;
            }
            input[type=range]:active::-webkit-slider-thumb {
              transform: scale(1.2);
            }
            input[type=range]::-moz-range-thumb {
              height: 16px;
              width: 16px;
              border-radius: 50%;
              background: #fff;
              border: 2px solid var(--color-brand);
              box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
              transition: transform 0.1s;
            }
          `}</style>
        </div>
      );
    }
  )
);
Slider.displayName = 'Slider';
