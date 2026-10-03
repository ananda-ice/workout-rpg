// src/components/QuestHistory.tsx
'use client';

import { Calendar, Dumbbell, HeartPulse, History, Moon } from 'lucide-react';
import { WorkoutSession } from '@/types/workout';

interface QuestHistoryProps {
  history: WorkoutSession[];
}

export default function QuestHistory({ history }: QuestHistoryProps) {
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];
    const sessions = history.filter((h) => h.date === dateStr);
    const hasRest = sessions.some((s) => s.category === 'rest');
    return { date: dateStr, count: sessions.length, hasRest };
  });

  return (
    <section className="pixel-panel p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b-2 border-black pb-2">
        <h2 className="font-pixel text-xs text-rpg-accent flex items-center gap-2">
          <History size={16} /> QUEST LOGS
        </h2>
        <span className="font-pixel text-[9px] text-gray-400">LAST 28 DAYS</span>
      </div>

      {/* Heatmap Grid */}
      <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-7 gap-1.5 p-2 bg-[#15141f] border-2 border-black">
          {days.map((day, idx) => {
            let bgClass = 'bg-[#242234] border-black';
            if (day.hasRest && day.count === 1) {
              bgClass = 'bg-blue-600/70 border-blue-400'; // สีฟ้าสำหรับวันพักผ่อน
            } else if (day.count === 1) {
              bgClass = 'bg-rpg-cyan border-black';
            } else if (day.count > 1) {
              bgClass = 'bg-rpg-accent border-black';
            }

            return (
              <div
                key={idx}
                title={`${day.date}: ${day.hasRest ? 'Rest Day' : `${day.count} Quests`}`}
                className={`h-4 border ${bgClass} transition-transform hover:scale-110 cursor-pointer`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center px-1 font-pixel text-[8px] text-gray-500">
          <span>PAST</span>
          <div className="flex items-center gap-1.5">
            <span>REST</span>
            <div className="w-2.5 h-2.5 bg-blue-600/70 border border-blue-400" title="Rest Day" />
            <span>TRAIN</span>
            <div className="w-2.5 h-2.5 bg-rpg-cyan border border-black" />
            <div className="w-2.5 h-2.5 bg-rpg-accent border border-black" />
          </div>
          <span>TODAY</span>
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-center font-pixel text-[9px] text-gray-500 py-4">NO COMPLETED QUESTS YET</p>
        ) : (
          history.slice(-5).reverse().map((session) => (
            <div
              key={session.id}
              className="bg-[#15141f] p-2.5 border-2 border-black flex justify-between items-center text-xs"
            >
              <div className="flex items-center gap-2">
                {session.category === 'rest' ? (
                  <Moon size={15} className="text-blue-400" />
                ) : session.category === 'cardio' ? (
                  <HeartPulse size={15} className="text-rpg-pink" />
                ) : (
                  <Dumbbell size={15} className="text-rpg-cyan" />
                )}
                <div>
                  <span className="font-pixel text-[10px] text-white block">{session.programName}</span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar size={10} /> {session.date}
                  </span>
                </div>
              </div>
              <span className="font-pixel text-[10px] text-rpg-accent">+{session.expGained} EXP</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}