// src/utils/rpgLogic.ts
import { WorkoutSession, BossRaid, HeroClass } from '@/types/workout';

export function getRequiredExp(level: number): number {
  return 100 + (Math.max(1, level) - 1) * 50;
}

export const HERO_CLASSES: Record<HeroClass, { name: string; avatar: string; bonus: string }> = {
  mage: { name: 'Mage', avatar: '🧙‍♂️', bonus: '+10% Cardio EXP' },
  warrior: { name: 'Warrior', avatar: '⚔️', bonus: '+10% Strength EXP' },
  rogue: { name: 'Rogue', avatar: '🥷', bonus: '+15% Streak Bonus' },
  paladin: { name: 'Paladin', avatar: '🛡️', bonus: 'Damage Shield & Rest Perks' },
  ranger: { name: 'Ranger', avatar: '🏹', bonus: '+10% Consistency Bonus' },
};

export interface Equipment {
  id: string;
  name: string;
  unlockLevel: number;
  icon: string;
  desc: string;
}

export const EQUIPMENTS: Equipment[] = [
  {
    id: 'boots',
    name: 'PIXEL BOOTS',
    unlockLevel: 2,
    icon: '👟',
    desc: 'Unlocks at Lv.2',
  },
  {
    id: 'gloves',
    name: 'IRON GLOVES',
    unlockLevel: 4,
    icon: '🥊',
    desc: 'Unlocks at Lv.4',
  },
  {
    id: 'shield',
    name: 'TITAN SHIELD',
    unlockLevel: 8,
    icon: '🛡️',
    desc: 'Unlocks at Lv.8',
  },
  {
    id: 'crown',
    name: 'HERO CROWN',
    unlockLevel: 15,
    icon: '👑',
    desc: 'Unlocks at Lv.15',
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: (level: number, totalQuests: number, streak: number) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'FIRST BLOOD',
    description: 'Complete your first workout quest',
    icon: '🎯',
    isUnlocked: (_lvl: number, quests: number, _streak: number) => quests >= 1,
  },
  {
    id: 'flame_spirit',
    title: 'FLAME SPIRIT',
    description: 'Reach a 3-day workout streak',
    icon: '🔥',
    isUnlocked: (_lvl: number, _quests: number, streak: number) => streak >= 3,
  },
  {
    id: 'awakening',
    title: 'AWAKENING',
    description: 'Reach Hero Level 5',
    icon: '⚡',
    isUnlocked: (lvl: number, _quests: number, _streak: number) => lvl >= 5,
  },
  {
    id: 'iron_will',
    title: 'IRON WILL',
    description: 'Complete 10 total quests',
    icon: '🛡️',
    isUnlocked: (_lvl: number, quests: number, _streak: number) => quests >= 10,
  },
];

export const DEFAULT_BOSS: BossRaid = {
  id: 'boss_goblin_king',
  name: 'Goblin Beast',
  maxHp: 1000,
  currentHp: 1000,
  avatar: '👺',
  weekId: getCurrentWeekId(),
};

export function getCurrentWeekId(): string {
  const d = new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
}

export function getHeroTitle(level: number): string {
  if (level >= 20) return 'LEGENDARY';
  if (level >= 15) return 'CHAMPION';
  if (level >= 10) return 'VETERAN';
  if (level >= 5) return 'WARRIOR';
  return 'NOVICE';
}

export function calculateStreak(history: WorkoutSession[]): number {
  if (!history || history.length === 0) return 0;

  const dates = Array.from(new Set(history.map((s) => s.date))).sort().reverse();
  const today = new Date().toISOString().split('T')[0];

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  if (!dates.includes(today) && !dates.includes(yesterday)) {
    return 0;
  }

  let streak = 0;
  let checkDate = dates.includes(today) ? new Date(today) : yesterdayDate;

  while (true) {
    const formatted = checkDate.toISOString().split('T')[0];
    if (dates.includes(formatted)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function checkRestEligibility(history: WorkoutSession[]): { canRest: boolean; reason?: string } {
  const today = new Date().toISOString().split('T')[0];
  const todaySession = history.find((s) => s.date === today);
  if (todaySession) {
    return { canRest: false, reason: 'Already logged an activity/rest today' };
  }

  const d1 = new Date();
  d1.setDate(d1.getDate() - 1);
  const yesterday = d1.toISOString().split('T')[0];

  const d2 = new Date();
  d2.setDate(d2.getDate() - 2);
  const twoDaysAgo = d2.toISOString().split('T')[0];

  const yesterdaySession = history.find((s) => s.date === yesterday);
  const twoDaysAgoSession = history.find((s) => s.date === twoDaysAgo);

  if (yesterdaySession?.category === 'rest' && twoDaysAgoSession?.category === 'rest') {
    return { canRest: false, reason: 'Max 2 consecutive rest days reached!' };
  }

  return { canRest: true };
}