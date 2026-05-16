'use client';

import { useState } from 'react';
import { POI } from '@/lib/types';

interface CreateItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePois: POI[];
  onCreate: (name: string, poiIds: string[]) => void;
}

export default function CreateItineraryModal({
  isOpen,
  onClose,
  availablePois,
  onCreate,
}: CreateItineraryModalProps) {
  const [name, setName] = useState('');
  const [selectedPoiIds, setSelectedPoiIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const togglePoi = (poiId: string) => {
    setSelectedPoiIds((prev) =>
      prev.includes(poiId)
        ? prev.filter((id) => id !== poiId)
        : [...prev, poiId]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Inserisci un nome per l\'itinerario');
      return;
    }
    if (selectedPoiIds.length === 0) {
      alert('Seleziona almeno un punto di interesse');
      return;
    }
    onCreate(name, selectedPoiIds);
    setName('');
    setSelectedPoiIds([]);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="bg-background border border-outline rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">Nuovo itinerario</h3>
            <p className="text-sm text-tertiary">Seleziona i posti per creare un percorso</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-primary uppercase tracking-widest">Nome itinerario</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Favorite Places"
              className="w-full p-4 rounded-2xl bg-surface border border-outline text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* POI Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-primary uppercase tracking-widest">Seleziona punti di interesse ({selectedPoiIds.length})</label>
            <div className="grid grid-cols-1 gap-2">
              {availablePois.map((poi) => {
                const isSelected = selectedPoiIds.includes(poi.id);
                const orderIndex = selectedPoiIds.indexOf(poi.id);
                
                return (
                  <button
                    key={poi.id}
                    onClick={() => togglePoi(poi.id)}
                    className={`flex items-center gap-4 p-3 rounded-2xl border transition-all text-left ${
                      isSelected 
                        ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(204,255,0,0.2)]' 
                        : 'bg-surface border-outline hover:border-foreground/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isSelected ? 'bg-primary text-black' : 'bg-outline text-tertiary'
                    }`}>
                      {isSelected ? orderIndex + 1 : '+'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground text-sm">{poi.name}</h4>
                      <p className="text-[10px] text-tertiary uppercase font-medium">{poi.category}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface/50 border-t border-outline flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl bg-surface border border-outline text-foreground font-bold hover:bg-surface-container transition-all active:scale-95"
          >
            Annulla
          </button>
          <button
            onClick={handleCreate}
            className="flex-[2] py-4 px-6 rounded-2xl bg-primary text-black font-bold shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:brightness-110 transition-all active:scale-95"
          >
            Crea itinerario
          </button>
        </div>
      </div>
    </div>
  );
}
