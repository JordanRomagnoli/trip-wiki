'use client';

import { POI } from '@/lib/data';
import { calculateDistance } from '@/lib/utils';
import MapsLogo from './MapsLogo';

interface POIOverlayProps {
  selectedPois: POI[];
  onReset: () => void;
  userLocation?: [number, number] | null;
  roadDistance?: number;
}

export default function POIOverlay({
  selectedPois,
  onReset,
  userLocation = null,
  roadDistance
}: POIOverlayProps) {
  if (selectedPois.length === 0) return null;

  let distance: string | null = null;
  let distanceLabel = 'Distance';

  if (roadDistance !== undefined) {
    distance = roadDistance.toFixed(2);
    distanceLabel = 'Percorso stradale';
  } else if (selectedPois.length === 2) {
    distance = calculateDistance(
      selectedPois[0].coordinates[0],
      selectedPois[0].coordinates[1],
      selectedPois[1].coordinates[0],
      selectedPois[1].coordinates[1]
    ).toFixed(2);
    distanceLabel = 'Tra i punti';
  } else if (selectedPois.length === 1 && userLocation) {
    distance = calculateDistance(
      userLocation[0],
      userLocation[1],
      selectedPois[0].coordinates[0],
      selectedPois[0].coordinates[1]
    ).toFixed(2);
    distanceLabel = 'Dalla tua posizione';
  }

  const openInMaps = () => {
    const poi = selectedPois[selectedPois.length - 1];
    const url = `https://www.google.com/maps/search/?api=1&query=${poi.coordinates[0]},${poi.coordinates[1]}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[1000] flex flex-col items-center pointer-events-none">
      {/* POI Info Card */}
      {selectedPois.length > 0 && (
        <div className="p-5 w-full max-w-md bg-[#1a1f2e]/95 backdrop-blur-2xl rounded-[32px] shadow-high pointer-events-auto border border-white/10 animate-in slide-in-from-bottom-8 duration-500 min-h-[140px] flex flex-col gap-3">
          <div className="flex justify-between items-start gap-4 mb-auto">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1 block">
                Punto Selezionato
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
                {selectedPois[selectedPois.length - 1].name}
              </h2>
            </div>

            {distance && (
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-white font-mono leading-none">
                  {distance} <span className="text-sm font-medium opacity-60">km</span>
                </div>
                <span className="text-[10px] text-primary/70 font-bold uppercase tracking-wider">{distanceLabel}</span>
              </div>
            )}
          </div>

          {selectedPois.length === 1 ? (
            <div className="flex gap-3 mt-6">
              <button
                onClick={onReset}
                className="flex-1 py-3.5 px-4 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold tracking-widest uppercase rounded-2xl border border-white/10 transition-all active:scale-[0.98]"
              >
                Cancella
              </button>
              <button
                onClick={openInMaps}
                className="flex-[0.5] py-3.5 px-4 bg-blue-400/10 border border-primary text-white flex items-center justify-center gap-2 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <MapsLogo className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onReset}
              className="w-full mt-6 py-3.5 px-4 bg-primary text-white text-xs font-bold tracking-widest uppercase rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Calcola una nuova Distanza
            </button>
          )}
        </div>
      )}
    </div>
  );
}