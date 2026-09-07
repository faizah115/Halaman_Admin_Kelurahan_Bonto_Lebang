'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminProfilPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilId, setProfilId] = useState<number | null>(null);

  // Form States
  const [heroJudul, setHeroJudul] = useState('Selamat Datang di Kelurahan Bonto Lebang');
  const [heroSubjudul, setHeroSubjudul] = useState('Portal resmi yang menampilkan profil desa, potensi unggulan, data kependudukan, berita, galeri, dan layanan pengaduan masyarakat.');
  const [heroBannerUrl, setHeroBannerUrl] = useState('');
  const [heroBannerUrl2, setHeroBannerUrl2] = useState('');
  const [heroBannerUrl3, setHeroBannerUrl3] = useState('');
  const [profilBannerUrl, setProfilBannerUrl] = useState('');
  const [profilBannerUrl2, setProfilBannerUrl2] = useState('');
  const [profilBannerUrl3, setProfilBannerUrl3] = useState('');
  const [lurahTerdahulu, setLurahTerdahulu] = useState<any[]>([
    { nama: 'Lurah Terdahulu 1', periode: '2000 - 2005', foto_url: null },
    { nama: 'Lurah Terdahulu 2', periode: '2005 - 2010', foto_url: null },
    { nama: 'Lurah Terdahulu 3', periode: '2010 - 2015', foto_url: null },
    { nama: 'Lurah Terdahulu 4', periode: '2015 - 2019', foto_url: null },
    { nama: 'Lurah Terdahulu 5', periode: '2019 - 2024', foto_url: null },
    { nama: 'RAMLI S.SOS', periode: '2024 - Sekarang', foto_url: null },
  ]);

  const [strukturList, setStrukturList] = useState<any[]>([
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
  ]);

  const [namaLurah, setNamaLurah] = useState('');
  const [jabatanLurah, setJabatanLurah] = useState('Lurah Bonto Lebang');
  const [fotoLurahUrl, setFotoLurahUrl] = useState('');
  const [lokasi, setLokasi] = useState('Bonto Lebang');
  const [kecamatan, setKecamatan] = useState('Bissappu');
  const [kabupaten, setKabupaten] = useState('Bantaeng');
  const [deskripsi, setDeskripsi] = useState('');
  const [sejarahText, setSejarahText] = useState('');
  const [visi, setVisi] = useState('');
  const [misi, setMisi] = useState('');

  const [rawMeta, setRawMeta] = useState<any>({});

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    setLoading(true);
    const { getProfil, getStruktur } = await import('@/lib/supabaseClient');
    const data = await getProfil();
    const sData = await getStruktur();

    if (data) {
      setProfilId(data.id);
      
      let meta = {};
      try {
        if (typeof data.sejarah === 'string' && data.sejarah.startsWith('{')) {
          meta = JSON.parse(data.sejarah);
        }
      } catch(e) {}
      setRawMeta(meta);

      setHeroJudul(data.hero_judul || 'Selamat Datang di Kelurahan Bonto Lebang');
      setHeroSubjudul(data.hero_subjudul || 'Portal resmi yang menampilkan profil desa, potensi unggulan, data kependudukan, berita, galeri, dan layanan pengaduan masyarakat.');
      setHeroBannerUrl(data.hero_banner_url || '');
      setHeroBannerUrl2(data.hero_banner_url_2 || '');
      setHeroBannerUrl3(data.hero_banner_url_3 || '');
      setProfilBannerUrl(data.profil_banner_url || '');
      setProfilBannerUrl2(data.profil_banner_url_2 || '');
      setProfilBannerUrl3(data.profil_banner_url_3 || '');
      if (data.lurah_terdahulu && Array.isArray(data.lurah_terdahulu) && data.lurah_terdahulu.length > 0) {
        setLurahTerdahulu(data.lurah_terdahulu);
      }
      if (sData && Array.isArray(sData) && sData.length > 0) {
        setStrukturList(sData);
      } else if (data.struktur && Array.isArray(data.struktur) && data.struktur.length > 0) {
        setStrukturList(data.struktur);
      }
      setNamaLurah((meta as any).nama_lurah || data.nama_lurah || '');
      setJabatanLurah((meta as any).jabatan_lurah || data.jabatan_lurah || 'Lurah Bonto Lebang');
      setFotoLurahUrl((meta as any).foto_lurah_url || data.foto_lurah_url || '');
      setLokasi(data.lokasi || 'Bonto Lebang');
      setKecamatan(data.kecamatan || 'Bissappu');
      setKabupaten(data.kabupaten || 'Bantaeng');
      setDeskripsi(data.deskripsi || (meta as any).deskripsi || (meta as any).sambutan || '');
      setSejarahText(data.sejarah_teks || (meta as any).sejarah_teks || (typeof data.sejarah === 'string' && !data.sejarah.startsWith('{') ? data.sejarah : '') || '');
      setVisi(data.visi || '');
      setMisi(data.misi || '');
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const metadata = {
      ...rawMeta,
      hero_judul: heroJudul,
      hero_subjudul: heroSubjudul,
      hero_banner_url: heroBannerUrl,
      hero_banner_url_2: heroBannerUrl2,
      hero_banner_url_3: heroBannerUrl3,
      profil_banner_url: profilBannerUrl,
      profil_banner_url_2: profilBannerUrl2,
      profil_banner_url_3: profilBannerUrl3,
      lurah_terdahulu: lurahTerdahulu,
      struktur: strukturList,
      deskripsi: deskripsi,
      sambutan: deskripsi,
      sejarah_teks: sejarahText,
      nama_lurah: namaLurah,
      jabatan_lurah: jabatanLurah,
      foto_lurah_url: fotoLurahUrl,
    };

    const payload = {
      lokasi: lokasi,
      kecamatan: kecamatan,
      kabupaten: kabupaten,
      visi: visi,
      misi: misi,
      sejarah: JSON.stringify(metadata),
    };

    if (profilId) {
      const { error } = await supabase.from('profil').update(payload).eq('id', profilId);
      if (error) alert('Gagal menyimpan profil: ' + error.message);
      else alert('✅ Data profil kelurahan berhasil diperbarui!');
    } else {
      const { data, error } = await supabase.from('profil').insert([payload]).select().maybeSingle();
      if (error) alert('Gagal membuat profil: ' + error.message);
      else {
        if (data) setProfilId(data.id);
        alert('✅ Data profil kelurahan berhasil disimpan!');
      }
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Memuat data profil...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Profil & Sambutan Lurah</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Informasi ini akan ditampilkan di halaman Beranda dan Halaman Profil Kelurahan Bonto Lebang.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Box Hero Banner Beranda */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>🖼️</span> Banner Utama Beranda (Hero Banner)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Judul Utama Banner
              </label>
              <input
                type="text"
                required
                value={heroJudul}
                onChange={(e) => setHeroJudul(e.target.value)}
                placeholder="Selamat Datang di Kelurahan Bonto Lebang"
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Subjudul / Deskripsi Singkat Banner
              </label>
              <textarea
                rows={2}
                value={heroSubjudul}
                onChange={(e) => setHeroSubjudul(e.target.value)}
                placeholder="Portal resmi yang menampilkan profil desa..."
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Foto Slide 1 (Banner Utama)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { uploadImage } = await import('@/lib/uploadHelper');
                      const url = await uploadImage(file, 'banner');
                      setHeroBannerUrl(url);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
                />
                {heroBannerUrl && (
                  <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                    <img src={heroBannerUrl} alt="Preview Banner" className="w-16 h-10 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setHeroBannerUrl('')}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Foto Slide 2 (Opsional)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { uploadImage } = await import('@/lib/uploadHelper');
                      const url = await uploadImage(file, 'banner');
                      setHeroBannerUrl2(url);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
                />
                {heroBannerUrl2 && (
                  <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                    <img src={heroBannerUrl2} alt="Preview Banner 2" className="w-16 h-10 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setHeroBannerUrl2('')}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Foto Slide 3 (Opsional)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { uploadImage } = await import('@/lib/uploadHelper');
                      const url = await uploadImage(file, 'banner');
                      setHeroBannerUrl3(url);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
                />
                {heroBannerUrl3 && (
                  <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                    <img src={heroBannerUrl3} alt="Preview Banner 3" className="w-16 h-10 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setHeroBannerUrl3('')}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Box Banner Hero Halaman Profil (3 Foto Slider Khusus Profil) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            <span>🖼️</span> Banner Slider Halaman Profil (3 Foto Slider Khusus Halaman Profil)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Upload foto slider yang khusus ditampilkan di bagian atas halaman <strong>Profil Kelurahan</strong> (terpisah dari halaman Beranda).
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Foto Slide 1 (Halaman Profil)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { uploadImage } = await import('@/lib/uploadHelper');
                      const url = await uploadImage(file, 'banner');
                      setProfilBannerUrl(url);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
                />
                {profilBannerUrl && (
                  <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                    <img src={profilBannerUrl} alt="Preview Profil Banner 1" className="w-16 h-10 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setProfilBannerUrl('')}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Foto Slide 2 (Halaman Profil)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { uploadImage } = await import('@/lib/uploadHelper');
                      const url = await uploadImage(file, 'banner');
                      setProfilBannerUrl2(url);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
                />
                {profilBannerUrl2 && (
                  <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                    <img src={profilBannerUrl2} alt="Preview Profil Banner 2" className="w-16 h-10 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setProfilBannerUrl2('')}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Foto Slide 3 (Halaman Profil)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { uploadImage } = await import('@/lib/uploadHelper');
                      const url = await uploadImage(file, 'banner');
                      setProfilBannerUrl3(url);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
                />
                {profilBannerUrl3 && (
                  <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                    <img src={profilBannerUrl3} alt="Preview Profil Banner 3" className="w-16 h-10 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setProfilBannerUrl3('')}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Box Kelola Struktur Pemerintahan (Semua Anggota & Staf) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span>👥</span> Kelola Struktur Pemerintahan
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Kelola daftar pejabat dan staf kelurahan. Data ini ditampilkan di halaman Profil (termasuk tombol Lihat Lainnya).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStrukturList([
                  ...strukturList,
                  { id: Date.now(), jabatan: 'Staf', nama: '', foto_url: null },
                ]);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              + Tambah Anggota Struktur
            </button>
          </div>

          <div className="space-y-4">
            {strukturList.map((pegawai, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
              >
                <span className="text-sm font-bold text-gray-400 w-6 text-center">{idx + 1}.</span>

                {/* Upload Foto */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-12 h-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden border border-gray-300 flex-shrink-0">
                    {pegawai.foto_url ? (
                      <img src={pegawai.foto_url} alt={pegawai.nama} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const { uploadImage } = await import('@/lib/uploadHelper');
                        const url = await uploadImage(file, 'profil');
                        const updated = [...strukturList];
                        updated[idx].foto_url = url;
                        setStrukturList(updated);
                      }
                    }}
                    className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                {/* Input Jabatan */}
                <div className="w-full md:w-56">
                  <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Jabatan / Posisi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kasi Pemerintahan"
                    value={pegawai.jabatan}
                    onChange={(e) => {
                      const updated = [...strukturList];
                      updated[idx].jabatan = e.target.value;
                      setStrukturList(updated);
                    }}
                    className="w-full p-2 text-xs border rounded-lg dark:bg-gray-700 border-gray-300 dark:border-gray-600 font-semibold"
                  />
                </div>

                {/* Input Nama Pegawai */}
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Nama Pegawai / Staf"
                    value={pegawai.nama}
                    onChange={(e) => {
                      const updated = [...strukturList];
                      updated[idx].nama = e.target.value;
                      setStrukturList(updated);
                    }}
                    className="w-full p-2 text-xs border rounded-lg dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStrukturList(strukturList.filter((_, i) => i !== idx));
                  }}
                  className="text-xs text-rose-600 hover:underline px-2 py-1 flex-shrink-0 self-end md:self-center"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Box Informasi Lurah */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>👤</span> Informasi Lurah
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Nama Lurah
              </label>
              <input
                type="text"
                required
                value={namaLurah}
                onChange={(e) => setNamaLurah(e.target.value)}
                placeholder="Contoh: Nama Lurah, S.Sos."
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Jabatan / Pangkat
              </label>
              <input
                type="text"
                required
                value={jabatanLurah}
                onChange={(e) => setJabatanLurah(e.target.value)}
                placeholder="Lurah Bonto Lebang"
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Foto Lurah (Unggah File Gambar)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { uploadImage } = await import('@/lib/uploadHelper');
                      const url = await uploadImage(file, 'profil');
                      setFotoLurahUrl(url);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
                />
                {fotoLurahUrl && (
                  <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                    <img src={fotoLurahUrl} alt="Preview Lurah" className="w-12 h-12 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setFotoLurahUrl('')}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Hapus Foto
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Box Wilayah Kelurahan */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>📍</span> Informasi Wilayah
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Kelurahan / Desa
              </label>
              <input
                type="text"
                required
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Kecamatan
              </label>
              <input
                type="text"
                required
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Kabupaten / Kota
              </label>
              <input
                type="text"
                required
                value={kabupaten}
                onChange={(e) => setKabupaten(e.target.value)}
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Box Sambutan, Sejarah, Visi & Misi */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>📜</span> Sambutan Lurah, Sejarah Singkat, Visi & Misi
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Sambutan Lurah (Ditampilkan di Beranda Utama)
              </label>
              <textarea
                rows={4}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Selamat datang di website resmi Kelurahan Bonto Lebang. Sebagai wujud komitmen kami..."
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600 font-sans"
              ></textarea>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Teks sambutan ini akan langsung ditampilkan di bagian Sambutan Lurah pada halaman depan Beranda.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Sejarah Singkat Kelurahan (Ditampilkan di Halaman Profil)
              </label>
              <textarea
                rows={5}
                value={sejarahText}
                onChange={(e) => setSejarahText(e.target.value)}
                placeholder="Kelurahan Bonto Lebang merupakan salah satu kelurahan yang berada di wilayah Kecamatan Bissappu..."
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600 font-sans"
              ></textarea>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Teks sejarah singkat ini akan ditampilkan di bagian awal Halaman Profil Kelurahan.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Visi Kelurahan
              </label>
              <textarea
                rows={2}
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                placeholder="Terwujudnya Kelurahan Bonto Lebang yang Maju, Sejahtera, dan Berbudaya."
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Misi Kelurahan
              </label>
              <textarea
                rows={5}
                value={misi}
                onChange={(e) => setMisi(e.target.value)}
                placeholder="1. Meningkatkan pelayanan publik...&#10;2. Mengoptimalkan potensi pesisir...&#10;3. Mendorong pengembangan pertanian...&#10;4. Membangun tata kelola..."
                className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm border-gray-300 dark:border-gray-600 font-sans"
              ></textarea>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                💡 <strong>Petunjuk:</strong> Tekan ENTER (baris baru) atau berikan nomor (1., 2., 3., 4.) untuk setiap poin misi agar ditampilkan rapi sebagai daftar per poin.
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md shadow-indigo-200 dark:shadow-none flex items-center gap-2"
          >
            {saving ? 'Menyimpan...' : '💾 Simpan Perubahan Profil'}
          </button>
        </div>
      </form>
    </div>
  );
}
