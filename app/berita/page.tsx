'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export const beritaPlaceholder: any[] = [];

function formatBadgeDate(dateStr: string) {
  if (!dateStr) return { dayMonth: '01 JAN', year: '2026' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { dayMonth: dateStr, year: '' };

  const day = d.getDate();
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  return {
    dayMonth: `${day} ${month}`,
    year: `${year}`,
  };
}

function parseRingkasanPenulis(rawRingkasan?: string | null) {
  if (!rawRingkasan) return { ringkasan: '', penulis: 'Redaksi Kelurahan', views: 0 };
  const trimmed = rawRingkasan.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          ringkasan: parsed.ringkasan || '',
          penulis: parsed.penulis || 'Redaksi Kelurahan',
          views: typeof parsed.views === 'number' ? parsed.views : (Number(parsed.views) || 0),
        };
      }
    } catch (e) { }
  }
  return { ringkasan: trimmed, penulis: 'Redaksi Kelurahan', views: 0 };
}

export default function BeritaPage() {
  const [beritaList, setBeritaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter states
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<'semua' | 'berita' | 'pengumuman'>('semua');
  const [selectedWaktu, setSelectedWaktu] = useState<'semua' | 'hari_ini' | 'minggu_ini' | 'bulan_ini'>('semua');

  useEffect(() => {
    async function fetchBerita() {
      setLoading(true);
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((item: any) => {
          const parsed = parseRingkasanPenulis(item.ringkasan);
          return {
            ...item,
            foto_url: item.foto_url || item.gambar_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
            penulis: item.penulis || parsed.penulis || 'Redaksi Kelurahan',
            views: parsed.views || 0,
            ringkasan: parsed.ringkasan || item.isi || 'Informasi pengumuman dan berita resmi dari Kelurahan Bonto Lebang.'
          };
        });

        setBeritaList(mapped);
      } else {
        setBeritaList(beritaPlaceholder);
      }
      setLoading(false);
    }

    fetchBerita();
  }, []);

  // Filter logic
  const now = new Date();
  const filteredList = beritaList.filter((item: any) => {
    // 1. Kategori Filter
    const kat = item.kategori?.toLowerCase() || '';
    if (selectedKategori === 'berita' && kat.includes('pengumuman')) return false;
    if (selectedKategori === 'pengumuman' && !kat.includes('pengumuman')) return false;

    // 2. Time Filter
    if (selectedWaktu !== 'semua') {
      if (!item.tanggal) return false;
      const itemDate = new Date(item.tanggal);
      if (isNaN(itemDate.getTime())) return true;

      const diffMs = now.getTime() - itemDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (selectedWaktu === 'hari_ini') {
        const isToday =
          itemDate.getDate() === now.getDate() &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear();
        if (!isToday && diffDays > 1) return false;
      } else if (selectedWaktu === 'minggu_ini') {
        if (diffDays > 7 || diffDays < 0) return false;
      } else if (selectedWaktu === 'bulan_ini') {
        if (diffDays > 30 || diffDays < 0) return false;
      }
    }

    return true;
  });

  const activeFiltersCount = (selectedKategori !== 'semua' ? 1 : 0) + (selectedWaktu !== 'semua' ? 1 : 0);

  const resetFilters = () => {
    setSelectedKategori('semua');
    setSelectedWaktu('semua');
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleItems = filteredList.slice(0, visibleCount);
  const hasMore = visibleCount < filteredList.length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 pb-20">

      {/* ─── Header Section ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200/80 dark:border-gray-700 py-12 md:py-16 px-6 text-center shadow-xs">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-[#7a1f2b] dark:text-red-400 tracking-tight drop-shadow-xs">
            Berita Kelurahan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Menyajikan informasi terbaru tentang peristiwa, berita terkini, dan artikel-artikel jurnalistik dari Kelurahan Bonto Lebang
          </p>
        </div>
      </div>

      {/* ─── Main Container ─────────────────────────────────────────────── */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">

        {/* ─── Filter Toggle Button & Control Panel ───────────────────────── */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-end gap-3">
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Reset Filter
              </button>
            )}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-[#7a1f2b] dark:text-red-300 border-2 border-[#7a1f2b]/30 dark:border-red-900/50 rounded-2xl text-sm font-extrabold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <span>Filter Kegiatan</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#7a1f2b] text-white text-[11px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <span className="text-xs transition-transform duration-200" style={{ transform: showFilterPanel ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                ▼
              </span>
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilterPanel && (
            <div className="p-5 md:p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-md space-y-5 animate-fadeIn">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Filter Kategori (Berita / Pengumuman) */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2.5">
                    Kategori Laporan
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'semua', label: 'Semua Kategori' },
                      { id: 'berita', label: 'Berita' },
                      { id: 'pengumuman', label: 'Pengumuman' },
                    ].map((k) => (
                      <button
                        key={k.id}
                        onClick={() => setSelectedKategori(k.id as any)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${selectedKategori === k.id
                            ? 'bg-[#7a1f2b] text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Filter Waktu (Hari Ini, Minggu Ini, Bulan Ini) */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2.5">
                    Rentang Waktu
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'semua', label: 'Semua Waktu' },
                      { id: 'hari_ini', label: 'Hari Ini' },
                      { id: 'minggu_ini', label: 'Minggu Ini' },
                      { id: 'bulan_ini', label: 'Bulan Ini' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWaktu(w.id as any)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${selectedWaktu === w.id
                            ? 'bg-[#7a1f2b] text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* ─── Grid Kartu Berita ─────────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400 font-medium">
            <span className="animate-spin inline-block mr-2 text-2xl"></span> Memuat berita kelurahan...
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="p-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
            <span className="text-5xl block mb-3"></span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Berita Tidak Ditemukan</h3>
            <p className="text-xs text-gray-400 mt-1 mb-4 max-w-sm mx-auto">
              Tidak ada berita atau pengumuman yang sesuai dengan filter kategori atau rentang waktu yang Anda pilih.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#7a1f2b] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#a91d3a] transition"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <>
            {/* Grid 3 Kolom Sejajar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visibleItems.map((item: any) => {
                const badgeDate = formatBadgeDate(item.tanggal);
                const detailUrl = `/berita/${item.id}`;
                const viewsCount = item.views || Math.floor(Math.abs(Math.sin(item.id || 1) * 350) + 120);

                return (
                  <article
                    key={item.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/70 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* 1. Foto Full Width (Rasio 4:3) */}
                      <Link href={detailUrl} className="block relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <img
                          src={item.foto_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
                          alt={item.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Label Badge BERITA vs PENGUMUMAN */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className={`px-3 py-1 rounded-xl text-[11px] font-black tracking-wider uppercase shadow-lg backdrop-blur-md flex items-center gap-1 ${item.kategori?.toLowerCase() === 'pengumuman'
                              ? 'bg-rose-600 text-white border border-rose-400/40'
                              : 'bg-[#7a1f2b] text-white border border-red-300/40'
                            }`}>
                            {item.kategori?.toLowerCase() === 'pengumuman' ? 'PENGUMUMAN' : 'BERITA'}
                          </span>
                        </div>

                        {/* 2. Overlay Gelap Gradient di pojok kiri bawah foto (opsional jam, tanggal, lokasi) */}
                        {item.lokasi_jam && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex items-center justify-between text-white text-xs font-semibold">
                            <span className="flex items-center gap-1 drop-shadow-sm">
                              <span></span> {item.lokasi_jam}
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Content Info */}
                      <div className="p-5 md:p-6 space-y-3">
                        {/* Keterangan / Label Kategori */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${item.kategori?.toLowerCase() === 'pengumuman'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-red-100 text-[#7a1f2b] dark:bg-red-950/60 dark:text-red-300'
                            }`}>
                            {item.kategori?.toLowerCase() === 'pengumuman' ? 'Pengumuman Resmi' : 'Berita Utama'}
                          </span>
                        </div>

                        {/* 3. Judul Berita — max 2 baris (line-clamp-2) */}
                        <Link href={detailUrl} className="block">
                          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#7a1f2b] dark:group-hover:text-red-400 transition-colors">
                            {item.judul}
                          </h2>
                        </Link>

                        {/* 4. Cuplikan Isi — 2-3 baris preview (line-clamp-3) */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                          {item.ringkasan || item.isi || 'Informasi terbaru mengenai kegiatan dan pengumuman resmi Kelurahan Bonto Lebang.'}
                        </p>
                      </div>
                    </div>

                    {/* 5. Footer Kartu (Baris Bawah Flex Space-Between) */}
                    <div className="px-5 pb-5 md:px-6 md:pb-6 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-3">

                      {/* Left: Penulis 👤 & Dilihat 👁 */}
                      <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <p className="flex items-center gap-1.5 truncate max-w-[170px]">
                          <span>👤</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">
                            {item.penulis || 'Redaksi Kelurahan'}
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                          <span>👁</span>
                          <span>Dilihat {viewsCount} kali</span>
                        </p>
                      </div>

                      {/* Right: Badge Tanggal — kotak kecil background merah muda/pastel, 2 baris */}
                      <div className="bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/40 rounded-xl px-3 py-1.5 text-center flex-shrink-0 shadow-xs">
                        <span className="block text-xs font-black text-[#7a1f2b] dark:text-red-300 leading-none">
                          {badgeDate.dayMonth}
                        </span>
                        <span className="block text-[10px] font-bold text-red-500/80 dark:text-red-400 leading-none mt-1">
                          {badgeDate.year}
                        </span>
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>

            {/* Elemen Tambahan: Tombol "Muat Lebih Banyak" */}
            {hasMore && (
              <div className="text-center pt-12">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3.5 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#7a1f2b] dark:text-red-300 border-2 border-[#7a1f2b]/30 dark:border-red-900/50 font-extrabold rounded-2xl text-sm transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  Muat Lebih Banyak Berita ↓
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
