// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Flame, Plus, HeartPulse, Trash2, Settings, Compass, Moon } from 'lucide-react';
import { WorkoutProgram, WorkoutSession, HeroClass, BossRaid } from '@/types/workout';
import AddProgramModal from '@/components/AddProgramModal';
import ActiveQuestModal from '@/components/ActiveQuestModal';
import BodyStatsModal from '@/components/BodyStatsModal';
import QuestHistory from '@/components/QuestHistory';
import AchievementBox from '@/components/AchievementBox';
import SettingsModal from '@/components/SettingsModal';
import BossRaidBox from '@/components/BossRaidBox';
import { 
  calculateStreak, 
  getHeroTitle, 
  HERO_CLASSES, 
  DEFAULT_BOSS, 
  getCurrentWeekId,
  checkRestEligibility 
} from '@/utils/rpgLogic';
import { sfx } from '@/utils/sfx';

const INITIAL_PROGRAMS: WorkoutProgram[] = [
  {
    id: 'p1',
    name: 'Outdoor Running',
    category: 'cardio',
    targetDays: ['Tue', 'Thu', 'Sat'],
    exercises: [{ id: 'e1', name: 'Jogging / Walking', defaultSets: 1 }]
  },
  {
    id: 'p2',
    name: 'Upper Bodyweight',
    category: 'strength',
    targetDays: ['Mon', 'Wed', 'Fri'],
    exercises: [
      { id: 'e2', name: 'Push-up', defaultSets: 3 },
      { id: 'e3', name: 'Bodyweight Squat', defaultSets: 3 },
      { id: 'e4', name: 'Plank', defaultSets: 3 }
    ]
  }
];

export default function HomePage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>(INITIAL_PROGRAMS);
  const [characterLevel, setCharacterLevel] = useState(1);
  const [currentExp, setCurrentExp] = useState(0);
  const [totalQuests, setTotalQuests] = useState(0);
  const [heroClass, setHeroClass] = useState<HeroClass>('mage');

  // Boss Raid State
  const [boss, setBoss] = useState<BossRaid>(DEFAULT_BOSS);

  // Body Stats & History
  const [weight, setWeight] = useState(80.0);
  const [height, setHeight] = useState(165.0);
  const [bmi, setBmi] = useState(29.4);
  const [history, setHistory] = useState<WorkoutSession[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBodyModalOpen, setIsBodyModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<WorkoutProgram | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const maxExp = 100;

  useEffect(() => {
    const savedPrograms = localStorage.getItem('rpg_programs');
    const savedLevel = localStorage.getItem('rpg_level');
    const savedExp = localStorage.getItem('rpg_exp');
    const savedQuests = localStorage.getItem('rpg_total_quests');
    const savedClass = localStorage.getItem('rpg_class');
    const savedBoss = localStorage.getItem('rpg_boss');
    const savedWeight = localStorage.getItem('rpg_weight');
    const savedHeight = localStorage.getItem('rpg_height');
    const savedBmi = localStorage.getItem('rpg_bmi');
    const savedHistory = localStorage.getItem('rpg_history');

    if (savedPrograms) setPrograms(JSON.parse(savedPrograms));
    if (savedLevel) setCharacterLevel(Number(savedLevel));
    if (savedExp) setCurrentExp(Number(savedExp));
    if (savedQuests) setTotalQuests(Number(savedQuests));
    if (savedClass) setHeroClass(savedClass as HeroClass);
    if (savedWeight) setWeight(Number(savedWeight));
    if (savedHeight) setHeight(Number(savedHeight));
    if (savedBmi) setBmi(Number(savedBmi));
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    if (savedBoss) {
      const parsedBoss: BossRaid = JSON.parse(savedBoss);
      if (parsedBoss.weekId === getCurrentWeekId()) {
        setBoss(parsedBoss);
      } else {
        setBoss(DEFAULT_BOSS);
      }
    }

    setIsLoaded(true);
  }, []);

  const currentStreak = calculateStreak(history);
  const heroRankTitle = getHeroTitle(characterLevel);
  const heroAvatar = HERO_CLASSES[heroClass]?.avatar || '🧙‍♂️';
  const restEligibility = checkRestEligibility(history);

  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todaysQuest = programs.find((p) => p.targetDays?.includes(todayDayName));

  const handleSaveProgram = (newProg: WorkoutProgram) => {
    sfx.playClick();
    const updated = [...programs, newProg];
    setPrograms(updated);
    localStorage.setItem('rpg_programs', JSON.stringify(updated));
  };

  const handleDeleteProgram = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.playClick();
    if (confirm('Are you sure you want to abandon this quest?')) {
      const updated = programs.filter((p) => p.id !== id);
      setPrograms(updated);
      localStorage.setItem('rpg_programs', JSON.stringify(updated));
    }
  };

  // จัดการเมื่อเสร็จสิ้น Workout ปกติ
  const handleCompleteQuest = (expEarned: number, sessionData: WorkoutSession) => {
    sfx.playLevelUp();
    let nextExp = currentExp + expEarned;
    let nextLvl = characterLevel;

    if (nextExp >= maxExp) {
      nextLvl += 1;
      nextExp = nextExp - maxExp;
    }

    const nextTotalQuests = totalQuests + 1;
    const updatedHistory = [...history, sessionData];

    const updatedBoss = {
      ...boss,
      currentHp: Math.max(0, boss.currentHp - expEarned),
    };

    setCharacterLevel(nextLvl);
    setCurrentExp(nextExp);
    setTotalQuests(nextTotalQuests);
    setHistory(updatedHistory);
    setBoss(updatedBoss);

    localStorage.setItem('rpg_level', String(nextLvl));
    localStorage.setItem('rpg_exp', String(nextExp));
    localStorage.setItem('rpg_total_quests', String(nextTotalQuests));
    localStorage.setItem('rpg_history', JSON.stringify(updatedHistory));
    localStorage.setItem('rpg_boss', JSON.stringify(updatedBoss));
  };

  // ฟังก์ชันกดวันพักผ่อน Campfire Rest Day
  const handleRestDay = () => {
    if (!restEligibility.canRest) return;

    sfx.playLevelUp();
    const today = new Date().toISOString().split('T')[0];
    const restExp = 15; // EXP การพักผ่อน

    const restSession: WorkoutSession = {
      id: Date.now().toString(),
      date: today,
      programId: 'rest_day',
      programName: 'Campfire Rest & Recovery',
      category: 'rest',
      logs: [],
      expGained: restExp,
    };

    let nextExp = currentExp + restExp;
    let nextLvl = characterLevel;
    if (nextExp >= maxExp) {
      nextLvl += 1;
      nextExp = nextExp - maxExp;
    }

    const updatedHistory = [...history, restSession];

    setCharacterLevel(nextLvl);
    setCurrentExp(nextExp);
    setHistory(updatedHistory);

    localStorage.setItem('rpg_level', String(nextLvl));
    localStorage.setItem('rpg_exp', String(nextExp));
    localStorage.setItem('rpg_history', JSON.stringify(updatedHistory));

    alert('🔥 Rested by the Campfire! Streak protected and gained +15 Recovery EXP!');
  };

  const handleSaveBodyStats = (newWeight: number, newHeight: number, newBmi: number) => {
    sfx.playClick();
    setWeight(newWeight);
    setHeight(newHeight);
    setBmi(newBmi);

    localStorage.setItem('rpg_weight', String(newWeight));
    localStorage.setItem('rpg_height', String(newHeight));
    localStorage.setItem('rpg_bmi', String(newBmi));
  };

  const handleSelectClass = (c: HeroClass) => {
    setHeroClass(c);
    localStorage.setItem('rpg_class', c);
  };

  const handleResetAll = () => {
    localStorage.clear();
    setPrograms(INITIAL_PROGRAMS);
    setCharacterLevel(1);
    setCurrentExp(0);
    setTotalQuests(0);
    setHeroClass('mage');
    setBoss(DEFAULT_BOSS);
    setWeight(80.0);
    setHeight(165.0);
    setBmi(29.4);
    setHistory([]);
  };

  const handleImportData = (backup: Record<string, string>) => {
    Object.keys(backup).forEach((key) => {
      localStorage.setItem(key, backup[key]);
    });
    window.location.reload();
  };

  if (!isLoaded) return null;

  return (
    <main className="max-w-5xl mx-auto min-h-screen p-4 pb-20 flex flex-col gap-6">
      
      {/* Top Header */}
      <header className="flex justify-between items-center px-1">
        <span className="font-pixel text-[10px] text-gray-400 tracking-wider">FITNESS QUEST RPG</span>
        <button
          onClick={() => {
            sfx.playClick();
            setIsSettingsOpen(true);
          }}
          className="p-2 pixel-panel bg-[#15141f] text-gray-400 hover:text-white hover:border-rpg-accent cursor-pointer transition-colors"
          title="Settings"
        >
          <Settings size={16} />
        </button>
      </header>

      <div className="flex flex-col md:grid md:grid-cols-5 gap-6">
        
        {/* ฝั่งซ้าย: Hero Status, Boss Raid, Achievements & Logs */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* 1. Character Status Window */}
          <section className="pixel-panel p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{heroAvatar}</span>
                <div>
                  <h1 className="font-pixel text-xs text-rpg-accent">HERO GAINS</h1>
                  <p className="font-pixel text-[9px] text-gray-400">
                    LV. {characterLevel} {heroRankTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 font-pixel text-xs text-rpg-pink">
                <Flame size={14} className="animate-pulse" />
                <span>{currentStreak} STREAK</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-pixel text-[9px] mb-1">
                <span>EXP</span>
                <span>{currentExp} / {maxExp}</span>
              </div>
              <div className="w-full h-3 bg-black border-2 border-black p-0.5">
                <div 
                  className="h-full bg-rpg-cyan transition-all duration-300"
                  style={{ width: `${(currentExp / maxExp) * 100}%` }}
                />
              </div>
            </div>
          </section>

          {/* 2. Boss Raid & Gear Showcase */}
          <BossRaidBox boss={boss} level={characterLevel} />

          {/* 3. Quick Stats Overview */}
          <section className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => {
                sfx.playClick();
                setIsBodyModalOpen(true);
              }}
              className="pixel-panel p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-rpg-accent transition-all"
            >
              <span className="font-pixel text-[9px] text-gray-400">WEIGHT</span>
              <span className="font-pixel text-sm text-rpg-accent mt-1">{weight.toFixed(1)} KG</span>
              <span className="text-[10px] text-gray-400">BMI {bmi.toFixed(1)}</span>
            </div>

            <div className="pixel-panel p-3 flex flex-col items-center justify-center text-center">
              <span className="font-pixel text-[9px] text-gray-400">TOTAL QUESTS</span>
              <span className="font-pixel text-sm text-rpg-cyan mt-1">{totalQuests}</span>
              <span className="text-[10px] text-gray-400">Completed</span>
            </div>
          </section>

          {/* 4. Achievements */}
          <AchievementBox level={characterLevel} totalQuests={totalQuests} streak={currentStreak} />

          {/* 5. Logs & Heatmap */}
          <QuestHistory history={history} />
        </div>

        {/* ฝั่งขวา: Rest Day Banner & Quest Board */}
        <div className="md:col-span-3 flex flex-col gap-4">
          
          {/* Campfire Rest Day Banner (ใหม่) */}
          <section className="pixel-panel p-4 bg-[#121824] border-2 border-blue-500/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">⛺</span>
              <div className="flex flex-col">
                <span className="font-pixel text-[8px] text-blue-400 flex items-center gap-1">
                  <Moon size={11} /> CAMPFIRE RECOVERY (STREAK SHIELD)
                </span>
                <span className="text-[11px] text-gray-300 font-pixel mt-0.5">
                  Rest today without breaking streak!
                </span>
                <span className="text-[9px] text-gray-400">
                  {restEligibility.canRest ? 'Max 2 rest days in a row' : restEligibility.reason}
                </span>
              </div>
            </div>

            <button
              onClick={handleRestDay}
              disabled={!restEligibility.canRest}
              className={`pixel-btn text-[9px] py-2 px-3 flex items-center gap-1.5 ${
                restEligibility.canRest
                  ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Moon size={12} /> REST TODAY
            </button>
          </section>

          {/* Today's Highlighted Quest */}
          {todaysQuest && (
            <section className="pixel-panel p-4 bg-[#141d1a] border-2 border-rpg-cyan flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="font-pixel text-[8px] text-rpg-cyan flex items-center gap-1">
                  <Compass size={12} /> TODAY&apos;S RECOMMENDED QUEST [{todayDayName.toUpperCase()}]
                </span>
                <h3 className="font-pixel text-sm text-white">{todaysQuest.name}</h3>
              </div>
              <button
                onClick={() => {
                  sfx.playClick();
                  setActiveQuest(todaysQuest);
                }}
                className="pixel-btn-cyan text-[10px] py-2 px-3 cursor-pointer"
              >
                QUICK START
              </button>
            </section>
          )}

          {/* Quest Board */}
          <section className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="font-pixel text-xs tracking-wider flex items-center gap-2">
                <span>⚔️</span> QUEST BOARD
              </h2>
              <button 
                onClick={() => {
                  sfx.playClick();
                  setIsAddModalOpen(true);
                }}
                className="pixel-btn-orange text-[10px] py-1 px-3 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} /> ADD
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {programs.map((prog) => (
                <div 
                  key={prog.id} 
                  className="pixel-panel p-4 flex justify-between items-center hover:border-rpg-accent transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {prog.category === 'cardio' ? (
                        <HeartPulse size={16} className="text-rpg-pink" />
                      ) : (
                        <Dumbbell size={16} className="text-rpg-cyan" />
                      )}
                      <h3 className="font-pixel text-xs text-white">{prog.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>{prog.exercises.length} Exercises</span>
                      {prog.targetDays && prog.targetDays.length > 0 && (
                        <span className="font-pixel text-[8px] text-rpg-accent">
                          [{prog.targetDays.join('/')}]
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteProgram(prog.id, e)}
                      className="p-2 text-gray-500 hover:text-rpg-pink transition-colors cursor-pointer"
                      title="Abandon Quest"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button 
                      onClick={() => {
                        sfx.playClick();
                        setActiveQuest(prog);
                      }}
                      className="pixel-btn-cyan text-[10px] py-2 px-3 cursor-pointer"
                    >
                      START
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* Modals ทั้งหมด */}
      <ActiveQuestModal
        isOpen={Boolean(activeQuest)}
        program={activeQuest}
        onClose={() => setActiveQuest(null)}
        onComplete={handleCompleteQuest}
      />

      <AddProgramModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveProgram}
      />

      <BodyStatsModal
        isOpen={isBodyModalOpen}
        initialWeight={weight}
        initialHeight={height}
        onClose={() => setIsBodyModalOpen(false)}
        onSave={handleSaveBodyStats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        heroClass={heroClass}
        onSelectClass={handleSelectClass}
        onClose={() => setIsSettingsOpen(false)}
        onResetAll={handleResetAll}
        onImportData={handleImportData}
      />

    </main>
  );
}