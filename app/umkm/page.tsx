'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const umkmPlaceholder: any[] = [];

function getFotos(item: any): string[] {
  const raw = item.gambar_url || item.foto_url;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean).slice(0, 3);
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).slice(0, 3);
      } catch (e) { }
    }
    return [trimmed].filter(Boolean);
  }
  return [];
}

function getWaUrl(kontak: string | null | undefined, namaProduk: string) {
  if (!kontak) return null;
  const digits = kontak.replace(/\D/g, '');
  if (!digits) return null;
  const phone = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
  const text = encodeURIComponent(`Halo, saya tertarik dengan produk ${namaProduk} di Kelurahan Bonto Lebang.`);
  return `https://wa.me/${phone}?text=${text}`;
}

export default function UMKMPage() {
  const [umkmData, setUmkmData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox Modal state
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    async function fetchUMKMData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('umkm')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUmkmData(data);
      } else {
        setUmkmData([]);
      }
      setLoading(false);
    }

    fetchUMKMData();
  }, []);

  // Filtered UMKM Calculation
  const filteredUmkm = umkmData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchNama = item.nama_produk?.toLowerCase().includes(q);
    const matchPemilik = item.pemilik?.toLowerCase().includes(q);
    const matchDesc = item.deskripsi?.toLowerCase().includes(q);
    const matchHarga = String(item.kategori || item.harga || '').toLowerCase().includes(q);
    return matchNama || matchPemilik || matchDesc || matchHarga;
  });

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
    const fotos = getFotos(activeModalItem);
    if (fotos.length === 0) return;
    setActiveSlideIndex((prev) => (prev + 1) % fotos.length);
  };

  const prevSlide = () => {
    if (!activeModalItem) return;
    const fotos = getFotos(activeModalItem);
    if (fotos.length === 0) return;
    setActiveSlideIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#7a1f2b] via-[#a91d3a] to-[#7a1f2b] text-white py-16 px-6 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-md">Potensi & Produk UMKM</h1>
        <p className="text-red-100 text-lg max-w-2xl mx-auto font-medium">
          Etalase promosi produk unggulan lokal dan karya usaha warga Kelurahan Bonto Lebang.
        </p>
      </div>

      {/* Info pendaftaran */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pt-6">
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          Untuk pengajuan pendaftaran data Potensi dan UMKM, silakan menghubungi layanan kontak WhatsApp.
        </p>
      </div>

      {/* Rapat Kanan Kiri Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14">

        {/* Bar Pencarian Produk UMKM */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 mb-8 transition-all">
          <div className="relative w-full max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama produk UMKM, pemilik, atau harga..."
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a91d3a]"
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
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400 font-medium">
            <span className="animate-spin inline-block mr-2 text-2xl">⏳</span> Memuat katalog produk UMKM...
          </div>
        ) : filteredUmkm.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 my-6">
            <p className="font-bold text-lg text-gray-800 dark:text-white">Produk Tidak Ditemukan</p>
            <p className="text-xs text-gray-500 mt-1 mb-4">Tidak ada produk UMKM yang cocok dengan kata kunci "{searchQuery}".</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-[#a91d3a] hover:bg-[#7a1f2b] text-white font-semibold rounded-xl text-xs transition"
            >
              Bersihkan Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredUmkm.map((item: any) => {
              const kontakHp = item.kontak_wa || item.kontak;
              const waUrl = getWaUrl(kontakHp, item.nama_produk);
              const fotos = getFotos(item);
              const displayFoto = fotos[0];

              let displayHarga = item.kategori || item.harga;
              if (typeof displayHarga === 'number') {
                displayHarga = `Rp ${displayHarga.toLocaleString('id-ID')}`;
              }

              return (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between border border-gray-100 dark:border-gray-700"
                >
                  <div>
                    {/* Gambar Produk dengan trigger modal slide */}
                    <div
                      onClick={() => openLightbox(item, 0)}
                      className="h-64 sm:h-72 md:h-80 w-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden flex items-center justify-center cursor-pointer"
                    >
                      {displayFoto ? (
                        <img
                          src={displayFoto}
                          alt={item.nama_produk}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-center text-gray-400 dark:text-gray-500 flex flex-col items-center">
                          <span className="text-6xl mb-2">🛍️</span>
                          <span className="text-sm font-medium">Foto Produk</span>
                        </div>
                      )}

                      {/* Indicator Slide Fotos (Maksimal 3 Foto) */}
                      {fotos.length > 0 && (
                        <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <span></span>
                          <span>{fotos.length > 1 ? `${fotos.length} Foto (Klik slide)` : '1'}</span>
                        </div>
                      )}

                      {/* Badge Harga */}
                      {displayHarga && (
                        <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-gray-100 dark:border-gray-700">
                          <span className="font-extrabold text-[#7a1f2b] dark:text-red-400 text-sm">
                            {displayHarga}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Detail Produk */}
                    <div className="p-5 md:p-6 flex flex-col">
                      <h3
                        onClick={() => openLightbox(item, 0)}
                        className="text-xl font-extrabold text-gray-900 dark:text-white mb-1.5 leading-snug group-hover:text-[#a91d3a] transition-colors cursor-pointer"
                      >
                        {item.nama_produk}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5 font-medium">
                        <span>👤</span> {item.pemilik || 'Warga Bonto Lebang'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>

                  {/* Tombol Hubungi Penjual */}
                  <div className="px-5 pb-5 md:px-6 md:pb-6 pt-2">
                    {waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-[#7a1f2b] to-[#a91d3a] hover:from-[#6b1124] hover:to-[#7a1f2b] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm tracking-wide transition-all transform active:scale-95"
                      >
                        <span className="text-lg">💬</span>
                        <span>Hubungi Penjual</span>
                      </a>
                    ) : (
                      <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-medium py-3 px-4 rounded-xl text-center text-sm">
                        Kontak Belum Tersedia
                      </div>
                    )}
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
                <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white leading-tight">
                  {activeModalItem.nama_produk}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  👤 Pemilik: {activeModalItem.pemilik || 'Warga Bonto Lebang'}
                </p>
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
              const modalFotos = getFotos(activeModalItem);
              const currentFoto = modalFotos[activeSlideIndex] || modalFotos[0];
              const hasMultiple = modalFotos.length > 1;

              return (
                <div className="flex-1 overflow-y-auto">
                  <div className="relative h-72 sm:h-96 w-full bg-slate-950 flex items-center justify-center select-none overflow-hidden">
                    {currentFoto ? (
                      <img
                        src={currentFoto}
                        alt={`${activeModalItem.nama_produk} foto ${activeSlideIndex + 1}`}
                        className="w-full h-full object-contain transition-all duration-300"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">Tidak ada foto produk</div>
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
                              ? 'w-8 bg-red-500 shadow-md'
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
                            ? 'border-red-500 scale-105 shadow-md shadow-red-500/30 ring-2 ring-red-500/50'
                            : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                          <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Detail Info & CTA */}
                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                          Etalase UMKM
                        </span>
                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                          {activeModalItem.nama_produk}
                        </h3>
                      </div>

                      {/* Tag Harga */}
                      {activeModalItem.harga && (
                        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-[#7a1f2b] dark:text-red-300 px-4 py-2 rounded-2xl font-extrabold text-base">
                          {activeModalItem.kategori || (typeof activeModalItem.harga === 'number' ? `Rp ${activeModalItem.harga.toLocaleString('id-ID')}` : activeModalItem.harga)}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {activeModalItem.deskripsi}
                    </p>

                    {/* Button WA Contact */}
                    {getWaUrl(activeModalItem.kontak_wa || activeModalItem.kontak, activeModalItem.nama_produk) && (
                      <a
                        href={getWaUrl(activeModalItem.kontak_wa || activeModalItem.kontak, activeModalItem.nama_produk)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-[#7a1f2b] to-[#a91d3a] hover:from-[#6b1124] hover:to-[#7a1f2b] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base transition-all transform active:scale-95 mt-2"
                      >
                        <span className="text-xl">💬</span>
                        <span>Pesan via WhatsApp Sekarang</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* Catatan bawah halaman */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pb-4">
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          Untuk pengajuan pendaftaran data Potensi dan UMKM, silakan menghubungi layanan kontak WhatsApp.
        </p>
      </div>
    </div>
  );
}
