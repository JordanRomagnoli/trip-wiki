'use client';

import { City } from '@/lib/data';

interface CitySwitcherProps {
  cities: City[];
  currentCityId: string;
  onCityChange: (cityId: string) => void;
}

export default function CitySwitcher({ cities, currentCityId, onCityChange }: CitySwitcherProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-1 p-1 glass rounded-2xl shadow-premium">
      {cities.map((city) => (
        <button
          key={city.id}
          onClick={() => onCityChange(city.id)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
            currentCityId === city.id
              ? 'bg-primary text-on-primary shadow-md'
              : 'text-tertiary hover:bg-surface'
          }`}
        >
          {city.name}
        </button>
      ))}
    </div>
  );
}
