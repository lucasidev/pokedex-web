import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Color = 'positive' | 'negative' | 'warning';

const colors: Record<Color, string> = {
  positive: 'bg-cyan-950 hover:bg-cyan-900 text-orange-50',
  negative: 'bg-none text-cyan-950 underline underline-offset-4 decoration-2',
  warning: 'bg-rose-600 hover:bg-rose-500 text-orange-50',
};

const disabledClass = 'bg-zinc-400 text-zinc-50 cursor-default';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: Color;
  children: ReactNode;
}

export function Button({
  color = 'positive',
  children,
  className,
  disabled,
  type,
  ...rest
}: ButtonProps) {
  const palette = disabled ? disabledClass : colors[color];
  return (
    <button
      type={type ?? 'button'}
      disabled={disabled}
      className={`px-4 py-1 align-middle font-semibold ${palette} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </button>
  );
}
