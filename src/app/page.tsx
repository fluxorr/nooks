'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Link2, Search, Sparkles, Plus, ExternalLink, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (!url) return;
    window.location.href = `/save?url=${encodeURIComponent(url)}`;
  };

  const copyExtensionCode = () => {
    navigator.clipboard.writeText('npx @nooks/extension');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight">nooks</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-muted hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted hover:text-white transition-colors">How it works</a>
            <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-sm text-muted mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Your personal web library</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Curate the web,{' '}
            <span className="gradient-text">remember everything</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto mb-12"
          >
            Save links with auto-summaries, organize into beautiful collections called Nooks, and search instantly across everything you've saved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl p-2 w-full max-w-md">
              <Link2 className="w-5 h-5 text-muted ml-2" />
              <input
                type="url"
                placeholder="Paste a URL to save..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-black font-medium text-sm rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm text-muted mt-6"
          >
            or use keyboard shortcut <kbd className="px-2 py-1 bg-surface rounded text-xs">⌘⇧S</kbd> with our extension
          </motion.p>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass rounded-2xl border border-white/10 p-1">
            <div className="rounded-xl overflow-hidden bg-surface">
              <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-muted">nooks.app</span>
              </div>
              <div className="p-8 grid grid-cols-3 gap-4">
                {/* Mock link cards */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-4 rounded-xl bg-background border border-white/5 hover:border-accent/30 transition-colors cursor-pointer',
                      i === 1 ? 'col-span-2' : ''
                    )}
                  >
                    <div className="w-full h-24 bg-gradient-to-br from-surface to-background rounded-lg mb-3" />
                    <div className="h-3 bg-surface rounded w-3/4 mb-2" />
                    <div className="h-2 bg-surface rounded w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything you need to stay organized</h2>
            <p className="text-muted text-lg">Powerful features, beautifully simple</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Auto-Summaries',
                description: 'Every link gets AI-generated summaries so you know what it contains without clicking.',
              },
              {
                icon: Search,
                title: 'Instant Search',
                description: 'Search across all your saved links with semantic understanding of content.',
              },
              {
                icon: Plus,
                title: 'Nooks Collections',
                description: 'Organize links into beautiful collections called Nooks. Create as many as you need.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-accent/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Save links from anywhere</h2>
            <p className="text-muted text-lg">Three ways to add to your library</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { num: '01', title: 'Paste a URL', desc: 'Simply paste any link and we will fetch the content automatically.' },
              { num: '02', title: 'Extension', desc: 'Add to Chrome and save with one click or keyboard shortcut.' },
              { num: '03', title: 'Hover to save', desc: 'Hover over any link for 500ms to reveal a save tooltip. Works site-wide.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 p-6 rounded-2xl bg-surface border border-white/5"
              >
                <span className="text-4xl font-bold text-accent/50">{step.num}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                  <p className="text-muted text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Install the extension</h2>
          <p className="text-muted text-lg mb-8">Copy and run this to get started</p>

          <div className="flex items-center justify-center gap-2">
            <code className="px-4 py-3 bg-surface rounded-lg font-mono text-sm">npx @nooks/extension</code>
            <button
              onClick={copyExtensionCode}
              className="p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-black" />
            </div>
            <span className="font-bold">nooks</span>
          </div>
          <p className="text-sm text-muted">Built with love for anyone who saves too many links</p>
        </div>
      </footer>
    </main>
  );
}