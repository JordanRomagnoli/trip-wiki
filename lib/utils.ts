export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const routeCache = new Map<string, { coordinates: [number, number][]; distance: number }>();

export async function getRoute(start: [number, number], end: [number, number]): Promise<{ coordinates: [number, number][]; distance: number } | null> {
  const cacheKey = `${start[0].toFixed(5)},${start[1].toFixed(5)}-${end[0].toFixed(5)},${end[1].toFixed(5)}`;
  
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey) || null;
  }

  try {
    // OSRM coordinates are [lon, lat]
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    );
    const data = await response.json();

    if (data.code === 'Ok' && data.routes.length > 0) {
      const route = data.routes[0];
      const result = {
        distance: route.distance / 1000, // convert to km
        coordinates: route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]) as [number, number][],
      };
      
      routeCache.set(cacheKey, result);
      return result;
    }
  } catch (error) {
    console.error('Error fetching route:', error);
  }
  return null;
}
