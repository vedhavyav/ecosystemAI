'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, QrCode } from 'lucide-react';
import { useRef } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { LiquidButton } from './ui/liquid-glass-button';

import { generateTransactionId } from '@/services/ui-math';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
};

export default function UpiModal({ isOpen, onClose, amount }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, isOpen);
  const transactionId = generateTransactionId();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="upi-modal-title"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-emerald-950 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-400" />

            <button
              onClick={onClose}
              aria-label="Close Modal"
              className="absolute top-4 right-4 text-emerald-100 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>

              <h3 id="upi-modal-title" className="text-2xl font-black text-white mb-2">Redeem Green Credits</h3>
              <p className="text-emerald-200/80 mb-8 font-medium">
                Scan the QR code below via any UPI app (GPay, PhonePe, Paytm) to claim your reward.
              </p>

              <div className="bg-white p-4 rounded-2xl mb-6 shadow-inner">
                {/* Mock QR Code Pattern */}
                <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center border-4 border-slate-900 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                      backgroundSize: '8px 8px',
                    }}
                  ></div>
                  <QrCode size={120} className="text-slate-800 z-10" />
                  <div className="absolute top-4 left-4 w-6 h-6 border-4 border-slate-900 rounded-sm"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-4 border-slate-900 rounded-sm"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-4 border-slate-900 rounded-sm"></div>
                </div>
              </div>

              <div className="text-5xl font-black text-emerald-400 tracking-tighter mb-6">
                ₹{amount}
              </div>

              <div className="w-full bg-black/20 rounded-xl p-4 text-sm text-emerald-100/60 font-mono mb-8 border border-white/5">
                <div className="flex justify-between mb-2">
                  <span>Merchant:</span>
                  <span className="text-white">EcoAI Rewards Govt.</span>
                </div>
                <div className="flex justify-between">
                  <span>Txn ID:</span>
                  <span className="text-white">{transactionId}</span>
                </div>
              </div>

              <LiquidButton
                onClick={onClose}
                className="w-full text-lg py-4 font-bold tracking-wide"
              >
                Done
              </LiquidButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
