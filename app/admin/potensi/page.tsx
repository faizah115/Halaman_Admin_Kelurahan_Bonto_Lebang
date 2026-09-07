'use client';

import { useState, useEffect } from 'react';
import { supabase, getProfil } from '@/lib/supabaseClient';

type PotensiItem = {
  id: number;
  judul: string;
  deskripsi: string;
  ikon: string;
  kategori?: string | null;
  foto_url?: string | null;
  urutan: number;
};

export default function AdminPotensiPage() {
  const [list, setList] = useState<PotensiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<PotensiItem | null>(null);

  // Form states
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('Wisata Alam');
  const [ikon, setIkon] = useState('⭐');
  const [fotoUrl, setFotoUrl] = useState('');
  const [urutan, setUrutan] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('potensi_unggulan')
      .select('*')
      .order('urutan', { ascending: true });

    if (!error && data && data.length > 0) {
      setList(data);
      setLoading(false);
      return;
    }

    const profil = await getProfil();
    if (profil && profil.potensi && Array.isArray(profil.potensi) && profil.potensi.length > 0) {
      setList(profil.potensi);
      setLoading(false);
      return;
    }

    setList([]);
    setLoading(false);
  };

  const savePotensiMetaToProfil = async (newList: PotensiItem[]) => {
    try {
      const { data: profilRow } = await supabase
        .from('profil')
        .select('id, sejarah')
        .limit(1)
        .maybeSingle();

      let meta: any = {};
      if (profilRow?.sejarah && typeof profilRow.sejarah === 'string' && profilRow.sejarah.startsWith('{')) {
        try {
          meta = JSON.parse(profilRow.sejarah);
        } catch (e) {
          meta = {};
        }
      }

      meta.potensi = newList;
      const jsonStr = JSON.stringify(meta);

      if (profilRow?.id) {
        await supabase.from('profil').update({ sejarah: jsonStr }).eq('id', profilRow.id);
      } else {
        await supabase.from('profil').insert([{ lokasi: 'Bonto Lebang', sejarah: jsonStr }]);
      }
    } catch (err) {
      console.error('Error saving metadata to profil:', err);
    }
  };

  const handleOpenModal = (item?: PotensiItem) => {
    if (item) {
      setEditItem(item);
      setJudul(item.judul);
      setDeskripsi(item.deskripsi);
      setKategori(item.kategori || 'Wisata Alam');
      setIkon(item.ikon || '⭐');
      setFotoUrl(item.foto_url || '');
      setUrutan(item.urutan);
    } else {
      setEditItem(null);
      setJudul('');
      setDeskripsi('');
      setKategori('Wisata Alam');
      setIkon('⭐');
      setFotoUrl('');
      setUrutan(list.length + 1);
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const itemData: PotensiItem = {
      id: editItem?.id || Date.now(),
      judul,
      deskripsi,
      kategori: kategori || 'Wisata Alam',
      ikon: ikon || '⭐',
      foto_url: fotoUrl || null,
      urutan,
    };

    let updatedList: PotensiItem[] = [];
    if (editItem) {
      updatedList = list.map((item) => (item.id === editItem.id ? itemData : item));
    } else {
      updatedList = [...list, itemData];
    }

    if (editItem && editItem.id > 0) {
      await supabase.from('potensi_unggulan').update(itemData).eq('id', editItem.id);
    } else {
      await supabase.from('potensi_unggulan').insert([itemData]);
    }

    await savePotensiMetaToProfil(updatedList);

    setList(updatedList);
    setShowModal(false);
    setSubmitting(false);
    alert('Data Potensi berhasil disimpan!');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus potensi unggulan ini?')) return;
    if (id > 0) {
      await supabase.from('potensi_unggulan').delete().eq('id', id);
    }

    const updatedList = list.filter((item) => item.id !== id);
    await savePotensiMetaToProfil(updatedList);
    setList(updatedList);
    alert('Potensi berhasil dihapus!');
  };

  const emojiOptions = ['🌊', '🌾', '🕌', '🐟', '🏖️', '🌴', '🎣', '🛶', '🌿', '🏛️', '🎭', '🍚', '🐄', '🌻', '⭐'];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Potensi Unggulan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Potensi unggulan kelurahan yang ditampilkan di halaman Beranda.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
        >
          <span>➕</span> Tambah Potensi Baru
        </button>
      </div>

      {/* Grid Kartu Potensi */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-2xl">
          <span className="animate-spin inline-block mr-2">⏳</span> Memuat data...
        </div>
      ) : list.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <span className="text-4xl block mb-2">🏆</span>
          <p className="font-semibold text-base">Belum Ada Potensi Unggulan</p>
          <p className="text-xs text-gray-400 mt-1">Klik &quot;Tambah Potensi Baru&quot; untuk menambahkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
              <div className="p-6 text-center">
                {item.foto_url ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow">
                    <img src={item.foto_url} alt={item.judul} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-6xl mb-4 block drop-shadow-md">{item.ikon}</span>
                )}
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{item.judul}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">{item.deskripsi}</p>
                <span className="inline-block mt-3 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">Urutan: {item.urutan}</span>
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
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 mb-5">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {editItem ? '✏️ Edit Potensi Unggulan' : '➕ Tambah Potensi Unggulan'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nama Tempat Wisata / Potensi
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Wisata Bahari & Pesisir Bonto Lebang"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Kategori Wisata (Badge Pill)
                </label>
                <input
                  type="text"
                  required
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  placeholder="Contoh: Wisata Alam, Wisata Bahari, Wisata Budaya"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Ikon / Emoji
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {emojiOptions.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setIkon(e)}
                        className={`text-2xl p-1.5 rounded-lg transition ${ikon === e ? 'bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Terpilih: <span className="text-2xl">{ikon}</span></p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={urutan}
                    onChange={(e) => setUrutan(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Foto Potensi (Unggah File Gambar — Opsional)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const { uploadImage } = await import('@/lib/uploadHelper');
                        const url = await uploadImage(file, 'potensi');
                        setFotoUrl(url);
                      }
                    }}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/40 dark:file:text-indigo-300"
                  />
                  {fotoUrl && (
                    <div className="flex items-center gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                      <img src={fotoUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                      <button type="button" onClick={() => setFotoUrl('')} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Jika tidak ada foto, ikon emoji akan digunakan.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan keunggulan potensi ini..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50">
                  {submitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
