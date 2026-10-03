import type { Metadata } from 'next';
import { Inter, Press_Start_2P } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const pixelFont = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel'
});

export const metadata: Metadata = {
  title: 'Workout RPG - Quest for Gains',
  description: 'Gamified Fitness Tracker in 8-bit Pixel Art Style',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${pixelFont.variable}`}>
      <body className="font-sans bg-[#0f0e17] text-[#fffffe] min-h-screen selection:bg-[#ff8906] selection:text-[#0f0e17]">
        {children}
      </body>
    </html>
  );
}