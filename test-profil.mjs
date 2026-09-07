import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test 1: Cek kolom tabel profil
console.log('=== TEST TABEL PROFIL ===\n');

const testPayload = {
  nama_lurah: 'Test Lurah',
  jabatan_lurah: 'Lurah Bonto Lebang',
  lokasi: 'Bonto Lebang',
  kecamatan: 'Bissappu',
  kabupaten: 'Bantaeng',
  deskripsi: 'Test deskripsi',
  visi: 'Test visi',
  misi: 'Test misi',
};

console.log('1. Testing insert profil...');
const { data, error } = await supabase.from('profil').insert([testPayload]).select();

if (error) {
  console.error('INSERT ERROR:', error.message);
  
  // Try minimal insert to discover actual columns
  console.log('\n2. Trying minimal insert...');
  const { data: d2, error: e2 } = await supabase.from('profil').insert([{ lokasi: 'Test' }]).select();
  if (e2) {
    console.error('MINIMAL INSERT ERROR:', e2.message);
  } else {
    console.log('MINIMAL INSERT OK. Columns:', Object.keys(d2[0]));
    // Clean up
    await supabase.from('profil').delete().eq('id', d2[0].id);
  }
} else {
  console.log('INSERT OK. Columns:', Object.keys(data[0]));
  console.log('Data:', data[0]);
  // Clean up
  await supabase.from('profil').delete().eq('id', data[0].id);
  console.log('Cleaned up test row.');
}
