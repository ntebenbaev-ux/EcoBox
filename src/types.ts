export type TabId = 'home' | 'games' | 'achievements' | 'leaderboard' | 'canteen';

export type Language = 'ru' | 'kk';

export type WasteType = 'plastic' | 'metal' | 'glass';

export interface Transaction {
  id: string;
  amount: number;
  titleRu: string;
  titleKk: string;
  timeRu: string;
  timeKk: string;
  category: 'plastic' | 'metal' | 'glass' | 'canteen' | 'game';
}

export interface Achievement {
  id: string;
  emoji: string;
  titleRu: string;
  titleKk: string;
  descriptionRu: string;
  descriptionKk: string;
  current: number;
  target: number;
  unitRu?: string;
  unitKk?: string;
  wasteLink?: WasteType;
}

export interface LeaderboardStudent {
  id: string;
  name: string;
  classLabel: string;
  coins: number;
  avatarEmoji: string;
  isCurrentUser?: boolean;
}

export interface LeaderboardClass {
  id: string;
  nameRu: string;
  nameKk: string;
  coins: number;
  studentsCount: number;
  isCurrentUserClass?: boolean;
}

export interface EcoHero {
  id: string;
  name: string;
  classLabel: string;
  badgeRu: string;
  badgeKk: string;
  recycledItems: number;
  avatarEmoji: string;
  isCurrentUser?: boolean;
}

export interface CanteenItem {
  id: string;
  emoji: string;
  nameRu: string;
  nameKk: string;
  descriptionRu: string;
  descriptionKk: string;
  price: number;
}

export interface AppSettings {
  notifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  language: Language;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export interface ActiveQrState {
  mode: 'student' | 'canteen';
  title: string;
  subtitle: string;
  code: string;
  price?: number;
}

export interface GameHighScores {
  sorterBest: number;
  habitsBest: number;
  totalGameCoinsEarned: number;
}
