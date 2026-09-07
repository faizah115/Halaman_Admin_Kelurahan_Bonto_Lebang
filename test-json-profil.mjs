import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const metadata = {
  deskripsi: 'Ini deskripsi singkat kelurahan Bonto Lebang',
  nama_lurah: 'H. Ahmad, S.Sos.',
  jabatan_lurah: 'Lurah Bonto Lebang',
  foto_lurah_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  sejarah: 'Kelurahan Bonto Lebang berdiri sejak tahun 1980...'
};

const payload = {
  lokasi: 'Bonto Lebang',
  kecamatan: 'Bissappu',
  kabupaten: 'Bantaeng',
  visi: 'Bonto Lebang Sejahtera',
  misi: 'Pelayanan Publik Terbaik',
  sejarah: JSON.stringify(metadata)
};

console.log('Testing insert profil payload with JSON sejarah...');
const { data, error } = await supabase.from('profil').insert([payload]).select();

if (error) {
  console.error('ERROR:', error);
} else {
  console.log('INSERT SUCCESS:', data);
  
  // Test reading and parsing
  const raw = data[0];
  let parsedSejarah = raw.sejarah;
  try {
    const json = JSON.parse(raw.sejarah);
    console.log('PARSED METADATA:', json);
  } catch (e) {
    console.log('Raw text:', raw.sejarah);
  }
}
