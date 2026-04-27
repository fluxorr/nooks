'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link2, Search, Sparkles, FolderOpen, Keyboard, ArrowRight, Globe, BarChart3, Users } from 'lucide-react';
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
    {
      icon: Sparkles,
      title: 'Auto-Summarizes',
      description: 'Every link gets AI-generated summaries so you instantly know what it contains.'
    },
    {
      icon: FolderOpen,
      title: 'Organize in Nooks',
      description: 'Create beautiful collections called Nooks. Organize links your way.'
    },
    {
      icon: Search,
      title: 'Instant Search',
      description: 'Find any saved link in milliseconds. Full-text search across all your content.'
    },
    {
      icon: Keyboard,
      title: 'Keyboard Shortcuts',
      description: 'Save links instantly with ⌘⇧S or hover over any link for 500ms to save.'
    }
  ];

  const stats = [
    { value: '∞', label: 'Links' },
    { value: '∞', label: 'Nooks' },
    { value: 'Free', label: 'Forever' }
  ];

  return (
    <main className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1915]">
      {/* Grain texture */}
      <div className="grain" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">nooks</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-[#6b685e] dark:text-[#a09a90] hover:text-foreground transition-colors">
              Features
            </a>
            <a href="/dashboard" className="px-4 py-2 bg-foreground text-[#faf8f5] dark:bg-[#faf8f5] dark:text-[#1a1915] text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
              Open App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#252220] border border-[#e8e4dc] dark:border-[#3d3835] text-sm text-[#6b685e] dark:text-[#a09a90]">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Your personal web library</span>
              </div>
            </motion.div>
          )}

          {mounted && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
            >
              Curate the web,{' '}
              <span className="gradient-text">remember everything</span>
            </motion.h1>
          )}

          {mounted && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[#6b685e] dark:text-[#a09a90] max-w-2xl mx-auto mb-12"
            >
              Save links with AI summaries, organize into beautiful collections called Nooks, and search instantly across everything you have saved.
            </motion.p>
          )}

          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-white dark:bg-[#252220] border border-[#e8e4dc] dark:border-[#3d3835] rounded-2xl p-2 w-full max-w-md shadow-sm">
                <Link2 className="w-5 h-5 text-[#6b685e] ml-3" />
                <input
                  type="url"
                  placeholder="Paste a URL to save..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#a09a90]"
                />
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}

          {mounted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm text-[#a09a90]"
            >
              or use keyboard shortcut <kbd className="px-2 py-1 bg-white dark:bg-[#252220] border border-[#e8e4dc] dark:border-[#3d3835] rounded text-xs">⌘⇧S</kbd> with our browser extension
            </motion.p>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-[#6b685e]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything you need</h2>
            <p className="text-[#6b685e] text-lg max-w-xl mx-auto">Powerful features, beautifully simple. Save, organize, and find your web content instantly.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-3xl bg-white dark:bg-[#252220] border border-[#e8e4dc] dark:border-[#3d3835] hover:border-amber-500/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-[#6b685e]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-[#f5f2eb] dark:bg-[#252220]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Save from anywhere</h2>
            <p className="text-[#6b685e] text-lg">Three ways to build your collection</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { num: '01', title: 'Paste a URL', desc: 'Simply paste any link on the homepage and we will fetch and summarize it automatically.' },
              { num: '02', title: 'Browser Extension', desc: 'Install the Chrome extension and save with one click or the ⌘⇧S keyboard shortcut.' },
              { num: '03', title: 'Hover to Save', desc: 'Hover over any link for 500ms to reveal a floating save button. Works on any website.' }
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 p-6 rounded-2xl bg-white dark:bg-[#2d2926] border border-[#e8e4dc] dark:border-[#3d3835]"
              >
                <span className="text-4xl font-bold text-amber-600/30">{step.num}</span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-[#6b685e] text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Start curating today</h2>
          <p className="text-[#6b685e] text-lg mb-8">Join thousands of people who save and organize their web content with Nooks.</p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"
          >
            Open Dashboard <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#e8e4dc] dark:border-[#3d3835]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">nooks</span>
          </div>
          <p className="text-sm text-[#6b685e]">Built for anyone who saves too many links</p>
        </div>
      </footer>
    </main>
  );
}