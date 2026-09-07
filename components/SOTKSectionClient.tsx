'use client';

import { useState } from 'react';

interface Pejabat {
  id?: number | string;
  nama: string;
  jabatan: string;
  foto_url: string | null;
}

export default function SOTKSectionClient({ pejabatList }: { pejabatList: Pejabat[] }) {
  const [showAll, setShowAll] = useState(false);

  // Tampilkan 4 pejabat utama di baris awal
  const INITIAL_COUNT = 4;
  const displayedPejabat = showAll ? pejabatList : pejabatList.slice(0, INITIAL_COUNT);

  return (
    <section id="sotk" className="bg-[#F8F9FA] dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-[40px] md:text-[44px] font-black text-[#A91D3A] font-['Poppins'] tracking-tight leading-none mb-2">
          SOTK
        </h2>
        <p className="text-base text-[#1A1A1A] dark:text-gray-300 font-normal max-w-2xl mx-auto">
          Struktur Organisasi dan Tata Kerja Kelurahan Bonto Lebang
        </p>
      </div>

      {/* Grid 4 Kartu Pejabat Studio Style (Rapat ~4-8px) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full">
        {displayedPejabat.map((pejabat, idx) => (
          <div key={pejabat.id || idx} className="flex flex-col bg-white dark:bg-gray-900 overflow-hidden border border-gray-200 dark:border-gray-700 transition duration-300 hover:shadow-md animate-in fade-in zoom-in-95">
            {/* Foto Pas Foto Studio Formal (Aspect 3:4, Tanpa Rounded, Tanpa Shadow) */}
            <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
              {pejabat.foto_url ? (
                <img
                  src={pejabat.foto_url}
                  alt={pejabat.nama}
                  className="w-full h-full object-cover rounded-none"
                />
              ) : (
                <div className="w-full h-full bg-[#E9ECEF] dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-6xl mb-2">👤</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center px-2">{pejabat.jabatan}</span>
                </div>
              )}
            </div>

            {/* Banner Solid Merah (Menempel Langsung di Bawah Foto) */}
            <div className="bg-[#A91D3A] text-white p-4 flex flex-col justify-center min-h-[85px]">
              <h3 className="font-bold text-white text-[18px] md:text-[20px] leading-snug line-clamp-1">
                {pejabat.nama}
              </h3>
              <p className="text-red-100 text-[14px] font-normal mt-0.5">
                {pejabat.jabatan}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Lihat Lainnya */}
      {pejabatList.length > INITIAL_COUNT && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 bg-[#6B1124] hover:bg-[#A91D3A] text-white font-bold px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md text-xs cursor-pointer"
          >
            <span>{showAll ? 'Tampilkan Lebih Sedikit' : 'Lihat Lainnya'}</span>
            <span className="text-xs">{showAll ? '↑' : '↓'}</span>
          </button>
        </div>
      )}
    </section>
  );
}
