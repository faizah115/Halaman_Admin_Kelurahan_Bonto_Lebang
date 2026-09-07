import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Inspecting umkm table...');
  const { data: rows, error } = await supabase.from('umkm').select('*');
  console.log('UMKM rows:', rows?.length, 'Error:', error);
  if (rows && rows.length > 0) {
    for (const row of rows) {
      if (row.harga && (row.harga.includes('45.000') || row.harga.includes('45000'))) {
        console.log('Updating row:', row.id, row.nama_produk);
        const newHarga = row.harga.replace('45.000', '25.000 - 50.000').replace('45000', '25.000 - 50.000');
        await supabase.from('umkm').update({ harga: newHarga }).eq('id', row.id);
      }
    }
  }
}

run();
