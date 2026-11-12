import { AnimatePresence, motion } from 'motion/react';
import { Coins, X } from 'lucide-react';
import { ActiveQrState, Language } from '../types';
import { getT } from '../i18n';
import { QrCodeMatrix } from './QrCodeMatrix';

interface QrModalProps {
  qrState: ActiveQrState | null;
  language: Language;
  onClose: () => void;
}

export function QrModal({ qrState, language, onClose }: QrModalProps) {
  const t = getT(language);

  return (
    <AnimatePresence>
      {qrState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="w-full max-w-sm bg-white dark:bg-[#15241D] rounded-3xl overflow-hidden shadow-2xl border border-[#E4F0E9] dark:border-[#22382C] text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-gradient-to-r from-[#27AE60] via-[#2ECC71] to-[#239B56] text-white flex items-center justify-between">
              <h2 id="qr-modal-title" className="text-base font-extrabold tracking-wide uppercase">
                {qrState.title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="min-w-[40px] min-h-[40px] -mr-2 rounded-xl flex items-center justify-center text-white/90 hover:bg-white/15 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.22, delay: 0.06 }}
                className="flex justify-center mb-4"
              >
                <QrCodeMatrix value={qrState.code} size={204} />
              </motion.div>

              <p className="text-sm font-medium text-[#526576] dark:text-[#A9C2B3] mb-4">
                {qrState.subtitle}
              </p>

              <div className="bg-[#F4FBF7] dark:bg-[#0D1913] rounded-xl px-4 py-3 border border-[#E2EFE7] dark:border-[#23392D] mb-5">
                <div className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">
                  {qrState.mode === 'canteen' ? t.voucherCodeLabel : t.personalCodeLabel}
                </div>
                <div className="text-base font-bold font-mono-num text-[#2C3E50] dark:text-[#ECF7F0] mt-0.5 tracking-wide">
                  {qrState.code}
                </div>
                {typeof qrState.price === 'number' && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-sm font-bold text-[#D4A007] dark:text-[#F1C40F] font-mono-num">
                    <Coins className="w-4 h-4" aria-hidden="true" />
                    <span>-{qrState.price} EcoCoins</span>
                  </div>
                )}
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full min-h-[46px] rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                {t.close}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
