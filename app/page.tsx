import { redirect } from 'next/navigation';
import { poiController } from '@/lib/controllers/poiController';
import { createClient } from '@/lib/supabase/server';
import { getPoiById } from '@/lib/models/poi';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; itinerary?: string; poi?: string }>;
}): Promise<Metadata> {
  const { poi } = await searchParams;

  if (poi) {
    try {
      const p = await getPoiById(poi);
      if (p) {
        return {
          title: `${p.name} | Trip Wiki`,
          description: p.description || `Esplora ${p.name} su Trip Wiki!`,
          openGraph: {
            title: p.name,
            description: p.description || `Esplora ${p.name} su Trip Wiki!`,
            type: 'website',
            images: [
              {
                url: '/icon.svg',
                width: 512,
                height: 512,
                alt: p.name,
              },
            ],
          },
          twitter: {
            card: 'summary_large_image',
            title: p.name,
            description: p.description || `Esplora ${p.name} su Trip Wiki!`,
            images: ['/icon.svg'],
          },
        };
      }
    } catch (e) {
      console.error('Error generating metadata for POI:', e);
    }
  }

  return {
    title: 'Trip Wiki | La guida di cui nessuno ha il bisogno',
    description: 'Esplora 2 città.',
  };
}

/**
 * Main Page (Server Component) - Acts as the entry point for the View layer.
 * It calls the Controller to fetch initial data.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; itinerary?: string; poi?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { category, itinerary, poi } = await searchParams;

  // Fetch initial data via the Controller (MVC)
  // If we are looking for a specific POI, we bypass filters to ensure it's loaded
  const initialCities = await poiController.getInitialData(
    poi ? undefined : { category, itineraryId: itinerary }
  );

  return <HomeClient initialCities={initialCities} user={user} poi={poi} />;
}
