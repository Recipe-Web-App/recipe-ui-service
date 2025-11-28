import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sous Chef',
    short_name: 'Sous Chef',
    description: 'A modern recipe management application built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['food', 'lifestyle'],
    lang: 'en-US',
    dir: 'ltr',
    orientation: 'portrait-primary',
  };
}
