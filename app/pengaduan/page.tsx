'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { uploadImage } from '@/lib/uploadHelper';

function PengaduanFormContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');

  // Dropdown Layanan: 'pengaduan' | 'kritik'
  const [jenisLayanan, setJenisLayanan] = useState<'pengaduan' | 'kritik'>('pengaduan');

  useEffect(() => {
    if (typeParam === 'kritik') {
      setJenisLayanan('kritik');
    } else if (typeParam === 'pengaduan') {
      setJenisLayanan('pengaduan');
    }
  }, [typeParam]);

  // Shared Form States
  const [namaPelapor, setNamaPelapor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Form States - Pengaduan Masyarakat
  const [tanggalKejadian, setTanggalKejadian] = useState(new Date().toISOString().split('T')[0]);
  const [nomorHp, setNomorHp] = useState('');
  const [kategoriPengaduan, setKategoriPengaduan] = useState('Infrastruktur (jalan, lampu jalan, saluran air, dll)');
  const [lokasiKejadian, setLokasiKejadian] = useState('');
  const [isiPengaduan, setIsiPengaduan] = useState('');
  
  // Upload 1-3 foto pengaduan
  const [foto1, setFoto1] = useState('');
  const [foto2, setFoto2] = useState('');
  const [foto3, setFoto3] = useState('');

  // 2. Form States - Kritik dan Saran
  const [kategoriSaran, setKategoriSaran] = useState('Pelayanan Kelurahan');
  const [isiSaran, setIsiSaran] = useState('');

  const resetForm = () => {
    setNamaPelapor('');
    setNomorHp('');
    setLokasiKejadian('');
    setIsiPengaduan('');
    setIsiSaran('');
    setFoto1('');
    setFoto2('');
    setFoto3('');
    setSubmittedSuccess(false);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      if (jenisLayanan === 'pengaduan') {
        const activeFotos = [foto1, foto2, foto3].filter(Boolean);
        
        // Payload JSON format string for detailed pengaduan payload
        const detailIsi = JSON.stringify({
          tipe: 'PENGADUAN',
          tanggal_kejadian: tanggalKejadian,
          lokasi_kejadian: lokasiKejadian,
          isi: isiPengaduan,
          foto_bukti: activeFotos,
        });

        const payload = {
          judul: `[PENGADUAN] ${kategoriPengaduan.split(' ')[0]} - ${namaPelapor}`,
          nama: namaPelapor,
          telepon: nomorHp,
          kategori: kategoriPengaduan,
          isi: detailIsi,
          status: 'baru',
        };

        const { error } = await supabase.from('pengaduan').insert([payload]);
        if (error) throw error;

      } else {
        // Kritik dan Saran
        const detailIsi = JSON.stringify({
          tipe: 'KRITIK_SARAN',
          isi: isiSaran,
        });

        const payload = {
          judul: `[KRITIK & SARAN] ${kategoriSaran} - ${namaPelapor}`,
          nama: namaPelapor,
          kategori: kategoriSaran,
          isi: detailIsi,
          status: 'baru',
        };

        const { error } = await supabase.from('pengaduan').insert([payload]);
        if (error) throw error;
      }

      setSubmittedSuccess(true);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setErrorMessage(err?.message || 'Gagal mengirimkan laporan. Silakan coba beberapa saat lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#7a1f2b] via-[#a91d3a] to-[#7a1f2b] text-white py-16 px-6 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-md">
          Layanan Pengaduan & Saran
        </h1>
        <p className="text-red-100 text-lg max-w-2xl mx-auto font-medium">
          Wadah resmi masyarakat untuk menyampaikan pengaduan kendala lapangan serta kritik dan saran demi kemajuan Kelurahan Bonto Lebang.
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        
        {/* Card Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden p-6 sm:p-10">
          
          {/* Form Content / Success Banner */}
          {submittedSuccess ? (
            <div className="text-center py-10 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center text-3xl mx-auto font-bold shadow-md">
                ✓
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                {jenisLayanan === 'pengaduan' ? 'Pengaduan Berhasil Terkirim!' : 'Kritik & Saran Berhasil Terkirim!'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                {jenisLayanan === 'pengaduan'
                  ? 'Terima kasih telah melaporkan kendala. Laporan Anda akan segera ditinjau dan diverifikasi oleh petugas kelurahan.'
                  : 'Terima kasih atas masukan dan tanggapan Anda. Masukan ini sangat berharga untuk meningkatkan kualitas layanan kelurahan.'}
              </p>
              <div className="pt-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-[#a91d3a] hover:bg-[#7a1f2b] text-white font-bold rounded-xl text-sm transition shadow-md"
                >
                  Kirim Laporan Lainnya
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMessage && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* ─── 1. FORM PENGADUAN MASYARAKAT ────────────────────────────── */}
              {jenisLayanan === 'pengaduan' && (
                <>
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <span>📢</span> Form Pengaduan Masyarakat
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Silakan isi formulir di bawah ini dengan informasi yang jelas dan akurat.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Nama Pelapor <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={namaPelapor}
                      onChange={(e) => setNamaPelapor(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a91d3a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Tanggal Kejadian <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={tanggalKejadian}
                        onChange={(e) => setTanggalKejadian(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a91d3a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Nomor HP / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={nomorHp}
                        onChange={(e) => setNomorHp(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a91d3a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Kategori Pengaduan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={kategoriPengaduan}
                      onChange={(e) => setKategoriPengaduan(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a91d3a]"
                    >
                      <option value="Infrastruktur (jalan, lampu jalan, saluran air, dll)">
                        Infrastruktur (jalan, lampu jalan, saluran air, dll)
                      </option>
                      <option value="Pelayanan Publik (kinerja petugas, proses surat, dll)">
                        Pelayanan Publik (kinerja petugas, proses surat, dll)
                      </option>
                      <option value="Kebersihan Lingkungan">Kebersihan Lingkungan</option>
                      <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Lokasi Kejadian <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lokasiKejadian}
                      onChange={(e) => setLokasiKejadian(e.target.value)}
                      placeholder="Sebutkan alamat/patokan lokasi kejadian (misal: Jl. Bonto Lebang RW 02 dekat selokan)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a91d3a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Isi Pengaduan <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={isiPengaduan}
                      onChange={(e) => setIsiPengaduan(e.target.value)}
                      placeholder="Jelaskan secara rincikan kendala atau masalah yang Anda temukan..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a91d3a]"
                    />
                  </div>

                  {/* Upload 1-3 Foto Bukti */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                        Upload Foto/Bukti (Maksimal 3 Foto)
                      </label>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Upload 1-3 foto kondisi terkait pengaduan untuk memperkuat laporan dan mempercepat verifikasi.
                      </p>
                    </div>

                    {[
                      { label: 'Foto Bukti 1', val: foto1, setVal: setFoto1 },
                      { label: 'Foto Bukti 2', val: foto2, setVal: setFoto2 },
                      { label: 'Foto Bukti 3', val: foto3, setVal: setFoto3 },
                    ].map((fSlot, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-28 shrink-0">
                          {fSlot.label}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await uploadImage(file, 'pengaduan');
                                fSlot.setVal(url);
                              } catch (err) {
                                console.error('Upload error:', err);
                              }
                            }
                          }}
                          className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#a91d3a] hover:file:bg-red-100 dark:file:bg-red-950/50 dark:file:text-red-300"
                        />
                        {fSlot.val && (
                          <div className="flex items-center gap-2 shrink-0">
                            <img src={fSlot.val} alt={`Bukti ${idx + 1}`} className="w-10 h-10 rounded-lg object-cover border border-gray-300" />
                            <button
                              type="button"
                              onClick={() => fSlot.setVal('')}
                              className="text-xs text-rose-600 hover:underline font-medium"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ─── 2. FORM KRITIK DAN SARAN ───────────────────────────── */}
              {jenisLayanan === 'kritik' && (
                <>
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <span>💡</span> Form Kritik dan Saran
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Sampaikan masukan, gagasan, atau saran konstruktif Anda untuk kemajuan bersama.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Nama Pelapor <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={namaPelapor}
                      onChange={(e) => setNamaPelapor(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a91d3a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Kategori Saran <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={kategoriSaran}
                      onChange={(e) => setKategoriSaran(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a91d3a]"
                    >
                      <option value="Pelayanan Kelurahan">Pelayanan Kelurahan</option>
                      <option value="Program/Kegiatan Kelurahan">Program/Kegiatan Kelurahan</option>
                      <option value="Website & Layanan Digital">Website & Layanan Digital</option>
                      <option value="Fasilitas Umum">Fasilitas Umum</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Isi Kritik / Saran <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={isiSaran}
                      onChange={(e) => setIsiSaran(e.target.value)}
                      placeholder="Tuliskan saran, gagasan, atau kritik Anda secara jelas..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#a91d3a]"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 bg-[#a91d3a] hover:bg-[#7a1f2b] text-white font-extrabold rounded-xl text-base shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin">⏳</span> Mengirimkan Data...
                    </>
                  ) : (
                    <>
                      <span>✉️</span> {jenisLayanan === 'pengaduan' ? 'Kirim Pengaduan Masyarakat' : 'Kirim Kritik & Saran'}
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default function LayananPengaduanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 text-center text-gray-500">
        <span className="animate-spin inline-block text-2xl mb-2">⏳</span>
        <p className="font-medium text-sm">Memuat formulir layanan...</p>
      </div>
    }>
      <PengaduanFormContent />
    </Suspense>
  );
}
