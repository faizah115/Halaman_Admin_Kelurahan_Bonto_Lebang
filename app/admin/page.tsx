'use client';

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Welcome Banner — gradient merah maroon */}
      <div
        className="text-white rounded-2xl p-6 md:p-8 shadow-lg mb-8"
        style={{ background: 'linear-gradient(135deg, #7a1f2b 0%, #a61e3c 100%)' }}
      >
        <div className="max-w-3xl">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Panel Pengelola
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold mt-3 mb-2">
            Selamat Datang di Panel Admin Bonto Lebang
          </h1>
          <p className="text-red-100 text-sm md:text-base leading-relaxed">
            Kelola data kelurahan, unggah berita terbaru, tambah produk UMKM warga, dan perbarui foto kegiatan desa dengan mudah dari satu tempat.
          </p>
        </div>
      </div>

      {/* Grid Kartu Akses Cepat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Kelola Profil & Lurah', icon: '🏛️', link: '/admin/profil', desc: 'Atur info kelurahan, sambutan & foto lurah' },
          { label: 'Potensi Unggulan', icon: '🏆', link: '/admin/potensi', desc: 'Kelola sektor potensi unggulan desa' },
          { label: 'Data Kependudukan', icon: '👨‍👩‍👧‍👦', link: '/admin/kependudukan', desc: 'Statistik Usia, Demografi, & Stunting' },
          { label: 'Kelola Berita', icon: '📰', link: '/admin/berita', desc: 'Tambah atau edit pengumuman resmi' },
          { label: 'Kelola UMKM', icon: '🛍️', link: '/admin/umkm', desc: 'Katalog etalase produk warga' },
          { label: 'Kelola Galeri', icon: '🖼️', link: '/admin/galeri', desc: 'Dokumentasi foto kegiatan' },
          { label: 'Pengaduan Warga', icon: '📩', link: '/admin/pengaduan', desc: 'Cek & proses laporan warga' },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition group flex flex-col justify-between"
            style={{ borderRadius: '12px' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#a61e3c';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '';
            }}
          >
            <div>
              <span className="text-4xl mb-4 block group-hover:scale-110 transition duration-200">{item.icon}</span>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white transition" style={{}}>
                {item.label}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.desc}
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold gap-1 group-hover:translate-x-1 transition" style={{ color: '#7a1f2b' }}>
              <span>Buka Menu</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Box Petunjuk Singkat */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-800 dark:text-white text-base mb-3 flex items-center gap-2">
          <span>📋</span> Petunjuk Penggunaan
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
          <li>Pilih menu di <strong>Sidebar Kiri</strong> untuk menginput atau mengubah konten website.</li>
          <li>Setiap data yang disimpan akan <strong>otomatis langsung muncul</strong> di website publik yang dilihat warga.</li>
          <li>Gunakan tombol <strong>"Lihat Website Publik ↗"</strong> di pojok kanan atas untuk mengecek hasil tampilan secara langsung.</li>
        </ul>
      </div>
    </div>
  );
}
