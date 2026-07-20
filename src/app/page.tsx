'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Moon, Sun, Search, Sparkles, ArrowRight, ExternalLink, Bookmark } from 'lucide-react';
import { Scales } from '@/components/Scales';

function CommandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 7a2 2 0 1 1 2 2H7a2 2 0 1 1 2-2v10a2 2 0 1 1-2-2h10a2 2 0 1 1-2 2V9a2 2 0 1 1 2-2H9z" />
    </svg>
  );
}

export default function Page() {
  const [url, setUrl] = useState('');

  useEffect(() => {
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
      <div className="max-w-4xl mx-auto relative min-h-screen">


        {/* Nav */}
        <nav className="relative z-50 bg-background/90 backdrop-blur-md border-b border-border transition-colors duration-300">
          <div className="px-6 sm:px-10 py-3 flex items-center justify-between">
            <motion.span whileHover={{ scale: 1.02 }} className="font-medium cursor-pointer">nooks</motion.span>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2.5 rounded-lg hover:bg-surface text-muted transition-colors"
              >
                <Sun className="w-[18px] h-[18px] hidden dark:block" />
                <Moon className="w-[18px] h-[18px] block dark:hidden" />
              </motion.button>
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-sm px-4 py-2 rounded-lg border border-border bg-surface-alt text-foreground hover:bg-accent-light transition-colors"
              >
                Dashboard
              </motion.a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-28 pb-20 px-6 sm:px-10">
          <div className="max-w-2xl">
            <h1 className="text-[36px] sm:text-[44px] font-semibold tracking-tight leading-[1.15] text-foreground mb-4">
              Curate the web,<br />
              <span className="text-foreground-subtle">remember everything</span>
            </h1>
            <p className="text-[15px] sm:text-[16px] leading-relaxed max-w-lg text-muted mb-8">
              Save links with AI summaries. Organize in collections called Nooks. Search instantly across everything you&apos;ve saved.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-5">
              <div className="flex-1 w-full max-w-sm flex items-center rounded-lg px-3 py-2.5 border border-border bg-surface hover:border-accent-light transition-colors">
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
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-5 py-2.5 shrink-0 rounded-lg text-sm font-medium bg-accent text-background hover:bg-accent-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Save</span>
              </motion.button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface">
                <CommandIcon className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">⇧⌘Z</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface">
                <CommandIcon className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">K</span>
              </span>
              <span className="text-foreground-subtle text-[13px]">or right-click any link</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 sm:px-10 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-14"
            >
              <p className="text-xs font-medium text-muted tracking-wider uppercase mb-3">How it works</p>
              <h2 className="text-[22px] font-semibold tracking-tight text-foreground">
                Three steps to never lose a link again
              </h2>
            </motion.div>

            <div className="space-y-16">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start"
              >
                <div className="w-full sm:w-48 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center mb-3">
                    <span className="text-xs font-semibold text-muted">1</span>
                  </div>
                  <h3 className="text-[17px] font-medium tracking-tight text-foreground mb-1">Save from anywhere</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Use the browser extension, right-click menu, or keyboard shortcut. No tab switching — the link saves in the background.
                  </p>
                </div>
                <div className="flex-1 w-full rounded-2xl border border-border bg-surface overflow-hidden">
                  <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626] opacity-60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f5a623] opacity-60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a] opacity-60" />
                    </div>
                    <span className="text-xs text-foreground-subtle font-mono truncate">Save to Nooks</span>
                  </div>
                  <div className="px-5 py-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f5a623] to-[#f97316] flex items-center justify-center">
                      <Bookmark className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-foreground truncate font-medium">How to build a design system</div>
                      <div className="text-[12px] text-foreground-subtle truncate">designsystem.com</div>
                    </div>
                    <span className="text-[11px] text-muted bg-surface border border-border rounded-md px-2 py-1">Saved!</span>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start"
              >
                <div className="w-full sm:w-48 shrink-0 order-2 sm:order-1">
                  <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center mb-3">
                    <span className="text-xs font-semibold text-muted">2</span>
                  </div>
                  <h3 className="text-[17px] font-medium tracking-tight text-foreground mb-1">AI summarizes it</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Every saved link gets a 2-3 sentence summary and relevant tags — auto-generated so you don&apos;t have to remember what you saved or why.
                  </p>
                </div>
                <div className="flex-1 w-full rounded-2xl border border-border bg-surface overflow-hidden order-1 sm:order-2">
                  <div className="px-5 py-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Sparkles className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                      <p className="text-[13px] text-foreground leading-relaxed">
                        A practical guide to building and maintaining scalable design systems, covering tokens, component libraries, documentation, and team workflows.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['design-systems', 'frontend', 'css', 'ui'].map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md text-[11px] border border-border bg-background text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start"
              >
                <div className="w-full sm:w-48 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center mb-3">
                    <span className="text-xs font-semibold text-muted">3</span>
                  </div>
                  <h3 className="text-[17px] font-medium tracking-tight text-foreground mb-1">Find it in seconds</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Press <kbd className="px-1.5 py-0.5 rounded text-xs font-mono bg-surface border border-border text-foreground-tertiary">⌘K</kbd> anywhere in the app to search across all your links and collections. Filter by nook, or just type what you remember.
                  </p>
                </div>
                <div className="flex-1 w-full rounded-2xl border border-border bg-surface overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                    <Search className="w-4 h-4 text-muted shrink-0" />
                    <span className="text-[13px] text-foreground-subtle">design system</span>
                    <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-background text-muted border border-border">
                      <CommandIcon className="w-2.5 h-2.5" />K
                    </div>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {[
                      { title: 'How to build a design system', domain: 'designsystem.com' },
                      { title: 'Design system best practices 2024', domain: 'blog.designsystems.com' },
                      { title: 'Atomic design methodology', domain: 'atomicdesign.bradfrost.com' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface transition-colors">
                        <ExternalLink className="w-4 h-4 text-muted shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] text-foreground truncate font-medium">{item.title}</div>
                          <div className="text-[11px] text-muted truncate">{item.domain}</div>
                        </div>
                        {i === 0 && <ArrowRight className="w-4 h-4 text-foreground" />}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dashboard preview */}
        <section className="py-20 px-6 sm:px-10 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="text-xs font-medium text-muted tracking-wider uppercase mb-3">Organized</p>
              <h2 className="text-[22px] font-semibold tracking-tight text-foreground">
                Keep everything in collections
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-surface overflow-hidden"
            >
              {/* Sidebar + content mockup */}
              <div className="flex">
                <div className="w-44 shrink-0 border-r border-border p-4 hidden sm:block">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Collections</p>
                  </div>
                  <div className="space-y-1">
                    {[
                      { name: 'Inbox', count: 12, color: '#6b685e' },
                      { name: 'Engineering', count: 8, color: '#2563eb' },
                      { name: 'Design', count: 5, color: '#7c3aed' },
                      { name: 'Reading list', count: 3, color: '#16a34a' },
                    ].map(c => (
                      <div key={c.name} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-surface text-foreground text-[13px]">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                        <span className="truncate flex-1">{c.name}</span>
                        <span className="text-muted text-xs">{c.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-medium text-foreground">All Links</h3>
                    <span className="text-xs text-muted">28 links</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { title: 'Rust programming in 2024', domain: 'blog.rust-lang.org', date: 'Today', summary: 'A comprehensive overview of Rust adoption across the industry...' },
                      { title: 'The future of React Server Components', domain: 'react.dev', date: 'Yesterday', summary: 'React Server Components represent a paradigm shift in how we think about...' },
                      { title: 'Building accessible web apps', domain: 'web.dev', date: '3d ago', summary: 'A practical guide to building web applications that work for everyone...' },
                    ].map((link, i) => (
                      <div key={i} className="p-3 rounded-xl border border-border bg-background">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                            <ExternalLink className="w-4 h-4 text-muted" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-medium text-foreground truncate">{link.title}</div>
                            <div className="flex items-center gap-2 text-[11px] text-muted mt-0.5">
                              <span>{link.domain}</span>
                              <span className="text-foreground-tertiary">·</span>
                              <span>{link.date}</span>
                            </div>
                            <p className="text-[12px] text-muted mt-1.5 line-clamp-1">{link.summary}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="fixed inset-y-0 left-1/2 -translate-x-[448px] w-6 pointer-events-none overflow-hidden opacity-[0.08] hidden lg:block">
          <Scales size={8} />
        </div>
        <div className="fixed inset-y-0 right-1/2 translate-x-[448px] w-6 pointer-events-none overflow-hidden opacity-[0.08] hidden lg:block">
          <Scales size={8} />
        </div>

        {/* CTA */}
        <section className="py-20 px-6 sm:px-10 border-t border-border">
          <div className="max-w-xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[22px] font-semibold tracking-tight text-foreground mb-3">
                Start curating your web
              </h2>
              <p className="text-[14px] text-muted mb-8 max-w-sm mx-auto">
                Free forever. No account needed. Just save, organize, and find.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-background hover:bg-accent-hover transition-colors"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 sm:px-10 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-foreground-tertiary">
              nooks &middot; save what matters
            </p>
            <p className="text-[13px] text-foreground-tertiary">
              Free forever
            </p>
          </div>
        </footer>

      </div>
    </main>
  );
}
