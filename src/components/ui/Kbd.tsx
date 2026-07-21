import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cn('px-1.5 py-0.5 rounded text-xs font-mono bg-surface border border-border text-foreground-tertiary', className)}>
      {children}
    </kbd>
  );
}
