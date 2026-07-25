'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function NavBar({
  actions,
  onToggleTheme,
}: {
  actions?: ReactNode;
  onToggleTheme: () => void;
}) {
  return (
    <nav className="relative z-50 bg-background/90 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="px-6 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="font-medium cursor-pointer hover:opacity-80 transition-opacity">
          nooks
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {actions}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-7 h-7 rounded-lg',
                  userButtonPopoverCard: 'bg-surface border border-border shadow-lg rounded-xl',
                  userButtonPopoverActionItem: 'text-foreground text-sm hover:bg-surface-alt',
                  userButtonPopoverActionItemText: 'text-foreground',
                  userButtonPopoverFooter: 'hidden',
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm px-4 py-2 rounded-lg border border-border bg-surface-alt text-foreground hover:bg-accent-light transition-colors"
            >
              Sign in
            </Link>
          </SignedOut>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-lg hover:bg-surface text-muted transition-colors"
          >
            <Sun className="w-[18px] h-[18px] hidden dark:block" />
            <Moon className="w-[18px] h-[18px] block dark:hidden" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
