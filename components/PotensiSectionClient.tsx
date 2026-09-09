'use client';

import { useState, useEffect } from 'react';

type PotensiItem = {
  id: number;
  judul: string;
  kategori?: string | null;
  deskripsi: string;
  ikon?: string | null;
  foto_url?: string | null;
  lokasi?: string;
  pengelola?: string;
  kontak?: string;
  deskripsi_lengkap_1?: string;
  deskripsi_lengkap_2?: string;
};

export default function PotensiSectionClient({ potensiList }: { potensiList: any[] }) {
  const [selectedItem, setSelectedItem] = useState<PotensiItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const list: PotensiItem[] = (potensiList || []).map((p) => ({
    ...p,
    kategori: p.kategori || 'Wisata Unggulan',
    foto_url: p.foto_url || null,
  }));

  // Auto-slide carousel setiap 5 detik
  useEffect(() => {
    if (list.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [list.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  if (list.length === 0) {
    return null;
  }

  return (
    <section className="pt-16 pb-16 md:pb-20 bg-[#F0F4F8] dark:bg-gray-900 w-full overflow-hidden">
      {/* Heading Kecil di Atas Carousel (Tetap Berjarak Rapi) */}
      <div className="max-w-6xl mx-auto text-center mb-8 px-6">
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 40px)',
            fontWeight: 900,
            color: '#A91D3A',
            fontFamily: "'Poppins', sans-serif",
            marginBottom: '6px',
          }}
        >
          Potensi Unggulan
        </h2>
        <p className="text-[#1A1A1A] dark:text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          Destinasi wisata terbaik di Kelurahan Bonto Lebang yang wajib dikunjungi
        </p>
      </div>

      {/* Full-width Carousel Container */}
      <div className="relative w-full h-[450px] sm:h-[480px] md:h-[520px] overflow-hidden bg-gray-900 group">
        {/* Slide Images & Overlay */}
        {list.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            {item.foto_url ? (
              <img
                src={item.foto_url}
                alt={item.judul}
                className="w-full h-full object-cover object-center absolute inset-0"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#6B1124] to-gray-900 flex items-center justify-center">
                <span className="text-8xl">{item.ikon || '🏝️'}</span>
              </div>
            )}
            {/* Overlay gelap di atas foto */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/85 via-black/55 to-black/35 backdrop-blur-[0.5px]"></div>
          </div>
        ))}

          {/* Slide Content Overlay (Center Aligned) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 z-10 max-w-4xl mx-auto">
            {/* Judul Nama Potensi */}
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(26px, 3.8vw, 40px)',
                lineHeight: 1.2,
              }}
              className="font-extrabold text-white mb-4 drop-shadow-md tracking-tight"
            >
              {list[currentIndex].judul}
            </h3>

            {/* Deskripsi Singkat */}
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(14px, 1.6vw, 17px)',
              }}
              className="text-gray-100 dark:text-gray-200 max-w-2xl leading-relaxed mb-7 drop-shadow text-center line-clamp-2"
            >
              {list[currentIndex].deskripsi}
            </p>

            {/* Tombol Lihat Detail (Membuka Modal) */}
            <button
              type="button"
              onClick={() => setSelectedItem(list[currentIndex])}
              className="inline-flex items-center justify-center bg-[#A91D3A] hover:bg-[#6B1124] text-white font-bold px-8 py-3 rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-sm md:text-base cursor-pointer"
            >
              Lihat Detail
            </button>
          </div>

          {/* Panah Navigasi Kiri & Kanan */}
          <button
            onClick={prevSlide}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/75 text-white transition-all duration-200 z-20 backdrop-blur-md border border-white/10 cursor-pointer"
            aria-label="Slide sebelumnya"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/75 text-white transition-all duration-200 z-20 backdrop-blur-md border border-white/10 cursor-pointer"
            aria-label="Slide berikutnya"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {list.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  index === currentIndex
                    ? 'bg-[#A91D3A] w-7 h-3 shadow-md'
                    : 'bg-white/50 hover:bg-white/90 w-3 h-3'
                }`}
                aria-label={`Ke slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

      {/* ── Modal / Popup Detail Potensi ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-[620px] max-h-[85vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close (✕) di Pojok Kanan Atas */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center font-bold text-lg shadow-md hover:bg-red-50 hover:text-[#A91D3A] transition cursor-pointer"
              aria-label="Tutup Modal"
            >
              ✕
            </button>

            {/* Header / Banner Modal */}
            <div className="relative w-full h-[190px] bg-gradient-to-r from-[#FDECEA] via-[#FFEBEE] to-[#FFCDD2] dark:from-red-950/40 dark:to-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
              {selectedItem.foto_url ? (
                <img
                  src={selectedItem.foto_url}
                  alt={selectedItem.judul}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl drop-shadow-md animate-bounce">{selectedItem.ikon || '🏝️'}</span>
              )}

              {/* Overlay Tipis pada Gambar */}
              {selectedItem.foto_url && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              )}
            </div>

            {/* Konten Teks Modal (Scrollable jika panjang) */}
            <div className="p-6 md:p-7 overflow-y-auto space-y-5">
              {/* Judul Potensi */}
              <h3 className="text-2xl font-bold text-[#A91D3A] dark:text-red-400 leading-snug">
                {selectedItem.id === 3 ? 'Budidaya Rumput Laut' : selectedItem.judul}
              </h3>

              {/* Deskripsi Lengkap */}
              <div className="text-[#1A1A1A] dark:text-gray-300 text-sm md:text-base leading-relaxed space-y-3">
                <p>{selectedItem.deskripsi_lengkap_1 || selectedItem.deskripsi}</p>
                {selectedItem.deskripsi_lengkap_2 && <p>{selectedItem.deskripsi_lengkap_2}</p>}
              </div>

              {/* Info Tambahan */}
              <div className="bg-[#F0F4F8] dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200/70 dark:border-gray-600 text-xs md:text-sm space-y-2">
                {selectedItem.lokasi && (
                  <div className="flex items-start gap-2">
                    <span className="text-base">📍</span>
                    <div>
                      <span className="font-semibold text-gray-500 dark:text-gray-400">Lokasi: </span>
                      <span className="font-bold text-[#1A1A1A] dark:text-white">{selectedItem.lokasi}</span>
                    </div>
                  </div>
                )}
                {selectedItem.pengelola && (
                  <div className="flex items-start gap-2">
                    <span className="text-base">👥</span>
                    <div>
                      <span className="font-semibold text-gray-500 dark:text-gray-400">Pengelola: </span>
                      <span className="font-bold text-[#1A1A1A] dark:text-white">{selectedItem.pengelola}</span>
                    </div>
                  </div>
                )}
                {selectedItem.kontak && (
                  <div className="flex items-start gap-2">
                    <span className="text-base">📞</span>
                    <div>
                      <span className="font-semibold text-gray-500 dark:text-gray-400">Kontak: </span>
                      <span className="font-bold text-[#1A1A1A] dark:text-white">{selectedItem.kontak}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 text-xs md:text-sm font-semibold text-[#A91D3A] border border-[#A91D3A] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
