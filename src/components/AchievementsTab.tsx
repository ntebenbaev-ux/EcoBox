import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Achievement, Language } from '../types';
import { getT } from '../i18n';

interface AchievementsTabProps {
  language: Language;
  achievements: Achievement[];
}

export function AchievementsTab({ language, achievements }: AchievementsTabProps) {
  const t = getT(language);

  const ribbonColors = [
    'from-[#F39C12] to-[#E74C3C]',
    'from-[#2ECC71] to-[#27AE60]',
    'from-[#3498DB] to-[#2980B9]',
    'from-[#27AE60] to-[#1E8449]',
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-[#2C3E50] dark:text-[#ECF7F0]">{t.achievementsTitle}</h2>
        <p className="text-sm text-[#5A6C7D] dark:text-[#9CB7A7]">{t.achievementsSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach, index) => {
          const title = language === 'kk' ? ach.titleKk : ach.titleRu;
          const desc = language === 'kk' ? ach.descriptionKk : ach.descriptionRu;
          const unit = language === 'kk' ? ach.unitKk : ach.unitRu;
          const pct = Math.min(100, Math.round((ach.current / ach.target) * 100));
          const isCompleted = ach.current >= ach.target;
          const ribbon = ribbonColors[index % ribbonColors.length];

          return (
            <motion.article
              key={ach.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-[#15241D] eco-card p-5 border border-[#E4F0E9] dark:border-[#22382C] flex flex-col justify-between gap-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <div
                      className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${ribbon} p-0.5 shadow-sm`}
                    >
                      <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0D1913] flex items-center justify-center text-2xl">
                        <span aria-hidden="true">{ach.emoji}</span>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#2C3E50] dark:text-[#ECF7F0] truncate">
                      {title}
                    </h3>
                    <p className="text-sm text-[#5A6C7D] dark:text-[#9CB7A7]">{desc}</p>
                  </div>
                </div>

                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4A007] dark:text-[#F1C40F] shrink-0">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    {t.completedBadge}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-end text-xs font-bold mb-1.5 font-mono-num text-[#2C3E50] dark:text-[#ECF7F0]">
                  <span>
                    {ach.current} / {ach.target}
                    {unit ? ` ${unit}` : ''}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#EAF5EE] dark:bg-[#0D1913] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.55, delay: 0.1 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${
                      isCompleted
                        ? 'bg-[#F1C40F]'
                        : 'bg-gradient-to-r from-[#2ECC71] to-[#27AE60]'
                    }`}
                  />
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
