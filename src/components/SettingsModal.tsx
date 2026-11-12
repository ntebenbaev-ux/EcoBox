import { AnimatePresence, motion } from 'motion/react';
import { Bell, Compass, Globe, LogOut, Moon, Sun, User, Volume2, X } from 'lucide-react';
import { AppSettings, Language } from '../types';
import { getT } from '../i18n';

interface SettingsModalProps {
  open: boolean;
  schoolCode: string;
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onRestartTour: () => void;
  onLogout: () => void;
  onClose: () => void;
}

export function SettingsModal({
  open,
  schoolCode,
  settings,
  onUpdateSettings,
  onRestartTour,
  onLogout,
  onClose,
}: SettingsModalProps) {
  const t = getT(settings.language);

  const ToggleSwitch = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: (next: boolean) => void;
    label: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 flex items-center ${
        checked ? 'bg-[#2ECC71]' : 'bg-[#CBD8D0] dark:bg-[#2A4033]'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`w-5 h-5 rounded-full bg-white shadow-xs ${checked ? 'ml-auto' : ''}`}
      />
    </button>
  );

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
          aria-labelledby="settings-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full sm:max-w-lg max-h-[90vh] bg-[#F4FBF7] dark:bg-[#0D1913] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E4F0E9] dark:border-[#22382C] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-[#27AE60] via-[#2ECC71] to-[#239B56] text-white flex items-center justify-between">
              <h2 id="settings-modal-title" className="text-lg font-bold text-white">
                {t.settingsTitle}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="min-w-[44px] min-h-[44px] -mr-2 rounded-xl flex items-center justify-center text-white/90 hover:bg-white/15 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-5">
              <section className="bg-white dark:bg-[#15241D] eco-card p-5 border border-[#E4F0E9] dark:border-[#22382C]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#2ECC71]/15 text-[#27AE60] dark:text-[#2ECC71] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
                      {t.profileSection}
                    </h3>
                    <p className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">
                      {t.studentSchoolValue}
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913]">
                    <dt className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">{t.studentNameLabel}</dt>
                    <dd className="font-bold text-[#2C3E50] dark:text-[#ECF7F0] mt-0.5">{t.studentNameValue}</dd>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913]">
                    <dt className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">{t.studentClassLabel}</dt>
                    <dd className="font-bold text-[#2C3E50] dark:text-[#ECF7F0] mt-0.5">{t.studentClassValue}</dd>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913]">
                    <dt className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">{t.studentSchoolLabel}</dt>
                    <dd className="font-semibold text-[#2C3E50] dark:text-[#ECF7F0] mt-0.5 truncate">
                      {t.studentSchoolValue}
                    </dd>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913]">
                    <dt className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">{t.studentIdLabel}</dt>
                    <dd className="font-bold font-mono-num text-[#27AE60] dark:text-[#2ECC71] mt-0.5 truncate">
                      {schoolCode || 'ECO-8A-204'}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="bg-white dark:bg-[#15241D] eco-card p-5 border border-[#E4F0E9] dark:border-[#22382C] space-y-4">
                <h3 className="text-sm font-bold text-[#2C3E50] dark:text-[#ECF7F0]">
                  {t.preferencesSection}
                </h3>

                <div className="flex items-center justify-between gap-4 min-h-[44px]">
                  <div className="flex items-center gap-3 min-w-0">
                    <Bell className="w-5 h-5 text-[#2ECC71] shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-[#2C3E50] dark:text-[#ECF7F0]">
                      {t.notifToggle}
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={settings.notifications}
                    onChange={(notifications) => onUpdateSettings({ notifications })}
                    label={t.notifToggle}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 min-h-[44px] pt-3 border-t border-[#EDF5F0] dark:border-[#21362A]">
                  <div className="flex items-center gap-3 min-w-0">
                    <Volume2 className="w-5 h-5 text-[#F1C40F] shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-[#2C3E50] dark:text-[#ECF7F0]">
                      {t.soundToggle}
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={settings.soundEffects}
                    onChange={(soundEffects) => onUpdateSettings({ soundEffects })}
                    label={t.soundToggle}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 min-h-[44px] pt-3 border-t border-[#EDF5F0] dark:border-[#21362A]">
                  <div className="flex items-center gap-3 min-w-0">
                    {settings.darkMode ? (
                      <Moon className="w-5 h-5 text-[#6EE7A0] shrink-0" aria-hidden="true" />
                    ) : (
                      <Sun className="w-5 h-5 text-[#F1C40F] shrink-0" aria-hidden="true" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-[#2C3E50] dark:text-[#ECF7F0]">
                        {t.themeToggle}
                      </div>
                      <div className="text-xs text-[#6B7F8F] dark:text-[#8BA495]">
                        {settings.darkMode ? t.themeDark : t.themeLight}
                      </div>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings.darkMode}
                    onChange={(darkMode) => onUpdateSettings({ darkMode })}
                    label={t.themeToggle}
                  />
                </div>

                <div className="pt-3 border-t border-[#EDF5F0] dark:border-[#21362A] flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#2ECC71] shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-[#2C3E50] dark:text-[#ECF7F0]">
                      {t.languageLabel}
                    </span>
                  </div>

                  <div className="inline-flex p-1 bg-[#F4FBF7] dark:bg-[#0D1913] rounded-xl border border-[#E2EFE7] dark:border-[#23392D]">
                    {(['ru', 'kk'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => onUpdateSettings({ language: lang })}
                        className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          settings.language === lang
                            ? 'bg-[#2ECC71] text-white'
                            : 'text-[#5A6C7D] dark:text-[#9CB7A7] hover:text-[#2C3E50] dark:hover:text-white'
                        }`}
                      >
                        {lang === 'ru' ? 'Русский' : 'Қазақша'}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <div className="space-y-2.5 pb-safe">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    onRestartTour();
                  }}
                  className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-white dark:bg-[#15241D] hover:bg-[#EAF9F0] dark:hover:bg-[#1B3125] border border-[#D7EDE0] dark:border-[#243B2E] text-[#2C3E50] dark:text-[#ECF7F0] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#2ECC71]" aria-hidden="true" />
                  <span>{t.restartTour}</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#FDF2F2] dark:bg-[#2D1717] hover:bg-[#FCE4E4] dark:hover:bg-[#3A1E1E] border border-[#F6D0D0] dark:border-[#4F2626] text-[#C0392B] dark:text-[#FF8A80] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>{t.logout}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
