'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type BeritaItem = {
  id: number;
  judul: string;
  kategori: string;
  tanggal: string;
  ringkasan: string;
  isi: string;
  gambar_url?: string | null;
  is_placeholder?: boolean;
};

const defaultPlaceholderBerita: BeritaItem[] = [];

function parseRingkasanPenulis(rawRingkasan?: string | null) {
  if (!rawRingkasan) return { ringkasan: '', penulis: 'Redaksi Kelurahan' };
  const trimmed = rawRingkasan.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          ringkasan: parsed.ringkasan || '',
          penulis: parsed.penulis || 'Redaksi Kelurahan',
        };
      }
    } catch (e) {}
  }
  return { ringkasan: trimmed, penulis: 'Redaksi Kelurahan' };
}

export default function AdminBeritaPage() {
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<BeritaItem | null>(null);

  // Form states
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Berita');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [penulis, setPenulis] = useState('Humas Kelurahan');
  const [ringkasan, setRingkasan] = useState('');
  const [isi, setIsi] = useState('');
  const [gambarUrl, setGambarUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBerita();
  }, []);

  const fetchBerita = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('tanggal', { ascending: false });

    if (!error && data && data.length > 0) {
      setBeritaList(data);
    } else {
      setBeritaList(defaultPlaceholderBerita);
    }
    setLoading(false);
  };

  const handleOpenModal = (item?: BeritaItem) => {
    if (item) {
      const parsed = parseRingkasanPenulis(item.ringkasan);
      setEditItem(item);
      setJudul(item.judul);
      setKategori(item.kategori || 'Berita');
      setTanggal(item.tanggal || new Date().toISOString().split('T')[0]);
      setPenulis(parsed.penulis);
      setRingkasan(parsed.ringkasan);
      setIsi(item.isi || '');
      setGambarUrl(item.gambar_url || '');
    } else {
      setEditItem(null);
      setJudul('');
      setKategori('Berita');
      setTanggal(new Date().toISOString().split('T')[0]);
      setPenulis('Humas Kelurahan');
      setRingkasan('');
      setIsi('');
      setGambarUrl('');
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const ringkasanPayload = JSON.stringify({
      ringkasan,
      penulis,
    });

    const payload = {
      judul,
      kategori,
      tanggal,
      ringkasan: ringkasanPayload,
      isi,
      gambar_url: gambarUrl || null,
    };

    if (editItem && !editItem.is_placeholder) {
      // Update existing DB entry
      const { error } = await supabase
        .from('berita')
        .update(payload)
        .eq('id', editItem.id);

      if (error) {
        alert('Gagal mengupdate berita: ' + error.message);
      } else {
        fetchBerita();
        setShowModal(false);
      }
    } else {
      // Insert Baru or convert sample placeholder to real DB entry
      const { error } = await supabase
        .from('berita')
        .insert([payload]);

      if (error) {
        alert('Gagal menyimpan berita: ' + error.message);
      } else {
        fetchBerita();
        setShowModal(false);
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number, isPlaceholder?: boolean) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

    if (isPlaceholder) {
      // Filter out local placeholder from state
      setBeritaList(prev => prev.filter(item => item.id !== id));
    } else {
      const { error } = await supabase
        .from('berita')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Gagal menghapus berita: ' + error.message);
      } else {
        fetchBerita();
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Berita & Pengumuman</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Semua berita bawaan maupun berita baru dapat Anda edit dan perbarui secara langsung di sini.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#7a1f2b] hover:bg-[#a91d3a] text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
        >
          <span>➕</span> Tambah Berita Baru
        </button>
      </div>

      {/* Tabel Data Berita */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <span className="animate-spin inline-block mr-2">⏳</span> Memuat berita...
          </div>
        ) : beritaList.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <span className="text-4xl block mb-2">📰</span>
            <p className="font-semibold text-base">Belum Ada Berita di Database</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Klik tombol "Tambah Berita Baru" untuk menambahkan berita pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 font-semibold">
                <tr>
                  <th className="px-5 py-3">Kategori & Tanggal</th>
                  <th className="px-5 py-3">Judul Berita</th>
                  <th className="px-5 py-3">Penulis</th>
                  <th className="px-5 py-3">Ringkasan</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {beritaList.map((item) => {
                  const parsed = parseRingkasanPenulis(item.ringkasan);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-1 ${
                          item.kategori === 'Pengumuman' 
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' 
                            : 'bg-red-100 text-[#7a1f2b] dark:bg-red-900/40 dark:text-red-300'
                        }`}>
                          {item.kategori === 'Pengumuman' ? '📢 Pengumuman' : '📰 Berita'}
                        </span>
                        <p className="text-xs text-gray-400">{item.tanggal}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-800 dark:text-white max-w-xs truncate">
                        {item.judul}
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        👤 {parsed.penulis}
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {parsed.ringkasan || item.isi}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-xs font-medium transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.is_placeholder)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-xs font-medium transition"
                        >
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 mb-5">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {editItem ? '✏️ Edit Berita / Pengumuman' : '➕ Tambah Berita Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="Berita">Berita Kegiatan</option>
                    <option value="Pengumuman">Pengumuman Resmi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Post
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nama Penulis / Redaksi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                    placeholder="Contoh: Humas Kelurahan"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Judul Berita
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Jadwal Posyandu Balita Bulan Ini"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Gambar Berita (Unggah File Gambar)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const { uploadImage } = await import('@/lib/uploadHelper');
                        const url = await uploadImage(file, 'berita');
                        setGambarUrl(url);
                      }
                    }}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#7a1f2b] hover:file:bg-red-100 dark:file:bg-red-950/40 dark:file:text-red-300"
                  />
                  {gambarUrl && (
                    <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                      <img src={gambarUrl} alt="Preview Berita" className="w-12 h-12 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => setGambarUrl('')}
                        className="text-xs text-rose-600 hover:underline font-semibold"
                      >
                        Hapus Gambar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Ringkasan Singkat
                </label>
                <input
                  type="text"
                  value={ringkasan}
                  onChange={(e) => setRingkasan(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk ditampilkan di kartu berita"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Isi Lengkap Berita
                </label>
                <textarea
                  rows={6}
                  required
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Tuliskan berita atau pengumuman lengkap di sini..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm leading-relaxed"
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
                  className="px-5 py-2 bg-[#7a1f2b] hover:bg-[#a91d3a] text-white rounded-xl text-sm font-bold transition disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
