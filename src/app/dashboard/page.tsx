'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Search, Link2, Trash2, Folder, ExternalLink, Globe, Clock, Home, Keyboard, Command, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/CommandPalette';
import { staggerContainer, staggerItem, useViewTransition } from '@/components/ViewTransitions';
import Link from 'next/link';

type Nook = { id: string; name: string; color: string; isPublic: boolean };
type LinkItem = { id: string; url: string; title: string; summary: string; nookId: string | null; tags: string[]; createdAt: string };

const NOOK_COLORS = ['#d97706', '#dc2626', '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#0d9488', '#ea580c', '#65a30d', '#0891b2'];

const borderColor = '#333333';
const bgColor = '#1c1c1c';
const textColor = '#ebebeb';
const mutedColor = '#6b6b6b';
const subtleColor = '#555555';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [isCommandOpen, setCommandOpen] = useState(false);
  const [nooks, setNooks] = useState<Nook[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedNook, setSelectedNook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewNook, setShowNewNook] = useState(false);
  const [newNookName, setNewNookName] = useState('');
  const [newNookColor, setNewNookColor] = useState('#d97706');
  const [loading, setLoading] = useState(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [showLinks, setShowLinks] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const { push } = useViewTransition();

  useEffect(() => {
    setDarkMode(true);
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Sparkles className="w-8 h-8 text-neutral-600" />
      </motion.div>
    </div>
  );

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#1c1c1c] text-[#ebebeb]' : 'bg-white text-[#37352f]'}`}>
      <div className="fixed inset-y-0 left-0 right-0 pointer-events-none mx-auto max-w-6xl" style={{ borderLeft: `1px dashed ${darkMode ? '#333' : '#e5e5e5'}`, borderRight: `1px dashed ${darkMode ? '#333' : '#e5e5e5'}` }} />

      <div className="max-w-6xl mx-auto relative flex flex-col min-h-screen" style={{ borderLeft: `1px solid ${darkMode ? '#333' : '#e9e9e7'}`, borderRight: `1px solid ${darkMode ? '#333' : '#e9e9e7'}` }}>
        <CommandPalette isOpen={isCommandOpen} onClose={() => setCommandOpen(false)} links={links.map(l => ({ id: l.id, url: l.url, title: l.title || l.url }))} nooks={nooks} onNavigateToNook={(id) => setSelectedNook(id)} onCreateNook={() => setShowNewNook(true)} onDeleteLink={deleteLink} />

        {/* Nav */}
        <nav className={`relative z-50 top-0 transition-all duration-300 ${isCommandOpen ? 'bg-[#1c1c1c]/90 backdrop-blur-md' : ''} ${darkMode ? 'bg-[#1c1c1c]/90' : 'bg-white/90'} backdrop-blur-md`} style={{ borderBottom: `1px solid ${darkMode ? '#333' : '#e9e9e7'}` }}>
          <div className="px-8 py-3 flex items-center justify-between">
            <Link href="/" className="font-medium cursor-pointer hover:opacity-80 transition-opacity">nooks</Link>
            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCommandOpen(true)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-[#2f2f2f] text-[#6b6b6b]' : 'hover:bg-gray-100 text-[#9b9b9b]'}`}>
                <Search className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-[#2f2f2f] text-[#6b6b6b]' : 'hover:bg-gray-100 text-[#9b9b9b]'}`}>
                <motion.div animate={{ rotate: darkMode ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </motion.button>
              <Link href="/" className={`text-sm px-3 py-1.5 rounded-lg transition-all border ${darkMode ? 'bg-[#2a2a2a] border-[#333] text-[#ebebeb] hover:bg-[#333]' : 'bg-[#f7f7f5] border-[#e9e9e7] text-[#37352f] hover:bg-gray-100'}`}>
                Home
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <aside className="w-60 shrink-0 py-6 pl-6 pr-6 flex flex-col" style={{
            borderRight: `1px solid ${darkMode ? '#333' : '#e9e9e7'}`
          }}>
            <div className="flex flex-col flex-1">
              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all ${darkMode ? `bg-[#252525]  ` : `bg-[#fafafa]  `} text-[15px] outline-none `}
                />
              </div>

              {/* Collections */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-[#6b6b6b] uppercase tracking-wide">Collections</h3>
                  <button onClick={() => setShowNewNook(true)} className="p-1.5 rounded-lg hover:bg-[#2f2f2f] text-[#6b6b6b]"><Plus className="w-4 h-4" /></button>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-1">
                  <motion.button variants={staggerItem} onClick={() => setSelectedNook('inbox')} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', (!selectedNook || selectedNook === 'inbox') ? (darkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100') : (darkMode ? 'text-[#6b6b6b] hover:text-[#ebebeb]' : 'text-[#6b6b6b] hover:text-[#37352f]'))}>
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#6b685e] to-[#4a4640] flex items-center justify-center"><Globe className="w-3 h-3 text-[#6b6b6b]" /></div>
                    <span>Inbox</span>
                    <span className="ml-auto text-xs text-[#6b6b6b]">{links.filter(l => !l.nookId).length}</span>
                  </motion.button>
                  {nooks.map(nook => (
                    <motion.button key={nook.id} variants={staggerItem} onClick={() => setSelectedNook(nook.id)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', selectedNook === nook.id ? (darkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100') : (darkMode ? 'text-[#6b6b6b] hover:text-[#ebebeb]' : 'text-[#6b6b6b] hover:text-[#37352f]'))}>
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: `${nook.color}15` }}><div className="w-2.5 h-2.5 rounded-full" style={{ background: nook.color }} /></div>
                      <span>{nook.name}</span>
                      <span className="ml-auto text-xs text-[#6b6b6b]">{links.filter(l => l.nookId === nook.id).length}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              {/* New Nook Form */}
              <AnimatePresence>
                {showNewNook && (
                  <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} className="p-4 rounded-2xl border mb-6" style={{ borderColor: darkMode ? '#333' : '#e9e9e7', background: darkMode ? '#252525' : '#fafafa' }}>
                    <input type="text" placeholder="Collection name" value={newNookName} onChange={(e) => setNewNookName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createNook()} className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none mb-3 ${darkMode ? 'bg-[#1c1c1c] border-[#333] text-[#ebebeb] placeholder:text-[#555]' : 'bg-white border-[#e9e9e7] text-[#37352f] placeholder:text-[#b4b4b0]'}`} autoFocus />
                    <div className="flex gap-1.5 mb-4">{NOOK_COLORS.map(c => <button key={c} onClick={() => setNewNookColor(c)} className={cn('w-6 h-6 rounded-full transition-all', newNookColor === c && 'scale-110 ring-2 ring-white/20')} style={{ background: c }} />)}</div>
                    <div className="flex gap-2">
                      <button onClick={createNook} className="flex-1 px-3 py-2 text-white text-sm font-semibold rounded-xl" style={{ background: '#37352f' }}>Create</button>
                      <button onClick={() => setShowNewNook(false)} className="px-3 py-2 rounded-xl" style={{ background: darkMode ? '#1c1c1c' : '#e9e9e7', color: darkMode ? '#6b6b6b' : '#6b6b6b' }}>Cancel</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats Card */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-2xl border mb-4" style={{ borderColor: darkMode ? '#333' : '#e9e9e7', background: darkMode ? 'linear-gradient(135deg, #252525 0%, #1c1c1c 100%)' : 'linear-gradient(135deg, #fafafa 0%, #f5f5f3 100%)' }}>
                <div className="flex items-center gap-2 text-xs text-[#6b6b6b] mb-2"><Clock className="w-3 h-3" /><span>This week</span></div>
                <div className="text-2xl font-bold text-[#ebebeb]" style={{ color: darkMode ? '#ebebeb' : '#37352f' }}>{links.filter(l => { const d = new Date(l.createdAt); const now = new Date(); return d.getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000; }).length}</div>
                <div className="text-xs text-[#6b6b6b]">new links saved</div>
              </motion.div>

              {/* Keyboard Shortcut */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="p-3 rounded-xl border" style={{ borderColor: darkMode ? '#333' : '#e9e9e7' }}>
                <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
                  <Keyboard className="w-4 h-4" />
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: darkMode ? '#333' : '#f2f2f0', color: darkMode ? '#888' : '#a8a8a4' }}>⌘K</kbd>
                  <span>to search</span>
                </div>
              </motion.div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 p-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                {selectedNookData && <div className="w-3 h-3 rounded-full" style={{ background: selectedNookData.color }} />}
                <h2 className="text-[24px] font-semibold tracking-tight" style={{ color: darkMode ? '#ebebeb' : '#37352f' }}>{selectedNook === 'inbox' || !selectedNook ? 'All Links' : selectedNookData?.name || 'Links'}</h2>
              </div>
              <span className="text-sm text-[#6b6b6b]">{filteredLinks.length} links</span>
            </motion.div>

            {filteredLinks.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center border" style={{ background: darkMode ? '#252525' : '#fafafa', borderColor: darkMode ? '#333' : '#e9e9e7' }}><Link2 className="w-10 h-10 text-[#6b6b6b]" /></div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: darkMode ? '#ebebeb' : '#37352f' }}>No links saved yet</h3>
                <p className="text-[#6b6b6b] text-sm max-w-sm mx-auto mb-6">Save links from the homepage or use the browser extension</p>
                <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl" style={{ background: '#37352f' }}>Save your first link</Link>
              </motion.div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate={showLinks ? "show" : "hidden"} className="grid gap-2">
                {filteredLinks.map((link) => (
                  <motion.div key={link.id} variants={staggerItem} onMouseEnter={() => setHoveredLink(link.id)} onMouseLeave={() => setHoveredLink(null)} className="group p-4 rounded-xl border transition-all" style={{ borderColor: darkMode ? '#333' : '#e9e9e7', background: darkMode ? '#252525' : 'white' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: darkMode ? '#1c1c1c' : '#f5f5f3' }}><Globe className="w-5 h-5 text-[#6b6b6b]" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[15px] font-medium hover:opacity-70 transition-colors line-clamp-1 block" style={{ color: darkMode ? '#ebebeb' : '#37352f' }}>{link.title || link.url}</a>
                            <div className="flex items-center gap-2 mt-1"><span className="text-xs text-[#6b6b6b]">{getDomain(link.url)}</span><span className="text-xs" style={{ color: darkMode ? '#555' : '#e5e5e3' }}>•</span><span className="text-xs text-[#6b6b6b]">{formatDate(link.createdAt)}</span></div>
                          </div>
                          <motion.div animate={{ opacity: hoveredLink === link.id ? 1 : 0 }} className="flex items-center gap-1">
                            <div className="relative">
                              <button className="p-2 rounded-xl hover:bg-[#333] text-[#6b6b6b] hover:text-[#ebebeb]"><Folder className="w-4 h-4" /></button>
                              <div className="absolute right-0 top-full mt-2 w-44 py-1.5 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20" style={{ background: darkMode ? '#252525' : 'white', border: `1px solid ${darkMode ? '#333' : '#e9e9e7'}` }}>
                                <button onClick={() => moveLink(link.id, null)} className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[#333]" style={{ color: darkMode ? '#6b6b6b' : '#6b6b6b' }}><Globe className="w-3.5 h-3.5" />Inbox</button>
                                {nooks.map(n => <button key={n.id} onClick={() => moveLink(link.id, n.id)} className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[#333]" style={{ color: darkMode ? '#6b6b6b' : '#6b6b6b' }}><div className="w-3.5 h-3.5 rounded-full" style={{ background: n.color }} />{n.name}</button>)}
                              </div>
                            </div>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-[#333] text-[#6b6b6b] hover:text-[#ebebeb]"><ExternalLink className="w-4 h-4" /></a>
                            <button onClick={() => deleteLink(link.id)} className="p-2 rounded-xl hover:bg-[#333] text-[#6b6b6b] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </motion.div>
                        </div>
                        {link.summary && <p className="text-sm text-[#6b6b6b] mt-2 line-clamp-2">{link.summary}</p>}
                        {link.tags && link.tags.length > 0 && <div className="flex flex-wrap gap-1.5 mt-3">{link.tags.slice(0, 4).map(t => <span key={t} className="px-2 py-0.5 rounded-md text-xs border" style={{ background: darkMode ? '#1c1c1c' : '#f5f5f3', borderColor: darkMode ? '#333' : '#e9e9e7', color: darkMode ? '#6b6b6b' : '#6b6b6b' }}>{t}</span>)}</div>}
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