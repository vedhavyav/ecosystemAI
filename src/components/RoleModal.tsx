'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User } from 'lucide-react';
import { useRef } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type Props = {
  isOpen: boolean;
  onSelectRole: (role: 'individual' | 'b2b') => void;
};

export default function RoleModal({ isOpen, onSelectRole }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-emerald-950 border border-emerald-500/30 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-400" />

            <div className="text-center mb-10">
              <h2 id="role-modal-title" className="text-3xl md:text-4xl font-black text-white mb-3">
                Welcome to Ecosystem AI
              </h2>
              <p className="text-emerald-100/70 text-lg">How will you be using the platform?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Individual Option */}
              <button
                onClick={() => onSelectRole('individual')}
                className="group relative bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-emerald-900/40 rounded-2xl p-8 text-left transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/20 transition-all" />
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <User className="text-emerald-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Individual</h3>
                <p className="text-emerald-100/60 leading-relaxed">
                  Track your personal carbon footprint, view recommendations, and earn green
                  credits.
                </p>
              </button>

              {/* B2B Option */}
              <button
                onClick={() => onSelectRole('b2b')}
                className="group relative bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-emerald-900/40 rounded-2xl p-8 text-left transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/20 transition-all" />
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="text-emerald-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Corporate ESG</h3>
                <p className="text-emerald-100/60 leading-relaxed">
                  Manage B2B enterprise dashboards, track Scope 3 emissions, and export BRSR
                  compliance reports.
                </p>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
