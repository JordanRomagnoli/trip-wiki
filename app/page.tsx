import { poiController } from '@/lib/controllers/poiController';
import HomeClient from './HomeClient';

/**
 * Main Page (Server Component) - Acts as the entry point for the View layer.
 * It calls the Controller to fetch initial data.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; itinerary?: string }>;
}) {
  const { category, itinerary } = await searchParams;

  // Fetch initial data via the Controller (MVC)
  const initialCities = await poiController.getInitialData({
    category,
    itineraryId: itinerary,
  });

  return <HomeClient initialCities={initialCities} />;
}
