// src/components/SettingsModal.tsx
'use client';

import { useState, useRef } from 'react';
import { X, Settings, RotateCcw, AlertTriangle, Download, Upload, User } from 'lucide-react';
import { sfx } from '@/utils/sfx';
import { HeroClass } from '@/types/workout';
import { HERO_CLASSES } from '@/utils/rpgLogic';

interface SettingsModalProps {
  isOpen: boolean;
  heroClass: HeroClass;
  onSelectClass: (c: HeroClass) => void;
  onClose: () => void;
  onResetAll: () => void;
  onImportData: (data: any) => void;
}

export default function SettingsModal({
  isOpen,
  heroClass,
  onSelectClass,
  onClose,
  onResetAll,
  onImportData,
}: SettingsModalProps) {
  const [confirming, setConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // ส่งออก Save Data เป็น JSON file
  const handleExport = () => {
    sfx.playClick();
    const backupData: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('rpg_')) {
        backupData[key] = localStorage.getItem(key);
      }
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workout_rpg_save_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // นำเข้า Save Data จากไฟล์ JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        sfx.playLevelUp();
        onImportData(json);
        alert('Save Data Imported Successfully!');
        onClose();
      } catch (err) {
        alert('Invalid Save File format');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    sfx.playClick();
    onResetAll();
    setConfirming(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="pixel-panel w-full max-w-sm max-h-[90vh] overflow-y-auto p-5 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <h2 className="font-pixel text-xs text-rpg-accent flex items-center gap-2">
            <Settings size={16} /> SYSTEM SETTINGS
          </h2>
          <button
            onClick={() => {
              sfx.playClick();
              setConfirming(false);
              onClose();
            }}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. เลือกคลาสตัวละคร */}
        <div className="flex flex-col gap-2">
          <span className="font-pixel text-[10px] text-white flex items-center gap-1.5">
            <User size={13} /> SELECT HERO CLASS
          </span>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(HERO_CLASSES) as HeroClass[]).map((cKey) => {
              const c = HERO_CLASSES[cKey];
              const isSelected = heroClass === cKey;
              return (
                <button
                  key={cKey}
                  onClick={() => {
                    sfx.playClick();
                    onSelectClass(cKey);
                  }}
                  className={`p-2 border-2 border-black flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isSelected ? 'bg-rpg-cyan text-black' : 'bg-[#15141f] text-white'
                  }`}
                >
                  <span className="text-xl">{c.avatar}</span>
                  <span className="font-pixel text-[7px] mt-1">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Export / Import Backup */}
        <div className="flex flex-col gap-2 border-t-2 border-black pt-3">
          <span className="font-pixel text-[10px] text-white">SAVE CLOUD / BACKUP</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              className="pixel-btn-cyan text-[9px] py-2 px-2 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Download size={13} /> EXPORT SAVE
            </button>
            <button
              onClick={() => {
                sfx.playClick();
                fileInputRef.current?.click();
              }}
              className="pixel-btn-orange text-[9px] py-2 px-2 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Upload size={13} /> IMPORT SAVE
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* 3. Wipe Data */}
        <div className="flex flex-col gap-2 border-t-2 border-black pt-3">
          {!confirming ? (
            <button
              onClick={() => {
                sfx.playClick();
                setConfirming(true);
              }}
              className="pixel-btn bg-red-900/40 text-rpg-pink border-red-800 hover:bg-red-800 hover:text-white text-[9px] py-2.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={13} /> RESET ALL DATA (NEW GAME)
            </button>
          ) : (
            <div className="bg-red-950/60 border-2 border-rpg-pink p-3 flex flex-col gap-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-rpg-pink font-pixel text-[10px]">
                <AlertTriangle size={15} /> CONFIRM WIPE?
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    sfx.playClick();
                    setConfirming(false);
                  }}
                  className="pixel-btn bg-gray-800 text-white text-[9px] py-2"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleReset}
                  className="pixel-btn bg-rpg-pink text-white text-[9px] py-2"
                >
                  YES, WIPE
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}