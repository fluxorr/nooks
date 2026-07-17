'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center border border-border bg-surface">
          <span className="text-2xl text-muted">!</span>
        </div>
        <h1 className="text-[20px] font-semibold text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-[14px] text-muted mb-8">
          An unexpected error occurred. Please try again.
          {error.digest && <span className="block mt-1 text-xs opacity-60">Error ID: {error.digest}</span>}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-xl bg-surface border border-border text-foreground hover:bg-accent-light transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
