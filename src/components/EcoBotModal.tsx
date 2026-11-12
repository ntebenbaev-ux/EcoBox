import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { getT } from '../i18n';

interface EcoBotModalProps {
  open: boolean;
  language: Language;
  balance: number;
  levelName: string;
  rank: number;
  onClose: () => void;
}

export function EcoBotModal({
  open,
  language,
  balance,
  levelName,
  rank,
  onClose,
}: EcoBotModalProps) {
  const t = getT(language);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome-bot',
        sender: 'bot',
        text: t.ecoBotWelcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language, t.ecoBotWelcome]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  const quickQuestions =
    language === 'kk'
      ? [t.faq1, t.faq2, t.faq3, 'Қате болса ше?']
      : [t.faq1, t.faq2, t.faq3, 'Что если контейнер выдал ошибку?'];

  const getInstantFaqReply = (question: string): string | null => {
    if (language === 'kk') {
      if (question === t.faq1) {
        return 'EcoBox қолдану тәртібі:\n1. Ақылды контейнер сканеріне жеке QR-кодыңды көрсет.\n2. Ашылған тиісті бөлімге қалдықты сал (пластик, шыны немесе металл).\n3. Балансыңа EcoCoins алып, операциялар тарихын бақыла.\n4. Жиналған баллдарды мектеп асханасында QR-код арқылы тәттілерге айырбаста!';
      }
      if (question === t.faq2) {
        return 'EcoBox контейнеріне мына таза қалдықтарды өткізуге болады:\n• Пластик (+15 EC): ПЭТ-бөтелкелер, қақпақтар.\n• Металл (+10 EC): алюминий банкілер.\n• Шыны (+20 EC): қақпақсыз шыны бөтелкелер.\nМаңызды: бөлім дұрыс таңдалмаса, контейнер қатені тіркеп, балл есептемейді.';
      }
      if (question === t.faq3) {
        return '«Асхана» қойындысына өтіп, шырын (50 EC), тоқаш (40 EC), жеміс жинағы (60 EC), сэндвич (70 EC) немесе эко-шоппер (450 EC) таңда. «QR алу» түймесін басып, кодты мектеп асханасының кассасында көрсет!';
      }
      if (question === 'Қате болса ше?') {
        return 'Егер материал дұрыс таңдалмаса немесе контейнер қатені тіркесе, жүйе бұл туралы хабарлайды және балл есептелмейді — бұл әділ рейтингті сақтайды. Ал техникалық ақау туындаса, мектеп әкімшісіне немесе техқолдауға хабарлас.';
      }
      return null;
    }

    if (question === t.faq1) {
      return 'Как пользоваться EcoBox:\n1. Покажи свой персональный QR-код на сканере умного контейнера EcoBox.\n2. Сдай отходы в открывшийся нужный отсек (пластик, стекло или металл).\n3. Получи EcoCoins на свой баланс и следи за историей операций.\n4. Обменивай накопленные баллы на угощения в школьной столовой по QR-коду!';
    }
    if (question === t.faq2) {
      return 'Правила сортировки в EcoBox:\n• Пластик (+15 EC): чистые ПЭТ-бутылки и крышки.\n• Металл (+10 EC): алюминиевые банки от напитков.\n• Стекло (+20 EC): чистые стеклянные бутылки и банки без крышек.\nВажно: если материал выбран неправильно, баллы не начисляются.';
    }
    if (question === t.faq3) {
      return 'Оплата в школьной столовой работает по QR-коду:\nОткрой вкладку «Столовая», выбери сок (50 EC), сэндвич (70 EC), выпечку (40 EC), фруктовый набор (60 EC) или эко-шоппер (450 EC), нажми «Получить QR» и покажи код на кассе.';
    }
    if (question === 'Что если контейнер выдал ошибку?') {
      return 'Если материал выбран неправильно или контейнер зафиксировал ошибку, система сообщает об этом, и баллы не начисляются — так поддерживается честный рейтинг учеников и классов. А если возникла техническая неисправность, обратись к школьному администратору или в техподдержку.';
    }
    return null;
  };

  const sendQuestion = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || loading) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: nowTime,
    };

    const historySnapshot = messages.map((m) => ({ sender: m.sender, text: m.text }));
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const instantReply = getInstantFaqReply(text);
    if (instantReply) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now() + 1}`,
          sender: 'bot',
          text: instantReply,
          timestamp: nowTime,
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ecobot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          balance,
          levelName,
          rank,
          history: historySnapshot,
        }),
      });
      const data = await res.json();
      const reply =
        data?.reply ||
        (language === 'kk'
          ? 'EcoBox-та пластик, металл және шыны өткізіп EcoCoins жинауға болады!'
          : 'В EcoBox ты можешь сдавать пластик, металл и стекло, а EcoCoins тратить в школьной столовой!');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now() + 2}`,
          sender: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now() + 2}`,
          sender: 'bot',
          text:
            language === 'kk'
              ? 'Қазір қосылым уақытша шектелген, бірақ жоғарыдағы жылдам сұрақтардан барлық нұсқауды оқи аласың!'
              : 'Сейчас связь временно ограничена, но ты всегда можешь нажать на быстрые вопросы выше — я сразу покажу подробную памятку!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendQuestion(input);
  };

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
          aria-labelledby="ecobot-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 48, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 310, damping: 28 }}
            className="w-full sm:max-w-lg h-[86vh] sm:h-[640px] bg-white dark:bg-[#15241D] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E4F0E9] dark:border-[#22382C] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#EDF5F0] dark:border-[#21362A] flex items-center justify-between gap-3 bg-gradient-to-r from-[#27AE60] via-[#2ECC71] to-[#239B56] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="ecobot-title" className="text-base font-bold text-white">
                    {t.ecoBotTitle}
                  </h2>
                  <p className="text-xs text-white/90 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#F9E79F]" aria-hidden="true" />
                    <span>{t.ecoBotSubtitle}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-white/90 hover:bg-white/15 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-[#EDF5F0] dark:border-[#21362A] bg-white dark:bg-[#15241D]">
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <motion.button
                    key={q}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => sendQuestion(q)}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913] hover:bg-[#E5F7EC] dark:hover:bg-[#1A3124] border border-[#D7EDE0] dark:border-[#243B2E] text-xs font-semibold text-[#1E8449] dark:text-[#6EE7A0] text-left transition-colors cursor-pointer"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9FDFB] dark:bg-[#0E1B14]">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                          isUser
                            ? 'bg-[#2ECC71] text-white rounded-br-sm shadow-sm'
                            : 'bg-white dark:bg-[#15241D] text-[#2C3E50] dark:text-[#ECF7F0] border border-[#E4F0E9] dark:border-[#22382C] rounded-bl-sm shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[11px] text-[#7D919F] dark:text-[#7B9786] mt-1 px-1 font-mono-num">
                        {msg.timestamp}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start"
                >
                  <div className="bg-white dark:bg-[#15241D] border border-[#E4F0E9] dark:border-[#22382C] rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-[#5A6C7D] dark:text-[#9CB7A7]">
                    {language === 'kk' ? 'Ойланып жатырмын...' : 'Печатает ответ...'}
                  </div>
                </motion.div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white dark:bg-[#15241D] border-t border-[#EDF5F0] dark:border-[#21362A] flex items-center gap-2 pb-safe"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.ecoBotPlaceholder}
                className="flex-1 min-h-[44px] px-4 rounded-xl bg-[#F4FBF7] dark:bg-[#0D1913] border border-[#D7EDE0] dark:border-[#243B2E] text-sm text-[#2C3E50] dark:text-[#ECF7F0] placeholder:text-[#8CA0AE] focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.94 }}
                disabled={!input.trim() || loading}
                aria-label={t.send}
                className="min-w-[44px] min-h-[44px] px-4 rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
