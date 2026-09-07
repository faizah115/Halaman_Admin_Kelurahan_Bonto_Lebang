import Link from "next/link";
import { notFound } from "next/navigation";
import { getPotensiUnggulan } from "@/lib/supabaseClient";

export const revalidate = 60;

export default async function DetailPotensiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  const dbPotensiList = await getPotensiUnggulan();
  const dbItem = dbPotensiList?.find((item: any) => item.id === numId);

  if (!dbItem) {
    notFound();
  }

  let galeriFotos: string[] = [];
  if (dbItem.galeri) {
    if (Array.isArray(dbItem.galeri)) {
      galeriFotos = dbItem.galeri;
    } else if (typeof dbItem.galeri === 'string') {
      try {
        const parsed = JSON.parse(dbItem.galeri);
        if (Array.isArray(parsed)) galeriFotos = parsed;
        else galeriFotos = [dbItem.galeri];
      } catch (e) {
        galeriFotos = [dbItem.galeri];
      }
    }
  }
  if (galeriFotos.length === 0 && dbItem.foto_url) {
    galeriFotos = [dbItem.foto_url];
  }

  let fasilitasList: string[] = ["🅿️ Area Parkir Wide", "🚻 Toilet Umum", "🌊 Pemandangan Alam", "📍 Akses Mudah"];
  if (dbItem.fasilitas) {
    if (Array.isArray(dbItem.fasilitas) && dbItem.fasilitas.length > 0) {
      fasilitasList = dbItem.fasilitas;
    } else if (typeof dbItem.fasilitas === 'string') {
      try {
        const parsed = JSON.parse(dbItem.fasilitas);
        if (Array.isArray(parsed) && parsed.length > 0) fasilitasList = parsed;
      } catch (e) {
        fasilitasList = dbItem.fasilitas.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }
  }

  const detail = {
    id: dbItem.id,
    judul: dbItem.judul,
    kategori: dbItem.kategori || "Wisata Unggulan",
    foto_url: dbItem.foto_url || "",
    lokasi: dbItem.lokasi || "Kelurahan Bonto Lebang, Kec. Bissapu, Kab. Bantaeng",
    jam_buka: dbItem.jam_buka || "08.00 - 17.00 WITA",
    tiket: dbItem.tiket || "Gratis",
    jarak: dbItem.jarak || "Kawasan Kelurahan",
    deskripsi_1: dbItem.deskripsi || "",
    deskripsi_2: dbItem.deskripsi_2 || "",
    galeri: galeriFotos,
    map_iframe: dbItem.map_iframe || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15878.118944510006!2d119.92383785!3d-5.54763185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe40e4abf9aaeb%3A0xa1ea16ecce9ffbd9!2sBonto%20Lebang%2C%20Kec.%20Bissapu%2C%20Kabupaten%20Bantaeng%2C%20Sulawesi%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
    map_link: dbItem.map_link || "https://maps.google.com/?q=Bonto+Lebang+Bissapu+Bantaeng",
    fasilitas: fasilitasList,
  };

  // Rekomendasi Potensi Unggulan Lainnya
  const otherWisata = (dbPotensiList || []).filter((w: any) => w.id !== detail.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 pb-20">

      {/* 1. Hero / Banner Foto */}
      <div className="relative w-full h-[400px] md:h-[450px] bg-gray-900 overflow-hidden">
        <img
          src={detail.foto_url}
          alt={detail.judul}
          className="w-full h-full object-cover opacity-85"
        />
        {/* Overlay gradient gelap tipis */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

        {/* Text Overlay di Pojok Kiri Bawah */}
        <div className="absolute bottom-10 left-0 right-0 max-w-5xl mx-auto px-6 text-white z-10">
          {/* Breadcrumb */}
          <nav className="text-xs md:text-sm text-gray-300 mb-2 font-medium flex items-center gap-2">
            <Link href="/" className="hover:text-white transition">Beranda</Link>
            <span>/</span>
            <Link href="/potensi" className="hover:text-white transition">Potensi Unggulan</Link>
            <span>/</span>
            <span className="text-white font-semibold line-clamp-1">{detail.judul}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md text-white">
            {detail.judul}
          </h1>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-6">

        {/* 2. Quick Info Bar (Overlap dengan hero) */}
        <div className="-mt-10 relative z-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <span className="text-2xl p-2.5 bg-red-50 dark:bg-red-950/50 rounded-xl text-[#D32F2F]">📍</span>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lokasi</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5 line-clamp-2">{detail.lokasi}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <span className="text-2xl p-2.5 bg-red-50 dark:bg-red-950/50 rounded-xl text-[#D32F2F]">🕒</span>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Jam Buka</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{detail.jam_buka}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <span className="text-2xl p-2.5 bg-red-50 dark:bg-red-950/50 rounded-xl text-[#D32F2F]">💰</span>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tiket Masuk</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{detail.tiket}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <span className="text-2xl p-2.5 bg-red-50 dark:bg-red-950/50 rounded-xl text-[#D32F2F]">🚗</span>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Jarak</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{detail.jarak}</p>
            </div>
          </div>

        </div>

        {/* 3. Deskripsi Lengkap */}
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-[#D32F2F] mb-4 flex items-center gap-2">
            <span>📖</span> Tentang {detail.judul}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 text-base md:text-lg">
            <p>{detail.deskripsi_1}</p>
            <p>{detail.deskripsi_2}</p>
          </div>
        </section>

        {/* 4. Galeri Foto */}
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-[#D32F2F] mb-4 flex items-center gap-2">
            <span>🖼️</span> Galeri Foto
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {detail.galeri.map((imgUrl: string, idx: number) => (
              <a
                key={idx}
                href={imgUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 block"
              >
                <img
                  src={imgUrl}
                  alt={`Galeri ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xl font-bold">
                  🔍
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 5. Lokasi & Peta */}
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-[#D32F2F] mb-4 flex items-center gap-2">
            <span>🗺️</span> Lokasi & Peta Petunjuk
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-full h-[320px] rounded-xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 mb-4">
              <iframe
                title="Peta Lokasi Wisata"
                src={detail.map_iframe}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                📍 Alamat: <span className="font-bold text-gray-900 dark:text-white">{detail.lokasi}</span>
              </p>
              <a
                href={detail.map_link}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto px-6 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <span>📍 Buka di Google Maps</span>
              </a>
            </div>
          </div>
        </section>

        {/* 6. Fasilitas Tersedia */}
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-[#D32F2F] mb-4 flex items-center gap-2">
            <span>✨</span> Fasilitas Tersedia
          </h2>
          <div className="flex flex-wrap gap-3">
            {detail.fasilitas.map((fas: string, i: number) => (
              <span
                key={i}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm flex items-center gap-1.5"
              >
                {fas}
              </span>
            ))}
          </div>
        </section>

        {/* 7. Wisata & Potensi Lainnya */}
        {otherWisata.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-[#D32F2F] mb-6 flex items-center gap-2">
              <span>🏝️</span> Wisata & Potensi Lainnya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherWisata.map((w: any) => (
                <div
                  key={w.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={w.foto_url}
                        alt={w.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-red-50/90 dark:bg-red-950/80 backdrop-blur-sm text-[#D32F2F] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-red-100">
                        {w.kategori}
                      </span>
                    </div>
                    <div className="p-5 w-full sm:w-3/5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#D32F2F] transition-colors mb-2">
                          {w.judul}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {w.deskripsi}
                        </p>
                      </div>
                      <div className="mt-4 pt-2">
                        <Link
                          href={`/potensi/${w.id}`}
                          className="inline-flex items-center gap-1 text-[#D32F2F] font-semibold text-xs hover:underline"
                        >
                          <span>Lihat Detail</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Tombol Kembali */}
        <div className="mt-16 text-center">
          <Link
            href="/potensi"
            className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold px-6 py-3.5 rounded-xl transition text-sm shadow-sm"
          >
            <span>← Kembali ke Potensi Unggulan</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
