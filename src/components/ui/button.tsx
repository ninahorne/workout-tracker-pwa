import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base neobrutalism styles
          'font-bold border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 disabled:opacity-50 disabled:cursor-not-allowed',

          // Variants
          {
            'bg-yellow-400 hover:bg-yellow-300': variant === 'default',
            'bg-purple-400 hover:bg-purple-300': variant === 'secondary',
            'bg-red-400 hover:bg-red-300': variant === 'danger',
            'bg-green-400 hover:bg-green-300': variant === 'success',
          },

          // Sizes
          {
            'px-3 py-1 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },

          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
