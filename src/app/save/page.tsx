'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Loader2, Tag, ArrowRight, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

type SaveResult = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
};

function SaveContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<SaveResult | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => { if (!cancelled) { setResult(data); setSaved(true); } })
      .catch(err => { if (!cancelled) { console.error(err); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="fixed inset-y-0 left-0 right-0 pointer-events-none mx-auto max-w-md border-x border-dashed border-border" />

      <div className="max-w-md mx-auto relative min-h-screen border-x border-border">
        {/* Nav */}
        <nav className="relative z-50 bg-background/90 backdrop-blur-md border-b border-border transition-colors duration-300">
          <div className="px-6 py-3 flex items-center justify-between">
            <Link href="/" className="font-medium cursor-pointer hover:opacity-80 transition-opacity">nooks</Link>
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-lg hover:bg-surface text-muted">
                <Sun className="w-4 h-4 hidden dark:block" />
                <Moon className="w-4 h-4 block dark:hidden" />
              </motion.button>
            </div>
          </div>
        </nav>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-center pt-8">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 mx-auto mb-5">
                  <Loader2 className="w-10 h-10 text-muted" />
                </motion.div>
                <h2 className="text-[18px] font-medium mb-2 text-foreground">Saving your link...</h2>
                <p className="text-[13px] text-muted">Fetching content and generating summary</p>
                <p className="text-xs mt-4 truncate text-muted opacity-60">{url}</p>
              </motion.div>
            ) : saved ? (
              <motion.div key="saved" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-center pt-4">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-surface">
                  <Check className="w-7 h-7 text-foreground" />
                </div>
                <h2 className="text-[18px] font-medium mb-1 text-foreground">Saved!</h2>
                <p className="text-xs mb-6 truncate text-muted">{url}</p>

                {result?.title && (
                  <div className="text-left p-4 rounded-xl border border-border bg-surface mb-5">
                    <p className="text-[14px] font-medium mb-1.5 text-foreground">{result.title}</p>
                    {result?.summary && <p className="text-[13px] text-muted">{result.summary}</p>}
                  </div>
                )}

                {result?.tags && result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {result.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 bg-surface border border-border text-muted">
                        <Tag className="w-3 h-3" />{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-accent text-background hover:bg-accent-hover transition-colors">
                    Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/" className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-surface border border-border text-foreground transition-colors">
                    Save Another
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-center pt-8">
                <h2 className="text-[18px] font-medium mb-2 text-foreground">Failed to save</h2>
                <p className="text-[13px] mb-6 text-muted">
                  {url ? 'Could not fetch or save this link. It may be invalid or unreachable.' : 'No URL provided.'}
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-surface border border-border text-foreground transition-colors">
                    Try Again
                  </Link>
                  {url && (
                    <button onClick={() => window.location.reload()} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl text-muted hover:text-foreground transition-colors">
                      Retry
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default function SavePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="w-8 h-8 text-muted" />
        </motion.div>
      </div>
    }>
      <SaveContent />
    </Suspense>
  );
}
