'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, FolderOpen, Plus, ExternalLink, Trash2,
  ArrowRight, X, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Kbd } from '@/components/ui/Kbd';

type CommandItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'links' | 'nooks' | 'actions';
};

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  links: { id: string; url: string; title: string }[];
  nooks: { id: string; name: string; color: string }[];
  onNavigateToNook: (nookId: string) => void;
  onCreateNook: () => void;
  onDeleteLink: (linkId: string) => void;
};

export function CommandPalette({
  isOpen,
  onClose,
  links,
  nooks,
  onNavigateToNook,
  onCreateNook,
  onDeleteLink,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const items: CommandItem[] = [
    ...links.map(link => ({
      id: link.id,
      title: link.title || link.url,
      subtitle: getDomain(link.url),
      icon: <ExternalLink className="w-4 h-4" />,
      action: () => window.open(link.url, '_blank'),
      category: 'links' as const,
    })),
    ...nooks.map(nook => ({
      id: nook.id,
      title: nook.name,
      subtitle: 'Collection',
      icon: <div className="w-4 h-4 rounded-full" style={{ background: nook.color }} />,
      action: () => onNavigateToNook(nook.id),
      category: 'nooks' as const,
    })),
    {
      id: 'create-nook',
      title: 'Create new collection',
      subtitle: 'Add a new Nook',
      icon: <Plus className="w-4 h-4" />,
      action: () => { onCreateNook(); onClose(); },
      category: 'actions',
    },
  ];

  const filteredItems = query
    ? items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase())
    )
    : items;

  const groupedItems = {
    links: filteredItems.filter(i => i.category === 'links'),
    nooks: filteredItems.filter(i => i.category === 'nooks'),
    actions: filteredItems.filter(i => i.category === 'actions'),
  };

  const flatItems = filteredItems;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        flatItems[selectedIndex]?.action();
        onClose();
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [flatItems, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.8 }}
            className="fixed top-[12%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div className="rounded-2xl overflow-hidden border border-border bg-background shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                <Search className="w-5 h-5 text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search links, collections..."
                  className="flex-1 bg-transparent outline-none text-[15px] text-foreground placeholder:text-muted"
                  aria-label="Search links and collections"
                />
                <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-surface text-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M9 7a2 2 0 1 1 2 2H7a2 2 0 1 1 2-2v10a2 2 0 1 1-2-2h10a2 2 0 1 1-2 2V9a2 2 0 1 1 2-2H9z" /></svg>K
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-muted">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-[15px]">No results found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {groupedItems.actions.length > 0 && (
                      <div className="px-2 py-1">
                        <p className="text-xs font-medium mb-2 text-muted tracking-wider uppercase">Actions</p>
                        {groupedItems.actions.map((item) => (
                          <CommandItemRow
                            key={item.id}
                            item={item}
                            isSelected={flatItems.indexOf(item) === selectedIndex}
                            onSelect={() => { item.action(); onClose(); }}
                          />
                        ))}
                      </div>
                    )}

                    {groupedItems.nooks.length > 0 && (
                      <div className="px-2 py-1">
                        <p className="text-xs font-medium mb-2 text-muted tracking-wider uppercase">Collections</p>
                        {groupedItems.nooks.map((item) => (
                          <CommandItemRow
                            key={item.id}
                            item={item}
                            isSelected={flatItems.indexOf(item) === selectedIndex}
                            onSelect={() => { item.action(); onClose(); }}
                          />
                        ))}
                      </div>
                    )}

                    {groupedItems.links.length > 0 && (
                      <div className="px-2 py-1">
                        <p className="text-xs font-medium mb-2 text-muted tracking-wider uppercase">Links</p>
                        {groupedItems.links.slice(0, 10).map((item) => (
                          <CommandItemRow
                            key={item.id}
                            item={item}
                            isSelected={flatItems.indexOf(item) === selectedIndex}
                            onSelect={() => { item.action(); onClose(); }}
                          />
                        ))}
                        {groupedItems.links.length > 10 && (
                          <p className="px-3 py-2 text-xs text-muted">
                            +{groupedItems.links.length - 10} more links
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface">
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Kbd className="bg-background">↑↓</Kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd className="bg-background">↵</Kbd>
                    Select
                  </span>
                </div>
                <span className="text-xs text-muted">esc to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CommandItemRow({
  item,
  isSelected,
  onSelect,
}: {
  item: CommandItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors',
        isSelected ? 'bg-surface text-foreground' : 'text-muted hover:bg-surface'
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
        isSelected ? 'bg-surface' : 'bg-background'
      )}>
        <span className={isSelected ? 'text-foreground' : 'text-muted'}>
          {item.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium truncate">{item.title}</p>
        {item.subtitle && (
          <p className="text-xs truncate text-muted">{item.subtitle}</p>
        )}
      </div>
      {isSelected && <ArrowRight className="w-4 h-4 text-foreground" />}
    </button>
  );
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}
