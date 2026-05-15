'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CITIES, City, POI } from '@/lib/data';
import CitySwitcher from '@/components/CitySwitcher';
import POIOverlay from '@/components/POIOverlay';
import { getRoute } from '@/lib/utils';

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
  const [routeData, setRouteData] = useState<{ coordinates: [number, number][]; distance: number } | null>(null);
  const [hideOthersEnabled, setHideOthersEnabled] = useState(true);
  const [visitedPois, setVisitedPois] = useState<string[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const currentCity = CITIES.find((c) => c.id === currentCityId) || CITIES[0];

  // Load visited POIs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('visitedPois');
    if (saved) {
      setVisitedPois(JSON.parse(saved));
    }
  }, []);

  // Save visited POIs to localStorage
  useEffect(() => {
    localStorage.setItem('visitedPois', JSON.stringify(visitedPois));
  }, [visitedPois]);

  const toggleVisited = (poiId: string) => {
    setVisitedPois(prev =>
      prev.includes(poiId) ? prev.filter(id => id !== poiId) : [...prev, poiId]
    );
  };

  // Filter POIs based on selected category and selection count
  const filteredCity = {
    ...currentCity,
    pois: currentCity.pois.filter(poi => {
      // If 2 POIs are selected and focus mode is enabled, only show those two
      if (hideOthersEnabled && selectedPois.length === 2) {
        return selectedPois.some(p => p.id === poi.id);
      }

      // If itinerary is selected, filter by itinerary POIs
      if (selectedItineraryId) {
        const itinerary = currentCity.itineraries?.find(i => i.id === selectedItineraryId);
        if (itinerary) {
          return itinerary.poiIds.includes(poi.id);
        }
      }

      // Otherwise, filter by category
      return selectedCategory === 'all' || poi.category === selectedCategory;
    })
  };

  let poiOrder: Record<string, number> | undefined;
  if (selectedItineraryId) {
    const itinerary = currentCity.itineraries?.find(i => i.id === selectedItineraryId);
    if (itinerary) {
      poiOrder = {};
      itinerary.poiIds.forEach((id, index) => {
        poiOrder![id] = index + 1;
      });
    }
  }

  useEffect(() => {
    async function updateRoute() {
      if (selectedPois.length === 2) {
        const route = await getRoute(selectedPois[0].coordinates, selectedPois[1].coordinates);
        setRouteData(route);
      } else if (selectedPois.length === 1 && userLocation) {
        const route = await getRoute(userLocation, selectedPois[0].coordinates);
        setRouteData(route);
      } else {
        setRouteData(null);
      }
    }
    updateRoute();
  }, [selectedPois, userLocation]);

  const handleCityChange = (cityId: string) => {
    setCurrentCityId(cityId);
    setSelectedPois([]); // Reset selection when changing city
    setSelectedCategory('all'); // Reset filter
    setSelectedItineraryId(null);
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
        <div className="w-full max-w-md bg-background/80 backdrop-blur-xl rounded-full shadow-high p-1.5 flex items-center gap-3 pointer-events-auto border border-outline">
          <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary shadow-sm ml-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleCityChange(currentCityId === 'valencia' ? 'ibiza' : 'valencia')}>
            <h2 className="text-xl font-bold text-foreground tracking-tight">{currentCity.name}</h2>
          </div>

          <div className="mr-2">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
              title="Filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons (Zoom & Theme) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-3 pointer-events-none">
        <button
          onClick={handleLocateUser}
          className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-xl border border-outline shadow-high flex items-center justify-center text-foreground pointer-events-auto active:scale-95 transition-transform"
          title="My Location"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
          className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-xl border border-outline shadow-high flex items-center justify-center text-foreground pointer-events-auto active:scale-95 transition-transform"
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
        {selectedPois.length === 2 && (
          <button
            onClick={() => setHideOthersEnabled(!hideOthersEnabled)}
            className={`w-12 h-12 rounded-full backdrop-blur-xl border flex items-center justify-center pointer-events-auto active:scale-95 transition-all ${hideOthersEnabled ? 'bg-primary border-primary text-[#181818] shadow-[0_0_20px_rgba(204,255,0,0.4)]' : 'bg-background/90 border-outline text-tertiary shadow-high'
              }`}
            title={hideOthersEnabled ? "Disable Focus Mode" : "Enable Focus Mode"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <MapComponent
          city={filteredCity}
          selectedPois={selectedPois}
          onPoiClick={handlePoiClick}
          theme={mapTheme}
          userLocation={userLocation}
          routePoints={routeData?.coordinates}
          visitedPois={visitedPois}
          poiOrder={poiOrder}
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
        roadDistance={routeData?.distance}
        visitedPois={visitedPois}
        onToggleVisited={toggleVisited}
      />

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-background border border-outline rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 mb-2 sm:mb-0">
            <div className="flex items-center justify-between p-5 border-b border-outline">
              <h3 className="text-xl font-bold text-foreground">Filters</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-6">
              {/* Category Filter */}
              <div className='flex flex-col gap-3'>
                <label className="block text-sm font-medium text-tertiary">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedItineraryId(null);
                        setSelectedPois([]);
                        setIsFilterModalOpen(false);
                      }}
                      className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.id && !selectedItineraryId
                        ? 'bg-primary text-black'
                        : 'bg-surface text-tertiary hover:bg-surface-container'
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Itinerary Filter */}
              {currentCity.itineraries && currentCity.itineraries.length > 0 && (
                <div className='flex flex-col gap-3'>
                  <label className="block text-sm font-medium text-tertiary mb-3">Suggested Itineraries</label>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedItineraryId(null);
                        setSelectedCategory('all');
                        setSelectedPois([]);
                        setIsFilterModalOpen(false);
                      }}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors text-left ${!selectedItineraryId && selectedCategory === 'all'
                        ? 'bg-primary text-black'
                        : 'bg-surface text-tertiary hover:bg-surface-container'
                        }`}
                    >
                      Explore freely (No itinerary)
                    </button>
                    {currentCity.itineraries.map(it => (
                      <button
                        key={it.id}
                        onClick={() => {
                          setSelectedItineraryId(it.id);
                          setSelectedCategory('all');
                          setSelectedPois([]);
                          setIsFilterModalOpen(false);
                        }}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors text-left ${selectedItineraryId === it.id
                          ? 'bg-primary text-black'
                          : 'bg-surface text-tertiary hover:bg-surface-container'
                          }`}
                      >
                        {it.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
