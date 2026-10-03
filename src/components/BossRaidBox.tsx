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

  return (
    <div className="flex flex-col gap-6">
      {/* Boss Raid Panel */}
      <section className="pixel-panel p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 className="font-pixel text-xs tracking-wider flex items-center gap-1.5">
            <Swords size={14} className="text-rpg-pink" />
            <span>WEEKLY BOSS RAID</span>
          </h2>
          <span className="font-pixel text-[8px] text-gray-400">RESET: SUNDAY</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{boss.avatar}</span>
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between items-center font-pixel text-[9px]">
              <span className="text-white">{boss.name}</span>
              <span className="text-gray-400">
                {boss.currentHp} / {boss.maxHp} HP
              </span>
            </div>
            <div className="w-full h-3.5 bg-[#2b2738] border-2 border-black p-0.5 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${hpPercent}%`,
                  backgroundColor: '#ff007f',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hero Gear Showcase Panel */}
      <section className="pixel-panel p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 className="font-pixel text-xs tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-rpg-cyan" />
            <span>HERO GEAR</span>
          </h2>
          <span className="font-pixel text-[8px] text-gray-400">LVL UNLOCKS</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {EQUIPMENTS.map((gear) => {
            const isUnlocked = level >= gear.unlockLevel;

            return (
              <div
                key={gear.id}
                title={`${gear.name}: ${gear.desc}`}
                className={`flex flex-col items-center justify-center p-2 border-2 border-black transition-all ${
                  isUnlocked
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-200'
                    : 'bg-black/40 border-black/50 text-gray-600 opacity-40'
                }`}
              >
                <span className="text-xl">{gear.icon}</span>
                <span className="font-pixel text-[7px] mt-1 text-center truncate w-full">
                  {gear.name.split(' ')[0]}
                </span>
                <span className="text-[7px] text-gray-400">Lv.{gear.unlockLevel}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}