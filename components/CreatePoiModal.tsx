'use client';

import { useState } from 'react';

interface CreatePoiModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityId: string;
  onCreate: (poi: any) => void;
}

const CATEGORIES = [
  { id: 'our-places', label: 'I nostri posti' },
  { id: 'culture', label: 'Cultura' },
  { id: 'nature', label: 'Natura' },
  { id: 'food', label: 'Cibo' },
  { id: 'disco', label: 'Vita notturna' },
];

export default function CreatePoiModal({
  isOpen,
  onClose,
  cityId,
  onCreate,
}: CreatePoiModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalizzazione non è supportata dal tuo browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toString());
        setLng(position.coords.longitude.toString());
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Impossibile ottenere la tua posizione');
        setIsLocating(false);
      }
    );
  };

  const handleCreate = () => {
    if (!name.trim() || !lat.trim() || !lng.trim()) {
      alert('Per favore compila tutti i campi obbligatori (Nome e Coordinate)');
      return;
    }

    const poi = {
      city_id: cityId,
      name,
      description,
      category,
      coordinates: [parseFloat(lat), parseFloat(lng)],
    };

    onCreate(poi);
    setName('');
    setDescription('');
    setCategory(CATEGORIES[0].id);
    setLat('');
    setLng('');
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="bg-background border border-outline rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">Nuovo Punto di Interesse</h3>
            <p className="text-sm text-tertiary">Aggiungi un nuovo posto alla mappa</p>
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

        <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-primary uppercase tracking-widest">Nome del posto *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Belvedere Panoramico"
              className="w-full p-4 rounded-2xl bg-surface border border-outline text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-primary uppercase tracking-widest">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    category === cat.id 
                      ? 'bg-primary text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                      : 'bg-surface border border-outline text-tertiary hover:border-foreground/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-primary uppercase tracking-widest">Descrizione</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cosa rende questo posto speciale?"
              rows={3}
              className="w-full p-4 rounded-2xl bg-surface border border-outline text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          {/* Coordinates */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-primary uppercase tracking-widest">Coordinate *</label>
              <button
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="text-xs font-bold text-foreground/70 hover:text-primary flex items-center gap-1 transition-colors"
              >
                <svg className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {isLocating ? 'Localizzazione...' : 'Usa la mia posizione'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-tertiary ml-1">Latitudine</span>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="e.g. 39.4699"
                  className="w-full p-4 rounded-2xl bg-surface border border-outline text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-tertiary ml-1">Longitudine</span>
                <input
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="e.g. -0.3763"
                  className="w-full p-4 rounded-2xl bg-surface border border-outline text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                />
              </div>
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
            Crea Punto
          </button>
        </div>
      </div>
    </div>
  );
}
