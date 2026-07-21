'use client';

import { useCallback, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { MotionConfig } from 'framer-motion';

interface ViewTransitionsProps {
  children: ReactNode;
}

export function ViewTransitions({ children }: ViewTransitionsProps) {
  const router = useRouter();
  
  useEffect(() => {
    if (!document.startViewTransition) return;

    const interceptor = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (
        target.matches('a') &&
        target.href &&
        target.target !== '_blank' &&
        target.href.startsWith(window.location.origin)
      ) {
        e.preventDefault();
        const href = target.href;
        document.startViewTransition(() => {
          router.push(href);
        });
      }
    };

    document.addEventListener('click', interceptor);
    return () => document.removeEventListener('click', interceptor);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}

interface ViewTransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  viewTransitionName?: string;
}

export function ViewTransitionLink({ 
  href, 
  children, 
  className,
  viewTransitionName 
}: ViewTransitionLinkProps) {
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  }, [href, router]);

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={className}
      style={viewTransitionName ? { viewTransitionName } : undefined}
    >
      {children}
    </a>
  );
}

// Hook for view transitions
export function useViewTransition() {
  const router = useRouter();

  const push = useCallback((href: string) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  }, [router]);

  return { push };
}

// Staggered reveal animation config
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    }
  },
};

// Optimistic update hook
export function useOptimisticUpdate<T>(
  initialValue: T,
  onUpdate: (newValue: T) => Promise<void>
) {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const update = useCallback(async (newValue: T) => {
    const previousValue = value;
    setValue(newValue);
    setIsLoading(true);

    try {
      await onUpdate(newValue);
    } catch (error) {
      setValue(previousValue);
      console.error('Optimistic update failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [value, onUpdate]);

  return { value, update, isLoading };
}