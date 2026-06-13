import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Typingjon',
    short_name: 'Typingjon',
    description: "Interaktiv darslar va real vaqt tahlili orqali klaviaturada tezroq, aniqroq yozing.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait-primary',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
