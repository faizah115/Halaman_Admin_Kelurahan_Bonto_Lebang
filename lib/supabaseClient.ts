import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProfil() {
  const { data, error } = await supabase
    .from('profil')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  let meta: any = {};
  if (data.sejarah && typeof data.sejarah === 'string' && data.sejarah.startsWith('{')) {
    try {
      meta = JSON.parse(data.sejarah);
    } catch (e) {
      meta = {};
    }
  }

  return {
    ...data,
    nama_lurah: (meta.nama_lurah && meta.nama_lurah.trim() !== '') ? meta.nama_lurah : (data.nama_lurah || ''),
    jabatan_lurah: (meta.jabatan_lurah && meta.jabatan_lurah.trim() !== '') ? meta.jabatan_lurah : (data.jabatan_lurah || 'Lurah Bonto Lebang'),
    foto_lurah_url: (meta.foto_lurah_url && meta.foto_lurah_url.trim() !== '') ? meta.foto_lurah_url : (data.foto_lurah_url || ''),
    deskripsi: data.deskripsi ?? meta.deskripsi ?? meta.sambutan ?? '',
    hero_judul: meta.hero_judul ?? 'Selamat Datang di Kelurahan Bonto Lebang',
    hero_subjudul: meta.hero_subjudul ?? 'Portal resmi yang menampilkan profil desa, potensi unggulan, data kependudukan, berita, galeri, dan layanan pengaduan masyarakat.',
    hero_banner_url: meta.hero_banner_url ?? '',
    hero_banner_url_2: meta.hero_banner_url_2 ?? '',
    hero_banner_url_3: meta.hero_banner_url_3 ?? '',
    profil_banner_url: meta.profil_banner_url ?? '',
    profil_banner_url_2: meta.profil_banner_url_2 ?? '',
    profil_banner_url_3: meta.profil_banner_url_3 ?? '',
    sejarah: meta.sejarah_teks ?? meta.sejarah ?? (typeof data.sejarah === 'string' && !data.sejarah.startsWith('{') ? data.sejarah : ''),
    pendidikan: meta.pendidikan ?? [],
    perkawinan: meta.perkawinan ?? [],
    data_umum: meta.data_umum ?? [],
    struktur_rw: meta.struktur_rw ?? [],
    petugas_kontak: meta.petugas_kontak ?? [],
    tpk_list: meta.tpk_list ?? [],
    mbg_list: meta.mbg_list ?? [],
    lurah_terdahulu: meta.lurah_terdahulu ?? [],
    struktur: meta.struktur ?? [],
    potensi: meta.potensi ?? [],
    mutasi_bulanan: meta.mutasi_bulanan ?? [],
  };
}

export async function getPetugasKontakData() {
  const profil = await getProfil();
  const petugas = (profil?.petugas_kontak && profil.petugas_kontak.length > 0)
    ? profil.petugas_kontak
    : [
        { jabatan: 'Lurah', nama: 'Ramli, S.E.', kontak: '0859 5616 9238', icon: '👔' },
        { jabatan: 'Babinsa', nama: 'Abd. Rahman', kontak: '0838 6343 7803', icon: '🛡️' },
        { jabatan: 'Binmas', nama: 'Suyuti', kontak: '0823 4628 4219', icon: '👮' },
      ];

  const tpk = (profil?.tpk_list && profil.tpk_list.length > 0)
    ? profil.tpk_list
    : ['Harlinah, S.Sos', 'Asrawati, S.E.', 'Irma Kadir'];

  const mbg = (profil?.mbg_list && profil.mbg_list.length > 0)
    ? profil.mbg_list
    : ['Ismawati', 'Hasnawati, S.Sos', 'Rosmawati'];

  return { petugas, tpk, mbg };
}

export async function getDataUmum() {
  const profil = await getProfil();
  if (profil && profil.data_umum && Array.isArray(profil.data_umum) && profil.data_umum.length > 0) {
    return profil.data_umum;
  }
  return [
    { id: 1, keterangan: 'Luas Wilayah', jumlah: '301 Ha', icon: '🗺️' },
    { id: 2, keterangan: 'Jumlah Penduduk', jumlah: '3.700 Jiwa', icon: '👥' },
    { id: 3, keterangan: 'Jumlah KK', jumlah: '1.128 – 1.129 KK', icon: '🏠' },
    { id: 4, keterangan: 'Jumlah KK Miskin', jumlah: '278 KK', icon: '📋' },
  ];
}

export async function getStrukturRWRT() {
  const profil = await getProfil();
  if (profil && profil.struktur_rw && Array.isArray(profil.struktur_rw) && profil.struktur_rw.length > 0) {
    return profil.struktur_rw;
  }
  return [
    {
      rw: 'RW I',
      ketua_rw: 'Rahman',
      rt_list: [
        { rt: 'RT I', ketua_rt: 'Abd. Hakim' },
        { rt: 'RT II', ketua_rt: 'Abd. Rahim' },
        { rt: 'RT III', ketua_rt: 'Ibrahim' },
      ],
    },
    {
      rw: 'RW II',
      ketua_rw: 'Abd. Hamid',
      rt_list: [
        { rt: 'RT I', ketua_rt: 'H. Arifuddin' },
        { rt: 'RT II', ketua_rt: 'H. Hakim' },
        { rt: 'RT III', ketua_rt: 'M. Alwi' },
        { rt: 'RT IV', ketua_rt: 'Mustafa' },
      ],
    },
    {
      rw: 'RW III',
      ketua_rw: 'Saharuddin Goni',
      rt_list: [
        { rt: 'RT I', ketua_rt: 'Alimuddin' },
        { rt: 'RT II', ketua_rt: 'Rabaling' },
        { rt: 'RT III', ketua_rt: 'Syamsuddin' },
        { rt: 'RT IV', ketua_rt: 'Hamsah' },
      ],
    },
    {
      rw: 'RW IV',
      ketua_rw: 'Syamsiah',
      rt_list: [
        { rt: 'RT I', ketua_rt: 'Kamaruddin' },
        { rt: 'RT II', ketua_rt: 'Sarifuddin R.' },
        { rt: 'RT III', ketua_rt: 'Sampara Gassing' },
      ],
    },
  ];
}

export async function getStatistikPendidikan() {
  const profil = await getProfil();
  return profil?.pendidikan ?? [];
}

export async function getStatistikPerkawinan() {
  const profil = await getProfil();
  return profil?.perkawinan ?? [];
}

export async function getStruktur() {
  const { data, error } = await supabase
    .from('struktur_pemerintahan')
    .select('*')
    .order('urutan', { ascending: true });

  if (!error && data && data.length > 0) {
    return data;
  }

  const profil = await getProfil();
  if (profil && profil.struktur && Array.isArray(profil.struktur) && profil.struktur.length > 0) {
    return profil.struktur;
  }

  return null;
}

export async function getStatistikRW() {
  const { data, error } = await supabase
    .from('kependudukan_rw')
    .select('*')
    .order('rw', { ascending: true });

  if (error) {
    // console.error('Error fetching statistik RW:', error);
    return null;
  }
  // Normalize Supabase column names to match app expectations
  return data?.map((row: any) => ({
    ...row,
    laki_laki: row.laki ?? row.laki_laki ?? 0,
    jumlah_kk: row.jumlah ?? row.jumlah_kk ?? 0,
    perempuan: row.perempuan ?? 0,
  })) ?? null;
}

export async function getStatistikUsia() {
  const { data, error } = await supabase
    .from('kependudukan_usia')
    .select('*')
    .order('urutan', { ascending: true });

  if (error) {
    // console.error('Error fetching statistik usia:', error);
    return null;
  }
  return data;
}

export async function getUMKM() {
  const { data, error } = await supabase
    .from('umkm')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // console.error('Error fetching UMKM:', error);
    return null;
  }
  return data;
}

export async function getGaleri() {
  const { data, error } = await supabase
    .from('galeri')
    .select('*')
    .order('tanggal', { ascending: false });

  if (error) {
    // console.error('Error fetching Galeri:', error);
    return null;
  }
  return data;
}

export async function getBerita() {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .order('tanggal', { ascending: false });

  if (error) {
    // console.error('Error fetching Berita:', error);
    return null;
  }
  return data;
}

export async function getBeritaById(id: string | number) {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function getMataPencaharian() {
  const { data, error } = await supabase
    .from('mata_pencaharian')
    .select('*')
    .order('urutan', { ascending: true });
  if (error || !data) return null;
  return data.map((row: any) => ({
    ...row,
    pekerjaan: row.pekerjaan ?? row.name ?? '',
    jumlah: row.jumlah ?? row.value ?? 0,
  }));
}

export async function getPertumbuhanPenduduk() {
  const { data, error } = await supabase
    .from('pertumbuhan_penduduk')
    .select('*')
    .order('tahun', { ascending: true });
  if (error) return null;
  return data;
}

export async function getStatistikAgama() {
  const { data, error } = await supabase
    .from('agama')
    .select('*')
    .order('urutan', { ascending: true });
  if (error || !data) return null;
  return data.map((row: any) => ({
    ...row,
    agama: row.agama ?? row.name ?? '',
    jumlah: row.jumlah ?? row.value ?? 0,
  }));
}

export async function getStunting() {
  const { data, error } = await supabase
    .from('stunting')
    .select('*')
    .order('tahun', { ascending: true });
  if (error) return null;
  return data;
}

export async function getMutasiBulanan() {
  const profil = await getProfil();
  const list: any[] = profil?.mutasi_bulanan ?? [];
  // Kembalikan diurutkan dari bulan pertama (Januari -> Desember, tahun lama -> baru)
  return [...list].sort((a, b) => {
    if (a.tahun !== b.tahun) return a.tahun - b.tahun;
    const bulanOrder: Record<string, number> = {
      Januari: 1, Februari: 2, Maret: 3, April: 4, Mei: 5, Juni: 6,
      Juli: 7, Agustus: 8, September: 9, Oktober: 10, November: 11, Desember: 12,
    };
    return (bulanOrder[a.bulan] ?? 0) - (bulanOrder[b.bulan] ?? 0);
  });
}

export const defaultPotensiList: any[] = [];

export async function getPotensiUnggulan() {
  const { data, error } = await supabase
    .from('potensi_unggulan')
    .select('*')
    .order('urutan', { ascending: true });

  if (!error && data && data.length > 0) {
    return data;
  }

  const profil = await getProfil();
  if (profil && profil.potensi && Array.isArray(profil.potensi) && profil.potensi.length > 0) {
    return profil.potensi;
  }

  return [];
}
