// src/types/workout.ts

export type HeroClass = 'mage' | 'warrior' | 'paladin' | 'rogue' | 'ranger';

export interface Exercise {
  id: string;
  name: string;
  defaultSets?: number;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'rest';
  targetDays?: string[];
  exercises: Exercise[];
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  programId: string;
  programName: string;
  category: 'strength' | 'cardio' | 'rest';
  logs: any[];
  expGained: number;
}

export interface BossRaid {
  id?: string;
  name: string;
  maxHp: number;
  currentHp: number;
  avatar: string;
  weekId: string;
}

// เพิ่มโครงสร้างสำหรับเก็บประวัติน้ำหนักและ BMI
export interface BodyStatEntry {
  id: string;
  date: string;
  weight: number;
  bmi: number;
}