// src/app/layout.tsx
import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';
import PixelMountainBackground from '@/components/PixelMountainBackground';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

export const metadata: Metadata = {
  title: 'Workout RPG - Quest for Gains',
  description: 'Gamified fitness tracker inspired by retro 8-bit RPGs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pixelFont.variable} min-h-screen text-slate-100 antialiased selection:bg-rpg-accent selection:text-black relative`}>
        {/* เลเยอร์พื้นหลังทิวเขาพิกเซล */}
        <PixelMountainBackground />

        {/* หน้าจอคอนเทนต์หลัก */}
        {children}
      </body>
    </html>
  );
}