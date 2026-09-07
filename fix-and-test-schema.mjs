import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUmkm() {
  console.log('Testing UMKM columns...');
  const candidates = ['foto_url', 'foto', 'gambar', 'image_url', 'url_foto', 'foto_path'];
  for (const c of candidates) {
    const payload = { nama_produk: 'Test Produk', [c]: 'https://example.com/test.jpg' };
    const { data, error } = await supabase.from('umkm').insert([payload]).select();
    if (error) {
      console.log(`Column '${c}': FAIL - ${error.message}`);
    } else {
      console.log(`Column '${c}': SUCCESS! Valid columns:`, Object.keys(data[0]));
      await supabase.from('umkm').delete().eq('id', data[0].id);
      break;
    }
  }

  console.log('\nTesting Potensi columns...');
  const potCandidates = ['foto_url', 'foto', 'gambar', 'image_url', 'url_foto', 'foto_path'];
  for (const c of potCandidates) {
    const payload = { judul: 'Test Potensi', deskripsi: 'Test', [c]: 'https://example.com/test.jpg' };
    const { data, error } = await supabase.from('potensi_unggulan').insert([payload]).select();
    if (error) {
      console.log(`Potensi Column '${c}': FAIL - ${error.message}`);
    } else {
      console.log(`Potensi Column '${c}': SUCCESS! Valid columns:`, Object.keys(data[0]));
      await supabase.from('potensi_unggulan').delete().eq('id', data[0].id);
      break;
    }
  }
}

testUmkm();
