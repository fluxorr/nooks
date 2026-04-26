'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Plus, Search, Link2, Trash2, Folder, 
  MoreHorizontal, ExternalLink, X, Check
} from 'lucide-react';
import { cn, generateId } from '@/lib/utils';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight">nooks</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-muted hover:text-white transition-colors">
              Landing
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-8">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg text-sm outline-none focus:border-accent/50 transition-colors"
                />
              </div>

              {/* Nooks */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Nooks</h3>
                  <button
                    onClick={() => setShowNewNook(true)}
                    className="p-1 rounded hover:bg-surface transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedNook('inbox')}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                      (!selectedNook || selectedNook === 'inbox') 
                        ? 'bg-surface text-white' 
                        : 'text-muted hover:text-white hover:bg-surface/50'
                    )}
                  >
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-gray-500 to-gray-600" />
                    Inbox
                    <span className="ml-auto text-xs text-muted">
                      {links.filter(l => !l.nookId).length}
                    </span>
                  </button>

                  {nooks.map(nook => (
                    <button
                      key={nook.id}
                      onClick={() => setSelectedNook(nook.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedNook === nook.id 
                          ? 'bg-surface text-white' 
                          : 'text-muted hover:text-white hover:bg-surface/50'
                      )}
                    >
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ background: nook.color }}
                      />
                      {nook.name}
                      <span className="ml-auto text-xs text-muted">
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
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-surface rounded-xl border border-white/10"
                  >
                    <input
                      type="text"
                      placeholder="Nook name"
                      value={newNookName}
                      onChange={(e) => setNewNookName(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm outline-none mb-3"
                      autoFocus
                    />
                    <div className="flex gap-2 mb-3">
                      {NOOK_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewNookColor(color)}
                          className={cn(
                            'w-6 h-6 rounded-full transition-transform',
                            newNookColor === color ? 'scale-110 ring-2 ring-white/20' : ''
                          )}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={createNook}
                        className="flex-1 px-3 py-2 bg-accent text-black text-sm font-medium rounded-lg hover:bg-accent-hover"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowNewNook(false)}
                        className="px-3 py-2 bg-surface-hover text-sm rounded-lg hover:bg-surface"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* Links Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedNook === 'inbox' || !selectedNook 
                  ? 'Inbox' 
                  : nooks.find(n => n.id === selectedNook)?.name || 'Links'}
              </h2>
              <span className="text-sm text-muted">{filteredLinks.length} links</span>
            </div>

            {filteredLinks.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
                  <Link2 className="w-8 h-8 text-muted" />
                </div>
                <h3 className="text-lg font-medium mb-2">No links yet</h3>
                <p className="text-muted text-sm">
                  Save some links from the homepage to see them here
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredLinks.map((link, i) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-surface border border-white/5 rounded-xl hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium hover:text-accent transition-colors line-clamp-1"
                        >
                          {link.title || link.url}
                        </a>
                        {link.summary && (
                          <p className="text-sm text-muted mt-1 line-clamp-2">{link.summary}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          {link.tags?.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-surface-hover rounded text-xs text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-xs text-muted/50">
                            {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Move to nook dropdown */}
                        <div className="relative group/move">
                          <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                            <Folder className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-48 py-1 bg-surface border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover/move:opacity-100 group-hover/move:visible transition-all z-10">
                            <button
                              onClick={() => moveLink(link.id, null)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-surface-hover"
                            >
                              Inbox
                            </button>
                            {nooks.map(nook => (
                              <button
                                key={nook.id}
                                onClick={() => moveLink(link.id, nook.id)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-surface-hover flex items-center gap-2"
                              >
                                <div className="w-3 h-3 rounded" style={{ background: nook.color }} />
                                {nook.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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