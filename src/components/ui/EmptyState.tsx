'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-24"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center border border-border bg-surface">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted text-sm max-w-sm mx-auto mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
