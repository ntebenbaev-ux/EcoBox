import { AnimatePresence, motion } from 'motion/react';
import { CupSoda, Recycle, Wine, X } from 'lucide-react';
import { Language, WasteType } from '../types';
import { getT } from '../i18n';

interface RecycleSimModalProps {
  open: boolean;
  language: Language;
  onClose: () => void;
  onSelectWaste: (waste: WasteType) => void;
}

export function RecycleSimModal({ open, language, onClose, onSelectWaste }: RecycleSimModalProps) {
  const t = getT(language);

  const options: {
    type: WasteType;
    label: string;
    desc: string;
    reward: number;
    icon: React.ReactNode;
    accentBg: string;
  }[] = [
    {
      type: 'plastic',
      label: t.plasticLabel,
      desc: t.plasticDesc,
      reward: 15,
      icon: <Recycle className="w-6 h-6 text-[#27AE60]" aria-hidden="true" />,
      accentBg: 'bg-[#2ECC71]/15',
    },
    {
      type: 'metal',
      label: t.metalLabel,
      desc: t.metalDesc,
      reward: 10,
      icon: <CupSoda className="w-6 h-6 text-[#27AE60]" aria-hidden="true" />,
      accentBg: 'bg-[#F1C40F]/20',
    },
    {
      type: 'glass',
      label: t.glassLabel,
      desc: t.glassDesc,
      reward: 20,
      icon: <Wine className="w-6 h-6 text-[#16A085]" aria-hidden="true" />,
      accentBg: 'bg-[#16A085]/15',
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recycle-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full sm:max-w-md bg-white dark:bg-[#15241D] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#E4F0E9] dark:border-[#22382C]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-[#D4E6DC] dark:bg-[#2A4235] rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 id="recycle-modal-title" className="text-lg font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
                  {t.recycleModalTitle}
                </h2>
                <p className="text-sm text-[#5A6C7D] dark:text-[#9CB7A7] mt-0.5">
                  {t.recycleModalSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="min-w-[44px] min-h-[44px] -mr-2 -mt-1 rounded-xl flex items-center justify-center text-[#5A6C7D] dark:text-[#9CB7A7] hover:bg-[#F4FBF7] dark:hover:bg-[#0D1913] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {options.map((opt, idx) => (
                <motion.button
                  key={opt.type}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: idx * 0.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelectWaste(opt.type);
                    onClose();
                  }}
                  className="w-full min-h-[68px] p-4 rounded-2xl bg-[#F4FBF7] dark:bg-[#0D1913] hover:bg-[#E7F8EE] dark:hover:bg-[#1A3124] border border-[#DCEEE3] dark:border-[#23392D] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-12 h-12 rounded-xl ${opt.accentBg} flex items-center justify-center shrink-0`}>
                      {opt.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
                        {opt.label}
                      </div>
                      <div className="text-xs text-[#5A6C7D] dark:text-[#9CB7A7] truncate">
                        {opt.desc}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono-num font-bold text-base text-[#27AE60] dark:text-[#2ECC71] whitespace-nowrap shrink-0">
                    +{opt.reward} EC
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
