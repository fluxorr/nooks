'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Search, Link2, Trash2, Folder, ExternalLink, Globe, Clock, Home, Keyboard, Sun, Moon, Check, ChevronDown, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/CommandPalette';
import { staggerContainer, staggerItem, useViewTransition } from '@/components/ViewTransitions';
import Link from 'next/link';

type Nook = { id: string; name: string; color: string; isPublic: boolean };
type LinkItem = { id: string; url: string; title: string; summary: string; nookId: string | null; tags: string[]; createdAt: string };

const NOOK_COLORS = ['#d97706', '#dc2626', '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#0d9488', '#ea580c', '#65a30d', '#0891b2'];
const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
] as const;
type SortKey = typeof SORT_OPTIONS[number]['value'];

export default function Dashboard() {
  const [isCommandOpen, setCommandOpen] = useState(false);
  const [nooks, setNooks] = useState<Nook[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedNook, setSelectedNook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('date-desc');
  const [showNewNook, setShowNewNook] = useState(false);
  const [newNookName, setNewNookName] = useState('');
  const [newNookColor, setNewNookColor] = useState('#d97706');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [showLinks, setShowLinks] = useState(false);
  const [creatingNook, setCreatingNook] = useState(false);
  const [toast, setToast] = useState<{ message: string; action?: { label: string; onClick: () => void } } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const { push } = useViewTransition();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === 'Escape') {
        if (selectedIds.size > 0) {
          setSelectedIds(new Set());
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (!loading) setTimeout(() => setShowLinks(true), 100); }, [loading]);

  const showToast = (message: string, action?: { label: string; onClick: () => void }) => {
    setToast({ message, action });
    setTimeout(() => setToast(null), 8000);
  };

  const fetchData = async () => {
    setFetchError(null);
    try {
      const res = await fetch('/api/nooks');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNooks(data.nooks || []);
      setLinks(data.links || []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load data';
      setFetchError(msg);
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const createNook = async () => {
    if (!newNookName.trim()) return;
    setCreatingNook(true);
    try {
      const res = await fetch('/api/nooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newNookName, color: newNookColor }),
      });
      if (!res.ok) throw new Error('Failed to create nook');
      const nook = await res.json();
      setNooks(prev => [...prev, nook]);
      setShowNewNook(false);
      setNewNookName('');
      showToast(`Created "${nook.name}" collection`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to create collection');
    } finally {
      setCreatingNook(false);
    }
  };

  const moveLink = async (linkId: string, nookId: string | null) => {
    const prev = [...links];
    setLinks(prevLinks => prevLinks.map(l => l.id === linkId ? { ...l, nookId } : l));
    try {
      const res = await fetch('/api/links', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ linkId, nookId }) });
      if (!res.ok) throw new Error('Failed to move link');
    } catch (e) {
      setLinks(prev);
      showToast('Failed to move link');
    }
  };

  const deleteLink = async (linkId: string) => {
    const link = links.find(l => l.id === linkId);
    if (!link) return;
    setLinks(prev => prev.filter(l => l.id !== linkId));
    selectedIds.delete(linkId);
    showToast('Link deleted', {
      label: 'Undo',
      onClick: async () => {
        setLinks(prev => [...prev, link]);
        try {
          await fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: link.url, nookId: link.nookId }) });
          showToast('Link restored');
        } catch {
          showToast('Failed to restore link');
        }
      },
    });
    try {
      await fetch('/api/links', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ linkId }) });
    } catch {
      setLinks(prev => [...prev, link]);
      showToast('Failed to delete link');
    }
  };

  const deleteSelected = async () => {
    const toDelete = Array.from(selectedIds);
    if (toDelete.length === 0) return;
    if (!window.confirm(`Delete ${toDelete.length} link${toDelete.length > 1 ? 's' : ''}?`)) return;

    const count = toDelete.length;
    setLinks(prev => prev.filter(l => !selectedIds.has(l.id)));
    setSelectedIds(new Set());
    showToast(`Deleted ${count} link${count > 1 ? 's' : ''}`);

    try {
      await Promise.all(toDelete.map(id =>
        fetch('/api/links', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ linkId: id }) })
      ));
    } catch {
      showToast('Some links failed to delete');
      fetchData();
    }
  };

  const toggleSelect = (id: string, index: number, shiftKey: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (shiftKey && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        filteredLinks.slice(start, end + 1).forEach(l => next.add(l.id));
      } else if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setLastSelectedIndex(index);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLinks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLinks.map(l => l.id)));
    }
  };

  const getDomain = (url: string) => { try { return new URL(url).hostname.replace('www.', ''); } catch { return url; } };
  const formatDate = (date: string) => {
    const d = new Date(date), now = new Date(), diff = now.getTime() - d.getTime(), days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sortLinks = (items: LinkItem[]) => {
    const sorted = [...items];
    switch (sortBy) {
      case 'date-asc': return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'title-asc': return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title-desc': return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      default: return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  };

  const filteredLinks = sortLinks(links.filter(link => {
    const matchesNook = !selectedNook || selectedNook === 'inbox' ? !link.nookId : link.nookId === selectedNook;
    const matchesSearch = !searchQuery || link.title?.toLowerCase().includes(searchQuery.toLowerCase()) || link.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNook && matchesSearch;
  }));

  const selectedNookData = !selectedNook || selectedNook === 'inbox' ? null : nooks.find(n => n.id === selectedNook);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Sparkles className="w-8 h-8 text-muted" />
      </motion.div>
    </div>
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="fixed inset-y-0 left-0 right-0 pointer-events-none mx-auto max-w-6xl border-x border-dashed border-border" />

      <div className="max-w-6xl mx-auto relative flex flex-col min-h-screen border-x border-border">
        <CommandPalette isOpen={isCommandOpen} onClose={() => setCommandOpen(false)} links={links.map(l => ({ id: l.id, url: l.url, title: l.title || l.url }))} nooks={nooks} onNavigateToNook={(id) => setSelectedNook(id)} onCreateNook={() => setShowNewNook(true)} onDeleteLink={deleteLink} />

        {/* Nav */}
        <nav className="relative z-50 bg-background/90 backdrop-blur-md border-b border-border transition-colors duration-300">
          <div className="px-6 sm:px-8 py-3 flex items-center justify-between">
            <Link href="/" className="font-medium cursor-pointer hover:opacity-80 transition-opacity">nooks</Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCommandOpen(true)}
                aria-label="Search (Cmd+K)"
                className="p-2 sm:p-2.5 rounded-lg hover:bg-surface text-muted transition-colors"
              >
                <Search className="w-[18px] h-[18px]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 sm:p-2.5 rounded-lg hover:bg-surface text-muted transition-colors"
              >
                <Sun className="w-[18px] h-[18px] hidden dark:block" />
                <Moon className="w-[18px] h-[18px] block dark:hidden" />
              </motion.button>
              <Link href="/" className="text-sm px-3 sm:px-4 py-2 rounded-lg border border-border bg-surface-alt text-foreground hover:bg-accent-light transition-colors">
                Home
              </Link>
            </div>
          </div>
        </nav>

        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface shadow-lg"
            >
              <span className="text-sm text-foreground">{toast.message}</span>
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors shrink-0"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => setToast(null)}
                className="p-1 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Batch action bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-8 py-3 border-b border-border bg-background/95 backdrop-blur-md"
            >
              <span className="text-sm text-muted">
                {selectedIds.size} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted hover:text-foreground transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={deleteSelected}
                  className="px-3 py-1.5 text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  Delete {selectedIds.size > 1 ? 'all' : ''}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <aside className="w-56 sm:w-60 shrink-0 py-6 pl-6 pr-6 flex flex-col border-r border-border">
            <div className="flex flex-col flex-1">
              {/* Error banner */}
              {fetchError && (
                <div className="mb-4 p-3 rounded-xl border border-border bg-surface text-sm text-muted">
                  <p>Failed to load data</p>
                  <button onClick={fetchData} className="text-foreground underline mt-1">Retry</button>
                </div>
              )}

              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-ink-400/40 text-foreground placeholder:text-muted"
                  aria-label="Search links"
                />
              </div>

              {/* Collections */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-muted uppercase tracking-wide">Collections</h3>
                  <button
                    onClick={() => setShowNewNook(true)}
                    aria-label="Create new collection"
                    className="p-1.5 rounded-lg hover:bg-surface text-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-1">
                  <motion.button variants={staggerItem} onClick={() => setSelectedNook('inbox')} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors', (!selectedNook || selectedNook === 'inbox') ? 'bg-surface' : 'text-muted hover:text-foreground')}>
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#6b685e] to-[#4a4640] flex items-center justify-center"><Globe className="w-3 h-3 text-[#6b6b6b]" /></div>
                    <span>Inbox</span>
                    <span className="ml-auto text-xs text-muted">{links.filter(l => !l.nookId).length}</span>
                  </motion.button>
                  {nooks.length === 0 ? (
                    <motion.button variants={staggerItem} onClick={() => setShowNewNook(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-foreground transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Create your first</span>
                    </motion.button>
                  ) : nooks.map(nook => (
                    <motion.button key={nook.id} variants={staggerItem} onClick={() => setSelectedNook(nook.id)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors', selectedNook === nook.id ? 'bg-surface' : 'text-muted hover:text-foreground')}>
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: `${nook.color}15` }}><div className="w-2.5 h-2.5 rounded-full" style={{ background: nook.color }} /></div>
                      <span>{nook.name}</span>
                      <span className="ml-auto text-xs text-muted">{links.filter(l => l.nookId === nook.id).length}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              {/* New Nook Form */}
              <AnimatePresence>
                {showNewNook && (
                  <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="p-4 rounded-2xl border border-border bg-surface mb-6">
                    <input
                      type="text"
                      placeholder="Collection name"
                      value={newNookName}
                      onChange={(e) => setNewNookName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !creatingNook && createNook()}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-background text-foreground placeholder:text-foreground-subtle outline-none focus-visible:ring-2 focus-visible:ring-ink-400/40 mb-3"
                      autoFocus
                      disabled={creatingNook}
                      aria-label="Collection name"
                    />
                    <div className="flex gap-1.5 mb-4">
                      {NOOK_COLORS.map(c => (
                        <button key={c} onClick={() => setNewNookColor(c)} className={cn('w-6 h-6 rounded-full transition-transform', newNookColor === c && 'scale-110 ring-2 ring-white/20')} style={{ background: c }} aria-label={`Color ${c}`} />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={createNook}
                        disabled={creatingNook || !newNookName.trim()}
                        className="flex-1 px-3 py-2 text-sm font-semibold rounded-xl bg-accent text-background hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {creatingNook ? 'Creating...' : 'Create'}
                      </button>
                      <button onClick={() => setShowNewNook(false)} disabled={creatingNook} className="px-3 py-2 rounded-xl text-muted hover:bg-surface transition-colors">Cancel</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats Card */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-2xl border border-border bg-gradient-to-br from-surface to-background mb-4">
                <div className="flex items-center gap-2 text-xs text-muted mb-2"><Clock className="w-3 h-3" /><span>This week</span></div>
                <div className="text-2xl font-bold text-foreground tabular-nums">{links.filter(l => { const d = new Date(l.createdAt); const now = new Date(); return d.getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000; }).length}</div>
                <div className="text-xs text-muted">new links saved</div>
              </motion.div>

              {/* Keyboard Shortcut */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="p-3 rounded-xl border border-border">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Keyboard className="w-4 h-4" />
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 rounded text-xs font-mono bg-surface border border-border text-foreground-tertiary">⌘K</kbd>
                  <span>to search</span>
                </div>
              </motion.div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 p-6 sm:p-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                {selectedNookData && <div className="w-3 h-3 rounded-full" style={{ background: selectedNookData.color }} />}
                <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-tight text-foreground">{selectedNook === 'inbox' || !selectedNook ? 'All Links' : selectedNookData?.name || 'Links'}</h2>
                <span className="text-sm text-muted hidden sm:inline">{filteredLinks.length} link{filteredLinks.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative" ref={sortRef}>
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted hover:text-foreground hover:bg-surface transition-colors"
                    aria-label="Sort links"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-xs">{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                  </button>
                  <AnimatePresence>
                    {showSortMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute right-0 top-full mt-1 w-40 py-1.5 rounded-xl border border-border bg-surface shadow-xl z-20"
                      >
                        {SORT_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                            className={cn(
                              'w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors',
                              sortBy === opt.value ? 'text-foreground font-medium' : 'text-muted hover:text-foreground'
                            )}
                          >
                            {sortBy === opt.value && <ChevronDown className="w-3 h-3 rotate-[-90deg]" />}
                            <span className={sortBy === opt.value ? '' : 'ml-5'}>{opt.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-sm text-muted sm:hidden">{filteredLinks.length} link{filteredLinks.length !== 1 ? 's' : ''}</span>
              </div>
            </motion.div>

            {/* Select all checkbox (visible when items exist) */}
            {filteredLinks.length > 0 && (
              <div className="flex items-center gap-2 mb-3 px-1">
                <button
                  onClick={toggleSelectAll}
                  className={cn(
                    'w-5 h-5 rounded border transition-colors flex items-center justify-center',
                    selectedIds.size === filteredLinks.length
                      ? 'bg-accent border-accent text-background'
                      : 'border-border hover:border-foreground-muted'
                  )}
                  aria-label={selectedIds.size === filteredLinks.length ? 'Deselect all' : 'Select all'}
                >
                  {selectedIds.size === filteredLinks.length && <Check className="w-3 h-3" />}
                </button>
                <span className="text-xs text-muted">
                  {selectedIds.size > 0
                    ? `${selectedIds.size} of ${filteredLinks.length} selected`
                    : 'Select all'
                  }
                </span>
              </div>
            )}

            {fetchError && !loading ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center border border-border bg-surface"><Link2 className="w-10 h-10 text-muted" /></div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Failed to load data</h3>
                <p className="text-muted text-sm mb-6">Check your connection and try again.</p>
                <button onClick={fetchData} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-accent text-background hover:bg-accent-hover transition-colors">Retry</button>
              </motion.div>
            ) : filteredLinks.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center border border-border bg-surface"><Link2 className="w-10 h-10 text-muted" /></div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">No links here yet</h3>
                <p className="text-muted text-sm max-w-sm mx-auto mb-6">Save links from the homepage or use the browser extension</p>
                <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-accent text-background hover:bg-accent-hover transition-colors">Save your first link</Link>
              </motion.div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate={showLinks ? "show" : "hidden"} className="space-y-1.5">
                {filteredLinks.map((link, index) => (
                  <motion.div
                    key={link.id}
                    variants={staggerItem}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={cn(
                      'group p-4 rounded-xl border transition-colors',
                      selectedIds.has(link.id) ? 'border-accent/30 bg-accent/5' : 'border-border bg-surface'
                    )}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <button
                        onClick={(e) => toggleSelect(link.id, index, e.shiftKey)}
                        className={cn(
                          'w-5 h-5 rounded border mt-0.5 shrink-0 transition-colors flex items-center justify-center',
                          selectedIds.has(link.id)
                            ? 'bg-accent border-accent text-background'
                            : 'border-border opacity-0 group-hover:opacity-100 hover:border-foreground-muted'
                        )}
                        aria-label={selectedIds.has(link.id) ? 'Deselect' : 'Select'}
                      >
                        {selectedIds.has(link.id) && <Check className="w-3 h-3" />}
                      </button>
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-background border border-border">
                        <Globe className="w-4 sm:w-5 h-4 sm:h-5 text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[14px] sm:text-[15px] font-medium hover:opacity-70 transition-opacity line-clamp-1 block text-foreground">{link.title || link.url}</a>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted">{getDomain(link.url)}</span>
                              <span className="text-xs text-foreground-tertiary">·</span>
                              <span className="text-xs text-muted">{formatDate(link.createdAt)}</span>
                            </div>
                          </div>
                          <motion.div
                            animate={{ opacity: hoveredLink === link.id || selectedIds.has(link.id) ? 1 : 0 }}
                            className="flex items-center gap-1 shrink-0"
                          >
                            <div className="relative">
                              <button
                                className="p-2 rounded-xl hover:bg-surface text-muted hover:text-foreground transition-colors"
                                aria-label="Move to collection"
                              >
                                <Folder className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 top-full mt-2 w-44 py-1.5 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-20 bg-surface border border-border">
                                <button onClick={() => moveLink(link.id, null)} className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-surface text-muted"><Globe className="w-3.5 h-3.5" />Inbox</button>
                                {nooks.map(n => <button key={n.id} onClick={() => moveLink(link.id, n.id)} className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-surface text-muted"><div className="w-3.5 h-3.5 rounded-full" style={{ background: n.color }} />{n.name}</button>)}
                              </div>
                            </div>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-surface text-muted hover:text-foreground transition-colors" aria-label="Open link"><ExternalLink className="w-4 h-4" /></a>
                            <button onClick={() => deleteLink(link.id)} className="p-2 rounded-xl hover:bg-surface text-muted hover:text-red-500 transition-colors" aria-label="Delete link"><Trash2 className="w-4 h-4" /></button>
                          </motion.div>
                        </div>
                        {link.summary && <p className="text-sm text-muted mt-2 line-clamp-2">{link.summary}</p>}
                        {link.tags && link.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {link.tags.slice(0, 4).map(t => (
                              <span key={t} className="px-2 py-0.5 rounded-md text-xs border border-border bg-background text-muted">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
