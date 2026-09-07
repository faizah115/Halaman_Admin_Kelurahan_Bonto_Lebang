import Link from "next/link";
import { getPotensiUnggulan } from "@/lib/supabaseClient";

export const dynamic = 'force-dynamic';

export default async function PotensiPage() {
  const potensiList = await getPotensiUnggulan();

  const list = potensiList || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#7a1f2b] via-[#a91d3a] to-[#7a1f2b] text-white py-16 px-6 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-md">Potensi & Wisata Unggulan</h1>
        <p className="text-red-100 text-lg max-w-2xl mx-auto font-medium">
          Jelajahi keindahan alam, budaya, dan agrowisata terbaik di Kelurahan Bonto Lebang, Kecamatan Bissapu, Kabupaten Bantaeng.
        </p>
      </div>

      {/* Info pendaftaran */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pt-6">
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          Untuk pengajuan pendaftaran data Potensi dan UMKM, silakan menghubungi layanan kontak WhatsApp.
        </p>
      </div>

      {/* Rapat Kanan Kiri Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14">
        {list.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <span className="text-5xl block mb-3">🏆</span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Belum Ada Data Potensi Unggulan</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Data potensi desa/kelurahan akan ditampilkan di sini setelah ditambahkan melalui Panel Admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {list.map((item: any) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border border-gray-100 dark:border-gray-700"
            >
              <div>
                {/* Gambar Potensi Lebih Besar (Height 72 / 288px) */}
                <div className="h-64 sm:h-72 md:h-80 w-full relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  {item.foto_url ? (
                    <img
                      src={item.foto_url}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300">
                      {item.ikon || "🏝️"}
                    </div>
                  )}
                  {item.kategori && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                      {item.kategori}
                    </div>
                  )}
                </div>

                <div className="p-5 md:p-6">
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 group-hover:text-[#a91d3a] transition-colors leading-snug">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {item.deskripsi}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0">
                <Link
                  href={`/potensi/${item.id}`}
                  className="w-full bg-gradient-to-r from-[#7a1f2b] to-[#a91d3a] hover:from-[#6b1124] hover:to-[#7a1f2b] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm tracking-wide transition-all transform active:scale-95"
                >
                  <span>Lihat Detail Potensi</span>
                  <span className="text-lg">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Catatan bawah halaman */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pb-4">
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          Untuk pengajuan pendaftaran data Potensi dan UMKM, silakan menghubungi layanan kontak WhatsApp.
        </p>
      </div>
    </div>
  );
}
