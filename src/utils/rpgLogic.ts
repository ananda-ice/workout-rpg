// src/utils/rpgLogic.ts
import { WorkoutSession, Equipment, HeroClass, BossRaid } from '@/types/workout';

// 1. คำนวณ Streak (รวมวัน Rest Day เข้าไปด้วย Streak ไม่หลุด)
export function calculateStreak(history: WorkoutSession[]): number {
  if (!history || history.length === 0) return 0;

  const uniqueDates = Array.from(new Set(history.map((h) => h.date))).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const latestDate = uniqueDates[0];
  if (latestDate !== today && latestDate !== yesterday) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(latestDate);

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i]);
    const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}

// เช็กว่าวันนี้กดพักได้หรือไม่ (ห้ามพักเกิน 2 วันติดกัน)
export function checkRestEligibility(history: WorkoutSession[]): { canRest: boolean; reason?: string } {
  const today = new Date().toISOString().split('T')[0];

  // ถ้าวันนี้บันทึกอะไรไปแล้ว (รวมถึงพักไปแล้ว) ไม่ให้กดซ้ำ
  const todaySession = history.find((h) => h.date === today);
  if (todaySession) {
    return { canRest: false, reason: 'Already logged today!' };
  }

  // หาวันที่ 1 และ 2 ย้อนหลังจากวันนี้
  const d1 = new Date();
  d1.setDate(d1.getDate() - 1);
  const dateYesterday = d1.toISOString().split('T')[0];

  const d2 = new Date();
  d2.setDate(d2.getDate() - 2);
  const dateTwoDaysAgo = d2.toISOString().split('T')[0];

  const yesterdaySession = history.find((h) => h.date === dateYesterday);
  const twoDaysAgoSession = history.find((h) => h.date === dateTwoDaysAgo);

  // ถ้าทั้งเมื่อวานและสองวันก่อนเป็นวัน 'rest' ทั้งคู่ = พักติดกันครบ 2 วันแล้ว
  if (yesterdaySession?.category === 'rest' && twoDaysAgoSession?.category === 'rest') {
    return { canRest: false, reason: 'Max 2 rest days in a row reached! Time to train!' };
  }

  return { canRest: true };
}

// 2. ข้อมูล Sprite และฉายาตามคลาส
export const HERO_CLASSES: Record<HeroClass, { name: string; avatar: string }> = {
  mage: { name: 'MAGE', avatar: '🧙‍♂️' },
  warrior: { name: 'WARRIOR', avatar: '⚔️' },
  ranger: { name: 'RANGER', avatar: '🏹' },
  rogue: { name: 'ROGUE', avatar: '🥷' },
};

export function getHeroTitle(level: number): string {
  if (level >= 20) return 'GRAND CHAMPION';
  if (level >= 15) return 'ELITE GLADIATOR';
  if (level >= 10) return 'VETERAN';
  if (level >= 5)  return 'APPRENTICE';
  return 'NOVICE';
}

// 3. รายการ Equipment ปลดล็อกตาม Level
export const EQUIPMENTS: Equipment[] = [
  { id: 'boots', name: 'PIXEL RUNNERS', icon: '👟', requiredLevel: 2, buffDesc: '+5% Cardio EXP' },
  { id: 'gloves', name: 'IRON GRIP', icon: '🥊', requiredLevel: 4, buffDesc: '+5% Strength EXP' },
  { id: 'armor', name: 'TITAN PLATE', icon: '🛡️', requiredLevel: 8, buffDesc: '+10% All EXP' },
  { id: 'crown', name: 'HERO CROWN', icon: '👑', requiredLevel: 15, buffDesc: 'Status Symbol' },
];

// 4. บอสประจำสัปดาห์
export function getCurrentWeekId(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil((((now.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

export const DEFAULT_BOSS: BossRaid = {
  name: 'GOBLIN BEAST',
  maxHp: 1000,
  currentHp: 1000,
  avatar: '👹',
  weekId: getCurrentWeekId(),
};

// 5. Achievements
export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  isUnlocked: (level: number, totalQuests: number, streak: number) => boolean;
}

export const ACHIEVEMENTS: Badge[] = [
  {
    id: 'first_step',
    name: 'FIRST BLOOD',
    desc: 'Complete your first quest',
    icon: '🎯',
    isUnlocked: (_, total) => total >= 1,
  },
  {
    id: 'on_fire',
    name: 'FLAME SPIRIT',
    desc: 'Reach a 3-day streak',
    icon: '🔥',
    isUnlocked: (_, __, streak) => streak >= 3,
  },
  {
    id: 'level_5',
    name: 'AWAKENING',
    desc: 'Reach Level 5',
    icon: '⚡',
    isUnlocked: (lvl) => lvl >= 5,
  },
  {
    id: 'ten_quests',
    name: 'IRON WILL',
    desc: 'Complete 10 total quests',
    icon: '🏆',
    isUnlocked: (_, total) => total >= 10,
  },
];