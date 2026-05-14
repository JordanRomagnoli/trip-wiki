'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { City, POI } from '@/lib/data';

// Fix for default marker icons in Leaflet with Next.js
const createCustomIcon = (color: string, label: string, isVisited: boolean = false) => {
  const finalColor = isVisited ? '#94a3b8' : color; // Gray-ish slate color for visited
  const opacity = isVisited ? '0.6' : '1';
  const grayscale = isVisited ? 'filter: grayscale(100%);' : '';

  return L.divIcon({
    html: `
      <div class="flex flex-col items-center" style="opacity: ${opacity}; ${grayscale}">
        <div style="
          width: 24px;
          height: 24px;
          border: 3px solid ${finalColor};
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 0 15px ${isVisited ? 'rgba(148,163,184,0.3)' : finalColor};
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: ${finalColor};
            border-radius: 50%;
          "></div>
        </div>
        <div style="
          margin-top: 8px;
          background: ${isVisited ? 'rgba(71, 85, 105, 0.9)' : 'rgba(26, 31, 46, 0.9)'};
          padding: 4px 12px;
          border-radius: 12px;
          color: white;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
        ">${label}</div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [120, 60],
    iconAnchor: [60, 12],
  });
};

const categoryColors = {
  'our-places': '#ef4444', // red
  culture: '#3b82f6', // blue
  nature: '#10b981', // green
  food: '#f59e0b',    // orange
  landmark: '#8b5cf6', // purple
  disco: '#ec4899',    // pink
};

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapComponentProps {
  city: City;
  selectedPois: POI[];
  onPoiClick: (poi: POI) => void;
  theme?: 'light' | 'dark';
  userLocation?: [number, number] | null;
  routePoints?: [number, number][];
  visitedPois?: string[];
}

const userLocationIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
      <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
    </div>
  `,
  className: 'user-location-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapEffect({ userLocation }: { userLocation: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 14, {
        duration: 1.5,
      });
    }
  }, [userLocation, map]);

  return null;
}

export default function MapComponent({
  city,
  selectedPois,
  onPoiClick,
  theme = 'dark',
  userLocation = null,
  routePoints,
  visitedPois,
}: MapComponentProps) {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={city.center}
        zoom={city.zoom}
        zoomControl={false}
        className={`w-full h-full transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0d0f14]' : 'bg-[#f8f9fa]'}`}
      >
        <ChangeView center={city.center} zoom={city.zoom} />
        <MapEffect userLocation={userLocation} />

        {theme === 'dark' ? (
          <TileLayer
            key="dark-tiles"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        ) : (
          <TileLayer
            key="light-tiles"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
          />
        )}

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon} zIndexOffset={1000}>
            <Popup>
              <div className="p-1">
                <p className="font-bold text-blue-600">You are here</p>
              </div>
            </Popup>
          </Marker>
        )}

        {city.pois.map((poi) => {
          const isVisited = visitedPois?.includes(poi.id);
          return (
            <Marker
              key={poi.id}
              position={poi.coordinates}
              icon={createCustomIcon(
                categoryColors[poi.category as keyof typeof categoryColors] || '#3b82f6',
                poi.name,
                isVisited
              )}
              eventHandlers={{
                click: () => onPoiClick(poi),
              }}
            >
              <Popup className="premium-popup">
                <div className="p-1">
                  <h3 className="font-bold text-primary">{poi.name}</h3>
                  <p className="text-xs text-tertiary mt-1">{poi.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Road Route Polyline */}
        {routePoints && (
          <Polyline
            positions={routePoints}
            color="#3b82f6"
            weight={5}
            opacity={0.8}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Fallback Straight Lines (only if no routePoints) */}
        {!routePoints && selectedPois.length === 2 && (
          <Polyline
            className='animate-pulse'
            positions={[selectedPois[0].coordinates, selectedPois[1].coordinates]}
            color={theme === 'dark' ? "#3b82f6" : "#2563eb"}
            dashArray="10, 10"
            weight={3}
            opacity={0.8}
          />
        )}

        {!routePoints && selectedPois.length === 1 && userLocation && (
          <Polyline
            positions={[userLocation, selectedPois[0].coordinates]}
            color="#3b82f6"
            dashArray="10, 10"
            weight={2}
            opacity={0.6}
          />
        )}
      </MapContainer>
    </div>
  );
}

