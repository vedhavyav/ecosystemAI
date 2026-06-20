'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  action?: () => void;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const navRef = useRef<HTMLDivElement>(null);

  // Note: Trapping focus on a persistent navbar will prevent keyboard users from accessing the main content.
  // We are applying it as requested, but it is typically only used for modals.
  useFocusTrap(navRef, true);

  return (
    <div ref={navRef} className={cn('fixed top-6 left-1/2 -translate-x-1/2 z-50', className)}>
      <nav
        className="flex items-center gap-3 bg-white/10 border border-emerald-500/20 backdrop-blur-xl py-1 px-1 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
        aria-label="Main Navigation"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.url}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.name}
              onClick={(e) => {
                if (item.action) {
                  e.preventDefault();
                  item.action();
                } else {
                  setActiveTab(item.name);
                }
              }}
              className={cn(
                'relative cursor-pointer text-sm font-semibold px-4 md:px-6 py-2 rounded-full transition-colors flex items-center gap-2 whitespace-nowrap',
                'text-white/60 hover:text-white',
                isActive && 'bg-white/10 text-white'
              )}
            >
              <span className="hidden md:inline whitespace-nowrap">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lampNav"
                  className="absolute inset-0 w-full bg-white/20 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-400 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-emerald-400/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-emerald-400/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-emerald-400/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
