'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { City, POI } from '@/lib/types';
import { User } from '@supabase/supabase-js';
import POIOverlay from '@/components/POIOverlay';
import CreateItineraryModal from '@/components/CreateItineraryModal';
import CreatePoiModal from '@/components/CreatePoiModal';
import { getRoute } from '@/lib/utils';
import { createItineraryAction, createPoiAction, logoutAction } from '@/lib/actions';
import { createClient } from '@/lib/supabase/client';

// Load MapComponent dynamically to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-tertiary font-medium">Caricamento mappa...</p>
      </div>
    </div>
  ),
});

const CATEGORIES = [
  { id: 'all', label: 'Tutti i posti' },
  { id: 'our-places', label: 'I nostri posti' },
  { id: 'culture', label: 'Cultura' },
  { id: 'nature', label: 'Natura' },
  { id: 'food', label: 'Cibo' },
  { id: 'disco', label: 'Vita notturna' },
];

interface HomeClientProps {
  initialCities: City[];
  user?: User | null;
}

export default function HomeClient({ initialCities, user }: HomeClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [currentCityId, setCurrentCityId] = useState(initialCities[0]?.id || 'valencia');
  const [selectedPois, setSelectedPois] = useState<POI[]>([]);
  const [mapTheme, setMapTheme] = useState<'light' | 'dark'>('light');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<{ coordinates: [number, number][]; distance: number } | null>(null);
  const [hideOthersEnabled, setHideOthersEnabled] = useState(true);
  const [visitedPois, setVisitedPois] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isItineraryFormOpen, setIsItineraryFormOpen] = useState(false);
  const [isPoiFormOpen, setIsPoiFormOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const selectedCategory = searchParams.get('category') || 'all';
  const selectedItineraryId = searchParams.get('itinerary');

  const currentCity = initialCities.find((c) => c.id === currentCityId) || initialCities[0];

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

  // Focus mode filtering (remains on client as requested)
  const filteredCity = useMemo(() => {
    if (hideOthersEnabled && selectedPois.length === 2) {
      return {
        ...currentCity,
        pois: currentCity.pois.filter(poi =>
          selectedPois.some(p => p.id === poi.id)
        )
      };
    }
    return currentCity;
  }, [currentCity, hideOthersEnabled, selectedPois]);

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

    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('itinerary');
    router.push(`?${params.toString()}`);
  };

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('La geolocalizzazione non è supportata dal tuo browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Impossibile ottenere la tua posizione. Controlla le impostazioni del browser.');
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
  const handleCreateItinerary = async (name: string, poiIds: string[]) => {
    try {
      await createItineraryAction(currentCity.id, name, poiIds);
      setIsItineraryFormOpen(false);
      // Reload the page to show the new itinerary in the filters
      router.refresh();
    } catch (error) {
      console.error('Error creating itinerary:', error);
      alert('Impossibile creare l\'itinerario');
    }
  };

  const handleCreatePoi = async (poi: any) => {
    try {
      await createPoiAction(poi);
      setIsPoiFormOpen(false);
      // Reload the page to show the new POI on the map
      router.refresh();
    } catch (error) {
      console.error('Error creating POI:', error);
      alert('Impossibile creare il punto di interesse');
    }
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">

      {/* Top Bar / Search */}
      <div className="fixed top-6 left-4 right-4 z-[1000] pointer-events-none flex justify-center">
        <div className="w-full max-w-lg flex items-center gap-3">
          <div className="flex-1 bg-background/80 backdrop-blur-xl rounded-full shadow-high p-1.5 flex items-center gap-3 pointer-events-auto border border-outline">
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary shadow-sm ml-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1 cursor-pointer" onClick={() => handleCityChange(currentCityId === 'valencia' ? 'ibiza' : 'valencia')}>
              <h2 className="text-xl font-bold text-foreground tracking-tight">{currentCity.name}</h2>
            </div>
            
            <div>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
                title="Filtri"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>

          {user && (
            <div className="pointer-events-auto shrink-0 relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-14 h-14 rounded-full bg-background/80 backdrop-blur-xl border border-outline shadow-high overflow-hidden flex items-center justify-center text-primary transition-transform hover:scale-105"
                title="Profilo"
              >
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-lg">{user.email?.[0].toUpperCase()}</span>
                )}
              </button>
              {isUserMenuOpen && (
                <div className="absolute top-16 right-0 mt-2 w-48 bg-background border border-outline rounded-xl shadow-high py-2 flex flex-col z-[2000]">
                  <div className="px-4 py-2 border-b border-outline mb-2">
                    <p className="text-sm font-medium text-foreground truncate">{user.user_metadata?.full_name || user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-left text-red-500 hover:bg-surface-container transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons (Zoom & Theme) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-3 pointer-events-none">
        <button
          onClick={handleLocateUser}
          className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-xl border border-outline shadow-high flex items-center justify-center text-foreground pointer-events-auto active:scale-95 transition-transform"
          title="La mia posizione"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button
          onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
          className="w-12 h-12 rounded-full bg-background/90 backdrop-blur-xl border border-outline shadow-high flex items-center justify-center text-foreground pointer-events-auto active:scale-95 transition-transform"
          title="Cambia tema mappa"
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
            title={hideOthersEnabled ? "Disattiva Focus Mode" : "Attiva Focus Mode"}
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

      {/* Floating Create Button (Bottom Right) */}
      {!selectedPois.length && user && (
        <div className="fixed bottom-6 right-6 z-[1000]">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={`w-16 h-16 rounded-full flex items-center justify-center pointer-events-auto active:scale-95 transition-all hover:scale-105 border ${mapTheme === 'light'
              ? 'bg-black border-black text-white'
              : 'bg-primary border-primary text-black'
              }`}
            title="Aggiungi nuovo"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-background border border-outline rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 mb-2 sm:mb-0">
            <div className="flex items-center justify-between p-5 border-b border-outline">
              <h3 className="text-xl font-bold text-foreground">Filtri</h3>
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
                <label className="block text-sm font-medium text-tertiary">Categorie</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('category', cat.id);
                        params.delete('itinerary');
                        router.push(`?${params.toString()}`);
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
                  <label className="block text-sm font-medium text-tertiary mb-3">Itinerari suggeriti</label>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete('category');
                        params.delete('itinerary');
                        router.push(`?${params.toString()}`);
                        setSelectedPois([]);
                        setIsFilterModalOpen(false);
                      }}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors text-left ${!selectedItineraryId && selectedCategory === 'all'
                        ? 'bg-primary text-black'
                        : 'bg-surface text-tertiary hover:bg-surface-container'
                        }`}
                    >
                      Esplora liberamente (Nessun itinerario)
                    </button>
                    {currentCity.itineraries.map(it => (
                      <button
                        key={it.id}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          params.set('itinerary', it.id);
                          params.delete('category');
                          router.push(`?${params.toString()}`);
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

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-background border border-outline rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 mb-2 sm:mb-0">
            <div className="flex items-center justify-between p-5 border-b border-outline">
              <h3 className="text-xl font-bold text-foreground">Crea nuovo</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <button
                onClick={() => {
                  setIsPoiFormOpen(true);
                  setIsCreateModalOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors text-left border border-outline group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Aggiungi punto di interesse</h4>
                  <p className="text-sm text-tertiary">Condividi un nuovo posto sulla mappa</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsItineraryFormOpen(true);
                  setIsCreateModalOpen(false);
                }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors text-left border border-outline group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L16 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Aggiungi itinerario</h4>
                  <p className="text-sm text-tertiary">Crea un percorso curato di posti</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Itinerary Creation Modal */}
      <CreateItineraryModal
        isOpen={isItineraryFormOpen}
        onClose={() => setIsItineraryFormOpen(false)}
        availablePois={currentCity.pois}
        onCreate={handleCreateItinerary}
      />

      {/* POI Creation Modal */}
      <CreatePoiModal
        isOpen={isPoiFormOpen}
        onClose={() => setIsPoiFormOpen(false)}
        cityId={currentCity.id}
        onCreate={handleCreatePoi}
      />
    </main>
  );
}
