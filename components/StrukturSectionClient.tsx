'use client';

import { useState } from 'react';

interface Pegawai {
  id: number;
  jabatan: string;
  nama: string;
  foto_url: string | null;
}

export default function StrukturSectionClient({ struktur }: { struktur: Pegawai[] }) {
  const [showAll, setShowAll] = useState(false);

  // Default 8 orang (4 per baris x 2 baris)
  const INITIAL_COUNT = 8;
  const displayedStruktur = showAll ? struktur : struktur.slice(0, INITIAL_COUNT);

  return (
    <section
      id="struktur-pemerintahan"
      style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)" }}
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-y border-gray-200 dark:border-gray-700 py-16 px-6 md:px-12 shadow-sm my-8"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#A91D3A] font-['Poppins'] mb-2">
              Struktur Pemerintahan
            </h2>
            <p className="text-base text-[#1A1A1A] dark:text-gray-400">
              Daftar pejabat dan staf pengelola Kelurahan Bonto Lebang.
            </p>
          </div>
          {struktur.length > INITIAL_COUNT && (
            <span className="text-sm font-bold text-[#A91D3A] bg-red-50 dark:bg-red-950/40 px-4 py-2 rounded-full border border-red-100 dark:border-red-900 shadow-sm self-start md:self-auto">
              Menampilkan {displayedStruktur.length} dari {struktur.length} Anggota
            </span>
          )}
        </div>

        {/* 4 Kartu Per Baris (2 Baris Awal = 8 Orang) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8 w-full">
          {displayedStruktur.map((pegawai) => (
            <div
              key={pegawai.id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition duration-300 w-full animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="w-full aspect-[3/4] rounded-2xl bg-[#F0F4F8] dark:bg-gray-700 flex items-center justify-center overflow-hidden mb-5 border border-gray-200 dark:border-gray-600 shadow-sm flex-shrink-0">
                {pegawai.foto_url ? (
                  <img
                    src={pegawai.foto_url}
                    alt={pegawai.nama}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-6xl md:text-7xl">👤</span>
                )}
              </div>
              <p className="text-xs md:text-sm font-extrabold text-[#A91D3A] dark:text-red-400 uppercase tracking-wider mb-1.5 line-clamp-1">
                {pegawai.jabatan}
              </p>
              <h3 className="font-extrabold text-[#1A1A1A] dark:text-white text-lg md:text-xl line-clamp-2 leading-snug">
                {pegawai.nama}
              </h3>
            </div>
          ))}
        </div>

        {/* Tombol Lihat Lainnya */}
        {struktur.length > INITIAL_COUNT && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2.5 bg-[#6B1124] hover:bg-[#A91D3A] text-white font-extrabold px-9 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl text-base cursor-pointer transform hover:scale-105"
            >
              <span>{showAll ? 'Tampilkan Lebih Sedikit' : 'Lihat Lainnya (Tampilkan Semua)'}</span>
              <span className="text-lg">{showAll ? '↑' : '↓'}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
