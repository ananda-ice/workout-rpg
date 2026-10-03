// src/components/BodyStatsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, TrendingDown, Scale, BarChart2 } from 'lucide-react';
import { BodyStatEntry } from '@/types/workout';
import { sfx } from '@/utils/sfx';

interface BodyStatsModalProps {
  isOpen: boolean;
  initialWeight: number;
  initialHeight: number;
  onClose: () => void;
  onSave: (weight: number, height: number, bmi: number) => void;
}

export default function BodyStatsModal({
  isOpen,
  initialWeight,
  initialHeight,
  onClose,
  onSave,
}: BodyStatsModalProps) {
  const [weight, setWeight] = useState(initialWeight);
  const [height, setHeight] = useState(initialHeight);
  const [history, setHistory] = useState<BodyStatEntry[]>([]);

  useEffect(() => {
    setWeight(initialWeight);
    setHeight(initialHeight);
    const saved = localStorage.getItem('rpg_body_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [initialWeight, initialHeight, isOpen]);

  if (!isOpen) return null;

  const currentBmi = weight && height ? weight / Math.pow(height / 100, 2) : 0;

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-sky-400' };
    if (bmi < 23) return { label: 'Normal Weight', color: 'text-emerald-400' };
    if (bmi < 25) return { label: 'Overweight', color: 'text-amber-400' };
    return { label: 'Obese', color: 'text-rpg-pink' };
  };

  const handleSave = () => {
    sfx.playLevelUp();
    const today = new Date().toISOString().split('T')[0];
    const newEntry: BodyStatEntry = {
      id: Date.now().toString(),
      date: today,
      weight: Number(weight),
      bmi: Number(currentBmi.toFixed(1)),
    };

    const updated = [...history.filter((h) => h.date !== today), newEntry].slice(-14);
    setHistory(updated);
    localStorage.setItem('rpg_body_history', JSON.stringify(updated));

    onSave(Number(weight), Number(height), Number(currentBmi.toFixed(1)));
    onClose();
  };

  // ดึงสถิติ 7 วันล่าสุดมาพล็อตกราฟแท่ง
  const recentStats = history.slice(-7);
  const minWeight = recentStats.length > 0 ? Math.min(...recentStats.map((s) => s.weight)) - 2 : 50;
  const maxWeight = recentStats.length > 0 ? Math.max(...recentStats.map((s) => s.weight)) + 2 : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="pixel-panel w-full max-w-lg p-5 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-rpg-accent" />
            <h2 className="font-pixel text-xs">HERO BODY METRICS</h2>
          </div>
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="p-1 hover:text-rpg-pink cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-pixel text-[9px] text-gray-400">WEIGHT (KG)</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="pixel-input font-pixel text-xs text-center"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-pixel text-[9px] text-gray-400">HEIGHT (CM)</label>
            <input
              type="number"
              step="0.5"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="pixel-input font-pixel text-xs text-center"
            />
          </div>
        </div>

        {/* BMI Preview Banner */}
        <div className="border-2 border-black p-3 bg-black/20 flex justify-between items-center">
          <div>
            <span className="font-pixel text-[9px] text-gray-400">CALCULATED BMI</span>
            <div className="font-pixel text-lg text-white mt-0.5">
              {currentBmi > 0 ? currentBmi.toFixed(1) : '-'}
            </div>
          </div>
          <div className="text-right">
            <span className="font-pixel text-[8px] text-gray-400">STATUS</span>
            <div className={`font-pixel text-xs mt-0.5 ${getBmiCategory(currentBmi).color}`}>
              {getBmiCategory(currentBmi).label}
            </div>
          </div>
        </div>

        {/* Weight & BMI Stat History (กราฟแท่งพิกเซล) */}
        <div className="flex flex-col gap-2 pt-2 border-t-2 border-black">
          <div className="flex justify-between items-center">
            <span className="font-pixel text-[9px] text-gray-400 flex items-center gap-1.5">
              <BarChart2 size={13} className="text-rpg-cyan" />
              <span>WEIGHT LOG (RECENT ENTRIES)</span>
            </span>
            <span className="font-pixel text-[8px] text-gray-400">
              {history.length} RECORDED
            </span>
          </div>

          {recentStats.length === 0 ? (
            <div className="border-2 border-dashed border-black/40 p-4 text-center font-pixel text-[9px] text-gray-500">
              NO STAT HISTORY LOGGED YET. SAVE YOUR STATS TO BEGIN TRACKING!
            </div>
          ) : (
            <div className="border-2 border-black p-3 bg-black/30 flex flex-col gap-3">
              {/* Mini Pixel Bar Chart */}
              <div className="h-28 flex items-end justify-between gap-2 pt-4 px-1 border-b border-black/50">
                {recentStats.map((item) => {
                  const heightPercent = Math.max(
                    15,
                    Math.min(100, ((item.weight - minWeight) / (maxWeight - minWeight)) * 100)
                  );
                  return (
                    <div key={item.id} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="font-pixel text-[8px] text-rpg-accent mb-1 opacity-80 group-hover:opacity-100">
                        {item.weight}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[24px] bg-[#00f0ff] border border-black transition-all hover:bg-amber-400"
                        title={`${item.date}: ${item.weight} kg (BMI: ${item.bmi})`}
                      />
                      <span className="font-pixel text-[7px] text-gray-400 mt-1 truncate max-w-[36px]">
                        {item.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Table List ล่าสุด */}
              <div className="flex flex-col gap-1 max-h-28 overflow-y-auto pr-1">
                {history.slice().reverse().map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-[10px] font-pixel border-b border-black/20 pb-1"
                  >
                    <span className="text-gray-400">{item.date}</span>
                    <span className="text-rpg-accent">{item.weight.toFixed(1)} KG</span>
                    <span className="text-rpg-cyan">BMI {item.bmi.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="pixel-btn text-[10px] py-1.5 px-4 bg-gray-700 text-white cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="pixel-btn-orange text-[10px] py-1.5 px-4 cursor-pointer"
          >
            UPDATE & LOG
          </button>
        </div>

      </div>
    </div>
  );
}