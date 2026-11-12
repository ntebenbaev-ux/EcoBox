import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Coins,
  CupSoda,
  Gamepad2,
  Leaf,
  Play,
  Recycle,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
  Wine,
  XCircle,
} from 'lucide-react';
import { ECO_HABIT_QUESTIONS, SORTER_ITEMS, SorterItem } from '../data/initialData';
import { getT } from '../i18n';
import { GameHighScores, Language, WasteType } from '../types';
import { playEcoSound } from '../utils/sound';

interface GamesTabProps {
  language: Language;
  highScores: GameHighScores;
  soundEnabled: boolean;
  onCompleteGame: (payload: {
    gameId: 'sorter' | 'habits';
    score: number;
    coinsEarned: number;
  }) => void;
}

type ActiveGame = 'menu' | 'sorter' | 'habits';
type GameState = 'PLAYING' | 'GAME_OVER';

interface FloatingCoinBurst {
  id: number;
  points: number;
  bin: WasteType | 'quiz';
}

function pickRandomSorterItem(excludeId?: string): SorterItem {
  const pool = excludeId ? SORTER_ITEMS.filter((i) => i.id !== excludeId) : SORTER_ITEMS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function GamesTab({ language, highScores, soundEnabled, onCompleteGame }: GamesTabProps) {
  const t = getT(language);
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');

  // --- Sorter Game State ---
  const [sorterState, setSorterState] = useState<GameState>('PLAYING');
  const [sorterScore, setSorterScore] = useState(0);
  const [sorterStreak, setSorterStreak] = useState(0);
  const [sorterBestStreak, setSorterBestStreak] = useState(0);
  const [sorterTimeLeft, setSorterTimeLeft] = useState(30);
  const [currentItem, setCurrentItem] = useState<SorterItem>(() => pickRandomSorterItem());
  const [itemRoundKey, setItemRoundKey] = useState(0);
  const [lastChosenBin, setLastChosenBin] = useState<WasteType>('plastic');
  const [sorterFeedback, setSorterFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [sorterReward, setSorterReward] = useState(0);
  const [sorterNewRecord, setSorterNewRecord] = useState(false);
  const [coinBursts, setCoinBursts] = useState<FloatingCoinBurst[]>([]);
  const [shakeArena, setShakeArena] = useState(false);

  const sorterScoreRef = useRef(0);
  sorterScoreRef.current = sorterScore;

  // --- Habits Quiz State ---
  const [habitsState, setHabitsState] = useState<GameState>('PLAYING');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);
  const [quizSelected, setQuizSelected] = useState<boolean | null>(null);
  const [quizReward, setQuizReward] = useState(0);
  const [quizNewRecord, setQuizNewRecord] = useState(false);

  const spawnCoinBurst = useCallback((points: number, bin: WasteType | 'quiz') => {
    const id = Date.now() + Math.random();
    setCoinBursts((prev) => [...prev, { id, points, bin }]);
    window.setTimeout(() => {
      setCoinBursts((prev) => prev.filter((b) => b.id !== id));
    }, 950);
  }, []);

  const computeSorterCoins = (score: number): number => {
    if (score >= 150) return 25;
    if (score >= 100) return 15;
    if (score >= 50) return 5;
    return 0;
  };

  const finishSorterGame = useCallback(
    (finalScore: number) => {
      const coinsEarned = computeSorterCoins(finalScore);
      const isNewRecord = finalScore > highScores.sorterBest && finalScore > 0;
      setSorterReward(coinsEarned);
      setSorterNewRecord(isNewRecord);
      setSorterState('GAME_OVER');
      playEcoSound(coinsEarned > 0 ? 'win' : 'earn', soundEnabled);
      onCompleteGame({ gameId: 'sorter', score: finalScore, coinsEarned });
    },
    [highScores.sorterBest, onCompleteGame, soundEnabled]
  );

  useEffect(() => {
    if (activeGame !== 'sorter' || sorterState !== 'PLAYING') return;

    const timer = window.setInterval(() => {
      setSorterTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          finishSorterGame(sorterScoreRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeGame, sorterState, finishSorterGame]);

  const startSorter = () => {
    setActiveGame('sorter');
    setSorterState('PLAYING');
    setSorterScore(0);
    setSorterStreak(0);
    setSorterBestStreak(0);
    setSorterTimeLeft(30);
    setSorterFeedback(null);
    setSorterReward(0);
    setSorterNewRecord(false);
    setCoinBursts([]);
    setCurrentItem(pickRandomSorterItem());
    setItemRoundKey((k) => k + 1);
  };

  const handleSortChoice = (chosenBin: WasteType) => {
    if (sorterState !== 'PLAYING') return;

    setLastChosenBin(chosenBin);
    const isCorrect = currentItem.type === chosenBin;

    if (isCorrect) {
      const nextStreak = sorterStreak + 1;
      const multiplier = nextStreak >= 5 ? 2 : nextStreak >= 3 ? 1.5 : 1;
      const gained = Math.round(10 * multiplier);
      setSorterScore((prev) => prev + gained);
      setSorterStreak(nextStreak);
      setSorterBestStreak((prev) => Math.max(prev, nextStreak));
      setSorterFeedback({
        correct: true,
        message: `${t.correctFeedback} +${gained}`,
      });
      spawnCoinBurst(gained, chosenBin);
      playEcoSound('earn', soundEnabled);
    } else {
      setSorterStreak(0);
      setSorterFeedback({
        correct: false,
        message: language === 'kk' ? currentItem.tipKk : currentItem.tipRu,
      });
      setShakeArena(true);
      window.setTimeout(() => setShakeArena(false), 320);
      playEcoSound('error', soundEnabled);
    }

    setCurrentItem(pickRandomSorterItem(currentItem.id));
    setItemRoundKey((k) => k + 1);
  };

  const startHabits = () => {
    setActiveGame('habits');
    setHabitsState('PLAYING');
    setQuizIndex(0);
    setQuizScore(0);
    setQuizCorrectCount(0);
    setQuizSelected(null);
    setQuizReward(0);
    setQuizNewRecord(false);
    setCoinBursts([]);
  };

  const handleQuizAnswer = (answerIsEco: boolean) => {
    if (quizSelected !== null || habitsState !== 'PLAYING') return;
    const question = ECO_HABIT_QUESTIONS[quizIndex];
    const isCorrect = question.isEcoFriendly === answerIsEco;

    setQuizSelected(answerIsEco);
    if (isCorrect) {
      setQuizScore((prev) => prev + 20);
      setQuizCorrectCount((prev) => prev + 1);
      spawnCoinBurst(20, 'quiz');
      playEcoSound('earn', soundEnabled);
    } else {
      playEcoSound('error', soundEnabled);
    }
  };

  const handleQuizNext = () => {
    const isLast = quizIndex >= ECO_HABIT_QUESTIONS.length - 1;
    if (!isLast) {
      setQuizIndex((prev) => prev + 1);
      setQuizSelected(null);
      return;
    }

    const finalCorrect = quizCorrectCount;
    const finalScore = quizScore;
    const coinsEarned = finalCorrect >= 7 ? 20 : finalCorrect >= 5 ? 10 : 0;
    const isNewRecord = finalScore > highScores.habitsBest && finalScore > 0;

    setQuizReward(coinsEarned);
    setQuizNewRecord(isNewRecord);
    setHabitsState('GAME_OVER');
    playEcoSound(coinsEarned > 0 ? 'win' : 'earn', soundEnabled);
    onCompleteGame({ gameId: 'habits', score: finalScore, coinsEarned });
  };

  if (activeGame === 'menu') {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
              {t.gamesHeaderTitle}
            </h2>
            <p className="text-sm text-[#5A6C7D] dark:text-[#9CB7A7]">{t.gamesSubtitle}</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#15241D] border border-[#E4F0E9] dark:border-[#22382C] self-start">
            <Coins className="w-4 h-4 text-[#F1C40F]" aria-hidden="true" />
            <span className="text-xs text-[#5A6C7D] dark:text-[#9CB7A7]">{t.gamesEarnedTotal}:</span>
            <span className="text-sm font-bold font-mono-num text-[#27AE60] dark:text-[#2ECC71]">
              +{highScores.totalGameCoinsEarned} EC
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            whileHover={{ y: -3 }}
            className="bg-white dark:bg-[#15241D] eco-card p-5 border border-[#E4F0E9] dark:border-[#22382C] flex flex-col justify-between gap-5"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#2ECC71]/15 flex items-center justify-center text-[#27AE60] dark:text-[#2ECC71] shrink-0">
                  <Recycle className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="text-right font-mono-num">
                  <div className="text-[11px] text-[#6B7F8F] dark:text-[#8BA495]">{t.gamesBestLabel}</div>
                  <div className="text-base font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
                    {highScores.sorterBest}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
                  {t.sorterTitle}
                </h3>
                <p className="text-sm text-[#526576] dark:text-[#A9C2B3] mt-1 leading-relaxed">
                  {t.sorterDesc}
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-[#5A6C7D] dark:text-[#9CB7A7] pt-1">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#2ECC71] shrink-0" aria-hidden="true" />
                  <span>{t.sorterRule1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-[#F1C40F] shrink-0" aria-hidden="true" />
                  <span>{t.sorterRule2}</span>
                </li>
              </ul>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={startSorter}
              className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-sm shadow-md shadow-[#2ECC71]/25 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>{t.startGame}</span>
            </motion.button>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.06 }}
            whileHover={{ y: -3 }}
            className="bg-white dark:bg-[#15241D] eco-card p-5 border border-[#E4F0E9] dark:border-[#22382C] flex flex-col justify-between gap-5"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F1C40F]/15 flex items-center justify-center text-[#D4A007] dark:text-[#F1C40F] shrink-0">
                  <Leaf className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="text-right font-mono-num">
                  <div className="text-[11px] text-[#6B7F8F] dark:text-[#8BA495]">{t.gamesBestLabel}</div>
                  <div className="text-base font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
                    {highScores.habitsBest}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
                  {t.habitsTitle}
                </h3>
                <p className="text-sm text-[#526576] dark:text-[#A9C2B3] mt-1 leading-relaxed">
                  {t.habitsDesc}
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-[#5A6C7D] dark:text-[#9CB7A7] pt-1">
                <li className="flex items-center gap-2">
                  <Gamepad2 className="w-3.5 h-3.5 text-[#2ECC71] shrink-0" aria-hidden="true" />
                  <span>{t.habitsRule1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-[#F1C40F] shrink-0" aria-hidden="true" />
                  <span>{t.habitsRule2}</span>
                </li>
              </ul>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={startHabits}
              className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-sm shadow-md shadow-[#2ECC71]/25 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>{t.startGame}</span>
            </motion.button>
          </motion.article>
        </div>
      </div>
    );
  }

  if (activeGame === 'sorter') {
    const itemName = language === 'kk' ? currentItem.nameKk : currentItem.nameRu;
    const exitX = lastChosenBin === 'plastic' ? -72 : lastChosenBin === 'glass' ? 72 : 0;

    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveGame('menu')}
            className="min-h-[44px] px-3 rounded-xl bg-white dark:bg-[#15241D] border border-[#E4F0E9] dark:border-[#22382C] text-sm font-semibold text-[#2C3E50] dark:text-[#ECF7F0] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{t.backToGames}</span>
          </button>

          <div className="flex items-center gap-3 bg-white dark:bg-[#15241D] px-4 py-2 rounded-xl border border-[#E4F0E9] dark:border-[#22382C] font-mono-num text-sm">
            <motion.span
              key={sorterScore}
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1 font-bold text-[#2C3E50] dark:text-[#ECF7F0]"
            >
              <Trophy className="w-4 h-4 text-[#F1C40F]" aria-hidden="true" />
              {sorterScore}
            </motion.span>
            <span className="text-[#CBD8D0] dark:text-[#2A4235]">|</span>
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                sorterTimeLeft <= 7 ? 'text-[#E74C3C]' : 'text-[#27AE60] dark:text-[#2ECC71]'
              }`}
            >
              <Timer className="w-4 h-4" aria-hidden="true" />
              {sorterTimeLeft}s
            </span>
          </div>
        </div>

        {sorterState === 'PLAYING' ? (
          <motion.div
            animate={shakeArena ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.28 }}
            className="bg-white dark:bg-[#15241D] eco-card p-5 sm:p-6 border border-[#E4F0E9] dark:border-[#22382C] space-y-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#5A6C7D] dark:text-[#9CB7A7]">
              <span>{t.sorterTitle}</span>
              <span className="font-mono-num text-[#27AE60] dark:text-[#2ECC71]">
                {t.streakLabel}: x{sorterStreak >= 5 ? '2' : sorterStreak >= 3 ? '1.5' : '1'} ({sorterStreak})
              </span>
            </div>

            {/* Falling Item Drop Chute */}
            <div className="relative h-[204px] px-4 rounded-2xl bg-gradient-to-b from-[#EAF7F0] to-[#F4FBF7] dark:from-[#0B1510] dark:to-[#102018] border border-[#DCEEE3] dark:border-[#23392D] overflow-hidden flex flex-col items-center justify-center">
              {/* Subtle vertical guide lines */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-25 bg-[radial-gradient(circle_at_center,_rgba(46,204,113,0.18)_0%,_transparent_65%)]"
              />

              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={itemRoundKey}
                  initial={{ y: -115, opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ y: 110, x: exitX, opacity: 0, scale: 0.55, rotate: 12 }}
                  transition={{
                    y: { type: 'spring', stiffness: 220, damping: 20 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.24 },
                  }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <motion.div
                    animate={{ y: [0, 7, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-6xl mb-2.5 select-none drop-shadow-sm"
                  >
                    {currentItem.emoji}
                  </motion.div>
                  <div className="text-base sm:text-lg font-bold text-[#2C3E50] dark:text-[#ECF7F0] px-3 py-1 rounded-xl bg-white/80 dark:bg-[#15241D]/85 backdrop-blur-xs shadow-xs">
                    {itemName}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Floating EcoCoins Pop Particles */}
              <AnimatePresence>
                {coinBursts.map((burst) => {
                  const burstX =
                    burst.bin === 'plastic' ? -72 : burst.bin === 'glass' ? 72 : 0;
                  return (
                    <motion.div
                      key={burst.id}
                      initial={{ opacity: 0, y: 55, x: burstX, scale: 0.65 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: [55, 8, -42, -74],
                        scale: [0.65, 1.15, 1.05, 0.9],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.85, ease: 'easeOut' }}
                      className="pointer-events-none absolute bottom-4 z-20 flex items-center gap-1 font-mono-num font-extrabold text-base text-[#D4A007] dark:text-[#F1C40F] drop-shadow-sm"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F1C40F] text-[#7D6608] shadow-md">
                        <Coins className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                      <span>+{burst.points}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="min-h-[38px] flex items-center justify-center text-center">
              <AnimatePresence mode="wait">
                {sorterFeedback ? (
                  <motion.div
                    key={sorterFeedback.message + itemRoundKey}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16 }}
                    className={`text-sm font-semibold flex items-center gap-1.5 ${
                      sorterFeedback.correct
                        ? 'text-[#27AE60] dark:text-[#2ECC71]'
                        : 'text-[#E74C3C] dark:text-[#FF7675]'
                    }`}
                  >
                    {sorterFeedback.correct ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <XCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>{sorterFeedback.message}</span>
                  </motion.div>
                ) : (
                  <span className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">
                    {t.recycleModalSubtitle}
                  </span>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSortChoice('plastic')}
                className="min-h-[82px] p-3 rounded-2xl bg-[#FFFBEA] dark:bg-[#2B2613] hover:bg-[#FEF3C7] dark:hover:bg-[#3A3318] border-2 border-[#F1C40F] text-[#7D6608] dark:text-[#F7DC6F] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Recycle className="w-6 h-6 text-[#D4A007]" aria-hidden="true" />
                <span className="text-sm font-bold">{t.plasticLabel}</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSortChoice('metal')}
                className="min-h-[82px] p-3 rounded-2xl bg-[#EDF6FD] dark:bg-[#132433] hover:bg-[#DCEEFB] dark:hover:bg-[#193044] border-2 border-[#3498DB] text-[#1B4F72] dark:text-[#85C1E9] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CupSoda className="w-6 h-6 text-[#2980B9]" aria-hidden="true" />
                <span className="text-sm font-bold">{t.metalLabel}</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSortChoice('glass')}
                className="min-h-[82px] p-3 rounded-2xl bg-[#EAF9F0] dark:bg-[#142D20] hover:bg-[#D5F5E3] dark:hover:bg-[#1B3C2B] border-2 border-[#2ECC71] text-[#1E8449] dark:text-[#6EE7A0] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Wine className="w-6 h-6 text-[#27AE60]" aria-hidden="true" />
                <span className="text-sm font-bold">{t.glassLabel}</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="bg-white dark:bg-[#15241D] eco-card p-6 border border-[#E4F0E9] dark:border-[#22382C] text-center space-y-5"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 16 }}
              className="w-16 h-16 rounded-2xl bg-[#FFF9E6] dark:bg-[#2B2613] mx-auto flex items-center justify-center"
            >
              <Trophy className="w-9 h-9 text-[#F1C40F]" aria-hidden="true" />
            </motion.div>

            <div>
              {sorterNewRecord && (
                <div className="text-xs font-bold text-[#D4A007] dark:text-[#F1C40F] mb-1">
                  {t.newRecordBadge}
                </div>
              )}
              <h3 className="text-2xl font-extrabold text-[#2C3E50] dark:text-[#ECF7F0]">
                {t.gameOverTitle}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913]">
                <div className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">{t.scoreLabel}</div>
                <div className="text-2xl font-extrabold font-mono-num text-[#2C3E50] dark:text-[#ECF7F0]">
                  {sorterScore}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913]">
                <div className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">{t.streakLabel}</div>
                <div className="text-2xl font-extrabold font-mono-num text-[#27AE60] dark:text-[#2ECC71]">
                  {sorterBestStreak}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAF9F0] dark:bg-[#183325] border border-[#2ECC71]/40">
              {sorterReward > 0 ? (
                <div className="flex items-center justify-center gap-2 text-lg font-extrabold text-[#27AE60] dark:text-[#2ECC71] font-mono-num">
                  <Coins className="w-5 h-5 text-[#F1C40F]" aria-hidden="true" />
                  <span>
                    {t.coinsRewardedLabel}: +{sorterReward} EcoCoins
                  </span>
                </div>
              ) : (
                <p className="text-sm font-medium text-[#526576] dark:text-[#A9C2B3]">
                  {t.noRewardHint}
                </p>
              )}
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={startSorter}
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>{t.playAgain}</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    );
  }

  // --- Habits Quiz Active View ---
  const question = ECO_HABIT_QUESTIONS[quizIndex];
  const statement = language === 'kk' ? question.statementKk : question.statementRu;
  const explanation = language === 'kk' ? question.explanationKk : question.explanationRu;
  const isAnswered = quizSelected !== null;
  const isRightAnswer = isAnswered && quizSelected === question.isEcoFriendly;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setActiveGame('menu')}
          className="min-h-[44px] px-3 rounded-xl bg-white dark:bg-[#15241D] border border-[#E4F0E9] dark:border-[#22382C] text-sm font-semibold text-[#2C3E50] dark:text-[#ECF7F0] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t.backToGames}</span>
        </button>

        <div className="flex items-center gap-3 bg-white dark:bg-[#15241D] px-4 py-2 rounded-xl border border-[#E4F0E9] dark:border-[#22382C] font-mono-num text-sm">
          <span className="font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
            {t.questionLabel} {quizIndex + 1}/{ECO_HABIT_QUESTIONS.length}
          </span>
          <span className="text-[#CBD8D0] dark:text-[#2A4235]">|</span>
          <motion.span
            key={quizScore}
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            className="font-bold text-[#27AE60] dark:text-[#2ECC71]"
          >
            {quizScore}
          </motion.span>
        </div>
      </div>

      {habitsState === 'PLAYING' ? (
        <div className="bg-white dark:bg-[#15241D] eco-card p-6 border border-[#E4F0E9] dark:border-[#22382C] space-y-5 relative overflow-hidden">
          <div className="w-full h-2 bg-[#EAF5EE] dark:bg-[#0D1913] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#2ECC71]"
              initial={false}
              animate={{ width: `${((quizIndex + 1) / ECO_HABIT_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="py-5 px-4 rounded-2xl bg-[#F4FBF7] dark:bg-[#0D1913] border border-[#DCEEE3] dark:border-[#23392D] text-center space-y-3"
              >
                <div className="text-5xl select-none">{question.emoji}</div>
                <p className="text-base sm:text-lg font-semibold text-[#2C3E50] dark:text-[#ECF7F0] leading-snug">
                  {statement}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {coinBursts
                .filter((b) => b.bin === 'quiz')
                .map((burst) => (
                  <motion.div
                    key={burst.id}
                    initial={{ opacity: 0, y: 12, scale: 0.7 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [12, -20, -48, -68], scale: [0.7, 1.15, 1] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.85, ease: 'easeOut' }}
                    className="pointer-events-none absolute top-4 right-6 flex items-center gap-1 font-mono-num font-extrabold text-base text-[#D4A007] dark:text-[#F1C40F]"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F1C40F] text-[#7D6608] shadow-md">
                      <Coins className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    <span>+{burst.points}</span>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {!isAnswered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => handleQuizAnswer(true)}
                className="min-h-[52px] px-4 py-3 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span>{t.ecoFriendlyBtn}</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => handleQuizAnswer(false)}
                className="min-h-[52px] px-4 py-3 rounded-xl bg-[#FDF2F2] dark:bg-[#2D1717] hover:bg-[#FCE4E4] dark:hover:bg-[#3B1E1E] border border-[#F5B7B1] dark:border-[#5C2929] text-[#C0392B] dark:text-[#FF8A80] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" aria-hidden="true" />
                <span>{t.notEcoBtn}</span>
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div
                className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                  isRightAnswer
                    ? 'bg-[#EAF9F0] dark:bg-[#183325] border-[#2ECC71] text-[#1E8449] dark:text-[#A9DFBF]'
                    : 'bg-[#FDF2F2] dark:bg-[#2D1717] border-[#E74C3C]/50 text-[#922B21] dark:text-[#F5B7B1]'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  {isRightAnswer ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{isRightAnswer ? `${t.correctFeedback} +20` : t.wrongFeedback}</span>
                </div>
                <p>{explanation}</p>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleQuizNext}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-sm cursor-pointer"
              >
                {quizIndex < ECO_HABIT_QUESTIONS.length - 1 ? t.nextQuestion : t.finishQuiz}
              </motion.button>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="bg-white dark:bg-[#15241D] eco-card p-6 border border-[#E4F0E9] dark:border-[#22382C] text-center space-y-5"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 16 }}
            className="w-16 h-16 rounded-2xl bg-[#FFF9E6] dark:bg-[#2B2613] mx-auto flex items-center justify-center"
          >
            <Trophy className="w-9 h-9 text-[#F1C40F]" aria-hidden="true" />
          </motion.div>

          <div>
            {quizNewRecord && (
              <div className="text-xs font-bold text-[#D4A007] dark:text-[#F1C40F] mb-1">
                {t.newRecordBadge}
              </div>
            )}
            <h3 className="text-2xl font-extrabold text-[#2C3E50] dark:text-[#ECF7F0]">
              {t.gameOverTitle}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913]">
              <div className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">{t.scoreLabel}</div>
              <div className="text-2xl font-extrabold font-mono-num text-[#2C3E50] dark:text-[#ECF7F0]">
                {quizScore}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913]">
              <div className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">{t.correctFeedback}</div>
              <div className="text-2xl font-extrabold font-mono-num text-[#27AE60] dark:text-[#2ECC71]">
                {quizCorrectCount}/{ECO_HABIT_QUESTIONS.length}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EAF9F0] dark:bg-[#183325] border border-[#2ECC71]/40">
            {quizReward > 0 ? (
              <div className="flex items-center justify-center gap-2 text-lg font-extrabold text-[#27AE60] dark:text-[#2ECC71] font-mono-num">
                <Coins className="w-5 h-5 text-[#F1C40F]" aria-hidden="true" />
                <span>
                  {t.coinsRewardedLabel}: +{quizReward} EcoCoins
                </span>
              </div>
            ) : (
              <p className="text-sm font-medium text-[#526576] dark:text-[#A9C2B3]">
                {t.noQuizRewardHint}
              </p>
            )}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={startHabits}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>{t.playAgain}</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
