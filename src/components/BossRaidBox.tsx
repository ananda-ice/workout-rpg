// src/components/BossRaidBox.tsx
'use client';

import { Swords, Sparkles } from 'lucide-react';
import { BossRaid } from '@/types/workout';
import { EQUIPMENTS } from '@/utils/rpgLogic';

interface BossRaidBoxProps {
  boss: BossRaid;
  level: number;
}

export default function BossRaidBox({ boss, level }: BossRaidBoxProps) {
  const hpPercent = Math.max(0, Math.min(100, (boss.currentHp / boss.maxHp) * 100));
  const isDefeated = boss.currentHp <= 0;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Boss Raid Banner */}
      <section className="pixel-panel p-4 bg-[#1a1215] border-rpg-pink/50 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 className="font-pixel text-xs text-rpg-pink flex items-center gap-2">
            <Swords size={16} /> WEEKLY BOSS RAID
          </h2>
          <span className="font-pixel text-[8px] text-gray-400">RESET: SUNDAY</span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-3xl ${isDefeated ? 'grayscale opacity-50' : 'animate-bounce'}`}>
            {isDefeated ? '💀' : boss.avatar}
          </span>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between font-pixel text-[10px]">
              <span className="text-white">{boss.name}</span>
              <span className="text-rpg-pink">
                {isDefeated ? 'DEFEATED!' : `${boss.currentHp} / ${boss.maxHp} HP`}
              </span>
            </div>
            <div className="w-full h-3 bg-black border-2 border-black p-0.5">
              <div
                className="h-full bg-rpg-pink transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Equipment Showcase */}
      <section className="pixel-panel p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center border-b-2 border-black pb-1.5">
          <span className="font-pixel text-[10px] text-rpg-cyan flex items-center gap-1.5">
            <Sparkles size={13} /> HERO GEAR
          </span>
          <span className="font-pixel text-[8px] text-gray-400">LVL UNLOCKS</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {EQUIPMENTS.map((gear) => {
            const unlocked = level >= gear.requiredLevel;
            return (
              <div
                key={gear.id}
                title={`${gear.name} (${gear.buffDesc})`}
                className={`p-2 border-2 border-black flex flex-col items-center justify-center text-center ${
                  unlocked ? 'bg-[#15141f] text-white' : 'bg-black/40 opacity-30 grayscale'
                }`}
              >
                <span className="text-lg">{gear.icon}</span>
                <span className="font-pixel text-[7px] mt-1 line-clamp-1">{gear.name}</span>
                <span className="text-[7px] text-gray-400">
                  {unlocked ? 'EQUIPPED' : `LV.${gear.requiredLevel}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}