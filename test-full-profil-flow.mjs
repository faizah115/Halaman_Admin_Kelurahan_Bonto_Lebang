import { createClient } from '@supabase/supabase-js';
import { getProfil } from './lib/supabaseClient.ts';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('1. Saving test profil...');
const metadata = {
  deskripsi: 'Kelurahan Bonto Lebang adalah kelurahan yang hijau dan ramah.',
  nama_lurah: 'Drs. H. Syamsuddin, M.Si.',
  jabatan_lurah: 'Lurah Bonto Lebang',
  foto_lurah_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
};

const payload = {
  lokasi: 'Bonto Lebang',
  kecamatan: 'Bissappu',
  kabupaten: 'Bantaeng',
  visi: 'Terwujudnya Kelurahan Bonto Lebang yang Mandiri',
  misi: 'Meningkatkan kualitas pelayanan dan kesejahteraan',
  sejarah: JSON.stringify(metadata),
};

const { data: saveRes, error: saveErr } = await supabase.from('profil').insert([payload]).select().single();

if (saveErr) {
  console.error('SAVE ERROR:', saveErr);
} else {
  console.log('SAVE SUCCESS! ID:', saveRes.id);

  console.log('\n2. Fetching via getProfil()...');
  const fetched = await getProfil();
  console.log('FETCHED PROFIL RESULT:', fetched);

  console.log('\n3. Cleaning up test record...');
  await supabase.from('profil').delete().eq('id', saveRes.id);
  console.log('CLEANED UP SUCCESS!');
}
