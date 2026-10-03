// src/components/ActiveQuestModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Flame, Timer, Edit3, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutProgram, WorkoutSession } from '@/types/workout';

interface ActiveQuestModalProps {
  isOpen: boolean;
  program: WorkoutProgram | null;
  onClose: () => void;
  onComplete: (expEarned: number, sessionData: WorkoutSession) => void;
}

export default function ActiveQuestModal({
  isOpen,
  program,
  onClose,
  onComplete,
}: ActiveQuestModalProps) {
  const [logMode, setLogMode] = useState<'manual' | 'live'>('manual');

  // State สำหรับโหมด Live (Stopwatch)
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // State สำหรับบันทึกค่าแต่ละท่า
  const [exerciseData, setExerciseData] = useState<{
    [key: string]: { sets: number[]; durationMinutes?: number; distanceKm?: number };
  }>({});

  useEffect(() => {
    if (program) {
      const initial: typeof exerciseData = {};
      program.exercises.forEach((ex) => {
        initial[ex.id] = {
          sets: Array(ex.defaultSets || 3).fill(10),
          durationMinutes: 30,
          distanceKm: 5.0,
        };
      });
      setExerciseData(initial);
      setSeconds(0);
      setIsActive(false);
    }
  }, [program]);

  // ตัวจับเวลาสำหรับ Live Mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isOpen || !program) return null;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSetChange = (exId: string, setIndex: number, val: number) => {
    setExerciseData((prev) => {
      const currentSets = [...(prev[exId]?.sets || [])];
      currentSets[setIndex] = Math.max(0, val);
      return {
        ...prev,
        [exId]: { ...prev[exId], sets: currentSets },
      };
    });
  };

  const handleFinishQuest = () => {
    // คำนวณ EXP เบื้องต้น
    let calculatedExp = 50;
    if (program.category === 'cardio') {
      const duration =
        logMode === 'live'
          ? Math.floor(seconds / 60)
          : exerciseData[program.exercises[0]?.id]?.durationMinutes || 30;
      calculatedExp += Math.floor(duration * 2);
    } else {
      let totalReps = 0;
      Object.values(exerciseData).forEach((data) => {
        data.sets?.forEach((r) => (totalReps += r));
      });
      calculatedExp += Math.floor(totalReps * 0.5);
    }

    // Effect Confetti ฉลองชัยชนะ
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const today = new Date().toISOString().split('T')[0];

    const sessionData: WorkoutSession = {
      id: Date.now().toString(),
      date: today,
      programId: program.id,
      programName: program.name,
      category: program.category,
      logs: [],
      expGained: calculatedExp,
    };

    onComplete(calculatedExp, sessionData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="pixel-panel w-full max-w-lg max-h-[90vh] flex flex-col justify-between overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b-2 border-black flex justify-between items-center bg-[#15141f]">
          <div>
            <span className="font-pixel text-[9px] text-rpg-accent tracking-widest">
              ACTIVE QUEST [{program.category.toUpperCase()}]
            </span>
            <h2 className="font-pixel text-xs text-white mt-1">{program.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector: Quick Log vs Live Mode */}
        <div className="grid grid-cols-2 border-b-2 border-black bg-black font-pixel text-[10px]">
          <button
            onClick={() => {
              setIsActive(false);
              setLogMode('manual');
            }}
            className={`py-2.5 flex items-center justify-center gap-1.5 cursor-pointer ${
              logMode === 'manual'
                ? 'bg-rpg-panel text-rpg-accent border-b-2 border-rpg-accent'
                : 'text-gray-400'
            }`}
          >
            <Edit3 size={13} /> QUICK LOG (STRAVA)
          </button>
          <button
            onClick={() => setLogMode('live')}
            className={`py-2.5 flex items-center justify-center gap-1.5 cursor-pointer ${
              logMode === 'live'
                ? 'bg-rpg-panel text-rpg-cyan border-b-2 border-rpg-cyan'
                : 'text-gray-400'
            }`}
          >
            <Timer size={13} /> LIVE QUEST
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          
          {/* Live Stopwatch View */}
          {logMode === 'live' && (
            <div className="pixel-panel p-4 bg-black flex flex-col items-center justify-center gap-3">
              <span className="font-pixel text-3xl text-rpg-cyan tracking-wider">
                {formatTimer(seconds)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`pixel-btn text-[10px] py-2 px-4 ${
                    isActive ? 'bg-rpg-pink text-white' : 'pixel-btn-cyan'
                  }`}
                >
                  {isActive ? <Pause size={14} /> : <Play size={14} />}
                  {isActive ? 'PAUSE' : 'START TIMER'}
                </button>
                <button
                  onClick={() => {
                    setIsActive(false);
                    setSeconds(0);
                  }}
                  className="pixel-btn bg-gray-800 text-gray-300 text-[10px] py-2 px-3"
                >
                  <RotateCcw size={14} /> RESET
                </button>
              </div>
            </div>
          )}

          {/* รายการท่าออกกำลังกาย */}
          {program.exercises.map((ex) => (
            <div key={ex.id} className="pixel-panel p-3 bg-[#15141f] border-2 border-black flex flex-col gap-2">
              <span className="font-pixel text-xs text-white flex items-center gap-1.5">
                <span>⚔️</span> {ex.name}
              </span>

              {/* Cardio Mode */}
              {program.category === 'cardio' ? (
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div className="flex flex-col gap-1">
                    <label className="font-pixel text-[9px] text-gray-400">DURATION (MINS)</label>
                    <input
                      type="number"
                      value={exerciseData[ex.id]?.durationMinutes ?? 30}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setExerciseData((prev) => ({
                          ...prev,
                          [ex.id]: { ...prev[ex.id], durationMinutes: val },
                        }));
                      }}
                      className="pixel-input text-center text-sm py-2"
                      placeholder="30"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-pixel text-[9px] text-gray-400">DISTANCE (KM)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={exerciseData[ex.id]?.distanceKm ?? 5.0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setExerciseData((prev) => ({
                          ...prev,
                          [ex.id]: { ...prev[ex.id], distanceKm: val },
                        }));
                      }}
                      className="pixel-input text-center text-sm py-2"
                      placeholder="5.0"
                    />
                  </div>
                </div>
              ) : (
                /* Strength Mode */
                <div className="flex flex-col gap-2 mt-1">
                  <div className="grid grid-cols-3 gap-2">
                    {exerciseData[ex.id]?.sets?.map((reps, sIdx) => (
                      <div key={sIdx} className="bg-black/40 border border-black p-2 flex flex-col items-center gap-1">
                        <span className="font-pixel text-[8px] text-gray-400">SET {sIdx + 1}</span>
                        {logMode === 'live' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSetChange(ex.id, sIdx, reps - 1)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-pixel text-xs text-rpg-cyan">{reps}</span>
                            <button
                              onClick={() => handleSetChange(ex.id, sIdx, reps + 1)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <input
                            type="number"
                            value={reps}
                            onChange={(e) => handleSetChange(ex.id, sIdx, Number(e.target.value))}
                            className="w-12 bg-transparent text-center font-pixel text-xs text-rpg-cyan border-b border-gray-600 focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

        </div>

        {/* Footer Complete Button */}
        <div className="p-4 border-t-2 border-black bg-[#15141f] flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-rpg-accent font-pixel text-[10px]">
            <Flame size={14} className="animate-pulse" />
            <span>CLAIM REWARDS</span>
          </div>

          <button
            onClick={handleFinishQuest}
            className="pixel-btn-orange text-xs py-2.5 px-5 flex items-center gap-1.5"
          >
            <CheckCircle2 size={16} /> COMPLETE QUEST
          </button>
        </div>

      </div>
    </div>
  );
}