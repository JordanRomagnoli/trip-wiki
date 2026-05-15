import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trip Wiki',
    short_name: 'TripWiki',
    description: 'Your premium geospatial travel guide',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#ccff00',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
