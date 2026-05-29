import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Joins conditional classes (clsx) and resolves conflicting Tailwind
// utilities so the last one wins (tailwind-merge). Use for any className
// composition, especially when a component forwards a className prop.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
