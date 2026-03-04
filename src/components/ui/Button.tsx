import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  themeColor?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', themeColor = 'emerald', ...props }, ref) => {
    
    const variants = {
      primary: `bg-${themeColor}-600 text-black border border-${themeColor}-500 hover:bg-${themeColor}-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none`,
      secondary: `bg-zinc-900 text-${themeColor}-400 border border-${themeColor}-800 hover:border-${themeColor}-500 hover:bg-zinc-800`,
      ghost: `hover:bg-zinc-800 text-${themeColor}-400`,
      danger: 'bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-900/40',
    };

    const sizes = {
      sm: 'h-7 px-2 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
      icon: 'h-10 w-10 p-2 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          'inline-flex items-center justify-center font-mono transition-all focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider',
          variants[variant],
          sizes[size],
          `focus:ring-${themeColor}-500 focus:ring-offset-zinc-950`,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
