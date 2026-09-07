import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tables = [
  'profil', 'struktur_pemerintahan', 'kependudukan_rw', 'kependudukan_usia',
  'umkm', 'galeri', 'berita', 'mata_pencaharian', 'pertumbuhan_penduduk',
  'agama', 'stunting', 'pengaduan', 'potensi_unggulan'
];

console.log('=== TEST AKSES SELURUH TABEL SUPABASE ===\n');

for (const t of tables) {
  const { data, error, status } = await supabase.from(t).select('*').limit(1);
  if (error) {
    console.log(`[FAIL] Tabel "${t}": HTTP ${status} - ${error.message}`);
  } else {
    console.log(`[OK]   Tabel "${t}": HTTP ${status} - Terhubung (Data: ${data.length} baris)`);
  }
}

console.log('\n=== TEST SELESAI ===');

