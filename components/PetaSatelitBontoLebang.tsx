'use client';

import { useEffect, useRef, useState } from 'react';

export default function PetaSatelitBontoLebang() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [tileType, setTileType] = useState<'satellite' | 'street'>('satellite');

  useEffect(() => {
    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Inject Leaflet JS
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      // Initialize map centered at Bonto Lebang
      const map = L.map(mapRef.current, {
        center: [-5.5465, 119.9230],
        zoom: 15,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Satellite Tile Layer (Esri World Imagery)
      const satelliteTiles = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Esri, Maxar, Earthstar Geographics',
          maxZoom: 18,
        }
      );

      // Street Tile Layer (OpenStreetMap)
      const streetTiles = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png',
        {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }
      );

      // Add default satellite tiles
      satelliteTiles.addTo(map);
      mapInstanceRef.current = { map, satelliteTiles, streetTiles, L };

      // Garis Pembatas Resmi Polygon Kelurahan Bonto Lebang
      const bontoLebangBoundary = [
        [-5.5370, 119.9175],
        [-5.5360, 119.9265],
        [-5.5380, 119.9330],
        [-5.5435, 119.9365],
        [-5.5510, 119.9350],
        [-5.5570, 119.9295],
        [-5.5565, 119.9195],
        [-5.5525, 119.9140],
        [-5.5450, 119.9135],
        [-5.5395, 119.9155],
      ];

      // Draw Red Polygon Boundary (Garis Merah Khusus Bonto Lebang)
      const polygon = L.polygon(bontoLebangBoundary, {
        color: '#A91D3A',
        weight: 4.5,
        opacity: 0.95,
        fillColor: '#A91D3A',
        fillOpacity: 0.18,
        dashArray: '8, 6',
      }).addTo(map);

      polygon.bindTooltip(
        '<div style="font-weight: 800; color: #6B1124; font-family: sans-serif; font-size: 13px; text-transform: uppercase;">🔴 Wilayah Kelurahan Bonto Lebang</div>',
        { permanent: true, direction: 'center', className: 'custom-map-tooltip' }
      );

      // Add Custom Marker for Kantor Kelurahan
      const kantorIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: #6B1124; color: white; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 11px; border: 2px solid #A91D3A; box-shadow: 0 4px 10px rgba(0,0,0,0.5); white-space: nowrap; cursor: pointer;">🏛️ Kantor Kelurahan Bonto Lebang</div>`,
        iconSize: [190, 32],
        iconAnchor: [95, 16],
      });

      L.marker([-5.5465, 119.9230], { icon: kantorIcon }).addTo(map)
        .bindPopup('<b style="color:#6B1124;">Kantor Kelurahan Bonto Lebang</b><br />Pusat Pelayanan Masyarakat Bonto Lebang, Kec. Bissapu, Kab. Bantaeng');

      // Add Custom Marker for TPI Kampung Kaili
      const tpiIcon = L.divIcon({
        className: 'custom-pin-tpi',
        html: `<div style="background-color: #0284C7; color: white; padding: 5px 10px; border-radius: 20px; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); white-space: nowrap; cursor: pointer;">🐟 TPI Kampung Kaili (RW 004)</div>`,
        iconSize: [170, 30],
        iconAnchor: [85, 15],
      });

      L.marker([-5.5550, 119.9245], { icon: tpiIcon }).addTo(map)
        .bindPopup('<b style="color:#0284C7;">Tempat Pelelangan Ikan (TPI) & Pesisir Kaili</b><br />Pusat Nelayan & Budidaya Rumput Laut');
    }
  }, []);

  const switchTile = (type: 'satellite' | 'street') => {
    if (!mapInstanceRef.current) return;
    const { map, satelliteTiles, streetTiles } = mapInstanceRef.current;
    if (type === 'satellite') {
      map.removeLayer(streetTiles);
      satelliteTiles.addTo(map);
    } else {
      map.removeLayer(satelliteTiles);
      streetTiles.addTo(map);
    }
    setTileType(type);
  };

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#A91D3A]">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full z-0 bg-gray-900" />

      {/* Header Overlay & Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-[#6B1124] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full shadow-lg border border-[#A91D3A] flex items-center gap-2 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
          <span>Garis Pembatas Wilayah Kelurahan Bonto Lebang</span>
        </div>

        {/* Layer Switcher Buttons */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-md flex items-center gap-1 pointer-events-auto">
          <button
            type="button"
            onClick={() => switchTile('satellite')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${
              tileType === 'satellite'
                ? 'bg-[#A91D3A] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            🛰️ Satelit
          </button>
          <button
            type="button"
            onClick={() => switchTile('street')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${
              tileType === 'street'
                ? 'bg-[#A91D3A] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            🗺️ Peta Jalan
          </button>
        </div>
      </div>
    </div>
  );
}
