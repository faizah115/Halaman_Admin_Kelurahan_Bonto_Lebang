'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { beritaPlaceholder } from '../page';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '01 Januari 2026';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

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

export default function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [beritaItem, setBeritaItem] = useState<any>(null);
  const [sidebarBerita, setSidebarBerita] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Fetch all berita from Supabase
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .order('tanggal', { ascending: false });

      let list = beritaPlaceholder;
      if (!error && data && data.length > 0) {
        const mapped = data.map((item: any) => {
          const parsed = parseRingkasanPenulis(item.ringkasan);
          return {
            ...item,
            foto_url: item.foto_url || item.gambar_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
            penulis: item.penulis || parsed.penulis || 'Redaksi Kelurahan',
            views: parsed.views || 0,
            ringkasan: parsed.ringkasan || item.isi || 'Informasi pengumuman dan berita resmi dari Kelurahan Bonto Lebang.',
            raw_ringkasan_text: parsed.ringkasan || '',
          };
        });

        list = mapped;
      }

      // Find current article
      const found = list.find((b: any) => String(b.id) === String(id)) || list[0];

      if (found) {
        let currentViews = (found.views || 0);

        // Check session to increment views once per session per visitor
        const sessionKey = `viewed_berita_${found.id}`;
        if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, 'true');
          currentViews += 1;

          // Save incremented view count to Supabase JSON ringkasan payload
          if (found.id && !found.is_placeholder) {
            const updatedRingkasanPayload = JSON.stringify({
              ringkasan: found.raw_ringkasan_text || found.ringkasan || '',
              penulis: found.penulis || 'Humas Kelurahan',
              views: currentViews,
            });

            supabase
              .from('berita')
              .update({ ringkasan: updatedRingkasanPayload })
              .eq('id', found.id)
              .then();
          }
        }

        found.views = currentViews;
        setBeritaItem(found);
      }

      // Filter sidebar list (5-7 items excluding current)
      const sidebarItems = list.filter((b: any) => String(b.id) !== String(found?.id)).slice(0, 6);
      setSidebarBerita(sidebarItems);

      setLoading(false);
    }

    loadData();
  }, [id]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTitle = beritaItem ? encodeURIComponent(beritaItem.judul) : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 py-20 text-center text-gray-500 font-medium">
        <span className="animate-spin inline-block mr-2 text-2xl">⏳</span> Memuat detail artikel berita...
      </div>
    );
  }

  if (!beritaItem) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 py-20 text-center text-gray-500">
        <p className="text-xl font-bold mb-4">Berita tidak ditemukan.</p>
        <Link href="/berita" className="px-5 py-2.5 bg-[#7a1f2b] text-white rounded-xl text-sm font-bold">
          Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

  const viewsCount = beritaItem?.views || 1;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 pb-20 pt-6 md:pt-10">
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── 1. Breadcrumb ───────────────────────────────────────────── */}
        <nav className="mb-6 flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
          <Link href="/" className="hover:text-[#7a1f2b] transition"></Link>
          <span>/</span>
          <Link href="/berita" className="hover:text-[#7a1f2b] transition">Berita Kelurahan</Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold truncate max-w-[250px] sm:max-w-[400px]">
            {beritaItem.judul}
          </span>
        </nav>

        {/* ─── Main 2-Column Layout ────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* KOLOM KIRI: KONTEN UTAMA (±70%) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <main className="w-full lg:w-[70%] bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200/80 dark:border-gray-700 shadow-sm">

            {/* Category / Type Badge (BERITA vs PENGUMUMAN) */}
            <div className="mb-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs ${beritaItem.kategori?.toLowerCase() === 'pengumuman'
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#7a1f2b] text-white'
                }`}>
                {beritaItem.kategori?.toLowerCase() === 'pengumuman' ? 'PENGUMUMAN RESMI' : 'BERITA UTAMA'}
              </span>
            </div>

            {/* 2. Judul Artikel */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              {beritaItem.judul}
            </h1>

            {/* 3. Meta Info (Baris Horizontal) */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 pb-6 mb-6 border-b border-gray-100 dark:border-gray-700 font-medium">
              <span className="flex items-center gap-1.5">
                <span></span> {formatDate(beritaItem.tanggal)}
              </span>
              <span className="flex items-center gap-1.5">
                <span></span> Ditulis oleh <strong className="text-gray-700 dark:text-gray-300">{beritaItem.penulis || 'Redaksi Kelurahan'}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span></span> Dilihat {viewsCount} kali
              </span>
            </div>

            {/* 4. Foto Utama (Rasio 16:9) */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-8 shadow-sm">
              <img
                src={beritaItem.foto_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=80'}
                alt={beritaItem.judul}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 6. Kutipan (Opsional) */}
            {beritaItem.ringkasan && (
              <div className="border-l-4 border-[#7a1f2b] bg-red-50/60 dark:bg-red-950/30 p-5 rounded-r-2xl mb-8">
                <p className="text-gray-800 dark:text-gray-200 text-base md:text-lg font-medium italic leading-relaxed">
                  "{beritaItem.ringkasan}"
                </p>
              </div>
            )}

            {/* 5. Isi Artikel */}
            <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-base md:text-lg leading-[1.8] font-normal space-y-6 whitespace-pre-line">
              {beritaItem.isi || beritaItem.konten || beritaItem.ringkasan || 'Tidak ada konten berita lanjutan.'}
            </div>

            {/* 7. Tombol Bagikan */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Bagikan Artikel Ini:
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition shadow-xs"
                >
                  <span>💬 WhatsApp</span>
                </a>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-[#7a1f2b] dark:bg-red-950/40 dark:text-red-300 rounded-full text-xs font-bold transition border border-red-200 dark:border-red-900/50"
                >
                  <span>🔗 {copied ? 'Link Tersalin!' : 'Salin Tautan'}</span>
                </button>
              </div>
            </div>

          </main>


          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* KOLOM KANAN: SIDEBAR (±30%) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <aside className="w-full lg:w-[30%] bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200/80 dark:border-gray-700 shadow-sm sticky top-24">

            {/* Judul Sidebar */}
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white pb-3 mb-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <span>📰</span> Berita Terbaru
            </h3>

            {/* List Berita Lain */}
            <div className="space-y-4">
              {sidebarBerita.map((sideItem: any) => {
                const sideViews = sideItem.views || Math.floor(Math.abs(Math.sin(sideItem.id || 1) * 350) + 120);

                return (
                  <Link
                    key={sideItem.id}
                    href={`/berita/${sideItem.id}`}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-red-50/70 dark:hover:bg-gray-700/60 transition group border border-transparent hover:border-red-100 dark:hover:border-gray-600"
                  >
                    {/* Thumbnail Foto Kecil (kiri ~70x70px) */}
                    <div className="w-[70px] h-[70px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={sideItem.foto_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=300&q=80'}
                        alt={sideItem.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Judul & Meta Tanggal */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${sideItem.kategori?.toLowerCase() === 'pengumuman'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                            : 'bg-red-100 text-[#7a1f2b] dark:bg-red-950/80 dark:text-red-300'
                          }`}>
                          {sideItem.kategori?.toLowerCase() === 'pengumuman' ? '📢 PENGUMUMAN' : '📰 BERITA'}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white line-clamp-2 leading-snug group-hover:text-[#7a1f2b] dark:group-hover:text-red-400 transition-colors">
                        {sideItem.judul}
                      </h4>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                        📅 {formatDate(sideItem.tanggal)} • 👁 {sideViews}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
