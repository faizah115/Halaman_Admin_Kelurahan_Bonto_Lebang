import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tambah kolom yang kurang via RPC / raw SQL
// Supabase anon key tidak bisa ALTER TABLE, jadi kita sesuaikan kode admin agar cocok dengan kolom yang ada.

// Kolom yang ADA di Supabase: id, lokasi, kecamatan, kabupaten, sejarah, visi, misi
// Kolom yang DIBUTUHKAN admin tapi TIDAK ADA: nama_lurah, jabatan_lurah, foto_lurah_url, deskripsi

// Coba insert dengan kolom yang ada saja
const payload = {
  lokasi: 'Bonto Lebang',
  kecamatan: 'Bissappu',
  kabupaten: 'Bantaeng',
  sejarah: 'Kelurahan Bonto Lebang merupakan salah satu kelurahan...',
  visi: 'Visi Kelurahan',
  misi: 'Misi Kelurahan',
};

console.log('Inserting profil with available columns...');
const { data, error } = await supabase.from('profil').insert([payload]).select();

if (error) {
  console.error('ERROR:', error.message);
} else {
  console.log('SUCCESS:', data);
}
