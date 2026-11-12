import { motion } from 'motion/react';
import { Coins, QrCode } from 'lucide-react';
import { CanteenItem, Language } from '../types';
import { getT } from '../i18n';

interface CanteenTabProps {
  language: Language;
  balance: number;
  items: CanteenItem[];
  onRedeemItem: (item: CanteenItem) => void;
}

export function CanteenTab({ language, balance, items, onRedeemItem }: CanteenTabProps) {
  const t = getT(language);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-[#2C3E50] dark:text-[#ECF7F0]">{t.canteenTitle}</h2>
          <p className="text-sm text-[#5A6C7D] dark:text-[#9CB7A7]">{t.canteenSubtitle}</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#15241D] border border-[#E4F0E9] dark:border-[#22382C] text-sm font-bold font-mono-num">
          <Coins className="w-4 h-4 text-[#F1C40F]" aria-hidden="true" />
          <motion.span
            key={balance}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-[#2C3E50] dark:text-[#ECF7F0]"
          >
            {balance}
          </motion.span>
          <span className="text-[#D4A007] dark:text-[#F1C40F]">EcoCoins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => {
          const canAfford = balance >= item.price;
          const name = language === 'kk' ? item.nameKk : item.nameRu;
          const desc = language === 'kk' ? item.descriptionKk : item.descriptionRu;

          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.045 }}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-[#15241D] eco-card p-5 border border-[#E4F0E9] dark:border-[#22382C] flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-[#F4FBF7] dark:bg-[#0D1913] border border-[#E2EFE7] dark:border-[#23392D] flex items-center justify-center text-3xl shrink-0">
                  <span aria-hidden="true">{item.emoji}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
                    {name}
                  </h3>
                  <p className="text-sm text-[#5A6C7D] dark:text-[#9CB7A7] mt-0.5 leading-snug">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDF5F0] dark:border-[#21362A] flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 font-mono-num font-bold text-base">
                  <Coins className="w-4 h-4 text-[#F1C40F]" aria-hidden="true" />
                  <span className="text-[#2C3E50] dark:text-[#ECF7F0]">{item.price}</span>
                  <span className="text-[#D4A007] dark:text-[#F1C40F] text-sm">EcoCoins</span>
                </div>

                <motion.button
                  type="button"
                  disabled={!canAfford}
                  whileTap={canAfford ? { scale: 0.96 } : undefined}
                  onClick={() => onRedeemItem(item)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                    canAfford
                      ? 'bg-[#2ECC71] hover:bg-[#27AE60] text-white shadow-sm shadow-[#2ECC71]/25 cursor-pointer'
                      : 'bg-[#EDF5F0] dark:bg-[#0D1913] text-[#8CA0AE] dark:text-[#5B7466] cursor-not-allowed'
                  }`}
                >
                  <QrCode className="w-4 h-4" aria-hidden="true" />
                  <span>{canAfford ? t.getQr : t.notEnoughCoins}</span>
                </motion.button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
