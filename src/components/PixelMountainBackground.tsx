// src/components/PixelMountainBackground.tsx
'use client';

import { useState, useEffect } from 'react';

export default function PixelMountainBackground() {
  const [isDay, setIsDay] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateThemeState = () => {
      const isDayActive = document.documentElement.classList.contains('day-mode');
      setIsDay(isDayActive);
    };

    updateThemeState();
    setMounted(true);

    const observer = new MutationObserver(updateThemeState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 -z-50 overflow-hidden transition-colors duration-700 pointer-events-none ${
        isDay ? 'bg-gradient-to-b from-[#6ba4e8] to-[#99c4f4]' : 'bg-[#090813]'
      }`}
    >
      {/* แสง Glow ท้องฟ้า */}
      {isDay ? (
        <>
          <div className="absolute top-4 left-1/4 w-96 h-96 bg-amber-100/60 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sky-200/50 rounded-full blur-[120px]" />
        </>
      ) : (
        <>
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-indigo-900/30 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rpg-pink/15 rounded-full blur-[120px]" />
        </>
      )}

      {/* ละอองดาว (เฉพาะกลางคืน) / ก้อนเมฆพิกเซล (เฉพาะกลางวัน) */}
      {!isDay ? (
        <>
          <div className="absolute top-16 left-[15%] w-1.5 h-1.5 bg-amber-200 animate-star" />
          <div className="absolute top-28 left-[35%] w-1 h-1 bg-cyan-200 animate-star [animation-delay:1s]" />
          <div className="absolute top-20 right-[40%] w-1.5 h-1.5 bg-pink-200 animate-star [animation-delay:1.5s]" />
          <div className="absolute top-36 right-[25%] w-1 h-1 bg-amber-100 animate-star [animation-delay:2s]" />
        </>
      ) : (
        <>
          <div className="absolute top-16 left-[10%] w-28 h-6 bg-white/70 border-2 border-black/10 animate-fog-slow" />
          <div className="absolute top-32 right-[18%] w-36 h-8 bg-white/60 border-2 border-black/10 animate-fog-slow [animation-delay:4s]" />
          <div className="absolute top-24 left-[50%] w-20 h-5 bg-white/50 border-2 border-black/10 animate-fog-slow [animation-delay:8s]" />
        </>
      )}

      {/* เลเยอร์ทิวเขาพิกเซล (ปรับสีกลางวันให้สว่างเป็นสีฟ้าอมครามภูเขาแดดส่อง) */}
      <div className="absolute inset-0 flex flex-col justify-end opacity-75 blur-[0.6px] transition-all duration-700">
        
        {/* ทิวเขาชั้นไกลสุด */}
        <svg
          viewBox="0 0 1200 400"
          className={`w-full h-80 object-cover fill-current transition-colors duration-700 ${
            isDay ? 'text-[#508ac7]' : 'text-[#131124]'
          }`}
          preserveAspectRatio="none"
        >
          <path d="M0 400 L0 260 L90 200 L180 260 L320 140 L450 250 L600 110 L740 230 L880 130 L1020 240 L1120 170 L1200 240 L1200 400 Z" />
        </svg>

        {/* ชั้นหมอกลอย */}
        <div
          className={`absolute bottom-16 inset-x-0 h-32 bg-gradient-to-t via-transparent to-transparent animate-fog-slow transition-all duration-700 ${
            isDay ? 'from-[#99c4f4]/70' : 'from-[#1b1933]/60'
          }`}
        />

        {/* ทิวเขาชั้นกลาง */}
        <svg
          viewBox="0 0 1200 350"
          className={`w-full h-64 -mt-36 object-cover fill-current transition-colors duration-700 ${
            isDay ? 'text-[#366fa8]' : 'text-[#0d0c18]'
          }`}
          preserveAspectRatio="none"
        >
          <path d="M0 350 L0 210 L140 100 L260 210 L410 80 L560 220 L710 90 L850 200 L980 120 L1100 230 L1200 160 L1200 350 Z" />
        </svg>

        {/* เชิงเขาหน้าสุด */}
        <svg
          viewBox="0 0 1200 200"
          className={`w-full h-36 -mt-20 object-cover fill-current transition-colors duration-700 ${
            isDay ? 'text-[#205282]' : 'text-[#07060e]'
          }`}
          preserveAspectRatio="none"
        >
          <path d="M0 200 L0 120 L80 100 L160 140 L280 80 L380 130 L500 70 L640 140 L780 90 L920 150 L1050 80 L1200 130 L1200 200 Z" />
        </svg>

      </div>

      {/* Grid Pattern เล็กๆ */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}