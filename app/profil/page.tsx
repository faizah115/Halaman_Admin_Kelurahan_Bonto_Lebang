import { getProfil, getStruktur } from '@/lib/supabaseClient';
import HeroSlider from '@/components/HeroSlider';
import SOTKSectionClient from '@/components/SOTKSectionClient';

export const revalidate = 60; // ISR every minute

// Placeholder struktur jika database belum diisi (12 anggota)
const strukturPlaceholder = [
  { id: 1, jabatan: 'Lurah', nama: 'Nama Lurah', foto_url: null },
  { id: 2, jabatan: 'Sekretaris Kelurahan', nama: 'Nama Sekretaris', foto_url: null },
  { id: 3, jabatan: 'Kasi Pemerintahan', nama: 'Nama Kasi', foto_url: null },
  { id: 4, jabatan: 'Kasi Pembangunan', nama: 'Nama Kasi', foto_url: null },
  { id: 5, jabatan: 'Kasi Kemasyarakatan', nama: 'Nama Kasi', foto_url: null },
  { id: 6, jabatan: 'Staf Pelayanan Publik', nama: 'Nama Staf', foto_url: null },
  { id: 7, jabatan: 'Staf Keuangan & Bendahara', nama: 'Nama Staf', foto_url: null },
  { id: 8, jabatan: 'Staf Trantib & Ketertiban', nama: 'Nama Staf', foto_url: null },
  { id: 9, jabatan: 'Staf Kebersihan & Lingkungan', nama: 'Nama Staf', foto_url: null },
  { id: 10, jabatan: 'Staf Pengelola Data & IT', nama: 'Nama Staf', foto_url: null },
  { id: 11, jabatan: 'Staf Kesejahteraan Masyarakat', nama: 'Nama Staf', foto_url: null },
  { id: 12, jabatan: 'Staf Umum & Kepegawaian', nama: 'Nama Staf', foto_url: null },
];

export default async function ProfilPage() {
  const data = await getProfil();
  const strukturData = await getStruktur();

  const { lokasi, kecamatan, kabupaten, sejarah, visi, misi } = data || {};

  const struktur = (strukturData && strukturData.length > 0)
    ? strukturData
    : strukturPlaceholder;

  const defaultLurahList = [
    { nama: 'Lurah Terdahulu 1', periode: '2000 - 2005', foto_url: null },
    { nama: 'Lurah Terdahulu 2', periode: '2005 - 2010', foto_url: null },
    { nama: 'Lurah Terdahulu 3', periode: '2010 - 2015', foto_url: null },
    { nama: 'Lurah Terdahulu 4', periode: '2015 - 2019', foto_url: null },
    { nama: 'Lurah Terdahulu 5', periode: '2019 - 2024', foto_url: null },
    { nama: data?.nama_lurah || 'RAMLI S.SOS', periode: '2024 - Sekarang', foto_url: data?.foto_lurah_url || null },
  ];

  const listLurah = (data?.lurah_terdahulu && data.lurah_terdahulu.length > 0)
    ? data.lurah_terdahulu
    : defaultLurahList;

  const sotkPejabat = [
    {
      nama: data?.nama_lurah || (struktur.find((s: any) => s.jabatan.toLowerCase().includes('lurah'))?.nama) || 'RAMLI S.SOS',
      jabatan: 'Lurah',
      foto_url: data?.foto_lurah_url || (struktur.find((s: any) => s.jabatan.toLowerCase().includes('lurah'))?.foto_url) || null
    },
    {
      nama: (struktur.find((s: any) => s.jabatan.toLowerCase().includes('sekretaris'))?.nama) || 'Nama Sekretaris',
      jabatan: 'Sekretaris Lurah',
      foto_url: (struktur.find((s: any) => s.jabatan.toLowerCase().includes('sekretaris'))?.foto_url) || null
    },
    {
      nama: (struktur.find((s: any) => s.jabatan.toLowerCase().includes('kesejahteraan') || s.jabatan.toLowerCase().includes('kemasyarakatan'))?.nama) || 'Nama Kasi Kesejahteraan',
      jabatan: 'Kasi Kesejahteraan',
      foto_url: (struktur.find((s: any) => s.jabatan.toLowerCase().includes('kesejahteraan') || s.jabatan.toLowerCase().includes('kemasyarakatan'))?.foto_url) || null
    },
    {
      nama: (struktur.find((s: any) => s.jabatan.toLowerCase().includes('pembangunan') || s.jabatan.toLowerCase().includes('p3m'))?.nama) || 'Nama Kasi P3M',
      jabatan: 'Kasi P3M',
      foto_url: (struktur.find((s: any) => s.jabatan.toLowerCase().includes('pembangunan') || s.jabatan.toLowerCase().includes('p3m'))?.foto_url) || null
    },
  ];

  return (
    <div style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)" }} className="min-h-screen dark:bg-gray-900">

      {/* Hero Slider 3 Foto Khusus Profil Kelurahan */}
      <HeroSlider
        title={`Profil Kelurahan ${lokasi || 'Bonto Lebang'}`}
        subtitle={`${lokasi || 'Bonto Lebang'} — Kecamatan ${kecamatan || '-'}, Kabupaten ${kabupaten || '-'}`}
        mainImageUrl={data?.profil_banner_url}
        imageUrl2={data?.profil_banner_url_2}
        imageUrl3={data?.profil_banner_url_3}
      />

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* ── Sejarah Singkat ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-extrabold text-[#A91D3A] font-['Poppins']">Sejarah Singkat</h2>
          </div>
          <div style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)" }} className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-[#1A1A1A] dark:text-gray-300 leading-relaxed text-base md:text-lg">
            {sejarah ? (
              <p className="whitespace-pre-line leading-relaxed">{sejarah}</p>
            ) : (
              <>
                <p className="mb-4">
                  Kelurahan Bonto Lebang merupakan salah satu kelurahan yang berada di wilayah
                  Kecamatan {kecamatan || '...'}, Kabupaten {kabupaten || '...'}. Nama
                  "Bonto Lebang" berasal dari bahasa daerah setempat yang memiliki makna mendalam
                  bagi masyarakat sekitar.
                </p>
                <p>
                  Kelurahan ini telah berdiri sejak lama dan terus berkembang seiring berjalannya
                  waktu, dengan masyarakat yang menjunjung tinggi nilai-nilai gotong royong,
                  kearifan lokal, serta semangat kebersamaan dalam membangun wilayahnya.
                </p>

              </>
            )}
          </div>
        </section>

        {/* ── Visi & Misi ── */}
        <section
          style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)" }}
          className="rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-[#A91D3A] font-['Poppins']">Visi & Misi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visi */}
            <div
              style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)" }}
              className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8"
            >
              <h3 className="text-xl font-bold mb-4 text-[#A91D3A] dark:text-red-400">
                Visi
              </h3>
              <p className="leading-relaxed text-[#1A1A1A] dark:text-gray-300 text-base md:text-lg">
                {visi || (
                  <span>
                    "Terwujudnya Kelurahan Bonto Lebang yang Maju, Sejahtera, dan Berbudaya."
                  </span>
                )}
              </p>
            </div>
            {/* Misi */}
            <div
              style={{ background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)" }}
              className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8"
            >
              <h3 className="text-xl font-bold mb-4 text-[#A91D3A] dark:text-red-400">
                Misi
              </h3>
              {misi ? (
                (() => {
                  const items = typeof misi === 'string'
                    ? misi.split(/\n|(?<=\S|^)\s*(?=\d+[\.\)])/).map(s => s.trim()).filter(Boolean)
                    : [];
                  if (items.length > 1) {
                    return (
                      <ul className="text-[#1A1A1A] dark:text-gray-300 space-y-3 list-none text-base">
                        {items.map((item, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <span className="text-[#A91D3A] font-bold mt-0.5 flex-shrink-0">✓</span>
                            <span className="whitespace-pre-line">{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p className="text-[#1A1A1A] dark:text-gray-300 leading-relaxed text-base whitespace-pre-line">{misi}</p>;
                })()
              ) : (
                <ul className="text-[#1A1A1A] dark:text-gray-300 space-y-3 list-none text-base">
                  {[
                    'Meningkatkan kualitas pelayanan publik.',
                    'Memberdayakan masyarakat melalui program ekonomi kreatif dan UMKM.',
                    'Melestarikan kearifan lokal dan budaya daerah.',
                    'Mendorong pembangunan infrastruktur yang merata dan berkelanjutan.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-[#A91D3A] font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>



        {/* ── Section SOTK (Struktur Organisasi dan Tata Kerja) dengan Tombol Lihat Lainnya ── */}
        <SOTKSectionClient pejabatList={struktur} />

      </div>
    </div>
  );
}
