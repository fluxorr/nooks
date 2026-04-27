'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Check, Loader2, Tag, ArrowRight } from 'lucide-react';

function SaveContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (url) {
      fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
        .then(res => res.json())
        .then(data => { setResult(data); setSaved(true); })
        .finally(() => setLoading(false));
    }
  }, [url]);

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
        <div className="glass rounded-3xl border border-[var(--border)] p-8 text-center">
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 mx-auto mb-6">
                <Loader2 className="w-12 h-12 text-amber-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Saving your link...</h2>
              <p className="text-[var(--foreground-muted)] text-sm">Fetching content and generating summary</p>
            </>
          ) : saved ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Saved!</h2>
              <p className="text-[var(--foreground-muted)] text-sm mb-4 truncate">{url}</p>
              {result?.title && <div className="text-left p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] mb-4"><p className="font-medium text-[var(--foreground)] mb-2">{result.title}</p>{result?.summary && <p className="text-sm text-[var(--foreground-muted)]">{result.summary}</p>}</div>}
              {result?.tags?.length > 0 && <div className="flex flex-wrap gap-2 justify-center mb-6">{result.tags.map((tag: string) => <span key={tag} className="px-3 py-1 bg-[var(--surface)] rounded-full text-xs text-[var(--foreground-muted)] flex items-center gap-1"><Tag className="w-3 h-3" />{tag}</span>)}</div>}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/dashboard" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors">Dashboard <ArrowRight className="w-4 h-4" /></a>
                <a href="/" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--surface)] text-[var(--foreground)] font-medium rounded-xl hover:bg-[var(--background-alt)] transition-colors">Save Another</a>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Failed to save</h2>
              <p className="text-[var(--foreground-muted)] text-sm">Please try again</p>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}

export default function SavePage() {
  return <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}><SaveContent /></Suspense>;
}