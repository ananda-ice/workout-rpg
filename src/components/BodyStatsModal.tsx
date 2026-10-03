// src/components/BodyStatsModal.tsx
'use client';

import { useState } from 'react';
import { X, Scale, Heart } from 'lucide-react';

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
  const [weight, setWeight] = useState(initialWeight || 80);
  const [height, setHeight] = useState(initialHeight || 165);

  if (!isOpen) return null;

  // คำนวณค่า BMI: weight (kg) / [height (m)]^2
  const heightInMeters = height / 100;
  const currentBmi = heightInMeters > 0 
    ? Number((weight / (heightInMeters * heightInMeters)).toFixed(1)) 
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(weight, height, currentBmi);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="pixel-panel w-full max-w-sm p-5 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 className="font-pixel text-xs text-rpg-accent flex items-center gap-2">
            <Scale size={16} /> BODY STATS
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* น้ำหนัก */}
          <div className="flex flex-col gap-1">
            <label className="font-pixel text-[10px] text-gray-300">WEIGHT (KG)</label>
            <input
              type="number"
              step="0.1"
              required
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="pixel-input text-white w-full text-center text-base"
            />
          </div>

          {/* ส่วนสูง */}
          <div className="flex flex-col gap-1">
            <label className="font-pixel text-[10px] text-gray-300">HEIGHT (CM)</label>
            <input
              type="number"
              step="0.5"
              required
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="pixel-input text-white w-full text-center text-base"
            />
          </div>

          {/* BMI Live Preview Box */}
          <div className="pixel-panel bg-[#15141f] p-3 border-2 border-black flex items-center justify-between">
            <span className="font-pixel text-[10px] text-gray-400 flex items-center gap-1.5">
              <Heart size={14} className="text-rpg-pink" /> CALCULATED BMI
            </span>
            <span className="font-pixel text-sm text-rpg-cyan">{currentBmi}</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="pixel-btn bg-gray-700 text-white text-[10px] py-2 px-3"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="pixel-btn-orange text-[10px] py-2 px-4"
            >
              UPDATE STATS
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}