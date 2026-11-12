import {
  Achievement,
  AppSettings,
  CanteenItem,
  EcoHero,
  GameHighScores,
  LeaderboardClass,
  LeaderboardStudent,
  Transaction,
  WasteType,
} from '../types';

export const INITIAL_BALANCE = 245;

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    amount: 15,
    titleRu: 'Бутылка (пластик)',
    titleKk: 'Бөтелке (пластик)',
    timeRu: '11:45',
    timeKk: '11:45',
    category: 'plastic',
  },
  {
    id: 'tx-2',
    amount: -50,
    titleRu: 'Сок в столовой',
    titleKk: 'Асханадағы шырын',
    timeRu: 'Вчера',
    timeKk: 'Кеше',
    category: 'canteen',
  },
  {
    id: 'tx-3',
    amount: 10,
    titleRu: 'Металл',
    titleKk: 'Металл',
    timeRu: '10:30',
    timeKk: '10:30',
    category: 'metal',
  },
  {
    id: 'tx-4',
    amount: -70,
    titleRu: 'Сэндвич в столовой',
    titleKk: 'Асханадағы сэндвич',
    timeRu: 'Позавчера',
    timeKk: 'Алдыңғы күні',
    category: 'canteen',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-plastic',
    emoji: '🥤',
    titleRu: 'Пластик Профи',
    titleKk: 'Пластик Профи',
    descriptionRu: 'Собери 30 бутылок',
    descriptionKk: '30 бөтелке жина',
    current: 15,
    target: 30,
    wasteLink: 'plastic',
  },
  {
    id: 'ach-paper',
    emoji: '📦',
    titleRu: 'Эко Герой',
    titleKk: 'Эко Қаһарман',
    descriptionRu: 'Сдай 10 кг макулатуры',
    descriptionKk: '10 кг макулатура өткіз',
    current: 7.5,
    target: 10,
    unitRu: 'кг',
    unitKk: 'кг',
  },
  {
    id: 'ach-metal',
    emoji: '🥫',
    titleRu: 'Металл Мастер',
    titleKk: 'Металл Шебері',
    descriptionRu: 'Сдай 50 банок',
    descriptionKk: '50 банкі өткіз',
    current: 28,
    target: 50,
    wasteLink: 'metal',
  },
  {
    id: 'ach-ninja',
    emoji: '🍃',
    titleRu: 'Зелёный Ниндзя',
    titleKk: 'Жасыл Ниндзя',
    descriptionRu: '5 дней без пластика',
    descriptionKk: 'Пластиксіз 5 күн',
    current: 2,
    target: 5,
  },
];

export const OTHER_STUDENTS: LeaderboardStudent[] = [
  { id: 'stu-dasha', name: 'Даша', classLabel: '9 «Б»', coins: 720, avatarEmoji: '👧🏻' },
  { id: 'stu-maksim', name: 'Максим', classLabel: '8 «Б»', coins: 580, avatarEmoji: '👦🏻' },
  { id: 'stu-alina', name: 'Алина', classLabel: '10 «А»', coins: 475, avatarEmoji: '👧🏽' },
  { id: 'stu-kamil', name: 'Камиль', classLabel: '7 «В»', coins: 190, avatarEmoji: '👦🏽' },
];

export const LEADERBOARD_CLASSES: LeaderboardClass[] = [
  { id: 'cls-9b', nameRu: '9 «Б» класс', nameKk: '9 «Б» сынып', coins: 3420, studentsCount: 27 },
  {
    id: 'cls-8a',
    nameRu: '8 «А» класс',
    nameKk: '8 «А» сынып',
    coins: 2890,
    studentsCount: 25,
    isCurrentUserClass: true,
  },
  { id: 'cls-7v', nameRu: '7 «В» класс', nameKk: '7 «В» сынып', coins: 2410, studentsCount: 26 },
  { id: 'cls-10a', nameRu: '10 «А» класс', nameKk: '10 «А» сынып', coins: 1980, studentsCount: 24 },
  { id: 'cls-6g', nameRu: '6 «Г» класс', nameKk: '6 «Г» сынып', coins: 1650, studentsCount: 28 },
];

export const ECO_HEROES: EcoHero[] = [
  {
    id: 'hero-dasha',
    name: 'Даша',
    classLabel: '9 «Б»',
    badgeRu: 'Сортировка без ошибок',
    badgeKk: 'Қатесіз сұрыптау',
    recycledItems: 84,
    avatarEmoji: '🦸‍♀️',
  },
  {
    id: 'hero-maksim',
    name: 'Максим',
    classLabel: '8 «Б»',
    badgeRu: 'Рекорд в Эко-играх',
    badgeKk: 'Эко-ойындар рекорды',
    recycledItems: 68,
    avatarEmoji: '🦸‍♂️',
  },
  {
    id: 'hero-alina',
    name: 'Алина',
    classLabel: '10 «А»',
    badgeRu: 'Стекло и металл',
    badgeKk: 'Шыны мен металл',
    recycledItems: 53,
    avatarEmoji: '🌿',
  },
  {
    id: 'hero-tomiris',
    name: 'Томирис',
    classLabel: '8 «А»',
    badgeRu: 'Активный старт недели',
    badgeKk: 'Аптаның белсенді бастауы',
    recycledItems: 43,
    avatarEmoji: '🌟',
    isCurrentUser: true,
  },
  {
    id: 'hero-kamil',
    name: 'Камиль',
    classLabel: '7 «В»',
    badgeRu: 'Юный защитник природы',
    badgeKk: 'Жас табиғат қорғаушысы',
    recycledItems: 31,
    avatarEmoji: '🌱',
  },
];

export const CANTEEN_ITEMS: CanteenItem[] = [
  {
    id: 'item-juice',
    emoji: '🧃',
    nameRu: 'Сок в столовой',
    nameKk: 'Асханадағы шырын',
    descriptionRu: 'Натуральный яблочный или апельсиновый сок 200 мл',
    descriptionKk: 'Табиғи алма немесе апельсин шырыны 200 мл',
    price: 50,
  },
  {
    id: 'item-sandwich',
    emoji: '🥪',
    nameRu: 'Сэндвич',
    nameKk: 'Сэндвич',
    descriptionRu: 'Свежий зерновой сэндвич с сыром и овощами',
    descriptionKk: 'Ірімшік пен көкөністер қосылған балғын сэндвич',
    price: 70,
  },
  {
    id: 'item-pastry',
    emoji: '🥐',
    nameRu: 'Свежая выпечка / булочка',
    nameKk: 'Балғын бәліш / тоқаш',
    descriptionRu: 'Тёплая школьная булочка из утренней пекарни',
    descriptionKk: 'Таңғы наубайханадан шыққан жылы мектеп тоқашы',
    price: 40,
  },
  {
    id: 'item-fruit',
    emoji: '🍎',
    nameRu: 'Фруктовый набор',
    nameKk: 'Жеміс жинағы',
    descriptionRu: 'Хрустящее яблоко, банан и дольки мандарина',
    descriptionKk: 'Қытырлақ алма, банан және мандарин тілімдері',
    price: 60,
  },
  {
    id: 'item-shopper',
    emoji: '🛍️',
    nameRu: 'Фирменный эко-шоппер EcoBox',
    nameKk: 'EcoBox фирмалық эко-шоппері',
    descriptionRu: 'Плотный хлопковый шоппер с символикой школьной эко-лиги',
    descriptionKk: 'Мектеп эко-лигасының белгісі бар тығыз мақта шоппері',
    price: 450,
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  soundEffects: true,
  darkMode: false,
  language: 'ru',
};

export const INITIAL_HIGH_SCORES: GameHighScores = {
  sorterBest: 0,
  habitsBest: 0,
  totalGameCoinsEarned: 0,
};

export interface SorterItem {
  id: string;
  emoji: string;
  nameRu: string;
  nameKk: string;
  type: WasteType;
  tipRu: string;
  tipKk: string;
}

export const SORTER_ITEMS: SorterItem[] = [
  {
    id: 'pet-water',
    emoji: '🧴',
    nameRu: 'Бутылка от воды (PET)',
    nameKk: 'Су бөтелкесі (PET)',
    type: 'plastic',
    tipRu: 'Прозрачная ПЭТ-бутылка сдаётся в отсек «Пластик».',
    tipKk: 'Мөлдір ПЭТ-бөтелке «Пластик» бөліміне тапсырылады.',
  },
  {
    id: 'soda-can',
    emoji: '🥫',
    nameRu: 'Алюминиевая банка',
    nameKk: 'Алюминий банкі',
    type: 'metal',
    tipRu: 'Алюминиевые банки от напитков относятся к металлу.',
    tipKk: 'Сусындардың алюминий банкілері металл бөліміне жатады.',
  },
  {
    id: 'glass-bottle',
    emoji: '🍾',
    nameRu: 'Стеклянная бутылка',
    nameKk: 'Шыны бөтелке',
    type: 'glass',
    tipRu: 'Стеклянные бутылки принимаются в отсек «Стекло».',
    tipKk: 'Шыны бөтелкелер «Шыны» бөліміне қабылданады.',
  },
  {
    id: 'plastic-cup',
    emoji: '🥤',
    nameRu: 'Пластиковый стаканчик',
    nameKk: 'Пластик стақан',
    type: 'plastic',
    tipRu: 'Чистый пластиковый стаканчик относится к пластику.',
    tipKk: 'Таза пластик стақан пластик бөліміне жатады.',
  },
  {
    id: 'tin-can',
    emoji: '🥣',
    nameRu: 'Жестяная баночка',
    nameKk: 'Қаңылтыр банкі',
    type: 'metal',
    tipRu: 'Жестяная баночка перерабатывается как металл.',
    tipKk: 'Қаңылтыр банкі металл ретінде өңделеді.',
  },
  {
    id: 'glass-jar',
    emoji: '🫙',
    nameRu: 'Стеклянная баночка',
    nameKk: 'Шыны банка',
    type: 'glass',
    tipRu: 'Чистая стеклянная банка без крышки — это стекло.',
    tipKk: 'Қақпақсыз таза шыны банка — шыны қалдығы.',
  },
  {
    id: 'bottle-caps',
    emoji: '🔵',
    nameRu: 'Пластиковые крышечки',
    nameKk: 'Пластик қақпақтар',
    type: 'plastic',
    tipRu: 'Крышки из HDPE-пластика сдаются в пластик.',
    tipKk: 'HDPE-пластик қақпақтар пластикке тапсырылады.',
  },
  {
    id: 'metal-lid',
    emoji: '🪙',
    nameRu: 'Металлическая крышка',
    nameKk: 'Металл қақпақ',
    type: 'metal',
    tipRu: 'Металлическую крышку от банки сдают в отсек «Металл».',
    tipKk: 'Банканың металл қақпағы «Металл» бөліміне түседі.',
  },
  {
    id: 'juice-glass',
    emoji: '🍶',
    nameRu: 'Бутылочка от сока (стекло)',
    nameKk: 'Шырын шөлмегі (шыны)',
    type: 'glass',
    tipRu: 'Стеклянные бутылочки от сока идут в отсек «Стекло».',
    tipKk: 'Шыны шырын шөлмегі «Шыны» бөліміне салынады.',
  },
  {
    id: 'shampoo-hdpe',
    emoji: '🧴',
    nameRu: 'Флакон 2 HDPE',
    nameKk: '2 HDPE флаконы',
    type: 'plastic',
    tipRu: 'Плотные флаконы с маркировкой 2 HDPE — это пластик.',
    tipKk: '2 HDPE таңбасы бар флакондар пластикке жатады.',
  },
];

export interface EcoHabitQuestion {
  id: string;
  emoji: string;
  statementRu: string;
  statementKk: string;
  isEcoFriendly: boolean;
  explanationRu: string;
  explanationKk: string;
}

export const ECO_HABIT_QUESTIONS: EcoHabitQuestion[] = [
  {
    id: 'q1',
    emoji: '🍶',
    statementRu: 'Брать в школу многоразовую бутылку для воды вместо покупки одноразовых каждый день.',
    statementKk: 'Күн сайын бір реттік бөтелке сатып алудың орнына мектепке көп реттік су бөтелкесін алып келу.',
    isEcoFriendly: true,
    explanationRu: 'Многоразовая бутылка за учебный год заменяет более 150 пластиковых бутылок!',
    explanationKk: 'Көп реттік бөтелке оқу жылында 150-ден астам пластик бөтелкені үнемдейді!',
  },
  {
    id: 'q2',
    emoji: '🥛',
    statementRu: 'Выбросить немытую упаковку с остатками йогурта в контейнер для чистого пластика.',
    statementKk: 'Ішінде йогурт қалдығы бар жуылмаған қорапты таза пластик контейнеріне тастау.',
    isEcoFriendly: false,
    explanationRu: 'Остатки еды испортят всю партию вторсырья. Перед сдачей тару нужно ополоснуть!',
    explanationKk: 'Тамақ қалдықтары бүкіл қайта өңделетін шикізатты бүлдіреді. Өткізер алдында шайып тастау керек!',
  },
  {
    id: 'q3',
    emoji: '💡',
    statementRu: 'Выключать свет и интерактивную доску в классе, когда весь класс уходит на перемену.',
    statementKk: 'Бүкіл сынып үзіліске шыққанда кабинеттегі жарық пен интерактивті тақтаны сөндіру.',
    isEcoFriendly: true,
    explanationRu: 'Экономия электроэнергии снижает нагрузку на электростанции и уменьшает выбросы CO₂.',
    explanationKk: 'Электр энергиясын үнемдеу электр станцияларына түсетін жүктемені азайтады.',
  },
  {
    id: 'q4',
    emoji: '🗜️',
    statementRu: 'Смять пластиковую бутылку и алюминиевую банку перед тем, как положить в EcoBox.',
    statementKk: 'EcoBox-қа салар алдында пластик бөтелке мен алюминий банкіні сығып кішірейту.',
    isEcoFriendly: true,
    explanationRu: 'Сжатая тара занимает в 3–4 раза меньше места в контейнере и экономит рейсы вывоза!',
    explanationKk: 'Сығылған ыдыс контейнерде 3–4 есе аз орын алады және тасымалдауды үнемдейді!',
  },
  {
    id: 'q5',
    emoji: '🛍️',
    statementRu: 'Ходить за покупками с тканевым шоппером вместо нового пакета на кассе.',
    statementKk: 'Дүкенге барғанда кассадан жаңа пакет алмай, мата шопперді қолдану.',
    isEcoFriendly: true,
    explanationRu: 'Один шоппер заменяет сотни тонких пластиковых пакетов, которые разлагаются веками.',
    explanationKk: 'Бір мата шоппер ғасырлар бойы шірімейтін жүздеген пластик пакетті алмастырады.',
  },
  {
    id: 'q6',
    emoji: '🔋',
    statementRu: 'Выбросить старые пальчиковые батарейки в обычную урну или контейнер для металла.',
    statementKk: 'Ескі батарейкаларды кәдімгі қоқыс шелегіне немесе металл контейнеріне тастау.',
    isEcoFriendly: false,
    explanationRu: 'Батарейки содержат тяжёлые металлы — их сдают только в специальные экобоксы для опасных отходов.',
    explanationKk: 'Батарейкаларда ауыр металдар бар — оларды тек арнайы қауіпті қалдықтар жәшігіне тапсыру керек.',
  },
  {
    id: 'q7',
    emoji: '🍱',
    statementRu: 'Носить школьный перекус в многоразовом ланч-боксе, а не в одноразовой плёнке.',
    statementKk: 'Мектептегі тіскебасарды бір реттік пленканың орнына көп реттік ланч-боксқа салып әкелу.',
    isEcoFriendly: true,
    explanationRu: 'Ланч-бокс сохраняет еду свежей и избавляет школу от лишней одноразовой упаковки.',
    explanationKk: 'Ланч-бокс тағамды балғын сақтайды және артық бір реттік ораманы азайтады.',
  },
  {
    id: 'q8',
    emoji: '🍂',
    statementRu: 'Сжигать сухие осенние листья возле школы, чтобы быстрее убрать двор.',
    statementKk: 'Ауланы тезірек жинау үшін мектеп жанындағы құрғақ жапырақтарды өртеу.',
    isEcoFriendly: false,
    explanationRu: 'При сжигании листьев в воздух выделяется вредный дым. Лучше делать из них компост!',
    explanationKk: 'Жапырақты өртегенде зиянды түтін бөлінеді. Олардан компост жасаған әлдеқайда пайдалы!',
  },
];
