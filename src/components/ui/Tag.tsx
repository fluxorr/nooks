import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-md text-xs border border-border bg-background text-muted', className)}>
      {children}
    </span>
  );
}
