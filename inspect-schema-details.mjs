import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing insert minimal into mata_pencaharian...');
const { data: d1, error: e1 } = await supabase.from('mata_pencaharian').insert([{ pekerjaan: 'Test' }]).select();
if (e1) console.error('mata_pencaharian err:', e1.message);
else {
  console.log('mata_pencaharian columns:', Object.keys(d1[0]));
  await supabase.from('mata_pencaharian').delete().eq('id', d1[0].id);
}

console.log('\nTesting insert minimal into agama...');
const { data: d2, error: e2 } = await supabase.from('agama').insert([{ nama: 'Test' }]).select();
if (e2) {
  const { data: d3, error: e3 } = await supabase.from('agama').insert([{ nama_agama: 'Test' }]).select();
  if (e3) {
    console.error('agama err:', e3.message);
  } else {
    console.log('agama columns:', Object.keys(d3[0]));
    await supabase.from('agama').delete().eq('id', d3[0].id);
  }
} else {
  console.log('agama columns:', Object.keys(d2[0]));
  await supabase.from('agama').delete().eq('id', d2[0].id);
}
