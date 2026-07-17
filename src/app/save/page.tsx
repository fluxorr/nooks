'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Loader2, Tag, ArrowRight, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

function SaveContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);

  const borderColor = '#333333';
  const bgColor = '#1c1c1c';
  const textColor = '#ebebeb';
  const mutedColor = '#6b6b6b';

  useEffect(() => {
    setDarkMode(true);
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
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#1c1c1c] text-[#ebebeb]' : 'bg-white text-[#37352f]'}`}>
      <div className="fixed inset-y-0 left-0 right-0 pointer-events-none mx-auto max-w-md" style={{ borderLeft: `1px dashed ${darkMode ? '#333' : '#e5e5e5'}`, borderRight: `1px dashed ${darkMode ? '#333' : '#e5e5e5'}` }} />

      <div className="max-w-md mx-auto relative min-h-screen" style={{ borderLeft: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}>
        {/* Nav */}
        <nav className={`relative z-50 transition-all duration-300 ${darkMode ? 'bg-[#1c1c1c]/90' : 'bg-white/90'} backdrop-blur-md`} style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div className="px-6 py-3 flex items-center justify-between">
            <Link href="/" className="font-medium cursor-pointer hover:opacity-80 transition-opacity">nooks</Link>
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-[#2f2f2f] text-[#6b6b6b]' : 'hover:bg-gray-100 text-[#9b9b9b]'}`}>
                <motion.div animate={{ rotate: darkMode ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </nav>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center pt-8"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 mx-auto mb-5">
                  <Loader2 className="w-10 h-10 text-[#6b6b6b]" />
                </motion.div>
                <h2 className="text-[18px] font-medium mb-2" style={{ color: textColor }}>Saving your link...</h2>
                <p className="text-[13px]" style={{ color: mutedColor }}>Fetching content and generating summary</p>
                <p className="text-xs mt-4 truncate" style={{ color: mutedColor, opacity: 0.6 }}>{url}</p>
              </motion.div>
            ) : saved ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center pt-4"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: '#252525' }}>
                  <Check className="w-7 h-7 text-[#ebebeb]" />
                </div>
                <h2 className="text-[18px] font-medium mb-1" style={{ color: textColor }}>Saved!</h2>
                <p className="text-xs mb-6 truncate" style={{ color: mutedColor }}>{url}</p>
                
                {result?.title && (
                  <div className="text-left p-4 rounded-xl border mb-5" style={{ background: '#252525', borderColor: borderColor }}>
                    <p className="text-[14px] font-medium mb-1.5" style={{ color: textColor }}>{result.title}</p>
                    {result?.summary && <p className="text-[13px]" style={{ color: mutedColor }}>{result.summary}</p>}
                  </div>
                )}
                
                {result?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {result.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5" style={{ background: '#252525', color: mutedColor, border: `1px solid ${borderColor}` }}>
                        <Tag className="w-3 h-3" />{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2 px-4 py-2.5 text-white text-[14px] font-medium rounded-xl transition-colors" style={{ background: '#37352f' }}>
                    Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/" className="flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-xl transition-colors" style={{ background: '#252525', border: `1px solid ${borderColor}`, color: textColor }}>
                    Save Another
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center pt-8"
              >
                <h2 className="text-[18px] font-medium mb-2" style={{ color: textColor }}>Failed to save</h2>
                <p className="text-[13px] mb-6" style={{ color: mutedColor }}>
                  {url ? 'Could not fetch or save this link. It may be invalid or unreachable.' : 'No URL provided.'}
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] font-medium rounded-xl transition-colors" style={{ background: '#252525', border: `1px solid ${borderColor}`, color: textColor }}>
                    Try Again
                  </Link>
                  {url && (
                    <button onClick={() => window.location.reload()} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl transition-colors" style={{ color: mutedColor }}>
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
      <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="w-8 h-8 text-[#6b6b6b]" />
        </motion.div>
      </div>
    }>
      <SaveContent />
    </Suspense>
  );
}