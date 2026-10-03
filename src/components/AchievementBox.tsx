// src/components/AchievementBox.tsx
'use client';

import { Trophy } from 'lucide-react';
import { ACHIEVEMENTS } from '@/utils/rpgLogic';

interface AchievementBoxProps {
  level: number;
  totalQuests: number;
  streak: number;
}

export default function AchievementBox({ level, totalQuests, streak }: AchievementBoxProps) {
  return (
    <section className="pixel-panel p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center border-b-2 border-black pb-2">
        <h2 className="font-pixel text-xs text-rpg-accent flex items-center gap-2">
          <Trophy size={16} /> ACHIEVEMENTS
        </h2>
        <span className="font-pixel text-[9px] text-gray-400">TROPHY ROOM</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map((badge) => {
          const unlocked = badge.isUnlocked(level, totalQuests, streak);
          return (
            <div
              key={badge.id}
              className={`p-2.5 border-2 flex items-center gap-2.5 transition-all ${
                unlocked
                  ? 'bg-[#15141f] border-black text-white shadow-sm'
                  : 'bg-black/30 border-dashed border-gray-700 opacity-40'
              }`}
            >
              <span className={`text-xl ${unlocked ? 'scale-110' : 'grayscale'}`}>{badge.icon}</span>
              <div className="flex flex-col">
                <span className="font-pixel text-[9px] text-white leading-tight">
                  {badge.name}
                </span>
                <span className="text-[9px] text-gray-400 leading-tight mt-0.5">
                  {unlocked ? badge.desc : 'LOCKED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}