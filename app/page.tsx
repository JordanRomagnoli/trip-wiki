'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CITIES, City, POI } from '@/lib/data';
import CitySwitcher from '@/components/CitySwitcher';
import POIOverlay from '@/components/POIOverlay';

// Load MapComponent dynamically to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-tertiary font-medium">Cargando mapa...</p>
      </div>
    </div>
  ),
});

const CATEGORIES = [
  { id: 'all', label: 'All Places' },
  { id: 'our-places', label: 'Our Places' },
  { id: 'culture', label: 'Culture' },
  { id: 'nature', label: 'Nature' },
  { id: 'food', label: 'Food' },
  { id: 'disco', label: 'Nightlife' },
];

export default function Home() {
  const [currentCityId, setCurrentCityId] = useState(CITIES[0].id);
  const [selectedPois, setSelectedPois] = useState<POI[]>([]);
  const [mapTheme, setMapTheme] = useState<'light' | 'dark'>('light');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentCity = CITIES.find((c) => c.id === currentCityId) || CITIES[0];

  // Filter POIs based on selected category
  const filteredCity = {
    ...currentCity,
    pois: currentCity.pois.filter(poi =>
      selectedCategory === 'all' || poi.category === selectedCategory
    )
  };

  const handleCityChange = (cityId: string) => {
    setCurrentCityId(cityId);
    setSelectedPois([]); // Reset selection when changing city
    setSelectedCategory('all'); // Reset filter
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Could not get your location. Please check your browser settings.');
      }
    );
  };

  const handlePoiClick = (poi: POI) => {
    if (selectedPois.find((p) => p.id === poi.id)) {
      // Deselect if already selected
      setSelectedPois(selectedPois.filter((p) => p.id !== poi.id));
    } else if (selectedPois.length < 2) {
      // Add to selection if less than 2
      setSelectedPois([...selectedPois, poi]);
    } else {
      // Replace second point if already 2 selected
      setSelectedPois([selectedPois[0], poi]);
    }

    if (userLocation && selectedPois.length >= 1) {
      setUserLocation(null);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">

      {/* Top Bar / Search */}
      <div className="fixed top-6 left-4 right-4 z-[1000] pointer-events-none flex flex-col items-center gap-3">
        <div className="w-full max-w-md bg-[#1a1f2e]/80 backdrop-blur-xl rounded-full shadow-high p-1.5 flex items-center gap-3 pointer-events-auto border border-white/5">
          <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-primary shadow-sm ml-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleCityChange(currentCityId === 'valencia' ? 'ibiza' : 'valencia')}>
            <h2 className="text-xl font-bold text-white tracking-tight">{currentCity.name}</h2>
          </div>

          <div className="mr-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1e293b] text-white/80 text-xs font-bold py-2 px-3 rounded-full border-none outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer appearance-none pr-8 relative"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1rem'
              }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons (Zoom & Theme) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-3 pointer-events-none">
        <button
          onClick={handleLocateUser}
          className="w-12 h-12 rounded-full bg-[#1a1f2e]/90 backdrop-blur-xl border border-white/5 shadow-high flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform"
          title="My Location"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
          className="w-12 h-12 rounded-full bg-[#1a1f2e]/90 backdrop-blur-xl border border-white/5 shadow-high flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform"
          title="Toggle Map Theme"
        >
          {mapTheme === 'dark' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <MapComponent
          city={filteredCity}
          selectedPois={selectedPois}
          onPoiClick={handlePoiClick}
          theme={mapTheme}
          userLocation={userLocation}
        />
      </div>

      {/* POI Overlay */}
      <POIOverlay
        selectedPois={selectedPois}
        onReset={() => {
          setSelectedPois([]);
          setUserLocation(null);
        }}
        userLocation={userLocation}
      />

    </main>
  );
}
