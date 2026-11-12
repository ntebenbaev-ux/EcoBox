import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, KeyRound, Leaf, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../i18n';
import { EcoLogo } from './EcoLogo';

interface WelcomeScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogin: (schoolCode: string) => void;
}

export function WelcomeScreen({ language, onLanguageChange, onLogin }: WelcomeScreenProps) {
  const t = getT(language);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setError(t.schoolCodeError);
      return;
    }
    setError('');
    onLogin(trimmed.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#F4FBF7] dark:bg-[#0D1913] flex flex-col justify-between px-4 py-6 sm:py-10">
      <div className="w-full max-w-md mx-auto flex justify-end">
        <div className="inline-flex items-center gap-1 p-1 bg-white dark:bg-[#15241D] rounded-xl shadow-sm border border-[#E2EFE7] dark:border-[#23392D]">
          <button
            type="button"
            onClick={() => onLanguageChange('ru')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] cursor-pointer ${
              language === 'ru'
                ? 'bg-[#2ECC71] text-white'
                : 'text-[#5A6C7D] dark:text-[#9BB5A6] hover:text-[#2C3E50] dark:hover:text-white'
            }`}
          >
            Русский
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('kk')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] cursor-pointer ${
              language === 'kk'
                ? 'bg-[#2ECC71] text-white'
                : 'text-[#5A6C7D] dark:text-[#9BB5A6] hover:text-[#2C3E50] dark:hover:text-white'
            }`}
          >
            Қазақша
          </button>
        </div>
      </div>

      <main className="w-full max-w-md mx-auto my-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-[#15241D] eco-card p-6 sm:p-8 border border-[#E4F0E9] dark:border-[#22382C] text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center mb-6"
          >
            <EcoLogo size="lg" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] dark:text-[#ECF7F0] tracking-tight text-balance mb-3">
            {t.welcomeTitle}
          </h1>

          <p className="text-[15px] leading-relaxed text-[#526576] dark:text-[#A9C2B3] mb-7">
            {t.welcomeDesc}
          </p>

          <form onSubmit={handleSubmit} className="text-left space-y-4">
            <div>
              <label
                htmlFor="school-code-input"
                className="block text-sm font-semibold text-[#2C3E50] dark:text-[#D9EDE1] mb-2"
              >
                {t.schoolCodeLabel}
              </label>
              <div className="relative">
                <KeyRound
                  className="w-5 h-5 text-[#2ECC71] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="school-code-input"
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={t.schoolCodePlaceholder}
                  autoComplete="off"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913] border border-[#D4E8DC] dark:border-[#2A4235] text-[#2C3E50] dark:text-[#ECF7F0] placeholder:text-[#8CA0AE] dark:placeholder:text-[#688274] font-mono-num text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition-shadow"
                />
              </div>
              {error ? (
                <p className="mt-2 text-xs font-medium text-[#E74C3C]">{error}</p>
              ) : (
                <p className="mt-2 text-xs text-[#6B7F8F] dark:text-[#89A394] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#2ECC71] shrink-0" aria-hidden="true" />
                  <span>{t.demoHint}</span>
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              className="w-full min-h-[48px] px-6 py-3.5 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold text-[15px] shadow-md shadow-[#2ECC71]/25 flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{t.enterButton}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#EDF5F0] dark:border-[#21362A] flex items-center justify-center gap-4 text-xs text-[#6B7F8F] dark:text-[#8AA395]">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F1C40F]" aria-hidden="true" />
              EcoCoins
            </span>
            <span aria-hidden="true">·</span>
            <span>Пластик +15</span>
            <span aria-hidden="true">·</span>
            <span>Металл +10</span>
            <span aria-hidden="true">·</span>
            <span>Стекло +20</span>
          </div>
        </motion.div>
      </main>

      <footer className="text-center text-xs text-[#7F93A1] dark:text-[#6E897A]">
        EcoBox School System · 2026
      </footer>
    </div>
  );
}
