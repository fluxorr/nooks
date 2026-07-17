'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Moon, Sun, Sparkles, FolderSearch, Zap } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'Auto-summarizes', desc: 'AI generates summaries for every link you save' },
  { icon: FolderSearch, title: 'Organize in Nooks', desc: 'Create collections to keep your links organized' },
  { icon: Zap, title: 'Instant search', desc: 'Find any link in milliseconds across all your Nooks' },
];

export default function Page() {
  const [url, setUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSave = () => {
    if (!url) return;
    window.location.href = `/save?url=${encodeURIComponent(url)}`;
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="fixed inset-y-0 left-0 right-0 pointer-events-none mx-auto max-w-2xl border-x border-dashed border-border" />

      <div className="max-w-2xl mx-auto relative min-h-screen border-x border-border">

        {/* Nav */}
        <nav className="relative z-50 bg-background/90 backdrop-blur-md border-b border-border transition-colors duration-300">
          <div className="px-8 py-3 flex items-center justify-between">
            <motion.span whileHover={{ scale: 1.02 }} className="font-medium cursor-pointer">nooks</motion.span>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg hover:bg-surface text-muted"
              >
                <Sun className="w-4 h-4 hidden dark:block" />
                <Moon className="w-4 h-4 block dark:hidden" />
              </motion.button>
              <motion.a href="/dashboard" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="text-sm px-3 py-1.5 rounded-lg border border-border bg-surface-alt text-foreground hover:bg-accent-light transition-colors">
                Dashboard
              </motion.a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-24 pb-16 px-8">
          {mounted && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
              <h1 className="text-[32px] font-semibold tracking-tight mb-4 leading-[1.2] text-foreground">
                Curate the web,<br /><span className="text-foreground-subtle">remember everything</span>
              </h1>
              <p className="text-[15px] mb-8 leading-relaxed max-w-md text-muted">
                Save links with AI summaries. Organize in collections called Nooks. Search instantly across all your saved content.
              </p>

              <motion.div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6" layout>
                <div className="flex-1 w-full max-w-sm flex items-center rounded-lg px-3 py-2 border border-border bg-surface hover:border-accent-light transition-colors">
                  <input
                    type="url"
                    name="url"
                    placeholder="Paste a link..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="flex-1 bg-transparent text-[15px] outline-none text-foreground placeholder:text-foreground-subtle"
                    autoComplete="url"
                  />
                </div>
                <motion.button onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-1.5 px-4 py-2 shrink-0 rounded-lg text-sm font-medium bg-accent text-background hover:bg-accent-hover transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Save</span>
                </motion.button>
              </motion.div>

              <motion.p className="text-sm tracking-tight text-foreground-subtle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                Or press <kbd className="px-1 rounded text-xs font-mono ml-0.5 mr-0.5 bg-surface border border-border text-foreground-tertiary">⌘⇧S</kbd> with our extension
              </motion.p>
            </motion.div>
          )}
        </section>

        <div className="border-b border-border" />

        {/* Features */}
        <section className="py-8 px-4">
          <div className="grid gap-1">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-4 rounded-xl group hover:bg-surface transition-colors"
              >
                <f.icon className="w-5 h-5 mt-1.5 text-foreground-muted shrink-0" />
                <div className="pt-0.5">
                  <span className="text-[15px] font-medium tracking-tight text-foreground">{f.title}</span>
                  <p className="text-[13px] mt-1 leading-relaxed text-muted">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="border-b border-border" />

        {/* CTA */}
        <section className="py-12 px-8">
          <div className="text-center">
            <motion.a href="/dashboard" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-foreground transition-colors">
              Open Dashboard
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>→</motion.span>
            </motion.a>
          </div>
        </section>

        <div className="border-b border-border" />

        {/* Footer */}
        <footer className="py-8 px-8">
          <div className="text-center">
            <motion.p className="text-[13px] text-foreground-tertiary" whileHover={{ opacity: 0.7 }}>Free forever</motion.p>
          </div>
        </footer>

      </div>
    </main>
  );
}
