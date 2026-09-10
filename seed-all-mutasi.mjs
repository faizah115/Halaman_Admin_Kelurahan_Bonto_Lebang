/**
 * seed-all-mutasi.mjs
 * Menyimpan data mutasi penduduk SEMUA bulan ke Supabase sekaligus.
 * Jalankan: node seed-all-mutasi.mjs
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Data semua bulan ─────────────────────────────────────────────────────────
const semuaMutasi = [
  {
    bulan: 'Januari', tahun: 2026, periode: 'Januari 2026',
    luas_wilayah: '301 Km', jumlah_kk: 1127,
    awal_bulan:  { total: 3692, laki_laki: 1872, perempuan: 1820 },
    kelahiran:   { total: 5,    laki_laki: 4,    perempuan: 1    },
    kematian:    { total: 2,    laki_laki: 2,    perempuan: 0    },
    pendatang:   { total: 0,    laki_laki: 0,    perempuan: 0    },
    pindah:      { total: 1,    laki_laki: 1,    perempuan: 0    },
    akhir_bulan: { total: 3694, laki_laki: 1873, perempuan: 1821 },
  },
  {
    bulan: 'Februari', tahun: 2026, periode: 'Februari 2026',
    luas_wilayah: '301 Km²', jumlah_kk: 1127,
    awal_bulan:  { total: 3694, laki_laki: 1873, perempuan: 1821 },
    kelahiran:   { total: 5,    laki_laki: 2,    perempuan: 3    },
    kematian:    { total: 3,    laki_laki: 0,    perempuan: 3    },
    pendatang:   { total: 0,    laki_laki: 0,    perempuan: 0    },
    pindah:      { total: 5,    laki_laki: 3,    perempuan: 2    },
    akhir_bulan: { total: 3691, laki_laki: 1872, perempuan: 1819 },
  },
  {
    bulan: 'Maret', tahun: 2026, periode: 'Maret 2026',
    luas_wilayah: '301 Km', jumlah_kk: 1126,
    awal_bulan:  { total: 3691, laki_laki: 1872, perempuan: 1819 },
    kelahiran:   { total: 5,    laki_laki: 3,    perempuan: 2    },
    kematian:    { total: 2,    laki_laki: 1,    perempuan: 1    },
    pendatang:   { total: 1,    laki_laki: 1,    perempuan: 0    },
    pindah:      { total: 1,    laki_laki: 0,    perempuan: 1    },
    akhir_bulan: { total: 3694, laki_laki: 1874, perempuan: 1820 },
  },
  {
    bulan: 'Mei', tahun: 2026, periode: 'Mei 2026',
    luas_wilayah: '301 Km', jumlah_kk: 1128,
    awal_bulan:  { total: 3700, laki_laki: 1876, perempuan: 1824 },
    kelahiran:   { total: 5,    laki_laki: 1,    perempuan: 4    },
    kematian:    { total: 3,    laki_laki: 2,    perempuan: 1    },
    pendatang:   { total: 1,    laki_laki: 1,    perempuan: 0    },
    pindah:      { total: 0,    laki_laki: 0,    perempuan: 0    },
    akhir_bulan: { total: 3702, laki_laki: 1875, perempuan: 1827 },
  },
  {
    bulan: 'Juli', tahun: 2026, periode: 'Juli 2026',
    luas_wilayah: '301 Km', jumlah_kk: 1129,
    awal_bulan:  { total: 3700, laki_laki: 1875, perempuan: 1825 },
    kelahiran:   { total: 2,    laki_laki: 1,    perempuan: 1    },
    kematian:    { total: 4,    laki_laki: 2,    perempuan: 2    },
    pendatang:   { total: 4,    laki_laki: 1,    perempuan: 3    },
    pindah:      { total: 3,    laki_laki: 0,    perempuan: 3    },
    akhir_bulan: { total: 3699, laki_laki: 1875, perempuan: 1824 },
  },
];

// ─── Jalankan seed ────────────────────────────────────────────────────────────
async function seedAllMutasi() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   Seeding SEMUA Data Mutasi Kependudukan 2026          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // 1. Baca profil existing
  console.log('▶ Membaca profil dari Supabase...');
  const { data: profilData, error: profilError } = await supabase
    .from('profil')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (profilError) {
    console.error('✗ Gagal mengambil profil:', profilError.message);
    return;
  }

  // 2. Parse meta
  let meta = {};
  if (profilData?.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
    try { meta = JSON.parse(profilData.sejarah); } catch { meta = {}; }
  }

  // 3. Replace mutasi_bulanan dengan data lengkap semua bulan
  meta.mutasi_bulanan = semuaMutasi;

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
    console.error('✗ Gagal menyimpan:', updateError.message);
    return;
  }

  console.log('\n✓ SUCCESS! Semua data mutasi berhasil disimpan ke Supabase!\n');
  console.log('┌──────────────┬──────────┬─────────────────────────────────────┐');
  console.log('│ Bulan        │    KK    │ Akhir Bulan                         │');
  console.log('├──────────────┼──────────┼─────────────────────────────────────┤');
  for (const m of semuaMutasi) {
    const bulan = m.bulan.padEnd(12);
    const kk    = String(m.jumlah_kk).padStart(6);
    const total = String(m.akhir_bulan.total).padStart(5);
    const l     = String(m.akhir_bulan.laki_laki).padStart(5);
    const p     = String(m.akhir_bulan.perempuan).padStart(5);
    console.log(`│ ${bulan} │ ${kk} KK │ ${total} jiwa (L:${l}, P:${p}) │`);
  }
  console.log('└──────────────┴──────────┴─────────────────────────────────────┘');
}

seedAllMutasi();
