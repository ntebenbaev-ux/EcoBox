import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  Award,
  Bot,
  Gamepad2,
  Home,
  Leaf,
  QrCode,
  Settings,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react';
import {
  Achievement,
  ActiveQrState,
  AppSettings,
  CanteenItem,
  GameHighScores,
  Language,
  LeaderboardStudent,
  TabId,
  Transaction,
  WasteType,
} from './types';
import {
  CANTEEN_ITEMS,
  DEFAULT_SETTINGS,
  ECO_HEROES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_BALANCE,
  INITIAL_HIGH_SCORES,
  INITIAL_TRANSACTIONS,
  LEADERBOARD_CLASSES,
  OTHER_STUDENTS,
} from './data/initialData';
import { getT } from './i18n';
import { playEcoSound } from './utils/sound';
import { EcoLogo } from './components/EcoLogo';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DashboardTab } from './components/DashboardTab';
import { GamesTab } from './components/GamesTab';
import { AchievementsTab } from './components/AchievementsTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { CanteenTab } from './components/CanteenTab';
import { QrModal } from './components/QrModal';
import { RecycleSimModal } from './components/RecycleSimModal';
import { EcoBotModal } from './components/EcoBotModal';
import { SettingsModal } from './components/SettingsModal';
import { GuidedTourModal } from './components/GuidedTourModal';

const STORAGE_KEY = 'ecobox_app_state_v2';

interface StoredState {
  schoolCode: string | null;
  balance: number;
  transactions: Transaction[];
  achievements: Achievement[];
  settings: AppSettings;
  highScores: GameHighScores;
  recycledBonusCount: number;
}

function loadStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('ecobox_app_state_v1');
    if (!raw) {
      return {
        schoolCode: null,
        balance: INITIAL_BALANCE,
        transactions: INITIAL_TRANSACTIONS,
        achievements: INITIAL_ACHIEVEMENTS,
        settings: DEFAULT_SETTINGS,
        highScores: INITIAL_HIGH_SCORES,
        recycledBonusCount: 0,
      };
    }
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      schoolCode: typeof parsed.schoolCode === 'string' ? parsed.schoolCode : null,
      balance: typeof parsed.balance === 'number' ? parsed.balance : INITIAL_BALANCE,
      transactions:
        Array.isArray(parsed.transactions) && parsed.transactions.length > 0
          ? parsed.transactions
          : INITIAL_TRANSACTIONS,
      achievements:
        Array.isArray(parsed.achievements) && parsed.achievements.length > 0
          ? parsed.achievements
          : INITIAL_ACHIEVEMENTS,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
      },
      highScores: {
        ...INITIAL_HIGH_SCORES,
        ...(parsed.highScores || {}),
      },
      recycledBonusCount:
        typeof parsed.recycledBonusCount === 'number' ? parsed.recycledBonusCount : 0,
    };
  } catch {
    return {
      schoolCode: null,
      balance: INITIAL_BALANCE,
      transactions: INITIAL_TRANSACTIONS,
      achievements: INITIAL_ACHIEVEMENTS,
      settings: DEFAULT_SETTINGS,
      highScores: INITIAL_HIGH_SCORES,
      recycledBonusCount: 0,
    };
  }
}

export default function App() {
  const initial = useMemo(() => loadStoredState(), []);

  const [schoolCode, setSchoolCode] = useState<string | null>(initial.schoolCode);
  const [balance, setBalance] = useState<number>(initial.balance);
  const [transactions, setTransactions] = useState<Transaction[]>(initial.transactions);
  const [achievements, setAchievements] = useState<Achievement[]>(initial.achievements);
  const [settings, setSettings] = useState<AppSettings>(initial.settings);
  const [highScores, setHighScores] = useState<GameHighScores>(initial.highScores);
  const [recycledBonusCount, setRecycledBonusCount] = useState<number>(initial.recycledBonusCount);

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [recycleModalOpen, setRecycleModalOpen] = useState(false);
  const [ecoBotOpen, setEcoBotOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [activeQr, setActiveQr] = useState<ActiveQrState | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const t = getT(settings.language);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
    document.documentElement.lang = settings.language;
  }, [settings.darkMode, settings.language]);

  useEffect(() => {
    try {
      const payload: StoredState = {
        schoolCode,
        balance,
        transactions,
        achievements,
        settings,
        highScores,
        recycledBonusCount,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [schoolCode, balance, transactions, achievements, settings, highScores, recycledBonusCount]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const sortedStudents: LeaderboardStudent[] = useMemo(() => {
    const tomiris: LeaderboardStudent = {
      id: 'stu-tomiris',
      name: 'Томирис',
      classLabel: '8 «А»',
      coins: balance,
      avatarEmoji: '👧🏻',
      isCurrentUser: true,
    };
    return [...OTHER_STUDENTS, tomiris].sort((a, b) => b.coins - a.coins);
  }, [balance]);

  const userRank = useMemo(() => {
    const idx = sortedStudents.findIndex((s) => s.isCurrentUser);
    return idx >= 0 ? idx + 1 : 5;
  }, [sortedStudents]);

  const sortedClasses = useMemo(() => {
    const delta = balance - INITIAL_BALANCE;
    return LEADERBOARD_CLASSES.map((cls) =>
      cls.isCurrentUserClass ? { ...cls, coins: Math.max(0, cls.coins + delta) } : cls
    ).sort((a, b) => b.coins - a.coins);
  }, [balance]);

  const sortedHeroes = useMemo(() => {
    return ECO_HEROES.map((hero) =>
      hero.isCurrentUser
        ? { ...hero, recycledItems: hero.recycledItems + recycledBonusCount }
        : hero
    ).sort((a, b) => b.recycledItems - a.recycledItems);
  }, [recycledBonusCount]);

  const levelName =
    balance >= 500 ? t.levelMaster : balance >= 300 ? t.levelActivist : t.levelNovice;

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const showNotification = useCallback(
    (message: string) => {
      if (!settings.notifications) return;
      setToast(message);
    },
    [settings.notifications]
  );

  const handleLogin = (code: string) => {
    playEcoSound('earn', settings.soundEffects);
    setSchoolCode(code);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setSettingsOpen(false);
    setSchoolCode(null);
  };

  const handleOpenPersonalQr = () => {
    playEcoSound('qr', settings.soundEffects);
    setActiveQr({
      mode: 'student',
      title: t.myQr,
      subtitle: t.studentQrSubtitle,
      code: `ECOBOX-${schoolCode || '8A-204'}`,
    });
  };

  const handleRecycleWaste = (waste: WasteType) => {
    const rewards: Record<WasteType, { amount: number; titleRu: string; titleKk: string }> = {
      plastic: { amount: 15, titleRu: 'Бутылка (пластик)', titleKk: 'Бөтелке (пластик)' },
      metal: { amount: 10, titleRu: 'Банка (металл)', titleKk: 'Банкі (металл)' },
      glass: { amount: 20, titleRu: 'Бутылка (стекло)', titleKk: 'Бөтелке (шыны)' },
    };

    const chosen = rewards[waste];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    playEcoSound('earn', settings.soundEffects);
    setBalance((prev) => prev + chosen.amount);
    setRecycledBonusCount((prev) => prev + 1);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        amount: chosen.amount,
        titleRu: chosen.titleRu,
        titleKk: chosen.titleKk,
        timeRu: nowTime,
        timeKk: nowTime,
        category: waste,
      },
      ...prev,
    ]);

    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.wasteLink === waste) {
          return { ...ach, current: Math.min(ach.target, ach.current + 1) };
        }
        return ach;
      })
    );

    const label = settings.language === 'kk' ? chosen.titleKk : chosen.titleRu;
    showNotification(`${t.toastEarned}: +${chosen.amount} EC · ${label}`);
  };

  const handleCompleteGame = useCallback(
    ({
      gameId,
      score,
      coinsEarned,
    }: {
      gameId: 'sorter' | 'habits';
      score: number;
      coinsEarned: number;
    }) => {
      setHighScores((prev) => ({
        sorterBest: gameId === 'sorter' ? Math.max(prev.sorterBest, score) : prev.sorterBest,
        habitsBest: gameId === 'habits' ? Math.max(prev.habitsBest, score) : prev.habitsBest,
        totalGameCoinsEarned: prev.totalGameCoinsEarned + coinsEarned,
      }));

      if (coinsEarned > 0) {
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const titleRu =
          gameId === 'sorter' ? 'Мини-игра: Сортировщик' : 'Мини-игра: Эко-привычки';
        const titleKk =
          gameId === 'sorter' ? 'Мини-ойын: Сұрыптаушы' : 'Мини-ойын: Эко-әдеттер';

        setBalance((prev) => prev + coinsEarned);
        setTransactions((prev) => [
          {
            id: `tx-game-${Date.now()}`,
            amount: coinsEarned,
            titleRu,
            titleKk,
            timeRu: nowTime,
            timeKk: nowTime,
            category: 'game',
          },
          ...prev,
        ]);

        const label = settings.language === 'kk' ? titleKk : titleRu;
        showNotification(`${t.toastEarned}: +${coinsEarned} EC · ${label}`);
      }
    },
    [settings.language, showNotification, t.toastEarned]
  );

  const handleRedeemCanteenItem = (item: CanteenItem) => {
    if (balance < item.price) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const itemName = settings.language === 'kk' ? item.nameKk : item.nameRu;
    const voucherCode = `CANTEEN-${item.id.replace('item-', '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    playEcoSound('spend', settings.soundEffects);
    setBalance((prev) => prev - item.price);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        amount: -item.price,
        titleRu: item.nameRu,
        titleKk: item.nameKk,
        timeRu: nowTime,
        timeKk: nowTime,
        category: 'canteen',
      },
      ...prev,
    ]);

    setActiveQr({
      mode: 'canteen',
      title: `${item.emoji} ${itemName}`,
      subtitle: t.canteenQrSubtitle,
      code: voucherCode,
      price: item.price,
    });

    showNotification(`${t.toastSpent}: ${itemName}`);
  };

  if (!schoolCode) {
    return (
      <MotionConfig reducedMotion="user">
        <WelcomeScreen
          language={settings.language}
          onLanguageChange={(language: Language) => updateSettings({ language })}
          onLogin={handleLogin}
        />
      </MotionConfig>
    );
  }

  const headerTitle =
    activeTab === 'home'
      ? t.greeting
      : activeTab === 'games'
        ? t.gamesHeaderTitle
        : activeTab === 'achievements'
          ? t.achievementsTitle
          : activeTab === 'leaderboard'
            ? t.leaderboardTitle
            : t.canteenTitle;

  const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.navHome, icon: <Home className="w-[21px] h-[21px]" aria-hidden="true" /> },
    { id: 'games', label: t.navGames, icon: <Gamepad2 className="w-[21px] h-[21px]" aria-hidden="true" /> },
    {
      id: 'achievements',
      label: t.navAchievements,
      icon: <Award className="w-[21px] h-[21px]" aria-hidden="true" />,
    },
    {
      id: 'leaderboard',
      label: t.navLeaderboard,
      icon: <Trophy className="w-[21px] h-[21px]" aria-hidden="true" />,
    },
    {
      id: 'canteen',
      label: t.navCanteen,
      icon: <UtensilsCrossed className="w-[21px] h-[21px]" aria-hidden="true" />,
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F4FBF7] dark:bg-[#0D1913] text-[#2C3E50] dark:text-[#ECF7F0] flex flex-col">
        <AnimatePresence>
          {toast && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#2C3E50] dark:bg-[#2ECC71] text-white dark:text-[#0D1913] text-sm font-semibold shadow-lg whitespace-nowrap"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <header className="sticky top-0 z-30 h-14 bg-gradient-to-r from-[#27AE60] via-[#2ECC71] to-[#239B56] text-white shadow-sm">
          <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <EcoLogo size="sm" className="ring-white/40" />
              <div className="min-w-0">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={headerTitle}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16 }}
                    className="text-base sm:text-lg font-extrabold tracking-tight text-white truncate leading-tight"
                  >
                    {headerTitle}
                  </motion.h1>
                </AnimatePresence>
                <p className="hidden sm:block text-xs text-white/85 truncate">{t.studentMeta}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                type="button"
                whileTap={{ scale: 0.93 }}
                onClick={handleOpenPersonalQr}
                aria-label={t.myQr}
                title={t.myQr}
                className="min-w-[44px] min-h-[44px] px-2.5 sm:px-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline text-xs font-bold whitespace-nowrap">{t.myQr}</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.93 }}
                onClick={() => setSettingsOpen(true)}
                aria-label={t.settings}
                title={t.settings}
                className="min-w-[44px] min-h-[44px] rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-5 pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'home' && (
                <DashboardTab
                  language={settings.language}
                  balance={balance}
                  rank={userRank}
                  transactions={transactions}
                  onOpenRecycleModal={() => setRecycleModalOpen(true)}
                  onOpenGamesTab={() => setActiveTab('games')}
                />
              )}

              {activeTab === 'games' && (
                <GamesTab
                  language={settings.language}
                  highScores={highScores}
                  soundEnabled={settings.soundEffects}
                  onCompleteGame={handleCompleteGame}
                />
              )}

              {activeTab === 'achievements' && (
                <AchievementsTab language={settings.language} achievements={achievements} />
              )}

              {activeTab === 'leaderboard' && (
                <LeaderboardTab
                  language={settings.language}
                  students={sortedStudents}
                  classes={sortedClasses}
                  heroes={sortedHeroes}
                />
              )}

              {activeTab === 'canteen' && (
                <CanteenTab
                  language={settings.language}
                  balance={balance}
                  items={CANTEEN_ITEMS}
                  onRedeemItem={handleRedeemCanteenItem}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <div className="fixed bottom-20 right-4 sm:right-6 z-30">
          <motion.button
            type="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            onClick={() => setEcoBotOpen(true)}
            aria-label={t.ecoGuideBtn}
            title={t.ecoGuideBtn}
            className="group relative h-14 px-4 rounded-full bg-[#2ECC71] hover:bg-[#27AE60] text-white shadow-lg shadow-[#2ECC71]/35 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6" aria-hidden="true" />
              <Leaf
                className="w-3 h-3 text-[#F1C40F] fill-[#F1C40F] absolute -top-1 -right-1.5"
                aria-hidden="true"
              />
            </div>
            <span className="text-sm font-bold whitespace-nowrap">{t.ecoGuideBtn}</span>
          </motion.button>
        </div>

        <nav
          aria-label="Основная навигация"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#15241D]/95 backdrop-blur-md border-t border-[#E4F0E9] dark:border-[#22382C]"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-5 items-center h-16 pb-safe">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer px-1 ${
                    isActive
                      ? 'text-[#27AE60] dark:text-[#2ECC71]'
                      : 'text-[#6B7F8F] dark:text-[#8BA495] hover:text-[#2C3E50] dark:hover:text-[#ECF7F0]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-indicator"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute top-0 w-8 h-0.5 rounded-full bg-[#2ECC71]"
                    />
                  )}
                  {item.icon}
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight whitespace-nowrap truncate max-w-full">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <QrModal qrState={activeQr} language={settings.language} onClose={() => setActiveQr(null)} />

        <RecycleSimModal
          open={recycleModalOpen}
          language={settings.language}
          onClose={() => setRecycleModalOpen(false)}
          onSelectWaste={handleRecycleWaste}
        />

        <EcoBotModal
          open={ecoBotOpen}
          language={settings.language}
          balance={balance}
          levelName={levelName}
          rank={userRank}
          onClose={() => setEcoBotOpen(false)}
        />

        <SettingsModal
          open={settingsOpen}
          schoolCode={schoolCode}
          settings={settings}
          onUpdateSettings={updateSettings}
          onRestartTour={() => setTourOpen(true)}
          onLogout={handleLogout}
          onClose={() => setSettingsOpen(false)}
        />

        <GuidedTourModal
          open={tourOpen}
          language={settings.language}
          onClose={() => setTourOpen(false)}
        />
      </div>
    </MotionConfig>
  );
}
