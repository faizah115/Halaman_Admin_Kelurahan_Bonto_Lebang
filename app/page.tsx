import Link from "next/link";
import { supabase, getProfil, getPotensiUnggulan, getStatistikRW, getStrukturRWRT } from "@/lib/supabaseClient";
import HeroSlider from "@/components/HeroSlider";
import PotensiSectionClient from "@/components/PotensiSectionClient";


export const dynamic = 'force-dynamic';

const rwPlaceholder = [
  { rw: 'RW I', jumlah_kk: 295, laki_laki: 485, perempuan: 470 },
  { rw: 'RW II', jumlah_kk: 310, laki_laki: 505, perempuan: 490 },
  { rw: 'RW III', jumlah_kk: 288, laki_laki: 472, perempuan: 453 },
  { rw: 'RW IV', jumlah_kk: 235, laki_laki: 425, perempuan: 400 },
];

// Fetch stats dynamically from kependudukan_rw table & getStrukturRWRT (same source as /kependudukan)
async function getStats() {
  const rawRW = await getStatistikRW();
  const rawStruktur = await getStrukturRWRT();

  let effectiveRW = rwPlaceholder;
  if (rawRW && rawRW.length > 0) {
    effectiveRW = rawRW;
  }

  const totalLaki = effectiveRW.reduce((sum: number, item: any) => sum + (item.laki_laki ?? item.laki ?? 0), 0);
  const totalPerempuan = effectiveRW.reduce((sum: number, item: any) => sum + (item.perempuan ?? 0), 0);
  const totalPenduduk = totalLaki + totalPerempuan;
  const totalKK = effectiveRW.reduce((sum: number, item: any) => sum + (item.jumlah_kk ?? item.jumlah ?? 0), 0);
  const totalRW = effectiveRW.length;
  
  const totalRT = rawStruktur && rawStruktur.length > 0
    ? rawStruktur.reduce((acc: number, item: any) => acc + (item.rt_list?.length || 0), 0)
    : 14;

  return { totalPenduduk, totalLaki, totalPerempuan, totalKK, totalRW, totalRT };
}

export default async function Home() {
  const { totalPenduduk, totalLaki, totalPerempuan, totalKK, totalRW, totalRT } = await getStats();
  const profilData = await getProfil();
  const potensiList = await getPotensiUnggulan();
  const { lokasi, kecamatan, kabupaten } = profilData || {};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Hero section */}
      <HeroSlider
        title={profilData?.hero_judul || "Selamat Datang di Kelurahan Bonto Lebang"}
        subtitle={profilData?.hero_subjudul || "Portal resmi yang menampilkan profil kelurahan, potensi unggulan, data kependudukan, berita, galeri, dan layanan pengaduan masyarakat."}
        mainImageUrl={profilData?.hero_banner_url}
        imageUrl2={profilData?.hero_banner_url_2}
        imageUrl3={profilData?.hero_banner_url_3}
      />

      {/* Sambutan Lurah */}
      <section style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)" }} className="py-16 px-6 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-12">

            {/* Kolom Kiri: Foto Lurah (Centered on mobile, left-aligned on desktop) */}
            <div className="w-full flex justify-center md:w-auto md:block flex-shrink-0">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-gray-200 dark:bg-gray-700 mx-auto md:mx-0">
                {profilData?.foto_lurah_url ? (
                  <img
                    src={profilData.foto_lurah_url}
                    alt={profilData.nama_lurah || "Foto Lurah"}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <span className="text-8xl opacity-30">👤</span>
                )}
              </div>
            </div>

            {/* Kolom Kanan: Semua Teks (Center-aligned on mobile, left-aligned on desktop) */}
            <div className="flex-1 text-center md:text-left">

              {/* 1. Judul Utama */}
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 900,
                  color: "#A91D3A",
                  fontFamily: "'Poppins', 'Baloo 2', 'Quicksand', sans-serif",
                  lineHeight: 1.1,
                  marginBottom: "16px",
                }}
              >
                Sambutan Lurah Bonto Lebang
              </h2>

              {/* 2. Nama Pejabat */}
              <p
                style={{
                  fontSize: "clamp(18px, 2vw, 26px)",
                  fontWeight: 700,
                  color: "#1A1A1A",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  marginBottom: "4px",
                  marginTop: "16px",
                }}
              >
                {profilData?.nama_lurah || "RAMLI S.SOS"}
              </p>

              {/* 3. Jabatan */}
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#444444",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "28px",
                }}
              >
                {profilData?.jabatan_lurah || "LURAH BONTO LEBANG"}
              </p>


              {/* Content Sambutan Lurah (Dinamis dari Admin / Fallback) */}
              {profilData?.deskripsi ? (
                <div className="space-y-4">
                  {profilData.deskripsi.split(/\n+/).map((para: string, idx: number) => (
                    para.trim() ? (
                      <p
                        key={idx}
                        style={{
                          fontSize: "clamp(14px, 1.5vw, 17px)",
                          fontWeight: 400,
                          color: "#1A1A1A",
                          lineHeight: 1.75,
                          textAlign: "justify",
                          textJustify: "inter-word",
                        }}
                        className="text-justify dark:text-gray-200"
                      >
                        {para.trim()}
                      </p>
                    ) : null
                  ))}
                </div>
              ) : (
                <>
                  <p
                    style={{
                      fontSize: "clamp(14px, 1.5vw, 17px)",
                      fontWeight: 400,
                      color: "#1A1A1A",
                      lineHeight: 1.75,
                      marginBottom: "16px",
                      textAlign: "justify",
                      textJustify: "inter-word",
                    }}
                    className="text-justify dark:text-gray-200"
                  >
                    Selamat datang di website resmi Kelurahan {lokasi || "Bonto Lebang"}.
                  </p>

                  <p
                    style={{
                      fontSize: "clamp(14px, 1.5vw, 17px)",
                      fontWeight: 400,
                      color: "#1A1A1A",
                      lineHeight: 1.75,
                      marginBottom: "16px",
                      textAlign: "justify",
                      textJustify: "inter-word",
                    }}
                    className="text-justify dark:text-gray-200"
                  >
                    Sebagai wujud komitmen kami dalam memberikan pelayanan yang tanggap dan menampung aspirasi masyarakat, kami menghadirkan{" "}
                    <strong style={{ fontWeight: 700, color: "#1A1A1A" }} className="dark:text-white">
                      Website Digital Kelurahan {lokasi || "Bonto Lebang"}
                    </strong>
                    . Website ini memudahkan masyarakat dalam mengakses layanan pengaduan, saran dan informasi kelurahan secara online kapan saja dan di mana saja, sehingga hubungan antara pemerintah kelurahan dan warga dapat terjalin lebih erat.
                  </p>
                </>
              )}

            </div>
          </div>
        </div>
      </section>


      {/* Ringkasan angka */}
      <section className="py-16 px-6 bg-[#F0F4F8] dark:bg-gray-900 w-full">
        <div className="max-w-6xl mx-auto w-full">

          {/* Header */}
          <h2
            style={{
              fontSize: "clamp(36px, 5vw, 48px)",
              fontWeight: 900,
              color: "#A91D3A",
              fontFamily: "'Poppins', 'Quicksand', sans-serif",
              lineHeight: 1.15,
              marginBottom: "12px",
            }}
          >
            Ringkasan Angka
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#1A1A1A",
              fontWeight: 400,
              maxWidth: "420px",
              lineHeight: 1.6,
              marginBottom: "40px",
            }}
          >
            Potret data kependudukan Kelurahan Bonto Lebang
          </p>

          {/* Grid 2 Kolom x 3 Baris Full Width (1 Kolom di Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 w-full">
            {[
              { angka: totalPenduduk, label: "Penduduk" },
              { angka: totalLaki, label: "Laki-Laki" },
              { angka: totalKK, label: "Kepala Keluarga" },
              { angka: totalPerempuan, label: "Perempuan" },
              { angka: totalRW, label: "Jumlah RW" },
              { angka: totalRT, label: "Jumlah RT" },
            ].map(({ angka, label }) => (
              <div
                key={label}
                className="w-full flex h-[85px] rounded-[8px] overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800"
              >
                {/* Bagian Kiri (35%): Gradient Merah Burgundy + Angka Besar */}
                <div
                  style={{
                    background: "linear-gradient(90deg, #6B1124 0%, #A91D3A 100%)",
                  }}
                  className="w-[35%] h-full flex items-center justify-center px-3"
                >
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    className="text-white text-2xl md:text-3xl font-extrabold tracking-tight text-center"
                  >
                    {(angka ?? 0).toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Bagian Kanan (65%): Background Terang + Label Center */}
                <div className="w-[65%] h-full bg-white dark:bg-gray-800 flex items-center justify-center px-4">
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    className="text-[#1A1A1A] dark:text-gray-100 font-bold text-base md:text-lg text-center leading-snug"
                  >
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-6">Data per tahun {new Date().getFullYear()}</p>
        </div>
      </section>

      {/* ─── Peta Wilayah Kelurahan (Google Maps Embed) ──────────────────── */}
      <section
        style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)" }}
        className="py-16 px-6"
      >
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 900,
                color: "#A91D3A",
                fontFamily: "'Poppins', sans-serif",
                marginBottom: "10px",
              }}
            >
              Peta Wilayah Kelurahan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Lokasi wilayah Kelurahan Bonto Lebang, Kec. Bissappu, Kab. Bantaeng, Sulawesi Selatan
            </p>
          </div>

          {/* Google Maps Embed Container */}
          <div
            style={{
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.13), 0 1.5px 6px rgba(0,0,0,0.07)",
              border: "1.5px solid rgba(169,29,58,0.18)",
              width: "100%",
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=Bonto+Lebang,+Bissappu,+Bantaeng+Regency,+South+Sulawesi&t=m&z=15&output=embed&iwloc=near"
              width="100%"
              height="530"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Wilayah Kelurahan Bonto Lebang"
            />
          </div>

          {/* Keterangan bawah peta */}
          <p className="text-center text-xs text-gray-400 mt-4">
            © Google Maps — Kelurahan Bonto Lebang, Kec. Bissappu, Kab. Bantaeng, Sulawesi Selatan
          </p>

        </div>
      </section>

      {/* Potensi Unggulan (Di bawah Peta dengan Modal Interactive) */}
      <PotensiSectionClient potensiList={potensiList || []} />


    </div>
  );
}
