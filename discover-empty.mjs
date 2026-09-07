import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing insert {} into mata_pencaharian...');
const { data: d1, error: e1 } = await supabase.from('mata_pencaharian').insert([{}]).select();
console.log('mata_pencaharian res:', d1, e1);

console.log('Testing insert {} into agama...');
const { data: d2, error: e2 } = await supabase.from('agama').insert([{}]).select();
console.log('agama res:', d2, e2);

if (d1 && d1.length > 0) await supabase.from('mata_pencaharian').delete().eq('id', d1[0].id);
if (d2 && d2.length > 0) await supabase.from('agama').delete().eq('id', d2[0].id);
