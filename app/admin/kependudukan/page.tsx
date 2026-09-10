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

type RwItem = {
  rw: string;
  ketua_rw: string;
  rt_list?: { rt: string; ketua_rt: string }[];
};

type DataUmumItem = {
  id: number;
  keterangan: string;
  jumlah: string;
  icon: string;
};

type MutasiItem = {
  bulan: string;
  tahun: number;
  periode: string;
  luas_wilayah?: string;
  jumlah_kk?: number;
  awal_bulan: { total: number; laki_laki: number; perempuan: number };
  kelahiran: { total: number; laki_laki: number; perempuan: number };
  kematian: { total: number; laki_laki: number; perempuan: number };
  pendatang: { total: number; laki_laki: number; perempuan: number };
  pindah: { total: number; laki_laki: number; perempuan: number };
  akhir_bulan: { total: number; laki_laki: number; perempuan: number };
};

const BULAN_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function AdminKependudukanPage() {
  const [activeTab, setActiveTab] = useState<'rwrt' | 'dataUmum' | 'usia' | 'mata' | 'pertumbuhan' | 'agama' | 'stunting' | 'pendidikan' | 'perkawinan' | 'mutasi'>('mutasi');
  const [loading, setLoading] = useState(true);

  // Data states
  const [usiaList, setUsiaList] = useState<UsiaItem[]>([]);
  const [mataList, setMataList] = useState<MataPencaharianItem[]>([]);
  const [pertumbuhanList, setPertumbuhanList] = useState<PertumbuhanItem[]>([]);
  const [agamaList, setAgamaList] = useState<AgamaItem[]>([]);
  const [stuntingList, setStuntingList] = useState<StuntingItem[]>([]);
  const [pendidikanList, setPendidikanList] = useState<JsonStatItem[]>([]);
  const [perkawinanList, setPerkawinanList] = useState<JsonStatItem[]>([]);
  const [rwrtList, setRwrtList] = useState<RwItem[]>([]);
  const [dataUmumList, setDataUmumList] = useState<DataUmumItem[]>([]);
  const [mutasiList, setMutasiList] = useState<MutasiItem[]>([]);
  const [selectedMutasiIdx, setSelectedMutasiIdx] = useState<number>(0);

  const [profilId, setProfilId] = useState<number | null>(null);
  const [rawMeta, setRawMeta] = useState<any>({});

  // Modals state: Data Umum
  const [showDataUmumModal, setShowDataUmumModal] = useState(false);
  const [editDataUmum, setEditDataUmum] = useState<DataUmumItem | null>(null);
  const [duIcon, setDuIcon] = useState('📍');
  const [duKeterangan, setDuKeterangan] = useState('');
  const [duJumlah, setDuJumlah] = useState('');

  // Modals state: RW/RT
  const [showRwModal, setShowRwModal] = useState(false);
  const [editRwIdx, setEditRwIdx] = useState<number | null>(null);
  const [rwNama, setRwNama] = useState('');
  const [rwKetua, setRwKetua] = useState('');
  const [rwRtListStr, setRwRtListStr] = useState('');

  // Modals state: Mutasi Bulanan
  const [showMutasiModal, setShowMutasiModal] = useState(false);
  const [editMutasiIdx, setEditMutasiIdx] = useState<number | null>(null);
  const [mutBulan, setMutBulan] = useState('Februari');
  const [mutTahun, setMutTahun] = useState(2026);
  const [mutLuas, setMutLuas] = useState('301 Km²');
  const [mutKk, setMutKk] = useState(1127);
  const [mutAwalL, setMutAwalL] = useState(1873);
  const [mutAwalP, setMutAwalP] = useState(1821);
  const [mutLahirL, setMutLahirL] = useState(2);
  const [mutLahirP, setMutLahirP] = useState(3);
  const [mutMatiL, setMutMatiL] = useState(0);
  const [mutMatiP, setMutMatiP] = useState(3);
  const [mutDatangL, setMutDatangL] = useState(0);
  const [mutDatangP, setMutDatangP] = useState(0);
  const [mutPindahL, setMutPindahL] = useState(3);
  const [mutPindahP, setMutPindahP] = useState(2);

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

      if (profilData.struktur_rw && Array.isArray(profilData.struktur_rw) && profilData.struktur_rw.length > 0) {
        setRwrtList(profilData.struktur_rw);
      } else {
        setRwrtList([]);
      }

      if (profilData.data_umum && Array.isArray(profilData.data_umum) && profilData.data_umum.length > 0) {
        setDataUmumList(profilData.data_umum);
      } else {
        setDataUmumList([]);
      }

      if (profilData.mutasi_bulanan && Array.isArray(profilData.mutasi_bulanan) && profilData.mutasi_bulanan.length > 0) {
        setMutasiList(profilData.mutasi_bulanan);
      } else {
        // Fallback default Februari 2026 jika belum ada
        setMutasiList([
          {
            bulan: 'Februari',
            tahun: 2026,
            periode: 'Februari 2026',
            luas_wilayah: '301 Km²',
            jumlah_kk: 1127,
            awal_bulan: { total: 3694, laki_laki: 1873, perempuan: 1821 },
            kelahiran: { total: 5, laki_laki: 2, perempuan: 3 },
            kematian: { total: 3, laki_laki: 0, perempuan: 3 },
            pendatang: { total: 0, laki_laki: 0, perempuan: 0 },
            pindah: { total: 5, laki_laki: 3, perempuan: 2 },
            akhir_bulan: { total: 3691, laki_laki: 1872, perempuan: 1819 },
          },
        ]);
      }
    } else {
      setPendidikanList([]);
      setPerkawinanList([]);
      setRwrtList([]);
      setDataUmumList([]);
      setMutasiList([
        {
          bulan: 'Februari',
          tahun: 2026,
          periode: 'Februari 2026',
          luas_wilayah: '301 Km²',
          jumlah_kk: 1127,
          awal_bulan: { total: 3694, laki_laki: 1873, perempuan: 1821 },
          kelahiran: { total: 5, laki_laki: 2, perempuan: 3 },
          kematian: { total: 3, laki_laki: 0, perempuan: 3 },
          pendatang: { total: 0, laki_laki: 0, perempuan: 0 },
          pindah: { total: 5, laki_laki: 3, perempuan: 2 },
          akhir_bulan: { total: 3691, laki_laki: 1872, perempuan: 1819 },
        },
      ]);
    }

    setLoading(false);
  };

  // ─── HANDLERS DATA UMUM ──────────────────────────────────────────────────────
  const handleOpenDataUmumModal = (item?: DataUmumItem) => {
    if (item) {
      setEditDataUmum(item);
      setDuIcon(item.icon || '📍');
      setDuKeterangan(item.keterangan || '');
      setDuJumlah(item.jumlah || '');
    } else {
      setEditDataUmum(null);
      setDuIcon('📍');
      setDuKeterangan('');
      setDuJumlah('');
    }
    setShowDataUmumModal(true);
  };

  const handleSaveDataUmum = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList: DataUmumItem[] = [];
    if (editDataUmum) {
      updatedList = dataUmumList.map((d) => (d.id === editDataUmum.id ? { ...d, icon: duIcon, keterangan: duKeterangan, jumlah: duJumlah } : d));
    } else {
      const newId = dataUmumList.length > 0 ? Math.max(...dataUmumList.map((d) => d.id)) + 1 : 1;
      updatedList = [...dataUmumList, { id: newId, icon: duIcon, keterangan: duKeterangan, jumlah: duJumlah }];
    }
    const newMeta = { ...rawMeta, data_umum: updatedList };
    await saveProfilMeta(newMeta);
    setDataUmumList(updatedList);
    setShowDataUmumModal(false);
  };

  const handleDeleteDataUmum = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data umum ini?')) return;
    const updatedList = dataUmumList.filter((d) => d.id !== id);
    const newMeta = { ...rawMeta, data_umum: updatedList };
    await saveProfilMeta(newMeta);
    setDataUmumList(updatedList);
  };

  // ─── HANDLERS STRUKTUR RW/RT ─────────────────────────────────────────────────
  const handleOpenRwModal = (idx?: number) => {
    if (idx !== undefined && idx !== null && rwrtList[idx]) {
      const item = rwrtList[idx];
      setEditRwIdx(idx);
      setRwNama(item.rw || '');
      setRwKetua(item.ketua_rw || '');
      const rtStr = item.rt_list ? item.rt_list.map((r) => `${r.rt}:${r.ketua_rt}`).join('\n') : '';
      setRwRtListStr(rtStr);
    } else {
      setEditRwIdx(null);
      setRwNama('');
      setRwKetua('');
      setRwRtListStr('');
    }
    setShowRwModal(true);
  };

  const handleSaveRw = async (e: React.FormEvent) => {
    e.preventDefault();
    const rtLines = rwRtListStr.split('\n').map((l) => l.trim()).filter(Boolean);
    const rt_list = rtLines.map((line) => {
      const parts = line.split(':');
      return { rt: parts[0]?.trim() || '', ketua_rt: parts[1]?.trim() || '' };
    });

    const newItem: RwItem = { rw: rwNama, ketua_rw: rwKetua, rt_list };
    let updatedList = [...rwrtList];
    if (editRwIdx !== null) {
      updatedList[editRwIdx] = newItem;
    } else {
      updatedList.push(newItem);
    }
    const newMeta = { ...rawMeta, struktur_rw: updatedList };
    await saveProfilMeta(newMeta);
    setRwrtList(updatedList);
    setShowRwModal(false);
  };

  const handleDeleteRw = async (idx: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data RW ini?')) return;
    const updatedList = rwrtList.filter((_, i) => i !== idx);
    const newMeta = { ...rawMeta, struktur_rw: updatedList };
    await saveProfilMeta(newMeta);
    setRwrtList(updatedList);
  };

  // ─── HANDLERS MUTASI BULANAN ──────────────────────────────────────────────────
  const handleOpenMutasiModal = (idx?: number) => {
    if (idx !== undefined && idx !== null && mutasiList[idx]) {
      const item = mutasiList[idx];
      setEditMutasiIdx(idx);
      setMutBulan(item.bulan || 'Februari');
      setMutTahun(item.tahun || 2026);
      setMutLuas(item.luas_wilayah || '301 Km²');
      setMutKk(item.jumlah_kk || 1127);

      setMutAwalL(item.awal_bulan?.laki_laki || 0);
      setMutAwalP(item.awal_bulan?.perempuan || 0);
      setMutLahirL(item.kelahiran?.laki_laki || 0);
      setMutLahirP(item.kelahiran?.perempuan || 0);
      setMutMatiL(item.kematian?.laki_laki || 0);
      setMutMatiP(item.kematian?.perempuan || 0);
      setMutDatangL(item.pendatang?.laki_laki || 0);
      setMutDatangP(item.pendatang?.perempuan || 0);
      setMutPindahL(item.pindah?.laki_laki || 0);
      setMutPindahP(item.pindah?.perempuan || 0);
    } else {
      setEditMutasiIdx(null);
      setMutBulan('Februari');
      setMutTahun(2026);
      setMutLuas('301 Km²');
      setMutKk(1127);

      setMutAwalL(1873);
      setMutAwalP(1821);
      setMutLahirL(2);
      setMutLahirP(3);
      setMutMatiL(0);
      setMutMatiP(3);
      setMutDatangL(0);
      setMutDatangP(0);
      setMutPindahL(3);
      setMutPindahP(2);
    }
    setShowMutasiModal(true);
  };

  const handleSaveMutasi = async (e: React.FormEvent) => {
    e.preventDefault();
    const awalTotal = mutAwalL + mutAwalP;
    const lahirTotal = mutLahirL + mutLahirP;
    const matiTotal = mutMatiL + mutMatiP;
    const datangTotal = mutDatangL + mutDatangP;
    const pindahTotal = mutPindahL + mutPindahP;

    const akhirL = mutAwalL + mutLahirL - mutMatiL + mutDatangL - mutPindahL;
    const akhirP = mutAwalP + mutLahirP - mutMatiP + mutDatangP - mutPindahP;
    const akhirTotal = akhirL + akhirP;

    const newItem: MutasiItem = {
      bulan: mutBulan,
      tahun: mutTahun,
      periode: `${mutBulan} ${mutTahun}`,
      luas_wilayah: mutLuas,
      jumlah_kk: mutKk,
      awal_bulan: { total: awalTotal, laki_laki: mutAwalL, perempuan: mutAwalP },
      kelahiran: { total: lahirTotal, laki_laki: mutLahirL, perempuan: mutLahirP },
      kematian: { total: matiTotal, laki_laki: mutMatiL, perempuan: mutMatiP },
      pendatang: { total: datangTotal, laki_laki: mutDatangL, perempuan: mutDatangP },
      pindah: { total: pindahTotal, laki_laki: mutPindahL, perempuan: mutPindahP },
      akhir_bulan: { total: akhirTotal, laki_laki: akhirL, perempuan: akhirP },
    };

    let updatedList = [...mutasiList];
    if (editMutasiIdx !== null) {
      updatedList[editMutasiIdx] = newItem;
      setSelectedMutasiIdx(editMutasiIdx);
    } else {
      updatedList.push(newItem);
      setSelectedMutasiIdx(updatedList.length - 1);
    }

    const newMeta = { ...rawMeta, mutasi_bulanan: updatedList };
    await saveProfilMeta(newMeta);
    setMutasiList(updatedList);
    setShowMutasiModal(false);
  };

  const handleDeleteMutasi = async (idx: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data mutasi bulan ini?')) return;
    const updatedList = mutasiList.filter((_, i) => i !== idx);
    const newMeta = { ...rawMeta, mutasi_bulanan: updatedList };
    await saveProfilMeta(newMeta);
    setMutasiList(updatedList);
    setSelectedMutasiIdx((prev) => Math.max(0, Math.min(prev, updatedList.length - 1)));
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
            Kelola 10 kategori data kependudukan: Struktur RW/RT, Data Umum, Usia, Mata Pencaharian, Pertumbuhan, Agama, Stunting, Pendidikan, Perkawinan & Mutasi Bulanan.
          </p>
        </div>
      </div>

      {/* Tabs Menu (10 Tabs) */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6 gap-2 pb-1">
        {[
          { key: 'rwrt', label: 'Struktur RW/RT', icon: '🏠' },
          { key: 'dataUmum', label: 'Data Umum', icon: '📍' },
          { key: 'usia', label: 'Kelompok Usia', icon: '👤' },
          { key: 'mata', label: 'Mata Pencaharian', icon: '💼' },
          { key: 'pertumbuhan', label: 'Pertumbuhan', icon: '📈' },
          { key: 'agama', label: 'Agama', icon: '🕌' },
          { key: 'stunting', label: 'Stunting Balita', icon: '🍼' },
          { key: 'pendidikan', label: 'Pendidikan', icon: '📚' },
          { key: 'perkawinan', label: 'Perkawinan', icon: '💍' },
          { key: 'mutasi', label: 'Mutasi Bulanan', icon: '📋' },
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



      {/* TAB: STRUKTUR RW/RT */}
      {activeTab === 'rwrt' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Struktur Wilayah RW & RT</h2>
            <button
              onClick={() => handleOpenRwModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ➕ Tambah RW
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3">RW</th>
                  <th className="px-4 py-3">Ketua RW</th>
                  <th className="px-4 py-3">Jumlah RT</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {rwrtList.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">{item.rw}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.ketua_rw}</td>
                    <td className="px-4 py-3 text-indigo-600 font-bold">{item.rt_list?.length ?? 0} RT</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenRwModal(idx)} className="text-xs text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteRw(idx)} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: DATA UMUM WILAYAH */}
      {activeTab === 'dataUmum' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Data Umum Wilayah</h2>
            <button
              onClick={() => handleOpenDataUmumModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
            >
              ➕ Tambah Data
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3">Icon</th>
                  <th className="px-4 py-3">Keterangan</th>
                  <th className="px-4 py-3">Nilai / Jumlah</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {dataUmumList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-2xl">{item.icon}</td>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">{item.keterangan}</td>
                    <td className="px-4 py-3 text-indigo-600 font-bold">{item.jumlah}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleOpenDataUmumModal(item)} className="text-xs text-amber-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteDataUmum(item.id)} className="text-xs text-rose-600 hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {/* TAB: MUTASI PENDUDUK BULANAN */}
      {activeTab === 'mutasi' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div>
              <h2 className="font-bold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                <span>📋</span> Parameter & Indikator Mutasi Penduduk
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Input dan kelola rincian data indikator mutasi kependudukan bulanan yang diintegrasikan ke situs publik.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {mutasiList.length > 0 && (
                <select
                  value={selectedMutasiIdx}
                  onChange={(e) => setSelectedMutasiIdx(Number(e.target.value))}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  {mutasiList.map((m, idx) => (
                    <option key={idx} value={idx}>
                      Periode: {m.periode || `${m.bulan} ${m.tahun}`}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => handleOpenMutasiModal()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <span>➕</span> Input Data Bulan Baru
              </button>
            </div>
          </div>

          {/* Tampilan Tabel Parameter / Indikator (Sesuai Permintaan) */}
          {mutasiList.length > 0 && mutasiList[selectedMutasiIdx] ? (() => {
            const cur = mutasiList[selectedMutasiIdx];
            return (
              <div className="bg-slate-50 dark:bg-gray-900/60 rounded-2xl p-5 border border-slate-200 dark:border-gray-700 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/80 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      📊 Data yang Berhasil Diintegrasikan ({cur.periode || `${cur.bulan} ${cur.tahun}`})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenMutasiModal(selectedMutasiIdx)}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
                    >
                      ✏️ Edit Parameter
                    </button>
                    <button
                      onClick={() => handleDeleteMutasi(selectedMutasiIdx)}
                      className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
                    >
                      🗑️ Hapus Bulan Ini
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-[#7a1f2b] text-white">
                        <th className="px-5 py-3.5 font-bold border-b border-rose-900 w-1/2">Parameter / Indikator</th>
                        <th className="px-5 py-3.5 font-bold border-b border-rose-900 w-1/2">Nilai / Rincian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-gray-200">
                          Luas Wilayah
                        </td>
                        <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white">
                          {cur.luas_wilayah || '301 Km²'}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-gray-200">
                          Jumlah Kartu Keluarga (KK)
                        </td>
                        <td className="px-5 py-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                          {(cur.jumlah_kk ?? 1127).toLocaleString('id-ID')} KK
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-gray-200">
                          Penduduk Awal Bulan ({cur.bulan} {cur.tahun})
                        </td>
                        <td className="px-5 py-3.5 text-gray-900 dark:text-gray-100">
                          <strong className="text-sky-600 dark:text-sky-400">{(cur.awal_bulan?.total ?? 0).toLocaleString('id-ID')} jiwa</strong>{' '}
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            ({(cur.awal_bulan?.laki_laki ?? 0).toLocaleString('id-ID')} Laki-laki, {(cur.awal_bulan?.perempuan ?? 0).toLocaleString('id-ID')} Perempuan)
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-5 py-3.5 font-semibold text-emerald-700 dark:text-emerald-400">
                          Kelahiran (+)
                        </td>
                        <td className="px-5 py-3.5 text-emerald-700 dark:text-emerald-400">
                          <strong>+{cur.kelahiran?.total ?? 0} jiwa</strong>{' '}
                          <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">
                            ({cur.kelahiran?.laki_laki ?? 0} Laki-laki, {cur.kelahiran?.perempuan ?? 0} Perempuan)
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-5 py-3.5 font-semibold text-rose-700 dark:text-rose-400">
                          Kematian (-)
                        </td>
                        <td className="px-5 py-3.5 text-rose-700 dark:text-rose-400">
                          <strong>-{cur.kematian?.total ?? 0} jiwa</strong>{' '}
                          <span className="text-xs text-rose-600/80 dark:text-rose-400/80 font-medium">
                            ({cur.kematian?.laki_laki ?? 0} Laki-laki, {cur.kematian?.perempuan ?? 0} Perempuan)
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-5 py-3.5 font-semibold text-blue-700 dark:text-blue-400">
                          Pendatang (+)
                        </td>
                        <td className="px-5 py-3.5 text-blue-700 dark:text-blue-400">
                          <strong>+{cur.pendatang?.total ?? 0} jiwa</strong>{' '}
                          <span className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">
                            ({cur.pendatang?.laki_laki ?? 0} Laki-laki, {cur.pendatang?.perempuan ?? 0} Perempuan)
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-5 py-3.5 font-semibold text-amber-700 dark:text-amber-400">
                          Pindah (-)
                        </td>
                        <td className="px-5 py-3.5 text-amber-700 dark:text-amber-400">
                          <strong>-{cur.pindah?.total ?? 0} jiwa</strong>{' '}
                          <span className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium">
                            ({cur.pindah?.laki_laki ?? 0} Laki-laki, {cur.pindah?.perempuan ?? 0} Perempuan)
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-emerald-50 dark:bg-emerald-950/40 font-bold">
                        <td className="px-5 py-4 text-emerald-950 dark:text-emerald-200">
                          Penduduk Akhir Bulan ({cur.bulan} {cur.tahun})
                        </td>
                        <td className="px-5 py-4 text-emerald-900 dark:text-emerald-100">
                          <span className="text-base font-extrabold text-[#7a1f2b] dark:text-rose-400">
                            {(cur.akhir_bulan?.total ?? 0).toLocaleString('id-ID')} jiwa
                          </span>{' '}
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                            ({(cur.akhir_bulan?.laki_laki ?? 0).toLocaleString('id-ID')} Laki-laki, {(cur.akhir_bulan?.perempuan ?? 0).toLocaleString('id-ID')} Perempuan)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })() : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Belum ada data mutasi penduduk. Klik "Input Data Bulan Baru" untuk menambah data.
            </div>
          )}

          {/* Tabel Riwayat Seluruh Bulan */}
          {mutasiList.length > 0 && (
            <div className="pt-2">
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                <span>🗓️</span> Riwayat Seluruh Periode Mutasi Penduduk
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 font-semibold">
                    <tr>
                      <th className="px-3.5 py-2.5">Periode</th>
                      <th className="px-3.5 py-2.5">Luas</th>
                      <th className="px-3.5 py-2.5">KK</th>
                      <th className="px-3.5 py-2.5 text-right">Awal Bulan</th>
                      <th className="px-3.5 py-2.5 text-right">Lahir</th>
                      <th className="px-3.5 py-2.5 text-right">Mati</th>
                      <th className="px-3.5 py-2.5 text-right">Datang</th>
                      <th className="px-3.5 py-2.5 text-right">Pindah</th>
                      <th className="px-3.5 py-2.5 text-right">Akhir Bulan</th>
                      <th className="px-3.5 py-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {mutasiList.map((m, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition cursor-pointer ${
                          selectedMutasiIdx === idx ? 'bg-indigo-50/70 dark:bg-indigo-950/50 font-medium' : ''
                        }`}
                        onClick={() => setSelectedMutasiIdx(idx)}
                      >
                        <td className="px-3.5 py-2.5 font-bold text-gray-800 dark:text-white">{m.periode || `${m.bulan} ${m.tahun}`}</td>
                        <td className="px-3.5 py-2.5 text-gray-600 dark:text-gray-300">{m.luas_wilayah || '301 Km²'}</td>
                        <td className="px-3.5 py-2.5 text-gray-600 dark:text-gray-300">{(m.jumlah_kk ?? 1127).toLocaleString('id-ID')}</td>
                        <td className="px-3.5 py-2.5 text-right text-sky-600 dark:text-sky-400">{(m.awal_bulan?.total ?? 0).toLocaleString('id-ID')}</td>
                        <td className="px-3.5 py-2.5 text-right text-emerald-600">+{m.kelahiran?.total ?? 0}</td>
                        <td className="px-3.5 py-2.5 text-right text-rose-600">-{m.kematian?.total ?? 0}</td>
                        <td className="px-3.5 py-2.5 text-right text-blue-600">+{m.pendatang?.total ?? 0}</td>
                        <td className="px-3.5 py-2.5 text-right text-amber-600">-{m.pindah?.total ?? 0}</td>
                        <td className="px-3.5 py-2.5 text-right font-bold text-gray-900 dark:text-white">{(m.akhir_bulan?.total ?? 0).toLocaleString('id-ID')}</td>
                        <td className="px-3.5 py-2.5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleOpenMutasiModal(idx)} className="text-amber-600 hover:underline font-semibold">Edit</button>
                          <button onClick={() => handleDeleteMutasi(idx)} className="text-rose-600 hover:underline font-semibold">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL DATA UMUM */}
      {showDataUmumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{editDataUmum ? 'Edit Data Umum' : 'Tambah Data Umum'}</h3>
            <form onSubmit={handleSaveDataUmum} className="space-y-3">
              <div>
                <label className="text-xs font-semibold">Icon (emoji)</label>
                <input type="text" value={duIcon} onChange={e => setDuIcon(e.target.value)} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" placeholder="📍" />
              </div>
              <div>
                <label className="text-xs font-semibold">Keterangan</label>
                <input type="text" required value={duKeterangan} onChange={e => setDuKeterangan(e.target.value)} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" placeholder="Contoh: Luas Wilayah" />
              </div>
              <div>
                <label className="text-xs font-semibold">Nilai / Jumlah</label>
                <input type="text" required value={duJumlah} onChange={e => setDuJumlah(e.target.value)} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" placeholder="Contoh: 301 Ha" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowDataUmumModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs rounded-xl">Batal</button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RW/RT */}
      {showRwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{editRwIdx !== null ? 'Edit RW' : 'Tambah RW'}</h3>
            <form onSubmit={handleSaveRw} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold">Nama RW</label>
                  <input type="text" required value={rwNama} onChange={e => setRwNama(e.target.value)} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" placeholder="Contoh: RW I" />
                </div>
                <div>
                  <label className="text-xs font-semibold">Ketua RW</label>
                  <input type="text" required value={rwKetua} onChange={e => setRwKetua(e.target.value)} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm" placeholder="Nama Ketua RW" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Daftar RT (satu per baris, format: <code>RT I:Nama Ketua</code>)</label>
                <textarea
                  rows={5}
                  value={rwRtListStr}
                  onChange={e => setRwRtListStr(e.target.value)}
                  className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-mono"
                  placeholder={`RT I:Nama Ketua RT\nRT II:Nama Ketua RT`}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowRwModal(false)} className="px-3 py-1.5 bg-gray-100 text-xs rounded-xl">Batal</button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MUTASI BULANAN */}
      {showMutasiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">
                  {editMutasiIdx !== null ? '✏️ Edit Parameter Mutasi Penduduk' : '➕ Input Parameter Mutasi Penduduk Baru'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Lengkapi seluruh parameter indikator kependudukan bulanan Kelurahan Bonto Lebang.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMutasiModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMutasi} className="space-y-5">
              {/* Periode & Wilayah */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-700 space-y-3">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  1. Data Periode & Wilayah
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Bulan</label>
                    <select
                      value={mutBulan}
                      onChange={e => setMutBulan(e.target.value)}
                      className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
                    >
                      {BULAN_LIST.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Tahun</label>
                    <input
                      type="number"
                      required
                      value={mutTahun}
                      onChange={e => setMutTahun(Number(e.target.value))}
                      className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Luas Wilayah</label>
                    <input
                      type="text"
                      required
                      value={mutLuas}
                      onChange={e => setMutLuas(e.target.value)}
                      className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contoh: 301 Km²"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">Jumlah KK</label>
                    <input
                      type="number"
                      required
                      value={mutKk}
                      onChange={e => setMutKk(Number(e.target.value))}
                      className="w-full p-2.5 border rounded-xl dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contoh: 1127"
                    />
                  </div>
                </div>
              </div>

              {/* Rincian Komponen Mutasi */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  2. Rincian Indikator Mutasi (Jiwa)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Penduduk Awal Bulan */}
                  <div className="bg-sky-50/60 dark:bg-sky-950/30 p-3.5 rounded-2xl border border-sky-200 dark:border-sky-900">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-sky-800 dark:text-sky-300">👥 Penduduk Awal Bulan</label>
                      <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-200/70 dark:bg-sky-900/60 px-2 py-0.5 rounded-md">
                        Total: {(mutAwalL + mutAwalP).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Laki-laki</span>
                        <input type="number" required value={mutAwalL} onChange={e => setMutAwalL(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Perempuan</span>
                        <input type="number" required value={mutAwalP} onChange={e => setMutAwalP(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                    </div>
                  </div>

                  {/* Kelahiran */}
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-emerald-800 dark:text-emerald-300">👶 Kelahiran (+)</label>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-200/70 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                        Total: +{mutLahirL + mutLahirP}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Laki-laki</span>
                        <input type="number" value={mutLahirL} onChange={e => setMutLahirL(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Perempuan</span>
                        <input type="number" value={mutLahirP} onChange={e => setMutLahirP(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                    </div>
                  </div>

                  {/* Kematian */}
                  <div className="bg-rose-50/60 dark:bg-rose-950/30 p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-rose-800 dark:text-rose-300">⚰️ Kematian (-)</label>
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-200/70 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                        Total: -{mutMatiL + mutMatiP}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Laki-laki</span>
                        <input type="number" value={mutMatiL} onChange={e => setMutMatiL(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Perempuan</span>
                        <input type="number" value={mutMatiP} onChange={e => setMutMatiP(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                    </div>
                  </div>

                  {/* Pendatang */}
                  <div className="bg-blue-50/60 dark:bg-blue-950/30 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-blue-800 dark:text-blue-300">🛬 Pendatang (+)</label>
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-200/70 dark:bg-blue-900/60 px-2 py-0.5 rounded-md">
                        Total: +{mutDatangL + mutDatangP}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Laki-laki</span>
                        <input type="number" value={mutDatangL} onChange={e => setMutDatangL(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Perempuan</span>
                        <input type="number" value={mutDatangP} onChange={e => setMutDatangP(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                    </div>
                  </div>

                  {/* Pindah */}
                  <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900 sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-amber-800 dark:text-amber-300">🛫 Pindah (-)</label>
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                        Total: -{mutPindahL + mutPindahP}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Laki-laki</span>
                        <input type="number" value={mutPindahL} onChange={e => setMutPindahL(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-600 dark:text-gray-400">Perempuan</span>
                        <input type="number" value={mutPindahP} onChange={e => setMutPindahP(Number(e.target.value))} className="w-full p-2 border rounded-xl dark:bg-gray-700 text-sm font-semibold" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kalkulasi Otomatis Akhir Bulan */}
              {(() => {
                const akhirL = mutAwalL + mutLahirL - mutMatiL + mutDatangL - mutPindahL;
                const akhirP = mutAwalP + mutLahirP - mutMatiP + mutDatangP - mutPindahP;
                const akhirTotal = akhirL + akhirP;
                return (
                  <div className="bg-emerald-100/60 dark:bg-emerald-950/60 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider text-[11px]">
                        🏁 Penduduk Akhir Bulan ({mutBulan} {mutTahun}) - Kalkulasi Otomatis
                      </span>
                      <span className="text-sm font-extrabold text-[#7a1f2b] dark:text-rose-400">
                        {akhirTotal.toLocaleString('id-ID')} jiwa
                      </span>
                    </div>
                    <p className="text-emerald-800 dark:text-emerald-300">
                      • Laki-laki: <strong>{akhirL.toLocaleString('id-ID')}</strong> ({mutAwalL} awal + {mutLahirL} lahir - {mutMatiL} mati + {mutDatangL} datang - {mutPindahL} pindah)
                    </p>
                    <p className="text-emerald-800 dark:text-emerald-300">
                      • Perempuan: <strong>{akhirP.toLocaleString('id-ID')}</strong> ({mutAwalP} awal + {mutLahirP} lahir - {mutMatiP} mati + {mutDatangP} datang - {mutPindahP} pindah)
                    </p>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowMutasiModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : '💾 Simpan Data Mutasi'}
                </button>
              </div>
            </form>
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
