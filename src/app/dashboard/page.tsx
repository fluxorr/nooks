'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Search, Link2, Trash2, Folder, ExternalLink, Globe, Clock, Home, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';
import { staggerContainer, staggerItem } from '@/components/ViewTransitions';

type Nook = { id: string; name: string; color: string; isPublic: boolean };
type Link = { id: string; url: string; title: string; summary: string; nookId: string | null; tags: string[]; createdAt: string };

const NOOK_COLORS = ['#d97706', '#dc2626', '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#0d9488', '#ea580c', '#65a30d', '#0891b2'];

export default function Dashboard() {
  const { isOpen: isCommandOpen, setIsOpen: setCommandOpen } = useCommandPalette();
  const [nooks, setNooks] = useState<Nook[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedNook, setSelectedNook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewNook, setShowNewNook] = useState(false);
  const [newNookName, setNewNookName] = useState('');
  const [newNookColor, setNewNookColor] = useState('#d97706');
  const [loading, setLoading] = useState(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (!loading) setTimeout(() => setShowLinks(true), 100); }, [loading]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/nooks');
      const data = await res.json();
      setNooks(data.nooks || []);
      setLinks(data.links || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const createNook = async () => {
    if (!newNookName.trim()) return;
    try {
      const res = await fetch('/api/nooks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newNookName, color: newNookColor }) });
      const nook = await res.json();
      setNooks([...nooks, nook]);
      setShowNewNook(false);
      setNewNookName('');
    } catch (e) { console.error(e); }
  };

  const moveLink = async (linkId: string, nookId: string | null) => {
    const prev = [...links];
    setLinks(links.map(l => l.id === linkId ? { ...l, nookId } : l));
    try { await fetch('/api/links', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ linkId, nookId }) }); }
    catch (e) { console.error(e); setLinks(prev); }
  };

  const deleteLink = async (linkId: string) => {
    const prev = [...links];
    setLinks(links.filter(l => l.id !== linkId));
    try { await fetch('/api/links', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ linkId }) }); }
    catch (e) { console.error(e); setLinks(prev); }
  };

  const getDomain = (url: string) => { try { return new URL(url).hostname.replace('www.', ''); } catch { return url; } };
  const formatDate = (date: string) => {
    const d = new Date(date), now = new Date(), diff = now.getTime() - d.getTime(), days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredLinks = links.filter(link => {
    const matchesNook = !selectedNook || selectedNook === 'inbox' ? !link.nookId : link.nookId === selectedNook;
    const matchesSearch = !searchQuery || link.title?.toLowerCase().includes(searchQuery.toLowerCase()) || link.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNook && matchesSearch;
  });

  const selectedNookData = !selectedNook || selectedNook === 'inbox' ? null : nooks.find(n => n.id === selectedNook);

  if (loading) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Sparkles className="w-8 h-8 text-amber-600" />
      </motion.div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="grain" />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setCommandOpen(false)} links={links.map(l => ({ id: l.id, url: l.url, title: l.title || l.url }))} nooks={nooks} onNavigateToNook={(id) => setSelectedNook(id)} onCreateNook={() => setShowNewNook(true)} onDeleteLink={deleteLink} />

      <header className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--foreground)]">nooks</span>
          </a>
          <div className="flex items-center gap-4">
            <button onClick={() => setCommandOpen(true)} className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
              <Search className="w-4 h-4" />
              <span className="text-xs">Search</span>
              <kbd className="ml-2 px-1.5 py-0.5 bg-[var(--background)] border border-[var(--border)] rounded text-xs">⌘K</kbd>
            </button>
            <a href="/" className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"><Home className="w-4 h-4" /><span>Home</span></a>
            <div className="w-px h-4 bg-[var(--border)]" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface)] rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-[var(--foreground-muted)]">{links.length} links</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-10">
          <aside className="w-56 shrink-0">
            <div className="sticky top-24">
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none focus:border-amber-500/30" />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-widest">Collections</h3>
                  <button onClick={() => setShowNewNook(true)} className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--foreground-muted)] hover:text-amber-600"><Plus className="w-4 h-4" /></button>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-1.5">
                  <motion.button variants={staggerItem} onClick={() => setSelectedNook('inbox')} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', (!selectedNook || selectedNook === 'inbox') ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm border border-[var(--border)]' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]')}>
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#6b685e] to-[#4a4640] flex items-center justify-center"><Globe className="w-3 h-3 text-[var(--foreground-muted)]" /></div>
                    <span>Inbox</span>
                    <span className="ml-auto text-xs text-[var(--foreground-muted)]">{links.filter(l => !l.nookId).length}</span>
                  </motion.button>
                  {nooks.map(nook => (
                    <motion.button key={nook.id} variants={staggerItem} onClick={() => setSelectedNook(nook.id)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', selectedNook === nook.id ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm border border-[var(--border)]' : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]')}>
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: `${nook.color}15` }}><div className="w-2.5 h-2.5 rounded-full" style={{ background: nook.color }} /></div>
                      <span>{nook.name}</span>
                      <span className="ml-auto text-xs text-[var(--foreground-muted)]">{links.filter(l => l.nookId === nook.id).length}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              <AnimatePresence>
                {showNewNook && (
                  <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] mb-6">
                    <input type="text" placeholder="Collection name" value={newNookName} onChange={(e) => setNewNookName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createNook()} className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none mb-3" autoFocus />
                    <div className="flex gap-1.5 mb-4">{NOOK_COLORS.map(c => <button key={c} onClick={() => setNewNookColor(c)} className={cn('w-6 h-6 rounded-full transition-all', newNookColor === c && 'scale-110 ring-2 ring-[var(--foreground)]/20')} style={{ background: c }} />)}</div>
                    <div className="flex gap-2">
                      <button onClick={createNook} className="flex-1 px-3 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700">Create</button>
                      <button onClick={() => setShowNewNook(false)} className="px-3 py-2 bg-[var(--background)] text-[var(--foreground-muted)] text-sm rounded-xl">Cancel</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 bg-gradient-to-br from-[var(--surface)] to-[var(--background-alt)] rounded-2xl border border-[var(--border)]">
                <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] mb-2"><Clock className="w-3 h-3" /><span>This week</span></div>
                <div className="text-2xl font-bold text-[var(--foreground)]">{links.filter(l => { const d = new Date(l.createdAt); const now = new Date(); return d.getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000; }).length}</div>
                <div className="text-xs text-[var(--foreground-muted)]">new links saved</div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]"><Keyboard className="w-4 h-4" /><span>Press</span><kbd className="px-1.5 py-0.5 bg-[var(--background)] rounded text-xs font-mono">⌘K</kbd><span>to search</span></div>
              </motion.div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {selectedNookData && <div className="w-3 h-3 rounded-full" style={{ background: selectedNookData.color }} />}
                <h2 className="text-2xl font-bold text-[var(--foreground)]">{selectedNook === 'inbox' || !selectedNook ? 'All Links' : selectedNookData?.name || 'Links'}</h2>
              </div>
              <span className="text-sm text-[var(--foreground-muted)]">{filteredLinks.length} links</span>
            </motion.div>

            {filteredLinks.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--surface)] flex items-center justify-center border border-[var(--border)]"><Link2 className="w-10 h-10 text-[var(--foreground-muted)]" /></div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No links saved yet</h3>
                <p className="text-[var(--foreground-muted)] text-sm max-w-sm mx-auto">Save links from the homepage or use the browser extension</p>
                <a href="/" className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700">Save your first link</a>
              </motion.div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate={showLinks ? "show" : "hidden"} className="grid gap-3">
                {filteredLinks.map((link) => (
                  <motion.div key={link.id} variants={staggerItem} onMouseEnter={() => setHoveredLink(link.id)} onMouseLeave={() => setHoveredLink(null)} className="group p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)] hover:border-amber-500/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--background-alt)] to-[var(--border)] flex items-center justify-center shrink-0"><Globe className="w-5 h-5 text-[var(--foreground-muted)]" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-[var(--foreground)] hover:text-amber-600 transition-colors line-clamp-1 block">{link.title || link.url}</a>
                            <div className="flex items-center gap-2 mt-1"><span className="text-xs text-[var(--foreground-muted)]">{getDomain(link.url)}</span><span className="text-xs text-[var(--border)]">•</span><span className="text-xs text-[var(--foreground-muted)]">{formatDate(link.createdAt)}</span></div>
                          </div>
                          <motion.div animate={{ opacity: hoveredLink === link.id ? 1 : 0 }} className="flex items-center gap-1">
                            <div className="relative">
                              <button className="p-2 rounded-xl hover:bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"><Folder className="w-4 h-4" /></button>
                              <div className="absolute right-0 top-full mt-2 w-44 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                <button onClick={() => moveLink(link.id, null)} className="w-full px-3 py-2 text-left text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-alt)] flex items-center gap-2"><Globe className="w-3.5 h-3.5" />Inbox</button>
                                {nooks.map(n => <button key={n.id} onClick={() => moveLink(link.id, n.id)} className="w-full px-3 py-2 text-left text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-alt)] flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full" style={{ background: n.color }} />{n.name}</button>)}
                              </div>
                            </div>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"><ExternalLink className="w-4 h-4" /></a>
                            <button onClick={() => deleteLink(link.id)} className="p-2 rounded-xl hover:bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </motion.div>
                        </div>
                        {link.summary && <p className="text-sm text-[var(--foreground-muted)] mt-2 line-clamp-2">{link.summary}</p>}
                        {link.tags && link.tags.length > 0 && <div className="flex flex-wrap gap-1.5 mt-3">{link.tags.slice(0, 4).map(t => <span key={t} className="px-2 py-0.5 bg-[var(--background-alt)] text-[var(--foreground-muted)] text-xs rounded-md border border-[var(--border)]">{t}</span>)}</div>}
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