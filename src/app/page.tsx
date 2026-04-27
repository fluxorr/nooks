'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link2, Search, Sparkles, FolderOpen, Keyboard, ArrowRight, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [url, setUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    if (!url) return;
    window.location.href = `/save?url=${encodeURIComponent(url)}`;
  };

  const features = [
    { icon: Sparkles, title: 'Auto-Summarizes', description: 'Every link gets AI-generated summaries so you instantly know what it contains.' },
    { icon: FolderOpen, title: 'Organize in Nooks', description: 'Create beautiful collections called Nooks. Organize links your way.' },
    { icon: Search, title: 'Instant Search', description: 'Find any saved link in milliseconds. Full-text search across all your content.' },
    { icon: Keyboard, title: 'Keyboard Shortcuts', description: 'Save links instantly with ⌘⇧S or hover over any link for 500ms to save.' }
  ];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="grain" />

      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[var(--foreground)]">nooks</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Features</a>
            <a href="/dashboard" className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">Open App</a>
          </div>
        </div>
      </nav>

      <section className="pt-48 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {mounted && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground-muted)]">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Your personal web library</span>
              </div>
            </motion.div>
          )}
          {mounted && (
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--foreground)] mb-6">
              Curate the web, <span className="gradient-text">remember everything</span>
            </motion.h1>
          )}
          {mounted && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-12">
              Save links with AI summaries, organize into beautiful collections called Nooks, and search instantly across everything you have saved.
            </motion.p>
          )}
          {mounted && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-2 w-full max-w-md shadow-sm">
                <Link2 className="w-5 h-5 text-[var(--foreground-muted)] ml-3" />
                <input type="url" placeholder="Paste a URL to save..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()} className="flex-1 bg-transparent outline-none text-sm" />
                <button onClick={handleSave} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition-colors">Save</button>
              </div>
            </motion.div>
          )}
          {mounted && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="text-sm text-[var(--foreground-muted)]">
              or use keyboard shortcut <kbd className="px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded text-xs">⌘⇧S</kbd> with our browser extension
            </motion.p>
          )}
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">Everything you need</h2>
            <p className="text-[var(--foreground-muted)] text-lg">Powerful features, beautifully simple.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-amber-500/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">{f.title}</h3>
                <p className="text-[var(--foreground-muted)]">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[var(--background-alt)]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">Save from anywhere</h2>
            <p className="text-[var(--foreground-muted)] text-lg">Three ways to build your collection</p>
          </motion.div>
          <div className="space-y-4">
            {[
              { num: '01', title: 'Paste a URL', desc: 'Simply paste any link on the homepage and we will fetch and summarize it automatically.' },
              { num: '02', title: 'Browser Extension', desc: 'Install the Chrome extension and save with one click or the ⌘⇧S keyboard shortcut.' },
              { num: '03', title: 'Hover to Save', desc: 'Hover over any link for 500ms to reveal a floating save button. Works on any website.' }
            ].map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-6 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-4xl font-bold text-amber-600/30">{s.num}</span>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">{s.title}</h3>
                  <p className="text-[var(--foreground-muted)] text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">Start curating today</h2>
          <p className="text-[var(--foreground-muted)] text-lg mb-8">Join thousands of people who save and organize their web content with Nooks.</p>
          <a href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors">
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[var(--foreground)]">nooks</span>
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">Built for anyone who saves too many links</p>
        </div>
      </footer>
    </main>
  );
}