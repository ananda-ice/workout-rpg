import type { Metadata, Viewport } from 'next';
import './globals.css';
import PixelMountainBackground from '@/components/PixelMountainBackground';

export const metadata: Metadata = {
  title: 'Workout RPG - Quest for Gains',
  description: 'Gamified retro 8-bit fitness tracker',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WorkoutRPG',
  },
};

export const viewport: Viewport = {
  themeColor: '#0c0b14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
        <PixelMountainBackground />
        {children}
      </body>
    </html>
  );
}