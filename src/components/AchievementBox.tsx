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
        <h2 className="font-pixel text-xs tracking-wider flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-400" />
          <span>ACHIEVEMENTS</span>
        </h2>
        <span className="font-pixel text-[8px] text-gray-400">TROPHY ROOM</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ACHIEVEMENTS.map((badge) => {
          const unlocked = badge.isUnlocked(level, totalQuests, streak);

          return (
            <div
              key={badge.id}
              className={`p-2.5 border-2 border-black flex flex-col gap-1 transition-all ${
                unlocked
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-200'
                  : 'bg-black/30 border-black/40 text-gray-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{badge.icon}</span>
                <span className="font-pixel text-[9px] font-bold tracking-tight line-clamp-1">
                  {badge.title}
                </span>
              </div>
              <p className="text-[9px] text-gray-400 font-sans leading-tight">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}