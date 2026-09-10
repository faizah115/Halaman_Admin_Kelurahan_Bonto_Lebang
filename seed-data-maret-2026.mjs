import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDataMaret2026() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   Seeding Data Mutasi Kependudukan Maret 2026   ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Data resmi laporan Maret 2026
  // Total akhir: 3691 + 5 - 2 + 1 - 1 = 3694 ✓
  const mutasiMaret2026 = {
    bulan: 'Maret',
    tahun: 2026,
    periode: 'Maret 2026',
    luas_wilayah: '301 Km',
    jumlah_kk: 1126,
    awal_bulan:  { total: 3691, laki_laki: 1872, perempuan: 1819 },
    kelahiran:   { total: 5,    laki_laki: 3,    perempuan: 2    },
    kematian:    { total: 2,    laki_laki: 1,    perempuan: 1    },
    pendatang:   { total: 1,    laki_laki: 1,    perempuan: 0    },
    pindah:      { total: 1,    laki_laki: 0,    perempuan: 1    },
    akhir_bulan: { total: 3694, laki_laki: 1874, perempuan: 1820 },
  };

  // 1. Baca profil existing
  console.log('▶ Membaca profil dari Supabase...');
  const { data: profilData, error: profilError } = await supabase
    .from('profil')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (profilError) {
    console.error('✗ Gagal mengambil data profil:', profilError.message);
    return;
  }

  // 2. Parse JSON meta
  let meta = {};
  if (profilData?.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
    try { meta = JSON.parse(profilData.sejarah); } catch (e) { meta = {}; }
  }

  // 3. Update mutasi_bulanan
  if (!Array.isArray(meta.mutasi_bulanan)) meta.mutasi_bulanan = [];

  const sebelum = meta.mutasi_bulanan.length;
  meta.mutasi_bulanan = meta.mutasi_bulanan.filter(
    (m) => !(m.bulan === 'Maret' && Number(m.tahun) === 2026)
  );
  meta.mutasi_bulanan = meta.mutasi_bulanan.filter(Boolean);
  meta.mutasi_bulanan.push(mutasiMaret2026);

  console.log(`▶ Mutasi bulanan sebelumnya : ${sebelum} data`);
  console.log(`▶ Mutasi bulanan setelah    : ${meta.mutasi_bulanan.length} data`);

  // 4. Simpan ke Supabase
  console.log('▶ Menyimpan ke Supabase...');
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
    console.error('✗ Gagal update data profil:', updateError.message);
    return;
  }

  console.log('\n✓ SUCCESS! Data Mutasi Maret 2026 berhasil disimpan ke Supabase!');
  console.log('─────────────────────────────────────────────────');
  console.log('  Periode         : Maret 2026');
  console.log('  Luas Wilayah    : 301 Km');
  console.log('  Jumlah KK       : 1.126 KK');
  console.log('  Awal Bulan      : 3.691 jiwa (L: 1.872, P: 1.819)');
  console.log('  Kelahiran  (+)  : +5 jiwa (L: 3, P: 2)');
  console.log('  Kematian   (-)  : -2 jiwa (L: 1, P: 1)');
  console.log('  Pendatang  (+)  : +1 jiwa (L: 1, P: 0)');
  console.log('  Pindah     (-)  : -1 jiwa (L: 0, P: 1)');
  console.log('  Akhir Bulan     : 3.694 jiwa (L: 1.874, P: 1.820)');
  console.log('─────────────────────────────────────────────────');
}

seedDataMaret2026();
