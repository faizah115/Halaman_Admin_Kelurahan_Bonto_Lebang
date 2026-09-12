import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Website Resmi Kelurahan Bonto Lebang",
  description: "Portal Informasi dan Pelayanan Publik Kelurahan Bonto Lebang, Kecamatan Bissappu, Kabupaten Bantaeng",
  icons: {
    icon: [
      { url: "/logo-kelurahan.png", type: "image/png" },
    ],
    shortcut: "/logo-kelurahan.png",
    apple: "/logo-kelurahan.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)" }} className="min-h-full flex flex-col text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>

        {/* ─── Global Footer ─────────────────────────────────────────────── */}
        <footer className="bg-[#6B1124] text-white mt-auto">

          {/* Main footer grid */}
          <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* 1. Identitas & Alamat */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span>🏛️</span> Identitas Pemerintah
              </h3>
              <div className="space-y-2 text-sm leading-relaxed text-red-100">
                <p className="font-bold text-white text-base">Kelurahan Bonto Lebang</p>
                <p>Kecamatan Bissappu</p>
                <p>Kabupaten Bantaeng</p>
                <p>Provinsi Sulawesi Selatan</p>
                <p className="mt-3 text-red-100">
                  <span className="font-semibold text-white">Kode Pos:</span> 92451
                </p>
                <p className="text-red-100">
                  <span className="font-semibold text-white">Jam Pelayanan:</span><br />
                  Senin – Jumat, 08.00 – 16.00 WITA
                </p>
              </div>
            </div>

            {/* 2. Kontak */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span>📞</span> Hubungi Kami
              </h3>
              <ul className="space-y-3 text-sm text-red-100">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">📍</span>
                  <span>Jl. Pemandian Alam Bissappu, Bonto Lebang, Kec. Bissappu, Kabupaten Bantaeng, Sulawesi Selatan</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📱</span>
                  <span className="font-bold text-white">-</span>
                </li>
              </ul>

            </div>

            {/* 3. Tautan Eksternal */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span>🔗</span> Jelajahi Tautan Resmi
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Pemerintah Kabupaten Bantaeng', url: 'https://bantaengkab.go.id' },
                  { label: 'Pemerintah Provinsi Sulawesi Selatan', url: 'https://sulselprov.go.id' },
                  { label: 'Kementerian Dalam Negeri (Kemendagri)', url: 'https://kemendagri.go.id' },
                  { label: 'Dukcapil', url: 'https://dukcapil.kemendagri.go.id' },
                  { label: 'JDIH Kabupaten Bantaeng', url: 'https://jdih.bantaengkab.go.id' },
                  { label: 'SP4N-LAPOR!', url: 'https://www.lapor.go.id' },
                  { label: 'Data Indonesia / BPS', url: 'https://www.bps.go.id' },
                ].map(({ label, url }) => (
                  <li key={label}>
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="font-bold text-white hover:underline transition flex items-center gap-1">
                      {label} <span className="text-xs">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="border-t border-white/20">
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-red-100">
              <p>© {new Date().getFullYear()} KKN UIN Alauddin Makassar Angkatan 79 - Posko 03 Kec Bissapu Kel.Bonto Lebang</p>
              <p>Dikembangkan untuk mendukung informasi & pengaduan masyarakat.</p>
            </div>
          </div>
        </footer>

        {/* ─── WhatsApp Floating Button (Global, semua halaman) ─── */}
        <WhatsAppFloatingButton />

      </body>
    </html>
  );
}
