'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, FolderOpen, Plus, ExternalLink, Trash2,
  ArrowRight, Command, X, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div className="bg-white dark:bg-[#252220] rounded-2xl border border-[#e8e4dc] dark:border-[#3d3835] shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-[#e8e4dc] dark:border-[#3d3835]">
                <Search className="w-5 h-5 text-[#a09a90]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search links, collections..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-[#a09a90]"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[#f5f2eb] dark:bg-[#1a1915] rounded text-xs text-[#6b685e]">
                  <Command className="w-3 h-3" />K
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-[#6b685e]">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>No results found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {groupedItems.actions.length > 0 && (
                      <div className="px-2 py-1">
                        <p className="text-xs font-medium text-[#a09a90] uppercase tracking-wide mb-1">Actions</p>
                        {groupedItems.actions.map((item, idx) => (
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
                        <p className="text-xs font-medium text-[#a09a90] uppercase tracking-wide mb-1">Collections</p>
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
                        <p className="text-xs font-medium text-[#a09a90] uppercase tracking-wide mb-1">Links</p>
                        {groupedItems.links.slice(0, 10).map((item) => (
                          <CommandItemRow
                            key={item.id}
                            item={item}
                            isSelected={flatItems.indexOf(item) === selectedIndex}
                            onSelect={() => { item.action(); onClose(); }}
                          />
                        ))}
                        {groupedItems.links.length > 10 && (
                          <p className="px-3 py-2 text-xs text-[#a09a90]">
                            +{groupedItems.links.length - 10} more links
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#e8e4dc] dark:border-[#3d3835] bg-[#faf8f5] dark:bg-[#1a1915]">
                <div className="flex items-center gap-4 text-xs text-[#6b685e]">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#252220] rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#252220] rounded">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="text-xs text-[#a09a90]">Press esc to close</span>
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
        'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors',
        isSelected
          ? 'bg-amber-500/10 text-foreground'
          : 'hover:bg-[#f5f2eb] dark:hover:bg-[#2d2926] text-[#6b685e]'
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center',
        isSelected ? 'bg-amber-500/20' : 'bg-[#f5f2eb] dark:bg-[#2d2926]'
      )}>
        <span className={isSelected ? 'text-amber-600' : 'text-[#6b685e]'}>
          {item.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        {item.subtitle && (
          <p className="text-xs text-[#a09a90] truncate">{item.subtitle}</p>
        )}
      </div>
      {isSelected && <ArrowRight className="w-4 h-4 text-amber-600" />}
    </button>
  );
}

// Hook for keyboard shortcut
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