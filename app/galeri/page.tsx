'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const galeriPlaceholder = [
  {
    id: -1,
    judul: 'Kerja Bakti & Gotong Royong Warga RW 01',
    kategori: 'Kemasyarakatan',
    deskripsi: 'Kegiatan gotong royong membersihkan saluran air dan pembenahan fasilitas umum kelurahan bersama warga dan mahasiswa KKN Posko 03.',
    foto_url: JSON.stringify([
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80'
    ]),
    tanggal: '2026-08-15',
  },
  {
    id: -2,
    judul: 'Pelatihan Digital Marketing UMKM Desa',
    kategori: 'KKN',
    deskripsi: 'Pendampingan pembuatan etalase online dan pemasaran produk lokal rumput laut bagi pelaku UMKM dan ibu-ibu PKK Bonto Lebang.',
    foto_url: JSON.stringify([
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'
    ]),
    tanggal: '2026-08-20',
  },
  {
    id: -3,
    judul: 'Panen Raya Rumput Laut Pesisir',
    kategori: 'Pemerintahan',
    deskripsi: 'Masyarakat dan kelompok nelayan pesisir Bonto Lebang melakukan panen raya rumput laut kualitas unggulan.',
    foto_url: JSON.stringify([
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80'
    ]),
    tanggal: '2026-08-25',
  },
  {
    id: -4,
    judul: 'Semarak Lomba Peringatan 17 Agustus',
    kategori: 'Kemasyarakatan',
    deskripsi: 'Berbagai perlombaan tradisional meriah yang diikuti oleh anak-anak, remaja, dan warga se-Kelurahan Bonto Lebang.',
    foto_url: JSON.stringify([
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80'
    ]),
    tanggal: '2026-08-17',
  },
  {
    id: -5,
    judul: 'Musyawarah Perencanaan Pembangunan (Musrenbang)',
    kategori: 'Pemerintahan',
    deskripsi: 'Rapat koordinasi tingkat kelurahan bersama tokoh masyarakat untuk menyusun prioritas pembangunan dan anggaran.',
    foto_url: JSON.stringify([
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80'
    ]),
    tanggal: '2026-08-28',
  },
  {
    id: -6,
    judul: 'Pengajian Rutin & Kegiatan Keagamaan Warga',
    kategori: 'Keagamaan',
    deskripsi: 'Dokumentasi kegiatan majelis taklim dan keagamaan di Masjid Kelurahan Bonto Lebang.',
    foto_url: JSON.stringify([
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80'
    ]),
    tanggal: '2026-08-10',
  }
];

function getFotos(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean).slice(0, 6);
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).slice(0, 6);
      } catch (e) { }
    }
    return [trimmed].filter(Boolean);
  }
  return [];
}

function parseDeskripsi(raw?: string | null): { deskripsi: string; lokasi: string } {
  if (!raw) return { deskripsi: '', lokasi: '' };
  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          deskripsi: parsed.deskripsi || parsed.text || '',
          lokasi: parsed.lokasi || '',
        };
      }
    } catch (e) { }
  }
  return { deskripsi: trimmed, lokasi: '' };
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function GaleriPage() {
  const [galeriData, setGaleriData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedKategori, setSelectedKategori] = useState('semua');
  const [selectedWaktu, setSelectedWaktu] = useState('semua'); // 'semua' | '1-minggu' | '1-bulan'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Lightbox modal state
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    async function fetchGaleriData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data && data.length > 0) {
        setGaleriData(data);
      } else {
        setGaleriData(galeriPlaceholder);
      }
      setLoading(false);
    }

    fetchGaleriData();
  }, []);

  // Filtered Items Calculation
  const filteredGaleri = galeriData.filter((item) => {
    // 1. Filter Kategori
    if (selectedKategori !== 'semua' && item.kategori !== selectedKategori) {
      return false;
    }

    // 2. Filter Waktu (1 Minggu / 1 Bulan Terakhir)
    if (selectedWaktu !== 'semua' && item.tanggal) {
      const itemDate = new Date(item.tanggal).getTime();
      const now = Date.now();
      const diffDays = (now - itemDate) / (1000 * 3600 * 24);

      if (selectedWaktu === '1-minggu') {
        if (isNaN(itemDate) || diffDays > 7 || diffDays < -1) return false;
      } else if (selectedWaktu === '1-bulan') {
        if (isNaN(itemDate) || diffDays > 30 || diffDays < -1) return false;
      }
    }

    // 3. Pencarian
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const parsed = parseDeskripsi(item.keterangan || item.deskripsi);
      const matchJudul = item.judul?.toLowerCase().includes(q);
      const matchDesc = parsed.deskripsi?.toLowerCase().includes(q);
      const matchLokasi = parsed.lokasi?.toLowerCase().includes(q);
      const matchKat = item.kategori?.toLowerCase().includes(q);
      if (!matchJudul && !matchDesc && !matchLokasi && !matchKat) return false;
    }

    return true;
  });

  const activeFiltersCount = (selectedKategori !== 'semua' ? 1 : 0) + (selectedWaktu !== 'semua' ? 1 : 0);

  const openLightbox = (item: any, initialIndex: number = 0) => {
    setActiveModalItem(item);
    setActiveSlideIndex(initialIndex);
  };

  const closeLightbox = () => {
    setActiveModalItem(null);
    setActiveSlideIndex(0);
  };

  const nextSlide = () => {
    if (!activeModalItem) return;
    const fotos = getFotos(activeModalItem.foto_url);
    if (fotos.length === 0) return;
    setActiveSlideIndex((prev) => (prev + 1) % fotos.length);
  };

  const prevSlide = () => {
    if (!activeModalItem) return;
    const fotos = getFotos(activeModalItem.foto_url);
    if (fotos.length === 0) return;
    setActiveSlideIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#7a1f2b] via-[#a91d3a] to-[#7a1f2b] text-white py-16 px-6 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-md">Galeri Kegiatan</h1>
        <p className="text-red-100 text-lg max-w-2xl mx-auto font-medium">
          Dokumentasi berbagai aktivitas warga, program kerja kelurahan, dan kegiatan KKN di Kelurahan Bonto Lebang.
        </p>
      </div>

      {/* Container Galeri & Filter */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14">

        {/* Bar Utama: Search Input + Tombol Filter Toggle */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 mb-6 transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Input Pencarian Utama */}
            <div className="relative w-full sm:w-80 md:w-96">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400"></span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul kegiatan atau lokasi..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a91d3a]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tombol Filter Toggle */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 border ${showFilterPanel || activeFiltersCount > 0
                ? 'bg-[#a91d3a] text-white border-[#7a1f2b] shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'
                }`}
            >
              <span>Filter Kegiatan</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#a91d3a] text-xs font-extrabold px-2 py-0.5 rounded-full shadow">
                  {activeFiltersCount}
                </span>
              )}
              <span className="text-xs transition-transform duration-200" style={{ transform: showFilterPanel ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                ▼
              </span>
            </button>

          </div>

          {/* Panel Opsi Filter (Hanya Muncul Jika Tombol Filter Diklik) */}
          {showFilterPanel && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/80 space-y-4">

              {/* 1. Filter Berdasarkan Kategori */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <span></span> Filter Berdasarkan Kategori:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'semua', label: 'Semua Kategori' },
                    { id: 'KKN', label: 'KKN Mahasiswa' },
                    { id: 'Kemasyarakatan', label: 'Kemasyarakatan' },
                    { id: 'Pemerintahan', label: 'Pemerintahan' },
                    { id: 'Keagamaan', label: 'Keagamaan' },
                  ].map((k) => (
                    <button
                      key={k.id}
                      onClick={() => setSelectedKategori(k.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${selectedKategori === k.id
                        ? 'bg-[#a91d3a] text-white shadow-sm font-bold'
                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                        }`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Filter Berdasarkan Rentang Waktu */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <span></span> Filter Berdasarkan Waktu:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'semua', label: 'Semua Waktu' },
                    { id: '1-minggu', label: '1 Minggu Terakhir' },
                    { id: '1-bulan', label: '1 Bulan Terakhir' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWaktu(w.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${selectedWaktu === w.id
                        ? 'bg-[#a91d3a] text-white shadow-sm font-bold'
                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                        }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Footer di Panel Filter */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/60 text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Status: <strong>{activeFiltersCount > 0 ? `${activeFiltersCount} filter aktif` : 'Semua ditampilkan'}</strong>
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedKategori('semua');
                      setSelectedWaktu('semua');
                    }}
                    className="text-[#a91d3a] dark:text-red-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Info Jumlah Hasil Filter */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-6 px-1">
          <span>Menampilkan <strong>{filteredGaleri.length}</strong> kegiatan</span>
          {(selectedKategori !== 'semua' || selectedWaktu !== 'semua' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedKategori('semua');
                setSelectedWaktu('semua');
                setSearchQuery('');
              }}
              className="text-[#a91d3a] dark:text-red-400 hover:underline font-semibold flex items-center gap-1"
            >
              Reset Filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400 font-medium">
            <span className="animate-spin inline-block mr-2 text-2xl"></span> Memuat galeri dokumentasi...
          </div>
        ) : filteredGaleri.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 my-6">
            <span className="text-5xl block mb-3"></span>
            <p className="font-bold text-lg text-gray-800 dark:text-white">Tidak Ada Kegiatan yang Cocok</p>
            <p className="text-xs text-gray-500 mt-1 mb-5">Coba ubah opsi filter atau kata kunci pencarian Anda.</p>
            <button
              onClick={() => {
                setSelectedKategori('semua');
                setSelectedWaktu('semua');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#a91d3a] hover:bg-[#7a1f2b] text-white font-semibold rounded-xl text-xs transition"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredGaleri.map((item: any) => {
              const fotos = getFotos(item.foto_url);
              const primaryFoto = fotos[0];
              const parsed = parseDeskripsi(item.keterangan || item.deskripsi);

              return (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between border border-gray-100 dark:border-gray-700"
                >
                  <div>
                    {/* Gambar Container dengan trigger slide */}
                    <div
                      onClick={() => openLightbox(item, 0)}
                      className="h-64 sm:h-72 w-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden flex items-center justify-center cursor-pointer"
                    >
                      {primaryFoto ? (
                        <img
                          src={primaryFoto}
                          alt={item.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-center text-gray-400 dark:text-gray-500 flex flex-col items-center">
                          <span className="text-6xl mb-2 opacity-50">📸</span>
                          <span className="text-sm font-medium">Foto Dokumentasi</span>
                        </div>
                      )}

                      {/* Lencana Kategori */}
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {item.kategori || 'Kegiatan'}
                      </div>

                      {/* Lencana Date */}
                      {item.tanggal && (
                        <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200 shadow">
                          {formatDate(item.tanggal)}
                        </div>
                      )}

                      {/* Indicator Slide Fotos (Maksimal 6 Foto) */}
                      {fotos.length > 0 && (
                        <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <span></span>
                          <span>{fotos.length > 1 ? `${fotos.length} Foto (Klik slide)` : '1 Foto'}</span>
                        </div>
                      )}
                    </div>

                    {/* Detail Info */}
                    <div className="p-5 md:p-6">
                      <h3
                        onClick={() => openLightbox(item, 0)}
                        className="text-xl font-extrabold text-gray-900 dark:text-white mb-1 leading-snug group-hover:text-[#a91d3a] dark:group-hover:text-red-400 transition-colors cursor-pointer"
                      >
                        {item.judul}
                      </h3>
                      <p className="text-xs font-semibold text-[#a91d3a] dark:text-red-400 mb-2 flex items-center gap-1">
                        <span></span> {parsed.lokasi || 'Kelurahan Bonto Lebang'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {parsed.deskripsi || 'Dokumentasi kegiatan resmi Kelurahan Bonto Lebang.'}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="px-5 pb-5 md:px-6 md:pb-6 pt-2">
                    <button
                      onClick={() => openLightbox(item, 0)}
                      className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-[#a91d3a] dark:text-red-300 font-bold py-3 px-4 rounded-xl border border-red-200 dark:border-red-800 flex items-center justify-center gap-2 text-sm transition-all"
                    >
                      <span></span>
                      <span>Lihat Foto Dokumentasi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Lightbox Modal Slide 3 Foto ─────────────────────────────────────── */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 transition-all duration-300 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">

            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-850">
              <div>
                <span className="bg-red-100 dark:bg-red-900/50 text-[#a91d3a] dark:text-red-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {activeModalItem.kategori || 'Kegiatan'}
                </span>
                <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white leading-tight mt-1">
                  {activeModalItem.judul}
                </h2>
              </div>
              <button
                onClick={closeLightbox}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-600 hover:text-white transition flex items-center justify-center font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Container Slide Gambar */}
            {(() => {
              const modalFotos = getFotos(activeModalItem.foto_url);
              const currentFoto = modalFotos[activeSlideIndex] || modalFotos[0];
              const hasMultiple = modalFotos.length > 1;
              const modalParsed = parseDeskripsi(activeModalItem.keterangan || activeModalItem.deskripsi);

              return (
                <div className="flex-1 overflow-y-auto">
                  <div className="relative h-72 sm:h-96 w-full bg-slate-950 flex items-center justify-center select-none overflow-hidden">
                    {currentFoto ? (
                      <img
                        src={currentFoto}
                        alt={`${activeModalItem.judul} foto ${activeSlideIndex + 1}`}
                        className="w-full h-full object-contain transition-all duration-300"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">Tidak ada foto dokumentasi</div>
                    )}

                    {/* Tombol Panah Kiri (Prev) */}
                    {hasMultiple && (
                      <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white hover:bg-black/90 hover:scale-110 active:scale-95 transition flex items-center justify-center font-bold text-xl shadow-lg border border-white/20"
                        title="Foto Sebelumnya"
                      >
                        ‹
                      </button>
                    )}

                    {/* Tombol Panah Kanan (Next) */}
                    {hasMultiple && (
                      <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white hover:bg-black/90 hover:scale-110 active:scale-95 transition flex items-center justify-center font-bold text-xl shadow-lg border border-white/20"
                        title="Foto Selanjutnya"
                      >
                        ›
                      </button>
                    )}

                    {/* Counter Badge Foto 1 dari 3 */}
                    {hasMultiple && (
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 shadow">
                        Foto {activeSlideIndex + 1} dari {modalFotos.length}
                      </div>
                    )}

                    {/* Indicator Dots */}
                    {hasMultiple && (
                      <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-2">
                        {modalFotos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`h-2.5 rounded-full transition-all ${idx === activeSlideIndex
                              ? 'w-8 bg-[#a91d3a] shadow-md'
                              : 'w-2.5 bg-white/50 hover:bg-white'
                              }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Strip Thumbnail 3 Foto */}
                  {hasMultiple && (
                    <div className="bg-slate-900 p-3 flex justify-center items-center gap-3 border-t border-slate-800">
                      {modalFotos.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSlideIndex(idx)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${idx === activeSlideIndex
                            ? 'border-[#a91d3a] scale-105 shadow-md shadow-red-500/30 ring-2 ring-red-500/50'
                            : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                          <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Detail Info */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Tanggal: {formatDate(activeModalItem.tanggal)}</span>
                      <span className="font-semibold text-[#a91d3a] dark:text-red-400">
                        📍 {modalParsed.lokasi || 'Kelurahan Bonto Lebang'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {modalParsed.deskripsi || 'Dokumentasi kegiatan resmi Kelurahan Bonto Lebang.'}
                    </p>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}
    </div>
  );
}
