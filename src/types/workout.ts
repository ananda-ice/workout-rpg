// src/types/workout.ts

export type HeroClass = 'mage' | 'warrior' | 'ranger' | 'rogue';

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
  name: string;
  maxHp: number;
  currentHp: number;
  avatar: string;
  weekId: string;
}

export interface Equipment {
  id: string;
  name: string;
  icon: string;
  requiredLevel: number;
  buffDesc: string;
}