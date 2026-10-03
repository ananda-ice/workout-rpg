// src/components/AddProgramModal.tsx
'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Calendar } from 'lucide-react';
import { WorkoutProgram, Exercise } from '@/types/workout';
import { sfx } from '@/utils/sfx';

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: WorkoutProgram) => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AddProgramModal({ isOpen, onClose, onSave }: AddProgramModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'strength' | 'cardio'>('strength');
  const [targetDays, setTargetDays] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExerciseName, setNewExerciseName] = useState('');

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    sfx.playClick();
    setTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim()) return;
    sfx.playClick();
    setExercises((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newExerciseName.trim(),
        defaultSets: 3,
      },
    ]);
    setNewExerciseName('');
  };

  const handleRemoveExercise = (id: string) => {
    sfx.playClick();
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sfx.playClick();
    const newProgram: WorkoutProgram = {
      id: Date.now().toString(),
      name: name.trim(),
      category,
      targetDays,
      exercises:
        exercises.length > 0
          ? exercises
          : [{ id: Date.now().toString(), name: 'General Exercise', defaultSets: 3 }],
    };

    onSave(newProgram);
    setName('');
    setCategory('strength');
    setTargetDays([]);
    setExercises([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="pixel-panel w-full max-w-md max-h-[90vh] overflow-y-auto p-5 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 className="font-pixel text-xs text-rpg-accent flex items-center gap-2">
            <span>📜</span> CREATE NEW QUEST
          </h2>
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          
          {/* 1. Quest Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-pixel text-[10px] text-gray-300">QUEST NAME</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Upper Body, 5km Run"
              className="pixel-input text-white w-full text-xs"
            />
          </div>

          {/* 2. Quest Category */}
          <div className="flex flex-col gap-1.5">
            <label className="font-pixel text-[10px] text-gray-300">QUEST TYPE</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setCategory('strength');
                }}
                className={`py-2 px-3 font-pixel text-[9px] border-2 border-black cursor-pointer transition-all ${
                  category === 'strength'
                    ? 'bg-rpg-cyan text-black font-bold'
                    : 'bg-[#15141f] text-gray-400'
                }`}
              >
                🏋️ REPS / WEIGHT
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setCategory('cardio');
                }}
                className={`py-2 px-3 font-pixel text-[9px] border-2 border-black cursor-pointer transition-all ${
                  category === 'cardio'
                    ? 'bg-rpg-pink text-white font-bold'
                    : 'bg-[#15141f] text-gray-400'
                }`}
              >
                🏃 CARDIO / TIME
              </button>
            </div>
          </div>

          {/* 3. Target Days Selection (เพิ่มส่วนนี้) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-pixel text-[10px] text-gray-300 flex items-center gap-1.5">
              <Calendar size={13} className="text-rpg-accent" /> TARGET DAYS (SCHEDULE)
            </label>
            <div className="grid grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = targetDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-2 text-center font-pixel text-[8px] border border-black cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rpg-accent text-black font-bold shadow-xs'
                        : 'bg-[#15141f] text-gray-400 hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <span className="text-[9px] text-gray-400">
              {targetDays.length > 0
                ? `Active on: ${targetDays.join(', ')}`
                : 'Anytime / No specific day'}
            </span>
          </div>

          {/* 4. Exercise List */}
          <div className="flex flex-col gap-2 border-t-2 border-black pt-3">
            <label className="font-pixel text-[10px] text-gray-300">EXERCISES IN THIS QUEST</label>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                placeholder="e.g. Push-up, Pull-up"
                className="pixel-input text-white flex-1 text-xs"
              />
              <button
                type="button"
                onClick={handleAddExercise}
                className="pixel-btn-orange px-3 text-xs flex items-center justify-center cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* รายการท่าที่เพิ่มแล้ว */}
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto mt-1">
              {exercises.length === 0 ? (
                <span className="text-[10px] text-gray-500 italic py-1">
                  No exercises added yet (Default: General Exercise)
                </span>
              ) : (
                exercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-2 bg-[#15141f] border border-black flex justify-between items-center text-xs"
                  >
                    <span className="text-white font-pixel text-[9px]">{ex.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(ex.id)}
                      className="text-gray-500 hover:text-rpg-pink cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 border-t-2 border-black pt-3 mt-2">
            <button
              type="button"
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="pixel-btn bg-gray-700 text-white text-[10px] py-2 px-3"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="pixel-btn-orange text-[10px] py-2 px-4"
            >
              SAVE QUEST
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}