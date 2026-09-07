'use client';

import { useEffect, useRef, useState } from 'react';

// Coordinates for Kelurahan Bonto Lebang, Bissapu, Bantaeng
const CENTER: [number, number] = [-5.5476, 119.9268];

// Batas wilayah polygon Kelurahan Bonto Lebang (approximate)
const BONTO_LEBANG_POLYGON: [number, number][] = [
  [-5.5390, 119.9170],
  [-5.5375, 119.9220],
  [-5.5380, 119.9290],
  [-5.5400, 119.9360],
  [-5.5430, 119.9400],
  [-5.5460, 119.9420],
  [-5.5500, 119.9410],
  [-5.5545, 119.9390],
  [-5.5570, 119.9350],
  [-5.5575, 119.9290],
  [-5.5560, 119.9230],
  [-5.5530, 119.9180],
  [-5.5490, 119.9160],
  [-5.5450, 119.9155],
  [-5.5420, 119.9160],
  [-5.5390, 119.9170],
];

// Key markers
const MARKERS = [
  {
    id: 'kantor',
    lat: -5.5476,
    lng: 119.9268,
    label: 'Kantor Kelurahan Bonto Lebang',
    desc: 'Pusat pelayanan administrasi Kelurahan Bonto Lebang, Kec. Bissapu',
    color: '#A91D3A',
    icon: '🏛️',
    category: 'Pemerintahan',
  },
  {
    id: 'masjid',
    lat: -5.5455,
    lng: 119.9248,
    label: 'Masjid Agung Bonto Lebang',
    desc: 'Masjid utama warga Kelurahan Bonto Lebang',
    color: '#1d6a3a',
    icon: '🕌',
    category: 'Ibadah',
  },
  {
    id: 'sekolah',
    lat: -5.5500,
    lng: 119.9300,
    label: 'SDN Bonto Lebang',
    desc: 'Sekolah Dasar Negeri di wilayah Kelurahan Bonto Lebang',
    color: '#1a5fa6',
    icon: '🏫',
    category: 'Pendidikan',
  },
  {
    id: 'puskesmas',
    lat: -5.5490,
    lng: 119.9240,
    label: 'Puskesmas Bissapu',
    desc: 'Pelayanan kesehatan masyarakat tingkat kecamatan',
    color: '#1a96a6',
    icon: '🏥',
    category: 'Kesehatan',
  },
  {
    id: 'daengtoa',
    lat: -5.5420,
    lng: 119.9320,
    label: 'Wisata Religi Daeng Toa',
    desc: 'Situs ziarah dan wisata religi bersejarah di Bonto Lebang',
    color: '#6b4fa6',
    icon: '⛩️',
    category: 'Wisata',
  },
  {
    id: 'tpi',
    lat: -5.5530,
    lng: 119.9380,
    label: 'TPI Kampung Kaili',
    desc: 'Tempat Pelelangan Ikan warga nelayan Kampung Kaili',
    color: '#a67c1a',
    icon: '🐟',
    category: 'Perikanan',
  },
];

const TILE_LAYERS = {
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

export default function PetaWilayahInteraktif() {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let L: any;
    let map: any;

    async function initMap() {
      // Dynamic import to avoid SSR issues
      L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (mapRef.current || !mapContainerRef.current) return;

      // Fix default icon paths for Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Initialize map
      map = L.map(mapContainerRef.current, {
        center: CENTER,
        zoom: 15,
        zoomControl: false,
        attributionControl: true,
      });
      mapRef.current = map;

      // Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add initial tile layer
      const initialTile = TILE_LAYERS.streets;
      tileLayerRef.current = L.tileLayer(initialTile.url, {
        attribution: initialTile.attribution,
        maxZoom: 19,
      }).addTo(map);

      // Polygon wilayah kelurahan
      L.polygon(BONTO_LEBANG_POLYGON, {
        color: '#228B57',
        weight: 2.5,
        opacity: 0.9,
        fillColor: '#228B57',
        fillOpacity: 0.18,
        dashArray: '6, 4',
      })
        .addTo(map)
        .bindPopup(
          '<div style="font-family:sans-serif;min-width:180px"><strong style="color:#228B57">🗺️ Kelurahan Bonto Lebang</strong><br/><span style="font-size:12px;color:#555">Kec. Bissapu, Kab. Bantaeng</span></div>'
        );

      // Markers
      MARKERS.forEach((m) => {
        const divIcon = L.divIcon({
          className: '',
          html: `<div style="
            background:${m.color};
            width:36px;height:36px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            display:flex;align-items:center;justify-content:center;
          ">
            <span style="transform:rotate(45deg);font-size:17px;line-height:1;">${m.icon}</span>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        L.marker([m.lat, m.lng], { icon: divIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;min-width:180px;max-width:220px">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${m.color};margin-bottom:3px">${m.category}</div>
              <strong style="font-size:14px;color:#111;line-height:1.35;display:block;margin-bottom:4px">${m.icon} ${m.label}</strong>
              <span style="font-size:12px;color:#555;line-height:1.4">${m.desc}</span>
            </div>`,
            { maxWidth: 240 }
          );
      });
    }

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient]);


  const handleCenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(CENTER, 15, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full" style={{ height: 520 }}>
      {/* Map container */}
      {isClient ? (
        <div
          ref={mapContainerRef}
          className="w-full h-full rounded-2xl overflow-hidden"
          style={{ zIndex: 0 }}
        />
      ) : (
        <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500 text-sm font-medium animate-pulse">Memuat peta...</span>
        </div>
      )}

      {/* ─── Center Button (Bottom Left) ──────────────────────────────────── */}
      <div
        className="absolute bottom-5 left-5 z-[1000]"
        style={{ zIndex: 1000 }}
      >
        <button
          onClick={handleCenter}
          title="Kembalikan ke posisi tengah"
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-[#7a1f2b] hover:text-white text-gray-700 dark:text-gray-300 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-extrabold transition-all flex items-center gap-1.5"
        >
          🎯 <span>Pusatkan</span>
        </button>
      </div>

      {/* ─── Legend Top-Left ─────────────────────────────────────────────── */}
      <div
        className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2.5 flex flex-col gap-1.5"
        style={{ zIndex: 1000 }}
      >
        <div className="text-[11px] font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-0.5">
          Legenda
        </div>
        {MARKERS.map((m) => (
          <div key={m.id} className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
            <span
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0"
              style={{ background: m.color }}
            />
            {m.label.length > 24 ? m.label.slice(0, 22) + '…' : m.label}
          </div>
        ))}
        <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
          <span className="w-3 h-3 rounded-sm border border-dashed border-[#228B57] bg-[#228B57]/30 flex-shrink-0" />
          Batas Wilayah Kelurahan
        </div>
      </div>
    </div>
  );
}
