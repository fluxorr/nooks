'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Moon, Sun, Sparkles, FolderSearch, Zap } from 'lucide-react';
import { Scales } from '@/components/ui/scales';

export default function Page() {
  const [url, setUrl] = useState('');
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSave = () => {
    if (!url) return;
    window.location.href = `/save?url=${encodeURIComponent(url)}`;
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const features = [
    { icon: Sparkles, title: 'Auto-summarizes', desc: 'AI generates summaries for every link you save', color: 'bg-blue-100 text-blue-600', darkText: 'text-blue-400' },
    { icon: FolderSearch, title: 'Organize in Nooks', desc: 'Create collections to keep your links organized', color: 'bg-green-100 text-green-600', darkText: 'text-green-400' },
    { icon: Zap, title: 'Instant search', desc: 'Find any link in milliseconds across all your Nooks', color: 'bg-purple-100 text-purple-600', darkText: 'text-purple-400' },
  ];

  const borderColor = darkMode ? '#222222' : '#e9e9e7';

  return (
    <main className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#1c1c1c] text-[#ebebeb]' : 'bg-white text-[#37352f]'}`}>
      <div className="fixed inset-y-0 left-0 right-0 pointer-events-none mx-auto max-w-2xl" style={{ borderLeft: `1px dashed ${darkMode ? '#333' : '#e5e5e5'}`, borderRight: `1px dashed ${darkMode ? '#333' : '#e5e5e5'}` }} />

      <div className="max-w-2xl mx-auto relative min-h-screen" style={{ borderLeft: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}>

        {/* Nav */}
        <nav className={`relative z-50 transition-all duration-300 ${darkMode ? 'bg-[#1c1c1c]/90' : 'bg-white/90'} backdrop-blur-md`} style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div className="px-8 py-3 flex items-center justify-between">
            <motion.span whileHover={{ scale: 1.02 }} className="font-medium cursor-pointer">nooks</motion.span>
            <div className="flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-[#2f2f2f] text-[#6b6b6b]' : 'hover:bg-gray-100 text-[#9b9b9b]'}`}>
                <motion.div animate={{ rotate: darkMode ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </motion.button>
              <motion.a href="/dashboard" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`text-sm px-3 py-1.5 rounded-lg transition-all border ${darkMode ? 'bg-[#2a2a2a] border-[#333] text-[#ebebeb] hover:bg-[#333]' : 'bg-[#f7f7f5] border-[#e9e9e7] text-[#37352f] hover:bg-gray-100'}`}>
                Dashboard
              </motion.a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-24 pb-16 px-8">
          {mounted && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
              <h1 className={`text-[32px] font-semibold tracking-tight mb-4 leading-[1.2] ${darkMode ? 'text-[#ebebeb]' : 'text-[#37352f]'}`}>
                Curate the web,<br /><span className={darkMode ? 'text-[#8b8b8b]' : 'text-[#a8a8a4]'}>remember everything</span>
              </h1>
              <p className={`text-[15px] mb-8 leading-relaxed max-w-md ${darkMode ? 'text-[#8b8b8b]' : 'text-[#6b6b6b]'}`}>
                Save links with AI summaries. Organize in collections called Nooks. Search instantly across all your saved content.
              </p>

              <motion.div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6" layout>
                <div className={`flex-1 w-full max-w-sm flex items-center rounded-lg px-3 py-2 border transition-all ${darkMode ? `bg-[#252525] border-[#333] ${inputFocused ? 'border-[#555]' : 'hover:border-[#444]'}` : `bg-[#fafafa] border-[#e5e5e3] ${inputFocused ? 'border-[#ccc9c5] shadow-sm' : 'hover:border-[#ccc9c5]'}`}`}>
                  <input type="url" placeholder="Paste a link..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} className={`flex-1 bg-transparent text-[15px] outline-none transition-colors ${darkMode ? 'text-[#ebebeb] placeholder:text-[#666]' : 'text-[#37352f] placeholder:text-[#b4b4b0]'}`} />
                </div>
                <motion.button onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`flex items-center gap-1.5 px-4 py-2 shrink-0 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-[#333] text-[#ebebeb] hover:bg-[#444]' : 'bg-[#37352f] text-white hover:bg-[#55524d]'}`}>
                  <Plus className="w-4 h-4" />
                  <span>Save</span>
                </motion.button>
              </motion.div>

              <motion.p className={`text-sm tracking-tight ${darkMode ? 'text-[#555]' : 'text-[#a8a8a4]'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                Or press <kbd className={`px-1 rounded text-xs font-mono ml-0.5 mr-0.5 ${darkMode ? 'bg-[#333] text-[#888]' : 'bg-[#f2f2f0] border-[#e5e5e3] text-[#a8a8a4]'}`}>⌘⇧S</kbd> with our extension
              </motion.p>
            </motion.div>
          )}
        </section>

        <div style={{ borderBottom: `1px solid ${borderColor}` }} />

        {/* Features */}
        <section className="py-8 px-4 transition-colors duration-300">
          <div className="grid gap-1">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }} viewport={{ once: true }} className={`flex items-start gap-4 p-4 rounded-xl transition-all group ${darkMode ? '' : 'hover:bg-gray-50'}`}>
                <motion.div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${darkMode ? 'bg-white font-bold' : f.color}`} whileHover={{ scale: 1.05 }}>
                  <f.icon className={`w-5 h-5 ${darkMode ? f.darkText : ''}`} />
                </motion.div>
                <div className="pt-0.5">
                  <motion.span className={`text-[15px] font-medium tracking-tight ${darkMode ? 'text-[#ebebeb]' : 'text-[#37352f]'}`}>{f.title}</motion.span>
                  <p className={`text-[13px] mt-1 leading-relaxed ${darkMode ? 'text-[#8b8b8b]' : 'text-[#6b6b6b]'}`}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div style={{ borderBottom: `1px solid ${borderColor}` }} />

        {/* CTA */}
        <section className="py-12 px-8">
          <div className="text-center">
            <motion.a href="/dashboard" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`inline-flex items-center gap-2 text-[13px] transition-colors ${darkMode ? 'text-[#8b8b8b] hover:text-[#ebebeb]' : 'text-[#6b6b6b] hover:text-[#37352f]'}`}>
              Open Dashboard
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>→</motion.span>
            </motion.a>
          </div>
        </section>

        <div style={{ borderBottom: `1px solid ${borderColor}` }} />

        {/* Footer */}
        <footer className="py-8 px-8">
          <div className="text-center">
            <motion.p className={`text-[13px] ${darkMode ? 'text-[#555]' : 'text-[#a8a8a4]'}`} whileHover={{ opacity: 0.7 }}>Free forever</motion.p>
          </div>
        </footer>

      </div>
    </main>
  );
}
