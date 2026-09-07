import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tryColumns = async (table, candidates) => {
  for (const c of candidates) {
    const { data, error } = await supabase.from(table).insert([c]).select();
    if (!error && data) {
      console.log(`[FOUND] Table '${table}' columns:`, Object.keys(data[0]), 'Data:', data[0]);
      await supabase.from(table).delete().eq('id', data[0].id);
      return Object.keys(data[0]);
    }
  }
  console.log(`[NOT FOUND] Table '${table}'`);
};

await tryColumns('mata_pencaharian', [
  { nama: 'Nelayan' },
  { jenis: 'Nelayan' },
  { mata_pencaharian: 'Nelayan' },
  { kriteria: 'Nelayan' },
  { title: 'Nelayan' }
]);

await tryColumns('agama', [
  { nama: 'Islam' },
  { jenis: 'Islam' },
  { kriteria: 'Islam' },
  { title: 'Islam' }
]);

await tryColumns('kependudukan_usia', [
  { kelompok_umur: '0-14' },
  { umur: '0-14' },
  { kategori: '0-14' }
]);

await tryColumns('stunting', [
  { tahun: 2024, stunting: 10, normal: 100 },
  { tahun: 2024 }
]);
