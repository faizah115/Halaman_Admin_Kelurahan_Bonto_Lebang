'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type UMKMItem = {
  id: number;
  nama_produk: string;
  pemilik: string;
  deskripsi: string;
  harga?: string | null;
  kategori?: string | null;
  kontak_wa?: string | null;
  foto_url?: string | null;
};

function extractFotos(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean).slice(0, 3);
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).slice(0, 3);
      } catch (e) {}
    }
    return [trimmed].filter(Boolean);
  }
  return [];
}

export default function AdminUMKMPage() {
  const [umkmList, setUmkmList] = useState<UMKMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<UMKMItem | null>(null);

  // Form states
  const [namaProduk, setNamaProduk] = useState('');
  const [pemilik, setPemilik] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [kontakWa, setKontakWa] = useState('');
  const [fotoUrl1, setFotoUrl1] = useState('');
  const [fotoUrl2, setFotoUrl2] = useState('');
  const [fotoUrl3, setFotoUrl3] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUMKM();
  }, []);

  const fetchUMKM = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('umkm')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUmkmList(data.map((row: any) => ({
        ...row,
        foto_url: row.gambar_url || row.foto_url || '',
        kontak_wa: row.kontak || row.kontak_wa || '',
        harga: row.kategori || (row.harga != null ? (typeof row.harga === 'number' ? `Rp ${row.harga.toLocaleString('id-ID')}` : String(row.harga)) : ''),
      })));
    } else {
      setUmkmList([]);
    }
    setLoading(false);
  };

  const handleOpenModal = (item?: UMKMItem) => {
    if (item) {
      setEditItem(item);
      setNamaProduk(item.nama_produk);
      setPemilik(item.pemilik || '');
      setDeskripsi(item.deskripsi || '');
      setHarga(item.kategori || item.harga || '');
      setKontakWa(item.kontak_wa || (item as any).kontak || '');
      
      const fotos = extractFotos(item.foto_url || (item as any).gambar_url);
      setFotoUrl1(fotos[0] || '');
      setFotoUrl2(fotos[1] || '');
      setFotoUrl3(fotos[2] || '');
    } else {
      setEditItem(null);
      setNamaProduk('');
      setPemilik('');
      setDeskripsi('');
      setHarga('');
      setKontakWa('');
      setFotoUrl1('');
      setFotoUrl2('');
      setFotoUrl3('');
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let numericHarga: number | null = null;
    if (harga) {
      const match = harga.match(/[0-9]+/);
      if (match) {
        const parsed = parseFloat(match[0]);
        if (!isNaN(parsed)) numericHarga = parsed;
      }
    }

    const activeFotos = [fotoUrl1, fotoUrl2, fotoUrl3].map(f => f.trim()).filter(Boolean);
    const finalGambarUrl = activeFotos.length > 1 
      ? JSON.stringify(activeFotos) 
      : (activeFotos[0] || null);

    const payload: any = {
      nama_produk: namaProduk,
      pemilik: pemilik || null,
      deskripsi: deskripsi || null,
      harga: numericHarga,
      kategori: harga || null,
      kontak: kontakWa || null,
      gambar_url: finalGambarUrl,
    };

    if (editItem && editItem.id > 0) {
      const { data: updatedData, error } = await supabase
        .from('umkm')
        .update(payload)
        .eq('id', editItem.id)
        .select();

      if (error) {
        alert('Gagal mengupdate produk UMKM: ' + error.message);
      } else {
        fetchUMKM();
        setShowModal(false);
      }
    } else {
      const { error } = await supabase
        .from('umkm')
        .insert([payload]);

      if (error) {
        alert('Gagal menambah produk UMKM: ' + error.message);
      } else {
        fetchUMKM();
        setShowModal(false);
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk UMKM ini?')) return;
    if (id > 0) {
      const { error } = await supabase
        .from('umkm')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Gagal menghapus UMKM: ' + error.message);
      }
    }
    fetchUMKM();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Katalog Potensi & UMKM</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Promosikan hasil olahan, kerajinan, dan produk unggulan warga Bonto Lebang.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
        >
          <span>🛍️</span> Tambah Produk Baru
        </button>
      </div>

      {/* Grid Katalog Produk */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl">
          <span className="animate-spin inline-block mr-2">⏳</span> Memuat produk UMKM...
        </div>
      ) : umkmList.length === 0 ? (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <span className="text-4xl block mb-2">🛍️</span>
          <p className="font-semibold text-base">Belum Ada Produk UMKM</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Klik tombol "Tambah Produk Baru" untuk mendaftarkan etalase produk warga.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {umkmList.map((item) => {
            const itemFotos = extractFotos(item.foto_url || (item as any).gambar_url);
            const primaryFoto = itemFotos[0];

            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="h-44 bg-gray-100 dark:bg-gray-700 relative flex items-center justify-center overflow-hidden">
                    {primaryFoto ? (
                      <img src={primaryFoto} alt={item.nama_produk} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                    {itemFotos.length > 1 && (
                      <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                        <span>🖼️</span> {itemFotos.length} Foto
                      </span>
                    )}
                    {item.harga && (
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        {item.harga}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{item.nama_produk}</h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-3">👤 Pemilik: {item.pemilik || '-'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.deskripsi}</p>
                    {item.kontak_wa && (
                      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                        <span>📱</span> WA: {item.kontak_wa}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
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
                {editItem ? '✏️ Edit Produk UMKM' : '🛍️ Tambah Produk UMKM Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                  placeholder="Contoh: Keripik Rumput Laut Crispy"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nama Pemilik / Usaha
                  </label>
                  <input
                    type="text"
                    required
                    value={pemilik}
                    onChange={(e) => setPemilik(e.target.value)}
                    placeholder="Contoh: Ibu Hasnah"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Harga / Rentang Harga Produk
                  </label>
                  <input
                    type="text"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="Contoh: Rp 25.000 - 50.000 / kg"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-1">
                    Bisa berupa nominal (Rp 20.000) atau rentang harga (Rp 15.000 - 25.000 / kg).
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  No. WhatsApp Pemesan
                </label>
                <input
                  type="text"
                  value={kontakWa}
                  onChange={(e) => setKontakWa(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {/* Unggah 3 Foto Produk */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                    🖼️ Foto Produk (Maksimal 3 Foto)
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">Bisa digeser/slide di halaman publik</span>
                </div>

                {[
                  { label: 'Foto 1 (Utama)', val: fotoUrl1, setVal: setFotoUrl1 },
                  { label: 'Foto 2 (Pendukung)', val: fotoUrl2, setVal: setFotoUrl2 },
                  { label: 'Foto 3 (Pendukung)', val: fotoUrl3, setVal: setFotoUrl3 },
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
                          const url = await uploadImage(file, 'umkm');
                          fSlot.setVal(url);
                        }
                      }}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
                    />
                    {fSlot.val && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <img src={fSlot.val} alt={`Preview ${idx + 1}`} className="w-10 h-10 rounded-lg object-cover border border-gray-300" />
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
                  Deskripsi Produk
                </label>
                <textarea
                  rows={4}
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan keunggulan produk, varian rasa, atau detail cara pemesanan..."
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
