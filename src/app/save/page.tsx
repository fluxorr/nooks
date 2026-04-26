'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Check, Loader2, Tag, FolderOpen } from 'lucide-react';

function SaveContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (url) {
      fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResult(data);
          setSaved(true);
        })
        .finally(() => setLoading(false));
    }
  }, [url]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="glass rounded-2xl border border-white/10 p-8 text-center">
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 mx-auto mb-6"
              >
                <Loader2 className="w-12 h-12 text-accent" />
              </motion.div>
              <h2 className="text-xl font-semibold mb-2">Saving your link...</h2>
              <p className="text-muted text-sm">Fetching content and generating summary</p>
            </>
          ) : saved ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Saved!</h2>
              <p className="text-muted text-sm mb-4">{url}</p>

              {result?.title && (
                <div className="text-left p-4 bg-surface rounded-xl border border-white/5 mb-4">
                  <p className="font-medium mb-2">{result.title}</p>
                  {result?.summary && (
                    <p className="text-sm text-muted">{result.summary}</p>
                  )}
                </div>
              )}

              {result?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-surface rounded-full text-xs text-muted flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <a
                href="/"
                className="mt-6 inline-flex items-center justify-center gap-2 text-accent hover:underline"
              >
                Go to your Nooks <Sparkles className="w-4 h-4" />
              </a>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">Failed to save</h2>
              <p className="text-muted text-sm">Please try again</p>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}

export default function SavePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <SaveContent />
    </Suspense>
  );
}