import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, Bot, Coins, QrCode, Recycle, UtensilsCrossed, X } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../i18n';

interface GuidedTourModalProps {
  open: boolean;
  language: Language;
  onClose: () => void;
}

export function GuidedTourModal({ open, language, onClose }: GuidedTourModalProps) {
  const [step, setStep] = useState(0);
  const t = getT(language);

  const steps =
    language === 'kk'
      ? [
          {
            icon: <QrCode className="w-7 h-7 text-[#2ECC71]" />,
            title: '1. «Менің QR-кодым» түймесі',
            body: 'Жоғарғы оң жақтағы QR белгішесін басып, кодты мектептегі EcoBox контейнерінің сканеріне көрсет.',
          },
          {
            icon: <Recycle className="w-7 h-7 text-[#2ECC71]" />,
            title: '2. Қалдық өткізу симуляторы',
            body: '«Қалдық өткізу (тест)» түймесі арқылы пластик (+15 EC), металл (+10 EC) немесе шыны (+20 EC) өткізіп көр.',
          },
          {
            icon: <UtensilsCrossed className="w-7 h-7 text-[#F1C40F]" />,
            title: '3. Ойындар мен Асхана',
            body: 'Төменгі мәзірден «Ойындар», «Жетістіктер», «Рейтинг» және «Асхана» бөлімдеріне өтіп, EcoCoins жинап тағамға айырбаста!',
          },
          {
            icon: <Bot className="w-7 h-7 text-[#2ECC71]" />,
            title: '4. Эко-гид көмекшісі',
            body: 'Төменгі оң жақтағы жасыл «Эко-гид» түймесі кез келген сұраққа жауап беруге әрқашан дайын.',
          },
        ]
      : [
          {
            icon: <QrCode className="w-7 h-7 text-[#2ECC71]" />,
            title: '1. Твой QR-код в шапке',
            body: 'Нажми на иконку QR-кода в правом верхнем углу, чтобы отсканировать профиль на школьном контейнере EcoBox.',
          },
          {
            icon: <Recycle className="w-7 h-7 text-[#2ECC71]" />,
            title: '2. Кнопка «Сдать отходы (тест)»',
            body: 'Попробуй сдать пластик (+15 EC), металл (+10 EC) или стекло (+20 EC) прямо с главного экрана — баланс и история обновятся сразу.',
          },
          {
            icon: <Coins className="w-7 h-7 text-[#F1C40F]" />,
            title: '3. Эко-игры, Рейтинг и Столовая',
            body: 'Внизу выбирай вкладки: «Игры» для заработка EcoCoins, «Достижения», «Рейтинг» учеников и «Столовая» для обмена баллов на QR-купоны.',
          },
          {
            icon: <Award className="w-7 h-7 text-[#2ECC71]" />,
            title: '4. Встроенный «Эко-гид»',
            body: 'Круглая зелёная кнопка внизу справа открывает помощника с инструкциями по сортировке и ответами на любые вопросы об EcoBox.',
          },
        ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleClose = () => {
    setStep(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="w-full max-w-sm bg-white dark:bg-[#15241D] rounded-3xl p-6 shadow-2xl border border-[#E4F0E9] dark:border-[#22382C]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#27AE60] dark:text-[#2ECC71] font-mono-num">
                {t.tourStepPrefix} {step + 1} / {steps.length}
              </span>
              <button
                type="button"
                onClick={handleClose}
                aria-label={t.close}
                className="min-w-[40px] min-h-[40px] -mr-2 rounded-xl flex items-center justify-center text-[#5A6C7D] dark:text-[#9CB7A7] hover:bg-[#F4FBF7] dark:hover:bg-[#0D1913] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F4FBF7] dark:bg-[#0D1913] border border-[#E2EFE7] dark:border-[#23392D] flex items-center justify-center mb-4">
                  {current.icon}
                </div>

                <h2 id="tour-title" className="text-lg font-bold text-[#2C3E50] dark:text-[#ECF7F0] mb-2">
                  {current.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#526576] dark:text-[#A9C2B3] mb-6">
                  {current.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2 mb-5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    idx <= step ? 'bg-[#2ECC71]' : 'bg-[#E2EFE7] dark:bg-[#23392D]'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[44px] px-4 rounded-xl text-sm font-semibold text-[#5A6C7D] dark:text-[#9CB7A7] hover:bg-[#F4FBF7] dark:hover:bg-[#0D1913] cursor-pointer"
              >
                {t.tourSkip}
              </button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (isLast) {
                    handleClose();
                  } else {
                    setStep((s) => s + 1);
                  }
                }}
                className="flex-1 min-h-[44px] px-5 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-sm cursor-pointer"
              >
                {isLast ? t.tourDone : t.tourNext}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
