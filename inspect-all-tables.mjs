import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tables = [
  'profil', 'struktur_pemerintahan', 'kependudukan_rw', 'kependudukan_usia',
  'umkm', 'galeri', 'berita', 'mata_pencaharian', 'pertumbuhan_penduduk',
  'agama', 'stunting', 'pengaduan', 'potensi_unggulan'
];

for (const t of tables) {
  const { data, error } = await supabase.from(t).select('*').limit(1);
  if (error) {
    console.log(`Table ${t}: Error (${error.message})`);
  } else {
    console.log(`Table ${t}: OK. Sample/Columns:`, data.length > 0 ? Object.keys(data[0]) : 'empty table');
  }
}
