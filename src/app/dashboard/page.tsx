'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Plus, Search, Link2, Trash2, Folder, 
  ExternalLink, Globe, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Nook = {
  id: string;
  name: string;
  color: string;
  isPublic: boolean;
};

type Link = {
  id: string;
  url: string;
  title: string;
  summary: string;
  nookId: string | null;
  tags: string[];
  createdAt: string;
};

const NOOK_COLORS = [
  '#f5a623', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#84cc16', '#06b6d4',
];

export default function Dashboard() {
  const [nooks, setNooks] = useState<Nook[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedNook, setSelectedNook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewNook, setShowNewNook] = useState(false);
  const [newNookName, setNewNookName] = useState('');
  const [newNookColor, setNewNookColor] = useState('#f5a623');
  const [loading, setLoading] = useState(true);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/nooks');
      const data = await res.json();
      setNooks(data.nooks || []);
      setLinks(data.links || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createNook = async () => {
    if (!newNookName.trim()) return;
    try {
      const res = await fetch('/api/nooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newNookName, color: newNookColor }),
      });
      const nook = await res.json();
      setNooks([...nooks, nook]);
      setShowNewNook(false);
      setNewNookName('');
    } catch (e) {
      console.error(e);
    }
  };

  const moveLink = async (linkId: string, nookId: string | null) => {
    try {
      await fetch('/api/links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, nookId }),
      });
      setLinks(links.map(l => l.id === linkId ? { ...l, nookId } : l));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      await fetch('/api/links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId }),
      });
      setLinks(links.filter(l => l.id !== linkId));
    } catch (e) {
      console.error(e);
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredLinks = links.filter(link => {
    const matchesNook = !selectedNook || selectedNook === 'inbox' 
      ? !link.nookId || link.nookId === 'inbox'
      : link.nookId === selectedNook;
    const matchesSearch = !searchQuery || 
      link.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesNook && matchesSearch;
  });

  const selectedNookData = !selectedNook || selectedNook === 'inbox' 
    ? null 
    : nooks.find(n => n.id === selectedNook);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/[0.08] backdrop-blur-xl sticky top-0 z-50 bg-[#0a0a0a]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-[1px]">
              <div className="w-full h-full rounded-xl bg-[#0a0a0a] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight group-hover:text-amber-400 transition-colors">nooks</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Home
            </a>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted">{links.length} links</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            <div className="sticky top-24">
              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-white/[0.06] rounded-xl text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-amber-500/30 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>

              {/* Nooks */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Collections</h3>
                  <button
                    onClick={() => setShowNewNook(true)}
                    className="p-1.5 rounded-lg hover:bg-surface transition-colors text-zinc-500 hover:text-amber-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedNook('inbox')}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      (!selectedNook || selectedNook === 'inbox') 
                        ? 'bg-surface text-white shadow-lg shadow-black/20' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-surface/50'
                    )}
                  >
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center">
                      <Globe className="w-3 h-3 text-zinc-400" />
                    </div>
                    <span>Inbox</span>
                    <span className="ml-auto text-xs text-zinc-600 font-normal">
                      {links.filter(l => !l.nookId).length}
                    </span>
                  </button>

                  {nooks.map(nook => (
                    <button
                      key={nook.id}
                      onClick={() => setSelectedNook(nook.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        selectedNook === nook.id 
                          ? 'bg-surface text-white shadow-lg shadow-black/20' 
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-surface/50'
                      )}
                    >
                      <div 
                        className="w-5 h-5 rounded-lg flex items-center justify-center"
                        style={{ background: `${nook.color}20` }}
                      >
                        <div 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: nook.color }}
                        />
                      </div>
                      <span>{nook.name}</span>
                      <span className="ml-auto text-xs text-zinc-600 font-normal">
                        {links.filter(l => l.nookId === nook.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Nook Form */}
              <AnimatePresence>
                {showNewNook && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/[0.08]"
                  >
                    <input
                      type="text"
                      placeholder="Collection name"
                      value={newNookName}
                      onChange={(e) => setNewNookName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && createNook()}
                      className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-zinc-600 outline-none mb-3"
                      autoFocus
                    />
                    <div className="flex gap-1.5 mb-4">
                      {NOOK_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewNookColor(color)}
                          className={cn(
                            'w-6 h-6 rounded-full transition-all',
                            newNookColor === color ? 'scale-110 ring-2 ring-white/30 ring-offset-2 ring-offset-[#0a0a0a]' : 'hover:scale-105'
                          )}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={createNook}
                        className="flex-1 px-3 py-2 bg-amber-500 text-black text-sm font-semibold rounded-xl hover:bg-amber-400 transition-colors"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowNewNook(false)}
                        className="px-3 py-2 bg-[#0a0a0a] text-zinc-400 text-sm rounded-xl hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats */}
              <div className="mt-8 p-4 bg-gradient-to-br from-surface to-[#0a0a0a] rounded-2xl border border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <Clock className="w-3 h-3" />
                  <span>This week</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {links.filter(l => {
                    const d = new Date(l.createdAt);
                    const now = new Date();
                    return d.getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000;
                  }).length}
                </div>
                <div className="text-xs text-zinc-500">new links saved</div>
              </div>
            </div>
          </aside>

          {/* Links Grid */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {selectedNookData && (
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ background: selectedNookData.color }}
                  />
                )}
                <h2 className="text-2xl font-bold text-white">
                  {selectedNook === 'inbox' || !selectedNook 
                    ? 'All Links' 
                    : selectedNookData?.name || 'Links'}
                </h2>
              </div>
              <span className="text-sm text-zinc-500">
                {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
              </span>
            </div>

            {filteredLinks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface flex items-center justify-center border border-white/[0.06]">
                  <Link2 className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-2">No links saved yet</h3>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                  Save links from the homepage or use the browser extension to build your collection
                </p>
                <a 
                  href="/"
                  className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-amber-500 text-black text-sm font-semibold rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Save your first link
                </a>
              </motion.div>
            ) : (
              <div className="grid gap-3">
                {filteredLinks.map((link, i) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="group relative p-4 bg-surface/50 hover:bg-surface rounded-2xl border border-white/[0.04] hover:border-white/[0.08] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Favicon */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shrink-0 border border-white/[0.06]">
                        <Globe className="w-5 h-5 text-zinc-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base font-semibold text-zinc-200 hover:text-amber-400 transition-colors line-clamp-1 block"
                            >
                              {link.title || link.url}
                            </a>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-zinc-600">{getDomain(link.url)}</span>
                              <span className="text-xs text-zinc-700">•</span>
                              <span className="text-xs text-zinc-500">{formatDate(link.createdAt)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className={cn(
                            'flex items-center gap-1 transition-opacity',
                            hoveredLink === link.id ? 'opacity-100' : 'opacity-0'
                          )}>
                            {/* Move to nook */}
                            <div className="relative">
                              <button className="p-2 rounded-xl hover:bg-white/5 transition-colors text-zinc-500 hover:text-zinc-300">
                                <Folder className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 top-full mt-2 w-44 py-1.5 bg-[#171717] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                <button
                                  onClick={() => moveLink(link.id, null)}
                                  className="w-full px-3 py-2 text-left text-sm text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  Inbox
                                </button>
                                {nooks.map(nook => (
                                  <button
                                    key={nook.id}
                                    onClick={() => moveLink(link.id, nook.id)}
                                    className="w-full px-3 py-2 text-left text-sm text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                  >
                                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: nook.color }} />
                                    {nook.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl hover:bg-white/5 transition-colors text-zinc-500 hover:text-zinc-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => deleteLink(link.id)}
                              className="p-2 rounded-xl hover:bg-white/5 transition-colors text-zinc-600 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {link.summary && (
                          <p className="text-sm text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                            {link.summary}
                          </p>
                        )}

                        {link.tags && link.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {link.tags.slice(0, 4).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-white/[0.03] text-zinc-500 text-xs rounded-md border border-white/[0.04]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}