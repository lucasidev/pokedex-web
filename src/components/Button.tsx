import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const button = cva('px-4 py-1 align-middle font-semibold', {
  variants: {
    variant: {
      positive: 'bg-cyan-950 hover:bg-cyan-900 text-orange-50',
      negative: 'bg-none text-cyan-950 underline underline-offset-4 decoration-2',
      warning: 'bg-rose-600 hover:bg-rose-500 text-orange-50',
    },
  },
  defaultVariants: {
    variant: 'positive',
  },
});

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {
  children: ReactNode;
}

export function Button({ variant, children, className, disabled, type, ...rest }: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      disabled={disabled}
      className={cn(
        button({ variant }),
        disabled && 'bg-zinc-400 text-zinc-50 cursor-default hover:bg-zinc-400',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
