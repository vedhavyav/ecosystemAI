'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TubelightTabsProps {
  items: NavItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TubelightTabs({ items, activeTab, onChange, className }: TubelightTabsProps) {
  return (
    <div className={cn('relative z-10 w-full mb-8 overflow-x-auto', className)}>
      <div className="flex items-center justify-start gap-2 bg-white/20 border border-emerald-800/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-max max-w-full">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                'relative cursor-pointer text-sm font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2',
                'text-emerald-900/60 hover:text-emerald-950',
                isActive && 'bg-white/40 text-emerald-950'
              )}
            >
              <Icon size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="lampTab"
                  className="absolute inset-0 w-full bg-emerald-100/30 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-800 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-emerald-800/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-emerald-800/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-emerald-800/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
