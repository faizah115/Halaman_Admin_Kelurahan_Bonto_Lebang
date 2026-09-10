import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDataFebruari2026() {
  console.log('Seeding Data Mutasi Kependudukan Februari 2026...');

  const mutasiFebruari2026 = {
    bulan: 'Februari',
    tahun: 2026,
    periode: 'Februari 2026',
    luas_wilayah: '301 Km²',
    jumlah_kk: 1127,
    awal_bulan: {
      total: 3694,
      laki_laki: 1873,
      perempuan: 1821,
    },
    kelahiran: {
      total: 5,
      laki_laki: 2,
      perempuan: 3,
    },
    kematian: {
      total: 3,
      laki_laki: 0,
      perempuan: 3,
    },
    pendatang: {
      total: 0,
      laki_laki: 0,
      perempuan: 0,
    },
    pindah: {
      total: 5,
      laki_laki: 3,
      perempuan: 2,
    },
    akhir_bulan: {
      total: 3691,
      laki_laki: 1872,
      perempuan: 1819,
    },
  };

  const { data: profilData, error: profilError } = await supabase
    .from('profil')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (profilError) {
    console.error('Gagal mengambil data profil:', profilError.message);
    return;
  }

  let meta = {};
  if (profilData?.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
    try {
      meta = JSON.parse(profilData.sejarah);
    } catch (e) {
      meta = {};
    }
  }

  if (!Array.isArray(meta.mutasi_bulanan)) {
    meta.mutasi_bulanan = [];
  }

  // Filter out any existing Februari 2026 entry and append updated
  meta.mutasi_bulanan = meta.mutasi_bulanan.filter(
    (m) => !(m.bulan === 'Februari' && Number(m.tahun) === 2026)
  );

  // Filter out duplicate or null entries
  meta.mutasi_bulanan = meta.mutasi_bulanan.filter(Boolean);
  meta.mutasi_bulanan.push(mutasiFebruari2026);

  let updateError = null;
  if (profilData) {
    const { error } = await supabase
      .from('profil')
      .update({ sejarah: JSON.stringify(meta) })
      .eq('id', profilData.id);
    updateError = error;
  } else {
    const { error } = await supabase
      .from('profil')
      .insert([{ lokasi: 'Bonto Lebang', sejarah: JSON.stringify(meta) }]);
    updateError = error;
  }

  if (updateError) {
    console.error('Gagal update data profil:', updateError.message);
  } else {
    console.log('SUCCESS: Data mutasi kependudukan Februari 2026 berhasil disimpan ke Supabase!');
  }
}

seedDataFebruari2026();
