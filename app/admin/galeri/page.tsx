'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type GaleriItem = {
  id: number;
  judul: string;
  kategori: string;
  tanggal: string;
  foto_url: string;
  deskripsi?: string | null;
  keterangan?: string | null;
};

function extractFotos(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean).slice(0, 6);
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).slice(0, 6);
      } catch (e) {}
    }
    return [trimmed].filter(Boolean);
  }
  return [];
}

function parseDeskripsi(raw?: string | null): { deskripsi: string; lokasi: string } {
  if (!raw) return { deskripsi: '', lokasi: '' };
  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          deskripsi: parsed.deskripsi || parsed.text || '',
          lokasi: parsed.lokasi || '',
        };
      }
    } catch (e) {}
  }
  return { deskripsi: trimmed, lokasi: '' };
}

export default function AdminGaleriPage() {
  const [galeriList, setGaleriList] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<GaleriItem | null>(null);

  // Form states
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('KKN');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [fotoUrl1, setFotoUrl1] = useState('');
  const [fotoUrl2, setFotoUrl2] = useState('');
  const [fotoUrl3, setFotoUrl3] = useState('');
  const [fotoUrl4, setFotoUrl4] = useState('');
  const [fotoUrl5, setFotoUrl5] = useState('');
  const [fotoUrl6, setFotoUrl6] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('tanggal', { ascending: false });

    if (!error && data) {
      setGaleriList(data);
    }
    setLoading(false);
  };

  const handleOpenModal = (item?: GaleriItem) => {
    if (item) {
      setEditItem(item);
      setJudul(item.judul);
      setKategori(item.kategori || 'KKN');
      setTanggal(item.tanggal || new Date().toISOString().split('T')[0]);

      const parsedDesc = parseDeskripsi(item.deskripsi || item.keterangan);
      setKeterangan(parsedDesc.deskripsi);
      setLokasi(parsedDesc.lokasi);

      const fotos = extractFotos(item.foto_url);
      setFotoUrl1(fotos[0] || '');
      setFotoUrl2(fotos[1] || '');
      setFotoUrl3(fotos[2] || '');
      setFotoUrl4(fotos[3] || '');
      setFotoUrl5(fotos[4] || '');
      setFotoUrl6(fotos[5] || '');
    } else {
      setEditItem(null);
      setJudul('');
      setKategori('KKN');
      setTanggal(new Date().toISOString().split('T')[0]);
      setKeterangan('');
      setLokasi('');
      setFotoUrl1('');
      setFotoUrl2('');
      setFotoUrl3('');
      setFotoUrl4('');
      setFotoUrl5('');
      setFotoUrl6('');
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const activeFotos = [fotoUrl1, fotoUrl2, fotoUrl3, fotoUrl4, fotoUrl5, fotoUrl6].map((f) => f.trim()).filter(Boolean);
    const finalFotoUrl = activeFotos.length > 1
      ? JSON.stringify(activeFotos)
      : (activeFotos[0] || '');

    const deskripsiPayload = (lokasi.trim() || keterangan.trim())
      ? JSON.stringify({ deskripsi: keterangan.trim(), lokasi: lokasi.trim() })
      : null;

    const payload = {
      judul,
      kategori,
      tanggal,
      foto_url: finalFotoUrl,
      deskripsi: deskripsiPayload,
    };

    if (editItem) {
      const { error } = await supabase
        .from('galeri')
        .update(payload)
        .eq('id', editItem.id);

      if (error) {
        alert('Gagal mengupdate dokumentasi galeri: ' + error.message);
      } else {
        fetchGaleri();
        setShowModal(false);
      }
    } else {
      const { error } = await supabase
        .from('galeri')
        .insert([payload]);

      if (error) {
        alert('Gagal menambah dokumentasi galeri: ' + error.message);
      } else {
        fetchGaleri();
        setShowModal(false);
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto kegiatan ini?')) return;

    const { error } = await supabase
      .from('galeri')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Gagal menghapus dokumentasi: ' + error.message);
    } else {
      fetchGaleri();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Galeri Kegiatan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Dokumentasi foto kegiatan kelurahan dan program kerja KKN mahasiswa (bisa hingga 6 foto per kegiatan).
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
        >
          <span>📸</span> Unggah Foto Baru
        </button>
      </div>

      {/* Grid Foto Galeri */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl">
          <span className="animate-spin inline-block mr-2">⏳</span> Memuat foto galeri...
        </div>
      ) : galeriList.length === 0 ? (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <span className="text-4xl block mb-2">🖼️</span>
          <p className="font-semibold text-base">Belum Ada Dokumentasi Kegiatan</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Klik tombol "Unggah Foto Baru" untuk menambahkan album kegiatan pertama.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeriList.map((item) => {
            const itemFotos = extractFotos(item.foto_url);
            const primaryFoto = itemFotos[0];
            const parsedDesc = parseDeskripsi(item.deskripsi || item.keterangan);

            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden flex items-center justify-center">
                    {primaryFoto ? (
                      <img src={primaryFoto} alt={item.judul} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">📸</span>
                    )}
                    <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      {item.kategori || 'Kegiatan'}
                    </span>
                    {itemFotos.length > 1 && (
                      <span className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                        <span>🖼️</span> {itemFotos.length} Foto
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{item.tanggal}</p>
                    <h3 className="font-bold text-base text-gray-800 dark:text-white mb-1">{item.judul}</h3>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1">
                      <span>📍</span> {parsedDesc.lokasi || 'Kelurahan Bonto Lebang'}
                    </p>
                    {parsedDesc.deskripsi && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{parsedDesc.deskripsi}</p>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-xs font-medium transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-xs font-medium transition"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 mb-5">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {editItem ? '✏️ Edit Dokumentasi Foto' : '📸 Unggah Foto Kegiatan Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Judul Kegiatan / Program Kerja
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Kerja Bakti Pembersihan Lingkungan RW 02"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Kategori Kegiatan
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="KKN">Kegiatan KKN Mahasiswa</option>
                    <option value="Kemasyarakatan">Kegiatan Kemasyarakatan</option>
                    <option value="Pemerintahan">Kegiatan Kelurahan</option>
                    <option value="Keagamaan">Kegiatan Keagamaan / Religi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  📍 Lokasi Spesifik Kegiatan (Opsional)
                </label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Contoh: RW 02 Bonto Lebang / Kantor Kelurahan (Default: Kelurahan Bonto Lebang)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {/* Unggah 3 Foto Dokumentasi */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                    🖼️ Foto Dokumentasi (Maksimal 6 Foto)
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">Bisa digeser/slide di halaman publik</span>
                </div>

                {[
                  { label: 'Foto 1 (Utama)', val: fotoUrl1, setVal: setFotoUrl1 },
                  { label: 'Foto 2 (Pendukung)', val: fotoUrl2, setVal: setFotoUrl2 },
                  { label: 'Foto 3 (Pendukung)', val: fotoUrl3, setVal: setFotoUrl3 },
                  { label: 'Foto 4 (Pendukung)', val: fotoUrl4, setVal: setFotoUrl4 },
                  { label: 'Foto 5 (Pendukung)', val: fotoUrl5, setVal: setFotoUrl5 },
                  { label: 'Foto 6 (Pendukung)', val: fotoUrl6, setVal: setFotoUrl6 },
                ].map((fSlot, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-32 flex-shrink-0">
                      {fSlot.label}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const { uploadImage } = await import('@/lib/uploadHelper');
                          const url = await uploadImage(file, 'galeri');
                          fSlot.setVal(url);
                        }
                      }}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-900/40 dark:file:text-amber-300"
                    />
                    {fSlot.val && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <img src={fSlot.val} alt={`Preview Galeri ${idx + 1}`} className="w-10 h-10 rounded-lg object-cover border border-gray-300" />
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Keterangan Singkat (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Tuliskan catatan singkat mengenai hasil kegiatan atau lokasi pelaksanaan..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
