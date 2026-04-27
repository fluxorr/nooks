'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Plus, Search, Link2, Trash2, Folder, 
  ExternalLink, Globe, Clock, Home, Command, Keyboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';
import { staggerContainer, staggerItem } from '@/components/ViewTransitions';

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
  '#d97706', '#dc2626', '#16a34a', '#2563eb', '#7c3aed',
  '#db2777', '#0d9488', '#ea580c', '#65a30d', '#0891b2',
];

export default function Dashboard() {
  const router = useRouter();
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
  const [mounted, setMounted] = useState(false);

  // Stagger animation state
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setShowLinks(true), 100);
    }
  }, [loading]);

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
    // Optimistic update
    const previousLinks = [...links];
    setLinks(links.map(l => l.id === linkId ? { ...l, nookId } : l));

    try {
      await fetch('/api/links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, nookId }),
      });
    } catch (e) {
      console.error(e);
      setLinks(previousLinks);
    }
  };

  const deleteLink = async (linkId: string) => {
    // Optimistic update
    const previousLinks = [...links];
    setLinks(links.filter(l => l.id !== linkId));

    try {
      await fetch('/api/links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId }),
      });
    } catch (e) {
      console.error(e);
      setLinks(previousLinks);
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
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1915] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-amber-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] dark:bg-[#1a1915]">
      {/* Grain texture */}
      <div className="grain" />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setCommandOpen(false)}
        links={links.map(l => ({ id: l.id, url: l.url, title: l.title || l.url }))}
        nooks={nooks}
        onNavigateToNook={(nookId) => setSelectedNook(nookId)}
        onCreateNook={() => setShowNewNook(true)}
        onDeleteLink={deleteLink}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[#e8e4dc] dark:border-[#3d3835]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-foreground">nooks</span>
          </a>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f5f2eb] dark:bg-[#252220] rounded-lg border border-[#e8e4dc] dark:border-[#3d3835] text-sm text-[#6b685e] hover:text-foreground transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">Search...</span>
              <kbd className="ml-2 px-1.5 py-0.5 bg-white dark:bg-[#1a1915] rounded text-xs">
                <Command className="w-3 h-3 inline" />K
              </kbd>
            </button>
            <a href="/" className="flex items-center gap-2 text-sm text-[#6b685e] hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <div className="w-px h-4 bg-[#e8e4dc] dark:bg-[#3d3835]" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f5f2eb] dark:bg-[#252220] rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-[#6b685e]">{links.length} links</span>
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09a90]" />
                <input
                  type="text"
                  placeholder="Filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#252220] border border-[#e8e4dc] dark:border-[#3d3835] rounded-xl text-sm text-foreground placeholder:text-[#a09a90] outline-none focus:border-amber-500/30 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>

              {/* Nooks */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-[#a09a90] uppercase tracking-widest">Collections</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewNook(true)}
                    className="p-1.5 rounded-lg hover:bg-[#f5f2eb] dark:hover:bg-[#252220] transition-colors text-[#6b685e] hover:text-amber-600"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>

                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-1.5"
                >
                  <motion.button
                    variants={staggerItem}
                    onClick={() => setSelectedNook('inbox')}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      (!selectedNook || selectedNook === 'inbox') 
                        ? 'bg-white dark:bg-[#252220] text-foreground shadow-sm border border-[#e8e4dc] dark:border-[#3d3835]' 
                        : 'text-[#6b685e] hover:text-foreground hover:bg-[#f5f2eb] dark:hover:bg-[#252220]/50'
                    )}
                  >
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#6b685e] to-[#4a4640] flex items-center justify-center">
                      <Globe className="w-3 h-3 text-[#a09a90]" />
                    </div>
                    <span>Inbox</span>
                    <span className="ml-auto text-xs text-[#a09a90] font-normal">
                      {links.filter(l => !l.nookId).length}
                    </span>
                  </motion.button>

                  {nooks.map(nook => (
                    <motion.button
                      key={nook.id}
                      variants={staggerItem}
                      onClick={() => setSelectedNook(nook.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        selectedNook === nook.id 
                          ? 'bg-white dark:bg-[#252220] text-foreground shadow-sm border border-[#e8e4dc] dark:border-[#3d3835]' 
                          : 'text-[#6b685e] hover:text-foreground hover:bg-[#f5f2eb] dark:hover:bg-[#252220]/50'
                      )}
                    >
                      <div 
                        className="w-5 h-5 rounded-lg flex items-center justify-center"
                        style={{ background: `${nook.color}15` }}
                      >
                        <div 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: nook.color }}
                        />
                      </div>
                      <span>{nook.name}</span>
                      <span className="ml-auto text-xs text-[#a09a90] font-normal">
                        {links.filter(l => l.nookId === nook.id).length}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              {/* Add Nook Form */}
              <AnimatePresence>
                {showNewNook && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 bg-white dark:bg-[#252220] rounded-2xl border border-[#e8e4dc] dark:border-[#3d3835]"
                  >
                    <input
                      type="text"
                      placeholder="Collection name"
                      value={newNookName}
                      onChange={(e) => setNewNookName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && createNook()}
                      className="w-full px-3 py-2.5 bg-[#faf8f5] dark:bg-[#1a1915] border border-[#e8e4dc] dark:border-[#3d3835] rounded-xl text-sm text-foreground placeholder:text-[#a09a90] outline-none mb-3"
                      autoFocus
                    />
                    <div className="flex gap-1.5 mb-4">
                      {NOOK_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewNookColor(color)}
                          className={cn(
                            'w-6 h-6 rounded-full transition-all',
                            newNookColor === color ? 'scale-110 ring-2 ring-foreground/20 ring-offset-2 ring-offset-white dark:ring-offset-[#252220]' : 'hover:scale-105'
                          )}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={createNook}
                        className="flex-1 px-3 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowNewNook(false)}
                        className="px-3 py-2 bg-[#f5f2eb] dark:bg-[#1a1915] text-[#6b685e] text-sm rounded-xl hover:bg-[#e8e4dc] dark:hover:bg-[#252220] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-4 bg-gradient-to-br from-white to-[#f5f2eb] dark:from-[#252220] dark:to-[#1a1915] rounded-2xl border border-[#e8e4dc] dark:border-[#3d3835]"
              >
                <div className="flex items-center gap-2 text-xs text-[#6b685e] mb-2">
                  <Clock className="w-3 h-3" />
                  <span>This week</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {links.filter(l => {
                    const d = new Date(l.createdAt);
                    const now = new Date();
                    return d.getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000;
                  }).length}
                </div>
                <div className="text-xs text-[#6b685e]">new links saved</div>
              </motion.div>

              {/* Keyboard hint */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-3 bg-[#f5f2eb] dark:bg-[#252220] rounded-xl border border-[#e8e4dc] dark:border-[#3d3835]"
              >
                <div className="flex items-center gap-2 text-xs text-[#6b685e]">
                  <Keyboard className="w-4 h-4" />
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#1a1915] rounded text-xs font-mono">
                    ⌘K
                  </kbd>
                  <span>to search</span>
                </div>
              </motion.div>
            </div>
          </aside>

          {/* Links Grid */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-3">
                {selectedNookData && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full"
                    style={{ background: selectedNookData.color }}
                  />
                )}
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedNook === 'inbox' || !selectedNook 
                    ? 'All Links' 
                    : selectedNookData?.name || 'Links'}
                </h2>
              </div>
              <span className="text-sm text-[#6b685e]">
                {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
              </span>
            </motion.div>

            {filteredLinks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white dark:bg-[#252220] flex items-center justify-center border border-[#e8e4dc] dark:border-[#3d3835]">
                  <Link2 className="w-10 h-10 text-[#a09a90]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No links saved yet</h3>
                <p className="text-[#6b685e] text-sm max-w-sm mx-auto">
                  Save links from the homepage or use the browser extension to build your collection
                </p>
                <a 
                  href="/"
                  className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors"
                >
                  Save your first link
                </a>
              </motion.div>
            ) : (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate={showLinks ? "show" : "hidden"}
                className="grid gap-3"
              >
                {filteredLinks.map((link, i) => (
                  <motion.div
                    key={link.id}
                    variants={staggerItem}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="group relative p-4 bg-white dark:bg-[#252220] rounded-2xl border border-[#e8e4dc] dark:border-[#3d3835] hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Favicon */}
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5f2eb] to-[#e8e4dc] dark:from-[#2d2926] dark:to-[#252220] flex items-center justify-center shrink-0 border border-[#e8e4dc] dark:border-[#3d3835]"
                      >
                        <Globe className="w-5 h-5 text-[#a09a90]" />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base font-semibold text-foreground hover:text-amber-600 transition-colors line-clamp-1 block"
                            >
                              {link.title || link.url}
                            </a>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-[#a09a90]">{getDomain(link.url)}</span>
                              <span className="text-xs text-[#d4d0c8]">•</span>
                              <span className="text-xs text-[#6b685e]">{formatDate(link.createdAt)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <motion.div 
                            animate={{ opacity: hoveredLink === link.id ? 1 : 0 }}
                            className="flex items-center gap-1"
                          >
                            {/* Move to nook */}
                            <div className="relative">
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-xl hover:bg-[#f5f2eb] dark:hover:bg-[#2d2926] transition-colors text-[#6b685e] hover:text-foreground"
                              >
                                <Folder className="w-4 h-4" />
                              </motion.button>
                              <div className="absolute right-0 top-full mt-2 w-44 py-1.5 bg-white dark:bg-[#2d2926] border border-[#e8e4dc] dark:border-[#3d3835] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                <button
                                  onClick={() => moveLink(link.id, null)}
                                  className="w-full px-3 py-2 text-left text-sm text-[#6b685e] hover:text-foreground hover:bg-[#f5f2eb] dark:hover:bg-[#252220] flex items-center gap-2"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  Inbox
                                </button>
                                {nooks.map(nook => (
                                  <button
                                    key={nook.id}
                                    onClick={() => moveLink(link.id, nook.id)}
                                    className="w-full px-3 py-2 text-left text-sm text-[#6b685e] hover:text-foreground hover:bg-[#f5f2eb] dark:hover:bg-[#252220] flex items-center gap-2"
                                  >
                                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: nook.color }} />
                                    {nook.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <motion.a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-xl hover:bg-[#f5f2eb] dark:hover:bg-[#2d2926] transition-colors text-[#6b685e] hover:text-foreground"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.a>
                            <motion.button
                              onClick={() => deleteLink(link.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 rounded-xl hover:bg-[#f5f2eb] dark:hover:bg-[#2d2926] transition-colors text-[#a09a90] hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        </div>

                        {link.summary && (
                          <p className="text-sm text-[#6b685e] mt-2 line-clamp-2 leading-relaxed">
                            {link.summary}
                          </p>
                        )}

                        {link.tags && link.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {link.tags.slice(0, 4).map(tag => (
                              <motion.span
                                key={tag}
                                whileHover={{ scale: 1.05 }}
                                className="px-2 py-0.5 bg-[#f5f2eb] dark:bg-[#2d2926] text-[#6b685e] text-xs rounded-md border border-[#e8e4dc] dark:border-[#3d3835]"
                              >
                                {tag}
                              </motion.span>
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