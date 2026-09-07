'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type PengaduanItem = {
  id: number;
  judul: string;
  nama: string;
  telepon?: string | null;
  kontak?: string | null;
  kategori?: string | null;
  isi?: string | null;
  status: string;
  created_at: string;
};

function parseDetailIsi(raw?: string | null) {
  if (!raw) return { tipe: 'PENGADUAN', isi: '', tanggal_kejadian: '', lokasi_kejadian: '', foto_bukti: [] };
  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          tipe: parsed.tipe || 'PENGADUAN',
          isi: parsed.isi || '',
          tanggal_kejadian: parsed.tanggal_kejadian || '',
          lokasi_kejadian: parsed.lokasi_kejadian || '',
          foto_bukti: Array.isArray(parsed.foto_bukti) ? parsed.foto_bukti : [],
        };
      }
    } catch (e) {}
  }
  return { tipe: 'PENGADUAN', isi: trimmed, tanggal_kejadian: '', lokasi_kejadian: '', foto_bukti: [] };
}

const formatFullDateTime = (dateStr: string) => {
  if (!dateStr) return { tanggal: '-', jam: '-' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { tanggal: dateStr, jam: '-' };

  const tanggal = d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const jam = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + ' WITA';

  return { tanggal, jam };
};

export default function AdminPengaduanPage() {
  const [pengaduanList, setPengaduanList] = useState<PengaduanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'semua' | 'pengaduan' | 'kritik'>('semua');
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  
  // Detail Modal state
  const [detailItem, setDetailItem] = useState<PengaduanItem | null>(null);

  useEffect(() => {
    fetchPengaduan();

    // Supabase Real-Time Listener for instant background updates
    const channel = supabase
      .channel('pengaduan-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pengaduan' },
        () => {
          fetchPengaduan();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeActive(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPengaduan = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pengaduan')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPengaduanList(data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from('pengaduan')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Gagal mengupdate status: ' + error.message);
    } else {
      fetchPengaduan();
      if (detailItem && detailItem.id === id) {
        setDetailItem({ ...detailItem, status: newStatus });
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;

    const { error } = await supabase
      .from('pengaduan')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Gagal menghapus laporan: ' + error.message);
    } else {
      fetchPengaduan();
      if (detailItem && detailItem.id === id) {
        setDetailItem(null);
      }
    }
  };

  const handleOpenDetail = (item: PengaduanItem) => {
    setDetailItem(item);
    // If status is 'baru' (unread), automatically update status to 'diproses' when read
    if (item.status === 'baru') {
      handleUpdateStatus(item.id, 'diproses');
    }
  };

  const filteredList = pengaduanList.filter((item) => {
    const detail = parseDetailIsi(item.isi);
    if (selectedTab === 'pengaduan') {
      return detail.tipe === 'PENGADUAN' || item.judul?.includes('[PENGADUAN]');
    } else if (selectedTab === 'kritik') {
      return detail.tipe === 'KRITIK_SARAN' || item.judul?.includes('[KRITIK');
    }
    return true;
  });

  const unreadCount = pengaduanList.filter(item => item.status === 'baru').length;

  return (
    <div>
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Pengaduan & Saran</h1>
            {isRealtimeActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Real-Time Active
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Daftar laporan terkirim secara otomatis (Real-Time). Laporan baru yang belum dibaca ditandai khusus.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-gray-200/80 dark:bg-gray-700/80 p-1 rounded-xl text-xs font-bold self-start">
          <button
            onClick={() => setSelectedTab('semua')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedTab === 'semua'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            Semua ({pengaduanList.length})
          </button>
          <button
            onClick={() => setSelectedTab('pengaduan')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedTab === 'pengaduan'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            Pengaduan
          </button>
          <button
            onClick={() => setSelectedTab('kritik')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedTab === 'kritik'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
            }`}
          >
            Kritik & Saran
          </button>
        </div>
      </div>

      {/* Unread Alert Bar */}
      {unreadCount > 0 && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <h3 className="font-extrabold text-rose-800 dark:text-rose-200 text-sm">
                Ada {unreadCount} Laporan Masuk Baru (Belum Dibaca)!
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">
                Laporan bertanda merah belum ditinjau. Klik 'Detail' untuk membaca dan memproses laporan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Table */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl">
          <span className="animate-spin inline-block mr-2 text-2xl">⏳</span> Memuat daftar laporan...
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <span className="text-4xl block mb-2">📩</span>
          <p className="font-semibold text-base">Belum Ada Laporan</p>
          <p className="text-xs text-gray-400 mt-1">Belum ada pengaduan atau kritik & saran yang dikirimkan warga.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4">Status & Layanan</th>
                  <th className="py-3 px-4">Pelapor</th>
                  <th className="py-3 px-4">Ringkasan Laporan</th>
                  <th className="py-3 px-4">Tanggal & Jam Masuk</th>
                  <th className="py-3 px-4 text-right">Aksi Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                {filteredList.map((item) => {
                  const detail = parseDetailIsi(item.isi);
                  const isPengaduan = detail.tipe === 'PENGADUAN' || item.judul?.includes('[PENGADUAN]');
                  const isUnread = item.status === 'baru';
                  const timeInfo = formatFullDateTime(item.created_at);

                  return (
                    <tr
                      key={item.id}
                      className={`transition ${
                        isUnread
                          ? 'bg-rose-50/80 dark:bg-rose-950/30 border-l-4 border-l-rose-500 font-semibold'
                          : 'hover:bg-gray-50/80 dark:hover:bg-gray-750'
                      }`}
                    >
                      {/* Status & Layanan */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isUnread ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-sm animate-pulse mb-1 block">
                            <span>🔴</span> BARU / BELUM DIBACA
                          </span>
                        ) : (
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1 ${
                            item.status === 'selesai'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {item.status === 'selesai' ? '✓ Selesai' : '⏳ Diproses'}
                          </span>
                        )}

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isPengaduan 
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' 
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {isPengaduan ? '📢 Pengaduan' : '💡 Kritik & Saran'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-[130px]">
                            {item.kategori || 'Umum'}
                          </span>
                        </div>
                      </td>

                      {/* Pelapor */}
                      <td className="py-3.5 px-4">
                        <p className={`text-sm ${isUnread ? 'font-extrabold text-rose-900 dark:text-rose-100' : 'font-bold text-gray-800 dark:text-white'}`}>
                          {item.nama}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.telepon || item.kontak || '-'}</p>
                      </td>

                      {/* Ringkasan */}
                      <td className="py-3.5 px-4 max-w-md">
                        {detail.lokasi_kejadian && (
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5 truncate">
                            📍 {detail.lokasi_kejadian}
                          </p>
                        )}
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-snug">
                          {detail.isi || item.isi}
                        </p>
                        {detail.foto_bukti && detail.foto_bukti.length > 0 && (
                          <span className="inline-block text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded mt-1">
                            🖼️ {detail.foto_bukti.length} Foto Bukti Lapangan
                          </span>
                        )}
                      </td>

                      {/* Tanggal & Jam Masuk */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          🗓️ {timeInfo.tanggal}
                        </p>
                        <p className="text-[11px] font-semibold text-[#a91d3a] dark:text-red-400 mt-0.5">
                          ⏰ {timeInfo.jam}
                        </p>
                      </td>

                      {/* Aksi & Status */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                            isUnread
                              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                        >
                          🔍 {isUnread ? 'Baca Laporan' : 'Detail'}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-xs font-semibold transition"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail Laporan */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 my-8">
            {(() => {
              const detail = parseDetailIsi(detailItem.isi);
              const isPengaduan = detail.tipe === 'PENGADUAN' || detailItem.judul?.includes('[PENGADUAN]');
              const timeInfo = formatFullDateTime(detailItem.created_at);

              return (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        isPengaduan ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {isPengaduan ? '📢 Pengaduan Masyarakat' : '💡 Kritik dan Saran'}
                      </span>
                      <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mt-2">
                        {detailItem.kategori || 'Laporan Umum'}
                      </h2>
                    </div>
                    <button
                      onClick={() => setDetailItem(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-gray-400 font-semibold block">Nama Pelapor:</span>
                      <span className="font-bold text-gray-800 dark:text-white text-sm">{detailItem.nama}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-semibold block">Kontak / WhatsApp:</span>
                      <span className="font-bold text-gray-800 dark:text-white text-sm">
                        {detailItem.telepon || detailItem.kontak || '-'}
                      </span>
                    </div>

                    {detail.tanggal_kejadian && (
                      <div>
                        <span className="text-gray-400 font-semibold block">Tanggal Kejadian:</span>
                        <span className="font-bold text-gray-800 dark:text-white">{detail.tanggal_kejadian}</span>
                      </div>
                    )}

                    {detail.lokasi_kejadian && (
                      <div>
                        <span className="text-gray-400 font-semibold block">Lokasi Kejadian:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">📍 {detail.lokasi_kejadian}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-gray-400 font-semibold block">🗓️ Tanggal Masuk:</span>
                      <span className="font-bold text-gray-800 dark:text-white">{timeInfo.tanggal}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-semibold block">⏰ Jam Masuk / Terkirim:</span>
                      <span className="font-bold text-[#a91d3a] dark:text-red-400">{timeInfo.jam}</span>
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <span className="text-gray-500 font-bold">Ubah Status Penanganan:</span>
                      <select
                        value={detailItem.status || 'baru'}
                        onChange={(e) => handleUpdateStatus(detailItem.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-[#a91d3a]"
                      >
                        <option value="baru">🔴 Baru / Belum Dibaca</option>
                        <option value="diproses">⏳ Sedang Diproses</option>
                        <option value="selesai">✓ Selesai Ditangani</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isPengaduan ? 'Isi Pengaduan:' : 'Isi Kritik & Saran:'}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 p-4 rounded-2xl border border-gray-200 dark:border-gray-600 leading-relaxed whitespace-pre-line">
                      {detail.isi || detailItem.isi}
                    </p>
                  </div>

                  {/* Foto Bukti jika ada */}
                  {detail.foto_bukti && detail.foto_bukti.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                        🖼️ Foto Bukti Kondisi Lapangan ({detail.foto_bukti.length} Foto):
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {detail.foto_bukti.map((url: string, idx: number) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-28 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:opacity-90 transition"
                          >
                            <img src={url} alt={`Bukti ${idx + 1}`} className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => setDetailItem(null)}
                      className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold transition"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
