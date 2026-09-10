import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDataJanuari2026() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  Seeding Data Mutasi Kependudukan Januari 2026   ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const mutasiJanuari2026 = {
    bulan: 'Januari',
    tahun: 2026,
    periode: 'Januari 2026',
    luas_wilayah: '301 Km',
    jumlah_kk: 1127,
    awal_bulan: {
      total: 3692,
      laki_laki: 1872,
      perempuan: 1820,
    },
    kelahiran: {
      total: 5,
      laki_laki: 4,
      perempuan: 1,
    },
    kematian: {
      total: 2,
      laki_laki: 2,
      perempuan: 0,
    },
    pendatang: {
      total: 0,
      laki_laki: 0,
      perempuan: 0,
    },
    pindah: {
      total: 1,
      laki_laki: 1,
      perempuan: 0,
    },
    akhir_bulan: {
      // L: 1872 + 4(lahir) - 2(mati) + 0(datang) - 1(pindah) = 1873 ✓
      // P: 1820 + 1(lahir) - 0(mati) + 0(datang) - 0(pindah) = 1821 ✓
      total: 3694,
      laki_laki: 1873,
      perempuan: 1821,
    },
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

  // 2. Parse JSON meta dari kolom sejarah
  let meta = {};
  if (profilData?.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
    try {
      meta = JSON.parse(profilData.sejarah);
    } catch (e) {
      meta = {};
    }
  }

  // 3. Tambah / update data Januari 2026
  if (!Array.isArray(meta.mutasi_bulanan)) {
    meta.mutasi_bulanan = [];
  }

  const sebelum = meta.mutasi_bulanan.length;
  // Hapus duplikat jika ada
  meta.mutasi_bulanan = meta.mutasi_bulanan.filter(
    (m) => !(m.bulan === 'Januari' && Number(m.tahun) === 2026)
  );
  meta.mutasi_bulanan = meta.mutasi_bulanan.filter(Boolean);
  meta.mutasi_bulanan.push(mutasiJanuari2026);

  console.log(`▶ Mutasi bulanan sebelumnya: ${sebelum} data`);
  console.log(`▶ Mutasi bulanan setelah update: ${meta.mutasi_bulanan.length} data`);

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
  } else {
    console.log('\n✓ SUCCESS! Data Mutasi Januari 2026 berhasil disimpan ke Supabase!');
    console.log('─────────────────────────────────────────────────');
    console.log('  Periode         : Januari 2026');
    console.log('  Luas Wilayah    : 301 Km');
    console.log('  Jumlah KK       : 1.127 KK');
    console.log('  Awal Bulan      : 3.692 jiwa (L: 1.872, P: 1.820)');
    console.log('  Kelahiran       : +5 jiwa (L: 4, P: 1)');
    console.log('  Kematian        : -2 jiwa (L: 2, P: 0)');
    console.log('  Pendatang       : +0 jiwa');
    console.log('  Pindah          : -1 jiwa (L: 1, P: 0)');
    console.log('  Akhir Bulan     : 3.694 jiwa (L: 1.873, P: 1.821)');
    console.log('─────────────────────────────────────────────────');
  }
}

seedDataJanuari2026();
