'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center border border-[#333] bg-[#252525]">
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-[20px] font-semibold text-[#ebebeb] mb-2">
          Something went wrong
        </h1>
        <p className="text-[14px] text-[#6b6b6b] mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-xl bg-[#333] text-[#ebebeb] hover:bg-[#444] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
