import { AnimatePresence, motion } from 'motion/react';
import {
  Coins,
  CupSoda,
  Gamepad2,
  PlusCircle,
  Recycle,
  Sparkles,
  Trophy,
  UtensilsCrossed,
  Wine,
} from 'lucide-react';
import { Language, Transaction } from '../types';
import { getT } from '../i18n';
import { EcoLogo } from './EcoLogo';

interface DashboardTabProps {
  language: Language;
  balance: number;
  rank: number;
  transactions: Transaction[];
  onOpenRecycleModal: () => void;
  onOpenGamesTab: () => void;
}

export function DashboardTab({
  language,
  balance,
  rank,
  transactions,
  onOpenRecycleModal,
  onOpenGamesTab,
}: DashboardTabProps) {
  const t = getT(language);

  const levelInfo =
    balance >= 500
      ? { label: t.levelMaster }
      : balance >= 300
        ? { label: t.levelActivist }
        : { label: t.levelNovice };

  const getCategoryVisual = (cat: Transaction['category']) => {
    switch (cat) {
      case 'plastic':
        return {
          icon: <Recycle className="w-5 h-5 text-[#2ECC71]" aria-hidden="true" />,
          bg: 'bg-[#2ECC71]/12 dark:bg-[#2ECC71]/20',
          dotColor: 'bg-[#2ECC71]',
        };
      case 'metal':
        return {
          icon: <CupSoda className="w-5 h-5 text-[#27AE60]" aria-hidden="true" />,
          bg: 'bg-[#2ECC71]/12 dark:bg-[#2ECC71]/20',
          dotColor: 'bg-[#2ECC71]',
        };
      case 'glass':
        return {
          icon: <Wine className="w-5 h-5 text-[#16A085]" aria-hidden="true" />,
          bg: 'bg-[#16A085]/12 dark:bg-[#16A085]/20',
          dotColor: 'bg-[#2ECC71]',
        };
      case 'game':
        return {
          icon: <Gamepad2 className="w-5 h-5 text-[#D4A007] dark:text-[#F1C40F]" aria-hidden="true" />,
          bg: 'bg-[#F1C40F]/15 dark:bg-[#F1C40F]/20',
          dotColor: 'bg-[#F1C40F]',
        };
      case 'canteen':
      default:
        return {
          icon: <UtensilsCrossed className="w-5 h-5 text-[#E74C3C]" aria-hidden="true" />,
          bg: 'bg-[#E74C3C]/10 dark:bg-[#E74C3C]/20',
          dotColor: 'bg-[#E74C3C]',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div className="lg:col-span-5 space-y-3.5">
        <section aria-label={t.yourBalance} className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0 }}
            whileHover={{ y: -2 }}
            className="eco-card px-5 py-4 bg-gradient-to-r from-[#4BA3E3] to-[#2674B8] text-white flex items-center justify-between gap-4 shadow-md"
          >
            <div>
              <div className="text-xs font-medium text-white/85">{t.yourLevel}</div>
              <div className="text-2xl font-extrabold tracking-tight mt-0.5">
                {levelInfo.label}
              </div>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Trophy className="w-8 h-8 text-[#F1C40F] fill-[#F1C40F]/30" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.06 }}
            whileHover={{ y: -2 }}
            className="eco-card px-5 py-4 bg-gradient-to-r from-[#2ECC71] to-[#1E9E52] text-white flex items-center justify-between gap-3 shadow-md"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-[#F1C40F] flex items-center justify-center shadow-sm shrink-0">
                <Coins className="w-6 h-6 text-[#7D6608]" aria-hidden="true" />
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <motion.span
                  key={balance}
                  initial={{ scale: 1.18 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className="text-3xl font-extrabold font-mono-num tracking-tight"
                >
                  {balance}
                </motion.span>
                <span className="text-base font-bold text-[#FEF9E7]">EcoCoins</span>
              </div>
            </div>
            <EcoLogo size="sm" className="ring-white/40" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.12 }}
            whileHover={{ y: -2 }}
            className="eco-card px-5 py-3.5 bg-gradient-to-r from-[#348AC7] to-[#1D5E91] text-white flex items-center justify-between gap-3 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-[#F1C40F]" aria-hidden="true" />
              </div>
              <div className="flex items-baseline gap-2">
                <motion.span
                  key={rank}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-extrabold font-mono-num"
                >
                  #{rank}
                </motion.span>
                <span className="text-sm font-medium text-white/90">{t.rankInLeaderboard}</span>
              </div>
            </div>
            <Trophy className="w-6 h-6 text-white/30 shrink-0" aria-hidden="true" />
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.16 }}
          className="bg-white dark:bg-[#15241D] eco-card p-4 border border-[#E4F0E9] dark:border-[#22382C] space-y-2.5"
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onOpenRecycleModal}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-[15px] shadow-md shadow-[#2ECC71]/25 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{t.recycleSimBtn}</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onOpenGamesTab}
            className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913] hover:bg-[#E5F7EC] dark:hover:bg-[#1B3125] border border-[#D4E8DC] dark:border-[#243B2E] text-[#1E8449] dark:text-[#6EE7A0] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.playEcoGamesBtn}</span>
          </motion.button>
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, delay: 0.12 }}
        aria-label={t.recentOps}
        className="lg:col-span-7 bg-white dark:bg-[#15241D] eco-card p-5 sm:p-6 border border-[#E4F0E9] dark:border-[#22382C]"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] dark:text-[#ECF7F0]">{t.recentOps}</h2>
            <p className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">{t.opsSubtitle}</p>
          </div>
          <Sparkles className="w-5 h-5 text-[#F1C40F]" aria-hidden="true" />
        </div>

        <ul className="divide-y divide-[#EDF5F0] dark:divide-[#21362A]">
          <AnimatePresence initial={false}>
            {transactions.map((tx) => {
              const isPositive = tx.amount > 0;
              const visual = getCategoryVisual(tx.category);
              const title = language === 'kk' ? tx.titleKk : tx.titleRu;
              const time = language === 'kk' ? tx.timeKk : tx.timeRu;

              return (
                <motion.li
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${visual.bg} flex items-center justify-center shrink-0`}>
                      {visual.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-[#2C3E50] dark:text-[#ECF7F0] truncate">
                        {title}
                      </div>
                      <div className="text-xs text-[#6B7F8F] dark:text-[#8BA495] flex items-center gap-1.5">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${visual.dotColor}`}
                          aria-hidden="true"
                        />
                        <span>{time}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`text-[15px] font-bold font-mono-num whitespace-nowrap shrink-0 ${
                      isPositive
                        ? 'text-[#27AE60] dark:text-[#2ECC71]'
                        : 'text-[#E74C3C] dark:text-[#FF7675]'
                    }`}
                  >
                    {isPositive ? `+${tx.amount}` : tx.amount} EC
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </motion.section>
    </div>
  );
}
