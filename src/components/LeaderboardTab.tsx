import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Coins, Leaf, Trophy, Users } from 'lucide-react';
import { EcoHero, Language, LeaderboardClass, LeaderboardStudent } from '../types';
import { getT } from '../i18n';

interface LeaderboardTabProps {
  language: Language;
  students: LeaderboardStudent[];
  classes: LeaderboardClass[];
  heroes: EcoHero[];
}

export function LeaderboardTab({ language, students, classes, heroes }: LeaderboardTabProps) {
  const t = getT(language);
  const [mode, setMode] = useState<'students' | 'classes' | 'heroes'>('students');

  const getRankBadge = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const tabs: { id: 'students' | 'classes' | 'heroes'; label: string; icon: React.ReactNode }[] = [
    { id: 'students', label: t.topStudents, icon: <Trophy className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'classes', label: t.topClasses, icon: <Users className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'heroes', label: t.ecoHeroes, icon: <Leaf className="w-3.5 h-3.5" aria-hidden="true" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#2C3E50] dark:text-[#ECF7F0]">{t.leaderboardTitle}</h2>
          <p className="text-sm text-[#5A6C7D] dark:text-[#9CB7A7]">{t.leaderboardSubtitle}</p>
        </div>

        <div
          role="tablist"
          aria-label={t.leaderboardTitle}
          className="inline-flex flex-wrap p-1 bg-white dark:bg-[#15241D] rounded-xl border border-[#E2EFE7] dark:border-[#23392D] self-start sm:self-auto"
        >
          {tabs.map((tab) => {
            const isSelected = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setMode(tab.id)}
                className={`relative min-h-[40px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'text-white'
                    : 'text-[#5A6C7D] dark:text-[#9CB7A7] hover:text-[#2C3E50] dark:hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="leaderboard-tab-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 bg-[#27AE60] rounded-lg shadow-sm"
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'students' && (
          <motion.ul
            key="students"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-2.5"
          >
            {students.map((student, index) => {
              const isUser = Boolean(student.isCurrentUser);

              return (
                <motion.li
                  key={student.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className={`eco-card px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 transition-colors ${
                    isUser
                      ? 'bg-gradient-to-r from-[#2ECC71] to-[#239B56] text-white shadow-md shadow-[#2ECC71]/25 border border-[#27AE60]'
                      : 'bg-white dark:bg-[#15241D] border border-[#E4F0E9] dark:border-[#22382C]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 text-center font-mono-num font-bold shrink-0 ${
                        index < 3
                          ? 'text-xl'
                          : isUser
                            ? 'text-sm text-white'
                            : 'text-sm text-[#5A6C7D] dark:text-[#9CB7A7]'
                      }`}
                    >
                      {getRankBadge(index)}
                    </span>

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                        isUser ? 'bg-white/20' : 'bg-[#F4FBF7] dark:bg-[#0D1913]'
                      }`}
                    >
                      <span aria-hidden="true">{student.avatarEmoji}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[15px] font-bold ${
                            isUser ? 'text-white' : 'text-[#2C3E50] dark:text-[#ECF7F0]'
                          }`}
                        >
                          {student.name}
                        </span>
                        {isUser && (
                          <span className="text-sm font-bold text-[#FEF9E7]">{t.youTag}</span>
                        )}
                      </div>
                      <div
                        className={`text-xs ${
                          isUser ? 'text-white/85' : 'text-[#6B7F8F] dark:text-[#8BA495]'
                        }`}
                      >
                        {student.classLabel}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 font-mono-num font-bold text-[15px] shrink-0 ${
                      isUser ? 'text-white' : 'text-[#2C3E50] dark:text-[#ECF7F0]'
                    }`}
                  >
                    <Coins
                      className={`w-4 h-4 ${isUser ? 'text-[#F9E79F]' : 'text-[#F1C40F]'}`}
                      aria-hidden="true"
                    />
                    <span>{student.coins} EC</span>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}

        {mode === 'classes' && (
          <motion.ul
            key="classes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-2.5"
          >
            {classes.map((cls, index) => {
              const isUserClass = Boolean(cls.isCurrentUserClass);
              const title = language === 'kk' ? cls.nameKk : cls.nameRu;

              return (
                <motion.li
                  key={cls.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className={`eco-card px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 ${
                    isUserClass
                      ? 'bg-gradient-to-r from-[#2ECC71] to-[#239B56] text-white shadow-md shadow-[#2ECC71]/25 border border-[#27AE60]'
                      : 'bg-white dark:bg-[#15241D] border border-[#E4F0E9] dark:border-[#22382C]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 text-center font-mono-num font-bold shrink-0 ${
                        index < 3
                          ? 'text-xl'
                          : isUserClass
                            ? 'text-sm text-white'
                            : 'text-sm text-[#5A6C7D] dark:text-[#9CB7A7]'
                      }`}
                    >
                      {getRankBadge(index)}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[15px] font-bold ${
                            isUserClass ? 'text-white' : 'text-[#2C3E50] dark:text-[#ECF7F0]'
                          }`}
                        >
                          {title}
                        </span>
                        {isUserClass && (
                          <span className="text-xs font-bold text-[#FEF9E7]">
                            {t.yourClassTag}
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-xs font-mono-num ${
                          isUserClass ? 'text-white/85' : 'text-[#6B7F8F] dark:text-[#8BA495]'
                        }`}
                      >
                        {cls.studentsCount} {t.studentsCountSuffix}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 font-mono-num font-bold text-[15px] shrink-0 ${
                      isUserClass ? 'text-white' : 'text-[#2C3E50] dark:text-[#ECF7F0]'
                    }`}
                  >
                    <Coins
                      className={`w-4 h-4 ${isUserClass ? 'text-[#F9E79F]' : 'text-[#F1C40F]'}`}
                      aria-hidden="true"
                    />
                    <span>{cls.coins} EC</span>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}

        {mode === 'heroes' && (
          <motion.ul
            key="heroes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-2.5"
          >
            {heroes.map((hero, index) => {
              const isUser = Boolean(hero.isCurrentUser);
              const badge = language === 'kk' ? hero.badgeKk : hero.badgeRu;

              return (
                <motion.li
                  key={hero.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className={`eco-card px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 ${
                    isUser
                      ? 'bg-gradient-to-r from-[#2ECC71] to-[#239B56] text-white shadow-md shadow-[#2ECC71]/25 border border-[#27AE60]'
                      : 'bg-white dark:bg-[#15241D] border border-[#E4F0E9] dark:border-[#22382C]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 text-center font-mono-num font-bold shrink-0 ${
                        index < 3
                          ? 'text-xl'
                          : isUser
                            ? 'text-sm text-white'
                            : 'text-sm text-[#5A6C7D] dark:text-[#9CB7A7]'
                      }`}
                    >
                      {getRankBadge(index)}
                    </span>

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                        isUser ? 'bg-white/20' : 'bg-[#F4FBF7] dark:bg-[#0D1913]'
                      }`}
                    >
                      <span aria-hidden="true">{hero.avatarEmoji}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[15px] font-bold ${
                            isUser ? 'text-white' : 'text-[#2C3E50] dark:text-[#ECF7F0]'
                          }`}
                        >
                          {hero.name}
                        </span>
                        {isUser && <span className="text-sm font-bold text-[#FEF9E7]">{t.youTag}</span>}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          isUser ? 'text-white/85' : 'text-[#6B7F8F] dark:text-[#8BA495]'
                        }`}
                      >
                        {hero.classLabel} · {badge}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`font-mono-num font-bold text-sm shrink-0 ${
                      isUser ? 'text-white' : 'text-[#27AE60] dark:text-[#2ECC71]'
                    }`}
                  >
                    {hero.recycledItems} {t.itemsUnit}
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
