import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  themeColor?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, themeColor = 'emerald', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          `flex h-10 w-full border border-${themeColor}-800 bg-zinc-950 px-3 py-2 text-sm text-${themeColor}-400 placeholder:text-zinc-700 focus:outline-none focus:border-${themeColor}-500 focus:ring-1 focus:ring-${themeColor}-500/20 disabled:cursor-not-allowed disabled:opacity-50 font-mono`,
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
