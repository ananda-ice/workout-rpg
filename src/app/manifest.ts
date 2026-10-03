import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Workout RPG - Quest for Gains',
    short_name: 'WorkoutRPG',
    description: 'Gamified retro 8-bit fitness and workout tracker',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0b14',
    theme_color: '#0c0b14',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}