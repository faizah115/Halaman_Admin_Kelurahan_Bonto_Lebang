import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedDataJuli2026() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║    Seeding Data Mutasi Kependudukan Juli 2026    ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Verifikasi perhitungan:
  // L: 1875 + 1(lahir) - 2(mati) + 1(datang) - 0(pindah) = 1875 ✓
  // P: 1825 + 1(lahir) - 2(mati) + 3(datang) - 3(pindah) = 1824 ✓
  // Total: 1875 + 1824 = 3699 ✓
  const mutasiJuli2026 = {
    bulan: 'Juli',
    tahun: 2026,
    periode: 'Juli 2026',
    luas_wilayah: '301 Km',
    jumlah_kk: 1129,
    awal_bulan:  { total: 3700, laki_laki: 1875, perempuan: 1825 },
    kelahiran:   { total: 2,    laki_laki: 1,    perempuan: 1    },
    kematian:    { total: 4,    laki_laki: 2,    perempuan: 2    },
    pendatang:   { total: 4,    laki_laki: 1,    perempuan: 3    },
    pindah:      { total: 3,    laki_laki: 0,    perempuan: 3    },
    akhir_bulan: { total: 3699, laki_laki: 1875, perempuan: 1824 },
  };

  // Data Umum Wilayah (update dengan data terbaru Juli 2026)
  const dataUmum = [
    { id: 1, keterangan: 'Luas Wilayah',    jumlah: '301 Km',       icon: '🗺️' },
    { id: 2, keterangan: 'Jumlah Penduduk', jumlah: '3.699 Jiwa',   icon: '👥' },
    { id: 3, keterangan: 'Jumlah KK',       jumlah: '1.129 KK',     icon: '🏠' },
    { id: 4, keterangan: 'Laki-laki',       jumlah: '1.875 Jiwa',   icon: '👨' },
    { id: 5, keterangan: 'Perempuan',       jumlah: '1.824 Jiwa',   icon: '👩' },
  ];

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

  // 3. Update data_umum dan mutasi_bulanan
  meta.data_umum = dataUmum;

  if (!Array.isArray(meta.mutasi_bulanan)) meta.mutasi_bulanan = [];

  const sebelum = meta.mutasi_bulanan.length;
  meta.mutasi_bulanan = meta.mutasi_bulanan.filter(
    (m) => !(m.bulan === 'Juli' && Number(m.tahun) === 2026)
  );
  meta.mutasi_bulanan = meta.mutasi_bulanan.filter(Boolean);
  meta.mutasi_bulanan.push(mutasiJuli2026);

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

  // 5. Update pertumbuhan_penduduk
  console.log('▶ Memperbarui tabel pertumbuhan_penduduk...');
  const { data: existingGrowth } = await supabase
    .from('pertumbuhan_penduduk')
    .select('*')
    .eq('tahun', 2026)
    .maybeSingle();

  if (existingGrowth) {
    await supabase.from('pertumbuhan_penduduk').update({ jumlah: 3699 }).eq('id', existingGrowth.id);
  } else {
    await supabase.from('pertumbuhan_penduduk').insert([{ tahun: 2026, jumlah: 3699 }]);
  }

  console.log('\n✓ SUCCESS! Data Mutasi Juli 2026 berhasil disimpan ke Supabase!');
  console.log('─────────────────────────────────────────────────');
  console.log('  Periode         : Juli 2026');
  console.log('  Luas Wilayah    : 301 Km');
  console.log('  Jumlah KK       : 1.129 KK');
  console.log('  Awal Bulan      : 3.700 jiwa (L: 1.875, P: 1.825)');
  console.log('  Kelahiran  (+)  : +2 jiwa (L: 1, P: 1)');
  console.log('  Kematian   (-)  : -4 jiwa (L: 2, P: 2)');
  console.log('  Pendatang  (+)  : +4 jiwa (L: 1, P: 3)');
  console.log('  Pindah     (-)  : -3 jiwa (L: 0, P: 3)');
  console.log('  Akhir Bulan     : 3.699 jiwa (L: 1.875, P: 1.824)');
  console.log('─────────────────────────────────────────────────');
}

seedDataJuli2026();
