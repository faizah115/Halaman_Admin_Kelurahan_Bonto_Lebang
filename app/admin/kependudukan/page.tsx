'use client';

import { useState, useEffect } from 'react';
import { supabase, getMataPencaharian, getStatistikAgama, getProfil } from '@/lib/supabaseClient';

type UsiaItem = {
  id: number;
  urutan: number;
  kelompok_umur: string;
  jumlah: number;
};

type MataPencaharianItem = {
  id: number;
  urutan: number;
  pekerjaan: string;
  jumlah: number;
};

type PertumbuhanItem = {
  id: number;
  tahun: number;
  jumlah: number;
};

type AgamaItem = {
  id: number;
  urutan: number;
  agama: string;
  jumlah: number;
};

type StuntingItem = {
  id: number;
  tahun: number;
  stunting: number;
  normal: number;
};


type JsonStatItem = {
  id: number;
  name: string;
  value: number;
};

export default function AdminKependudukanPage() {
  const [activeTab, setActiveTab] = useState<'usia' | 'mata' | 'pertumbuhan' | 'agama' | 'stunting' | 'pendidikan' | 'perkawinan'>('usia');
  const [loading, setLoading] = useState(true);

  // Data states
  const [usiaList, setUsiaList] = useState<UsiaItem[]>([]);
  const [mataList, setMataList] = useState<MataPencaharianItem[]>([]);
  const [pertumbuhanList, setPertumbuhanList] = useState<PertumbuhanItem[]>([]);
  const [agamaList, setAgamaList] = useState<AgamaItem[]>([]);
  const [stuntingList, setStuntingList] = useState<StuntingItem[]>([]);
  const [pendidikanList, setPendidikanList] = useState<JsonStatItem[]>([]);
  const [perkawinanList, setPerkawinanList] = useState<JsonStatItem[]>([]);
  const [profilId, setProfilId] = useState<number | null>(null);
  const [rawMeta, setRawMeta] = useState<any>({});

  const [showPendidikanModal, setShowPendidikanModal] = useState(false);
  const [editPendidikan, setEditPendidikan] = useState<JsonStatItem | null>(null);
  const [namaPendidikan, setNamaPendidikan] = useState('');
  const [jumlahPendidikan, setJumlahPendidikan] = useState(0);

  const [showPerkawinanModal, setShowPerkawinanModal] = useState(false);
  const [editPerkawinan, setEditPerkawinan] = useState<JsonStatItem | null>(null);
  const [namaPerkawinan, setNamaPerkawinan] = useState('');
  const [jumlahPerkawinan, setJumlahPerkawinan] = useState(0);


  const [showUsiaModal, setShowUsiaModal] = useState(false);
  const [editUsia, setEditUsia] = useState<UsiaItem | null>(null);
  const [kelompokUmur, setKelompokUmur] = useState('');
  const [jumlahUsia, setJumlahUsia] = useState(0);
  const [urutanUsia, setUrutanUsia] = useState(1);

  const [showMataModal, setShowMataModal] = useState(false);
  const [editMata, setEditMata] = useState<MataPencaharianItem | null>(null);
  const [pekerjaan, setPekerjaan] = useState('');
  const [jumlahMata, setJumlahMata] = useState(0);
  const [urutanMata, setUrutanMata] = useState(1);

  const [showPertumbuhanModal, setShowPertumbuhanModal] = useState(false);
  const [editPertumbuhan, setEditPertumbuhan] = useState<PertumbuhanItem | null>(null);
  const [tahunPertumbuhan, setTahunPertumbuhan] = useState(new Date().getFullYear());
  const [jumlahPertumbuhan, setJumlahPertumbuhan] = useState(0);

  const [showAgamaModal, setShowAgamaModal] = useState(false);
  const [editAgama, setEditAgama] = useState<AgamaItem | null>(null);
  const [namaAgama, setNamaAgama] = useState('');
  const [jumlahAgama, setJumlahAgama] = useState(0);
  const [urutanAgama, setUrutanAgama] = useState(1);

  const [showStuntingModal, setShowStuntingModal] = useState(false);
  const [editStunting, setEditStunting] = useState<StuntingItem | null>(null);
  const [tahunStunting, setTahunStunting] = useState(new Date().getFullYear());
  const [jumlahStunting, setJumlahStunting] = useState(0);
  const [jumlahNormal, setJumlahNormal] = useState(0);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);

    const { data: usiaData } = await supabase.from('kependudukan_usia').select('*').order('urutan', { ascending: true });
    if (usiaData && usiaData.length > 0) {
      setUsiaList(usiaData);
    } else {
      setUsiaList([]);
    }

    const mataData = await getMataPencaharian();
    if (mataData && mataData.length > 0) {
      setMataList(mataData);
    } else {
      setMataList([]);
    }

    const { data: pertData } = await supabase.from('pertumbuhan_penduduk').select('*').order('tahun', { ascending: true });
    if (pertData && pertData.length > 0) {
      setPertumbuhanList(pertData);
    } else {
      setPertumbuhanList([]);
    }

    const agamaData = await getStatistikAgama();
    if (agamaData && agamaData.length > 0) {
      setAgamaList(agamaData);
    } else {
      setAgamaList([]);
    }

    const { data: stuntingData } = await supabase.from('stunting').select('*').order('tahun', { ascending: true });
    if (stuntingData && stuntingData.length > 0) {
      setStuntingList(stuntingData);
    } else {
      setStuntingList([]);
    }

    const profilData = await getProfil();
    if (profilData) {
      setProfilId(profilData.id);

      let meta: any = {};
      try {
        if (typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
          meta = JSON.parse(profilData.sejarah);
        }
      } catch (e) { }
      setRawMeta(meta);

      if (profilData.pendidikan && profilData.pendidikan.length > 0) {
        setPendidikanList(profilData.pendidikan);
      } else {
        setPendidikanList([]);
      }

      if (profilData.perkawinan && profilData.perkawinan.length > 0) {
        setPerkawinanList(profilData.perkawinan);
      } else {
        setPerkawinanList([]);
      }
    } else {
      setPendidikanList([]);
      setPerkawinanList([]);
    }

    setLoading(false);
  };

  // ─── HANDLERS KELOMPOK USIA ──────────────────────────────────────────────────
  const handleOpenUsiaModal = (item?: UsiaItem) => {
    if (item) {
      setEditUsia(item);
      setKelompokUmur(item.kelompok_umur);
      setJumlahUsia(item.jumlah);
      setUrutanUsia(item.urutan);
    } else {
      setEditUsia(null);
      setKelompokUmur('');
      setJumlahUsia(0);
      setUrutanUsia(usiaList.length + 1);
    }
    setShowUsiaModal(true);
  };

  const handleSaveUsia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { kelompok_umur: kelompokUmur, jumlah: jumlahUsia, urutan: urutanUsia };

    if (editUsia && editUsia.id > 0) {
      const { data, error } = await supabase.from('kependudukan_usia').update(payload).eq('id', editUsia.id).select();
      if (error) {
        alert('Gagal update usia: ' + error.message);
      } else if (!data || data.length === 0) {
        const { error: insertErr } = await supabase.from('kependudukan_usia').insert([payload]);
        if (insertErr) alert('Gagal simpan usia: ' + insertErr.message);
        else { fetchAllData(); setShowUsiaModal(false); }
      } else {
        fetchAllData();
        setShowUsiaModal(false);
      }
    } else {
      const { error } = await supabase.from('kependudukan_usia').insert([payload]);
      if (error) alert('Gagal tambah usia: ' + error.message);
      else { fetchAllData(); setShowUsiaModal(false); }
    }
    setSubmitting(false);
  };

  const handleDeleteUsia = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data kelompok usia ini?')) return;
    if (id > 0) {
      const { error } = await supabase.from('kependudukan_usia').delete().eq('id', id);
      if (error) alert('Gagal hapus usia: ' + error.message);
    }
    fetchAllData();
  };

  // ─── HANDLERS MATA PENCAHARIAN ───────────────────────────────────────────────
  const handleOpenMataModal = (item?: MataPencaharianItem) => {
    if (item) {
      setEditMata(item);
      setPekerjaan(item.pekerjaan);
      setJumlahMata(item.jumlah);
      setUrutanMata(item.urutan || 1);
    } else {
      setEditMata(null);
      setPekerjaan('');
      setJumlahMata(0);
      setUrutanMata(mataList.length + 1);
    }
    setShowMataModal(true);
  };

  const handleSaveMata = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { name: pekerjaan, value: jumlahMata, urutan: urutanMata };

    if (editMata && editMata.id > 0) {
      const { data, error } = await supabase.from('mata_pencaharian').update(payload).eq('id', editMata.id).select();
      if (error) {
        alert('Gagal update mata pencaharian: ' + error.message);
      } else if (!data || data.length === 0) {
        const { error: insertErr } = await supabase.from('mata_pencaharian').insert([payload]);
        if (insertErr) alert('Gagal simpan mata pencaharian: ' + insertErr.message);
        else { fetchAllData(); setShowMataModal(false); }
      } else {
        fetchAllData();
        setShowMataModal(false);
      }
    } else {
      const { error } = await supabase.from('mata_pencaharian').insert([payload]);
      if (error) alert('Gagal tambah mata pencaharian: ' + error.message);
      else { fetchAllData(); setShowMataModal(false); }
    }
    setSubmitting(false);
  };

  const handleDeleteMata = async (id: number) => {
    if (!confirm('Hapus data mata pencaharian ini?')) return;
    if (id > 0) {
      const { error } = await supabase.from('mata_pencaharian').delete().eq('id', id);
      if (error) alert('Gagal hapus mata pencaharian: ' + error.message);
    }
    fetchAllData();
  };

  // ─── HANDLERS PERTUMBUHAN PENDUDUK ────────────────────────────────────────────
  const handleOpenPertumbuhanModal = (item?: PertumbuhanItem) => {
    if (item) {
      setEditPertumbuhan(item);
      setTahunPertumbuhan(item.tahun);
      setJumlahPertumbuhan(item.jumlah);
    } else {
      setEditPertumbuhan(null);
      setTahunPertumbuhan(new Date().getFullYear());
      setJumlahPertumbuhan(0);
    }
    setShowPertumbuhanModal(true);
  };

  const handleSavePertumbuhan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { tahun: tahunPertumbuhan, jumlah: jumlahPertumbuhan };

    if (editPertumbuhan && editPertumbuhan.id > 0) {
      const { data, error } = await supabase.from('pertumbuhan_penduduk').update(payload).eq('id', editPertumbuhan.id).select();
      if (error) {
        alert('Gagal update pertumbuhan: ' + error.message);
      } else if (!data || data.length === 0) {
        const { error: insertErr } = await supabase.from('pertumbuhan_penduduk').insert([payload]);
        if (insertErr) alert('Gagal simpan pertumbuhan: ' + insertErr.message);
        else { fetchAllData(); setShowPertumbuhanModal(false); }
      } else {
        fetchAllData();
        setShowPertumbuhanModal(false);
      }
    } else {
      const { error } = await supabase.from('pertumbuhan_penduduk').insert([payload]);
      if (error) alert('Gagal tambah pertumbuhan: ' + error.message);
      else { fetchAllData(); setShowPertumbuhanModal(false); }
    }
    setSubmitting(false);
  };

  const handleDeletePertumbuhan = async (id: number) => {
    if (!confirm('Hapus data pertumbuhan tahun ini?')) return;
    if (id > 0) {
      const { error } = await supabase.from('pertumbuhan_penduduk').delete().eq('id', id);
      if (error) alert('Gagal hapus pertumbuhan: ' + error.message);
    }
    fetchAllData();
  };

  // ─── HANDLERS AGAMA ──────────────────────────────────────────────────────────
  const handleOpenAgamaModal = (item?: AgamaItem) => {
    if (item) {
      setEditAgama(item);
      setNamaAgama(item.agama);
      setJumlahAgama(item.jumlah);
      setUrutanAgama(item.urutan || 1);
    } else {
      setEditAgama(null);
      setNamaAgama('');
      setJumlahAgama(0);
      setUrutanAgama(agamaList.length + 1);
    }
    setShowAgamaModal(true);
  };

  const handleSaveAgama = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { name: namaAgama, value: jumlahAgama, urutan: urutanAgama };

    if (editAgama && editAgama.id > 0) {
      const { data, error } = await supabase.from('agama').update(payload).eq('id', editAgama.id).select();
      if (error) {
        alert('Gagal update agama: ' + error.message);
      } else if (!data || data.length === 0) {
        const { error: insertErr } = await supabase.from('agama').insert([payload]);
        if (insertErr) alert('Gagal simpan agama: ' + insertErr.message);
        else { fetchAllData(); setShowAgamaModal(false); }
      } else {
        fetchAllData();
        setShowAgamaModal(false);
      }
    } else {
      const { error } = await supabase.from('agama').insert([payload]);
      if (error) alert('Gagal tambah agama: ' + error.message);
      else { fetchAllData(); setShowAgamaModal(false); }
    }
    setSubmitting(false);
  };

  const handleDeleteAgama = async (id: number) => {
    if (!confirm('Hapus data statistik agama ini?')) return;
    if (id > 0) {
      const { error } = await supabase.from('agama').delete().eq('id', id);
      if (error) alert('Gagal hapus agama: ' + error.message);
    }
    fetchAllData();
  };

  // ─── HANDLERS STUNTING ───────────────────────────────────────────────────────
  const handleOpenStuntingModal = (item?: StuntingItem) => {
    if (item) {
      setEditStunting(item);
      setTahunStunting(item.tahun);
      setJumlahStunting(item.stunting);
      setJumlahNormal(item.normal);
    } else {
      setEditStunting(null);
      setTahunStunting(new Date().getFullYear());
      setJumlahStunting(0);
      setJumlahNormal(0);
    }
    setShowStuntingModal(true);
  };

  const handleSaveStunting = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { tahun: tahunStunting, stunting: jumlahStunting, normal: jumlahNormal };

    if (editStunting && editStunting.id > 0) {
      const { data, error } = await supabase.from('stunting').update(payload).eq('id', editStunting.id).select();
      if (error) {
        alert('Gagal update stunting: ' + error.message);
      } else if (!data || data.length === 0) {
        const { error: insertErr } = await supabase.from('stunting').insert([payload]);
        if (insertErr) alert('Gagal simpan stunting: ' + insertErr.message);
        else { fetchAllData(); setShowStuntingModal(false); }
      } else {
        fetchAllData();
        setShowStuntingModal(false);
      }
    } else {
      const { error } = await supabase.from('stunting').insert([payload]);
      if (error) alert('Gagal tambah stunting: ' + error.message);
      else { fetchAllData(); setShowStuntingModal(false); }
    }
    setSubmitting(false);
  };

  const handleDeleteStunting = async (id: number) => {
    if (!confirm('Hapus data stunting ini?')) return;
    if (id > 0) {
      const { error } = await supabase.from('stunting').delete().eq('id', id);
      if (error) alert('Gagal hapus stunting: ' + error.message);
    }
    fetchAllData();
  };

  // ─── HANDLERS PROFIL META (PENDIDIKAN & PERKAWINAN) ──────────────────────
  const saveProfilMeta = async (updatedMeta: any) => {
    setSubmitting(true);
    const jsonStr = JSON.stringify(updatedMeta);
    if (profilId) {
      const { error } = await supabase.from('profil').update({ sejarah: jsonStr }).eq('id', profilId);
      if (error) alert('Gagal update data profil: ' + error.message);
      else { setRawMeta(updatedMeta); fetchAllData(); }
    } else {
      const { error, data } = await supabase.from('profil').insert([{ lokasi: 'Bonto Lebang', sejarah: jsonStr }]).select().single();
      if (error) alert('Gagal simpan data profil: ' + error.message);
      else { if (data) setProfilId(data.id); setRawMeta(updatedMeta); fetchAllData(); }
    }
    setSubmitting(false);
  };

  // Handlers Pendidikan
  const handleOpenPendidikanModal = (item?: JsonStatItem) => {
    if (item) {
      setEditPendidikan(item);
      setNamaPendidikan(item.name);
      setJumlahPendidikan(item.value);
    } else {
      setEditPendidikan(null);
      setNamaPendidikan('');
      setJumlahPendidikan(0);
    }
    setShowPendidikanModal(true);
  };

  const handleSavePendidikan = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList: JsonStatItem[] = [];
    if (editPendidikan) {
      updatedList = pendidikanList.map((p) => (p.id === editPendidikan.id ? { ...p, name: namaPendidikan, value: jumlahPendidikan } : p));
    } else {
      const newId = pendidikanList.length > 0 ? Math.max(...pendidikanList.map((p) => p.id)) + 1 : 1;
      updatedList = [...pendidikanList, { id: newId, name: namaPendidikan, value: jumlahPendidikan }];
    }
    const newMeta = { ...rawMeta, pendidikan: updatedList };
    await saveProfilMeta(newMeta);
    setShowPendidikanModal(false);
  };

  const handleDeletePendidikan = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data tingkat pendidikan ini?')) return;
    const updatedList = pendidikanList.filter((p) => p.id !== id);
    const newMeta = { ...rawMeta, pendidikan: updatedList };
    await saveProfilMeta(newMeta);
  };

  // Handlers Perkawinan
  const handleOpenPerkawinanModal = (item?: JsonStatItem) => {
    if (item) {
      setEditPerkawinan(item);
      setNamaPerkawinan(item.name);
      setJumlahPerkawinan(item.value);
    } else {
      setEditPerkawinan(null);
      setNamaPerkawinan('');
      setJumlahPerkawinan(0);
    }
    setShowPerkawinanModal(true);
  };

  const handleSavePerkawinan = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList: JsonStatItem[] = [];
    if (editPerkawinan) {
      updatedList = perkawinanList.map((p) => (p.id === editPerkawinan.id ? { ...p, name: namaPerkawinan, value: jumlahPerkawinan } : p));
    } else {
      const newId = perkawinanList.length > 0 ? Math.max(...perkawinanList.map((p) => p.id)) + 1 : 1;
      updatedList = [...perkawinanList, { id: newId, name: namaPerkawinan, value: jumlahPerkawinan }];
    }
    const newMeta = { ...rawMeta, perkawinan: updatedList };
    await saveProfilMeta(newMeta);
    setShowPerkawinanModal(false);
  };

  const handleDeletePerkawinan = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data status perkawinan ini?')) return;
    const updatedList = perkawinanList.filter((p) => p.id !== id);
    const newMeta = { ...rawMeta, perkawinan: updatedList };
    await saveProfilMeta(newMeta);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kelola Data Kependudukan & Statistik</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola 7 kategori data kependudukan (Usia, Mata Pencaharian, Pertumbuhan, Agama, Stunting, Pendidikan, & Perkawinan).
          </p>
        </div>
      </div>

      {/* Tabs Menu (7 Tabs) */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6 gap-2 pb-1">
        {[
          { key: 'usia', label: 'Kelompok Usia', icon: '' },
          { key: 'mata', label: 'Mata Pencaharian', icon: '' },
          { key: 'pertumbuhan', label: 'Pertumbuhan', icon: '' },
          { key: 'agama', label: 'Agama', icon: '' },
          { key: 'stunting', label: 'Stunting Balita', icon: '' },
          { key: 'pendidikan', label: 'Pendidikan', icon: '' },
          { key: 'perkawinan', label: 'Perkawinan', icon: '' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3 px-4 font-semibold text-xs sm:text-sm rounded-t-xl transition whitespace-nowrap border-b-2 ${activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>



      {/* TAB 2: KELOMPOK USIA */}
      {activeTab === 'usia' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Sebaran Kelompok Usia</h2>
            <button
              onClick={() => handleOpenUsiaModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ➕ Tambah Kelompok Usia
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3">Urutan</th>
                  <th className="px-4 py-3">Kelompok Umur</th>
                  <th className="px-4 py-3 text-right">Jumlah Penduduk</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {usiaList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-gray-400">{item.urutan}</td>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">{item.kelompok_umur}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-600">{item.jumlah} Jiwa</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenUsiaModal(item)} className="text-xs text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteUsia(item.id)} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MATA PENCAHARIAN */}
      {activeTab === 'mata' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Statistik Mata Pencaharian</h2>
            <button
              onClick={() => handleOpenMataModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ➕ Tambah Pekerjaan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3">Urutan</th>
                  <th className="px-4 py-3">Jenis Pekerjaan</th>
                  <th className="px-4 py-3 text-right">Jumlah Penduduk</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {mataList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-gray-400">{item.urutan}</td>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">{item.pekerjaan}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-600">{item.jumlah} Jiwa</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenMataModal(item)} className="text-xs text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteMata(item.id)} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PERTUMBUHAN PENDUDUK */}
      {activeTab === 'pertumbuhan' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Pertumbuhan Penduduk per Tahun</h2>
            <button
              onClick={() => handleOpenPertumbuhanModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ➕ Tambah Data Tahun
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3">Tahun</th>
                  <th className="px-4 py-3 text-right">Total Penduduk (Jiwa)</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {pertumbuhanList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">{item.tahun}</td>
                    <td className="px-4 py-3 text-right font-bold text-teal-600">{item.jumlah} Jiwa</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenPertumbuhanModal(item)} className="text-xs text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeletePertumbuhan(item.id)} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AGAMA */}
      {activeTab === 'agama' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Statistik Agama</h2>
            <button
              onClick={() => handleOpenAgamaModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ➕ Tambah Agama
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3">Urutan</th>
                  <th className="px-4 py-3">Agama</th>
                  <th className="px-4 py-3 text-right">Jumlah Penganut</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {agamaList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-gray-400">{item.urutan}</td>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">{item.agama}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-600">{item.jumlah} Jiwa</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenAgamaModal(item)} className="text-xs text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteAgama(item.id)} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: STUNTING */}
      {activeTab === 'stunting' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Rekapitulasi Stunting Balita</h2>
            <button
              onClick={() => handleOpenStuntingModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ➕ Tambah Data Tahun
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3">Tahun</th>
                  <th className="px-4 py-3 text-right">Kasus Stunting</th>
                  <th className="px-4 py-3 text-right">Gizi Normal</th>
                  <th className="px-4 py-3 text-right">Total Balita</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {stuntingList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">{item.tahun}</td>
                    <td className="px-4 py-3 text-right font-bold text-rose-600">{item.stunting} Balita</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">{item.normal} Balita</td>
                    <td className="px-4 py-3 text-right font-bold">{item.stunting + item.normal} Balita</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenStuntingModal(item)} className="text-xs text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteStunting(item.id)} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: PENDIDIKAN */}
      {activeTab === 'pendidikan' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Statistik Tingkat Pendidikan</h2>
            <button
              onClick={() => handleOpenPendidikanModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ➕ Tambah Pendidikan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3">Tingkat Pendidikan</th>
                  <th className="px-4 py-3 text-right">Jumlah Penduduk</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {pendidikanList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">{item.name}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-600">{item.value} Jiwa</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenPendidikanModal(item)} className="text-xs text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeletePendidikan(item.id)} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: PERKAWINAN */}
      {activeTab === 'perkawinan' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Statistik Status Perkawinan</h2>
            <button
              onClick={() => handleOpenPerkawinanModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ➕ Tambah Perkawinan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3">Status Perkawinan</th>
                  <th className="px-4 py-3 text-right">Jumlah Penduduk</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {perkawinanList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">{item.name}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-600">{item.value} Jiwa</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenPerkawinanModal(item)} className="text-xs text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeletePerkawinan(item.id)} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* MODAL USIA */}
      {showUsiaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{editUsia ? 'Edit Kelompok Usia' : 'Tambah Kelompok Usia'}</h3>
            <form onSubmit={handleSaveUsia} className="space-y-3">
              <div>
                <label className="text-xs font-semibold">Kelompok Umur</label>
                <input type="text" required value={kelompokUmur} onChange={(e) => setKelompokUmur(e.target.value)} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" placeholder="Contoh: 0–14 th" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold">Jumlah Penduduk</label>
                  <input type="number" required value={jumlahUsia} onChange={(e) => setJumlahUsia(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Urutan Tampil</label>
                  <input type="number" required value={urutanUsia} onChange={(e) => setUrutanUsia(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowUsiaModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs rounded-xl">Batal</button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MATA PENCAHARIAN */}
      {showMataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{editMata ? 'Edit Mata Pencaharian' : 'Tambah Mata Pencaharian'}</h3>
            <form onSubmit={handleSaveMata} className="space-y-3">
              <div>
                <label className="text-xs font-semibold">Jenis Pekerjaan</label>
                <input type="text" required value={pekerjaan} onChange={(e) => setPekerjaan(e.target.value)} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" placeholder="Contoh: Nelayan / Petani" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold">Jumlah Penduduk</label>
                  <input type="number" required value={jumlahMata} onChange={(e) => setJumlahMata(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Urutan Tampil</label>
                  <input type="number" required value={urutanMata} onChange={(e) => setUrutanMata(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowMataModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs rounded-xl">Batal</button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERTUMBUHAN */}
      {showPertumbuhanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{editPertumbuhan ? 'Edit Pertumbuhan Penduduk' : 'Tambah Data Tahun'}</h3>
            <form onSubmit={handleSavePertumbuhan} className="space-y-3">
              <div>
                <label className="text-xs font-semibold">Tahun</label>
                <input type="number" required value={tahunPertumbuhan} onChange={(e) => setTahunPertumbuhan(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold">Total Penduduk (Jiwa)</label>
                <input type="number" required value={jumlahPertumbuhan} onChange={(e) => setJumlahPertumbuhan(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowPertumbuhanModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs rounded-xl">Batal</button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AGAMA */}
      {showAgamaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{editAgama ? 'Edit Agama' : 'Tambah Agama'}</h3>
            <form onSubmit={handleSaveAgama} className="space-y-3">
              <div>
                <label className="text-xs font-semibold">Nama Agama</label>
                <input type="text" required value={namaAgama} onChange={(e) => setNamaAgama(e.target.value)} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" placeholder="Contoh: Islam / Kristen" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold">Jumlah Penganut</label>
                  <input type="number" required value={jumlahAgama} onChange={(e) => setJumlahAgama(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Urutan Tampil</label>
                  <input type="number" required value={urutanAgama} onChange={(e) => setUrutanAgama(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAgamaModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs rounded-xl">Batal</button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL STUNTING */}
      {showStuntingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{editStunting ? 'Edit Data Stunting' : 'Tambah Data Stunting'}</h3>
            <form onSubmit={handleSaveStunting} className="space-y-3">
              <div>
                <label className="text-xs font-semibold">Tahun Rekapitulasi</label>
                <input type="number" required value={tahunStunting} onChange={(e) => setTahunStunting(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold">Jumlah Stunting</label>
                  <input type="number" required value={jumlahStunting} onChange={(e) => setJumlahStunting(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Jumlah Gizi Normal</label>
                  <input type="number" required value={jumlahNormal} onChange={(e) => setJumlahNormal(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowStuntingModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs rounded-xl">Batal</button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PENDIDIKAN */}
      {showPendidikanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">{editPendidikan ? 'Edit' : 'Tambah'} Pendidikan</h3>
              <button onClick={() => setShowPendidikanModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
            </div>
            <form onSubmit={handleSavePendidikan} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tingkat Pendidikan</label>
                  <input type="text" required value={namaPendidikan} onChange={e => setNamaPendidikan(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: SD/Sederajat" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah</label>
                  <input type="number" required value={jumlahPendidikan} onChange={e => setJumlahPendidikan(Number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPendidikanModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Batal</button>
                <button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERKAWINAN */}
      {showPerkawinanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">{editPerkawinan ? 'Edit' : 'Tambah'} Perkawinan</h3>
              <button onClick={() => setShowPerkawinanModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
            </div>
            <form onSubmit={handleSavePerkawinan} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Perkawinan</label>
                  <input type="text" required value={namaPerkawinan} onChange={e => setNamaPerkawinan(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: Belum Kawin" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah</label>
                  <input type="number" required value={jumlahPerkawinan} onChange={e => setJumlahPerkawinan(Number(e.target.value))} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPerkawinanModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Batal</button>
                <button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
