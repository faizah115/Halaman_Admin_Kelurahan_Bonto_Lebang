import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testTables = [
  { table: 'mata_pencaharian', sample: { pekerjaan: 'Petani', jumlah: 100, urutan: 1 } },
  { table: 'pertumbuhan_penduduk', sample: { tahun: 2024, jumlah: 2500 } },
  { table: 'agama', sample: { agama: 'Islam', jumlah: 2450, urutan: 1 } }
];

for (const t of testTables) {
  console.log(`Testing ${t.table}...`);
  const { data, error } = await supabase.from(t.table).insert([t.sample]).select();
  if (error) {
    console.error(`INSERT ${t.table} ERROR:`, error.message);
  } else {
    console.log(`INSERT ${t.table} SUCCESS. Columns:`, Object.keys(data[0]));
    await supabase.from(t.table).delete().eq('id', data[0].id);
  }
}
