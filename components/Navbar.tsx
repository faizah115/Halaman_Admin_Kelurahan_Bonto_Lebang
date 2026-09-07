'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Sembunyikan navbar publik di semua halaman admin
  if (pathname?.startsWith('/admin')) return null;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#6B1124] shadow-md sticky top-0 z-50">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          
          {/* Logo Brand dengan Lambang Kelurahan Bonto Lebang */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 hover:opacity-95 transition group">
              <img
                src="/logo-kelurahan.png"
                alt="Logo Kelurahan Bonto Lebang"
                className="w-16 h-16 sm:w-24 sm:h-24 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white">
                KELURAHAN BONTO LEBANG
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition">
              Beranda
            </Link>
            <Link href="/profil" className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition">
              Profil Kelurahan
            </Link>
            <Link href="/kependudukan" className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition">
              Data Kependudukan
            </Link>
            <Link href="/berita" className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition">
              Berita & Pengumuman
            </Link>
            <Link href="/umkm" className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition">
              Potensi & UMKM
            </Link>
            <Link href="/galeri" className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition">
              Galeri Kegiatan
            </Link>

            {/* ─── DROPDOWN LAYANAN ────────────────────────────────────────── */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                className={`text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-bold transition flex items-center gap-1.5 ${
                  dropdownOpen ? 'bg-white/15' : ''
                }`}
              >
                <span>LAYANAN</span>
                <span className="text-xs transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </button>

              {/* Floating Menu Dropdown */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2.5 z-50 animate-fadeIn"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700/60">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Pilih Jenis Layanan
                    </p>
                  </div>

                  <Link
                    href="/pengaduan?type=pengaduan"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-gray-700/60 transition group"
                  >
                    <span className="text-lg mt-0.5">📢</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-[#a91d3a]">
                        Pengaduan Masyarakat
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                        Lapor kendala jalan, lampu, kebersihan & pelayanan publik
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/pengaduan?type=kritik"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-gray-700/60 transition group"
                  >
                    <span className="text-lg mt-0.5">💡</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-[#a91d3a]">
                        Kritik dan Saran
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                        Sampaikan ide, gagasan & evaluasi layanan kelurahan
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Hamburger Mobile Trigger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition text-xl font-bold"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#570d1d] border-t border-white/10 px-4 pt-3 pb-6 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
          >
            Beranda
          </Link>
          <Link
            href="/profil"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
          >
            Profil Kelurahan
          </Link>
          <Link
            href="/kependudukan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
          >
            Data Kependudukan
          </Link>
          <Link
            href="/berita"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
          >
            Berita & Pengumuman
          </Link>
          <Link
            href="/umkm"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
          >
            Potensi & UMKM
          </Link>
          <Link
            href="/galeri"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium"
          >
            Galeri Kegiatan
          </Link>

          {/* Mobile LAYANAN Submenu */}
          <div className="pt-2 mt-2 border-t border-white/15 space-y-1">
            <p className="px-3 text-xs font-bold text-red-200 uppercase tracking-wider">
              LAYANAN
            </p>
            <Link
              href="/pengaduan?type=pengaduan"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2"
            >
              <span>📢</span> Pengaduan Masyarakat
            </Link>
            <Link
              href="/pengaduan?type=kritik"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2"
            >
              <span>💡</span> Kritik dan Saran
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
