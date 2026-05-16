export type POI = {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  category: 'our-places' | 'culture' | 'nature' | 'food' | 'disco';
  visited?: boolean;
};

export type Itinerary = {
  id: string;
  name: string;
  poiIds: string[]; // ordered list of POI IDs
};

export type City = {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  pois: POI[];
  itineraries?: Itinerary[];
};
