import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing insert into mata_pencaharian...');
const { data: d1, error: e1 } = await supabase.from('mata_pencaharian').insert([{ name: 'Nelayan' }]).select();
if (e1) {
  console.error('e1:', e1);
} else {
  console.log('mata_pencaharian columns:', Object.keys(d1[0]), d1[0]);
  await supabase.from('mata_pencaharian').delete().eq('id', d1[0].id);
}

console.log('Testing insert into agama...');
const { data: d2, error: e2 } = await supabase.from('agama').insert([{ name: 'Islam' }]).select();
if (e2) {
  console.error('e2:', e2);
} else {
  console.log('agama columns:', Object.keys(d2[0]), d2[0]);
  await supabase.from('agama').delete().eq('id', d2[0].id);
}
