'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const menuItems = [
  { label: 'Dashboard Utama', href: '/admin', icon: '📊' },
  { label: 'Profil & Lurah', href: '/admin/profil', icon: '🏛️' },
  { label: 'Potensi Unggulan', href: '/admin/potensi', icon: '🏆' },
  { label: 'Data Kependudukan', href: '/admin/kependudukan', icon: '👨‍👩‍👧‍👦' },
  { label: 'Berita & Pengumuman', href: '/admin/berita', icon: '📰' },
  { label: 'Potensi & UMKM', href: '/admin/umkm', icon: '🛍️' },
  { label: 'Galeri Kegiatan', href: '/admin/galeri', icon: '🖼️' },
  { label: 'Pengaduan Warga', href: '/admin/pengaduan', icon: '📩' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkSession() {
      if (isLoginPage) {
        setLoading(false);
        return;
      }
      const localSession = typeof window !== 'undefined' ? localStorage.getItem('admin_session') : null;
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !localSession) {
        router.push('/admin/login');
      } else {
        setUser(session?.user || { email: 'admin@bontolebang.id' });
      }
      setLoading(false);
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const localSession = typeof window !== 'undefined' ? localStorage.getItem('admin_session') : null;
      if (!session && !localSession && !isLoginPage) {
        router.push('/admin/login');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname, isLoginPage]);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_session');
      document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Halaman login — layout polos, tanpa sidebar/topbar
  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900">{children}</div>;
  }

  // Loading — cek sesi
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#a61e3c', borderTopColor: 'transparent' }}
          />
          <p className="text-sm text-gray-300 font-medium animate-pulse">
            Memeriksa Keamanan &amp; Hak Akses Admin...
          </p>
        </div>
      </div>
    );
  }

  const activeLabel = menuItems.find((m) => m.href === pathname)?.label || 'Dashboard Admin';

  return (
    /**
     * Struktur layout admin (tanpa navbar publik):
     *
     * ┌─────────────────────────────────────────────┐
     * │  TOPBAR ADMIN  (sticky, full-width, h-14)   │
     * ├──────────┬──────────────────────────────────┤
     * │          │                                  │
     * │ SIDEBAR  │        KONTEN HALAMAN            │
     * │ (sticky) │        (scrollable)              │
     * │          │                                  │
     * └──────────┴──────────────────────────────────┘
     */
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* ── TOPBAR ADMIN — sticky full-width ─────────────────────────────── */}
      <header
        className="sticky top-0 z-50 w-full flex items-center justify-between px-4 md:px-6 shadow-md"
        style={{
          height: '56px',
          background: 'linear-gradient(135deg, #6B1124 0%, #a61e3c 100%)',
        }}
      >
        {/* Kiri: hamburger (mobile) + judul halaman aktif */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Buka Menu"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm md:text-base tracking-wide">
              Panel Admin
            </span>
            <span className="text-white/40 hidden md:inline">|</span>
            <span className="text-white/80 text-sm hidden md:inline">{activeLabel}</span>
          </div>
        </div>

        {/* Kanan: link publik + info user */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
          >
            <span>🌐</span> Website Publik <span className="text-[10px]">↗</span>
          </Link>

          {/* Avatar + email (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-xs text-white/80 truncate max-w-[140px]">
              {user?.email || 'Admin'}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-red-700 px-3 py-1.5 rounded-lg transition"
          >
            <span>🚪</span>
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* ── BODY: Sidebar + Konten ────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Overlay backdrop mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}

        {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
        <aside
          style={{ background: 'linear-gradient(180deg, #1a0a0d 0%, #150608 100%)' }}
          className={`fixed md:sticky md:top-14 md:h-[calc(100vh-56px)] md:overflow-y-auto inset-y-0 left-0 z-50 w-64 text-slate-300 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div>
            {/* Header Sidebar */}
            <div
              className="h-14 px-5 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(166,30,60,0.3)' }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🏛️</span>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">Admin Bonto Lebang</p>
                  <p className="text-[11px] font-medium" style={{ color: '#e07b8f' }}>
                    Panel Kontrol Kelurahan
                  </p>
                </div>
              </div>
              {/* Tombol tutup sidebar di mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-white p-1 transition"
              >
                ✕
              </button>
            </div>

            {/* Menu Navigasi */}
            <nav className="p-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    style={
                      isActive
                        ? {
                            background: 'linear-gradient(135deg, #7a1f2b 0%, #a61e3c 100%)',
                            boxShadow: '0 4px 15px rgba(166,30,60,0.35)',
                          }
                        : {}
                    }
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-[rgba(122,31,43,0.35)]'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Sidebar: Info User + Logout */}
          <div
            className="p-4"
            style={{
              borderTop: '1px solid rgba(166,30,60,0.25)',
              background: 'rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center gap-3 mb-3 px-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  background: 'rgba(166,30,60,0.25)',
                  border: '1px solid rgba(166,30,60,0.4)',
                  color: '#e07b8f',
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.email || 'Admin'}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sesi Aktif
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 rounded-xl text-xs font-medium transition duration-200 flex items-center justify-center gap-2 hover:bg-[#a61e3c] hover:text-white"
              style={{
                background: 'rgba(166,30,60,0.12)',
                color: '#e07b8f',
                border: '1px solid rgba(166,30,60,0.25)',
              }}
            >
              <span>🚪</span> Keluar (Logout)
            </button>
          </div>
        </aside>

        {/* ── KONTEN UTAMA ─────────────────────────────────────────────── */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
