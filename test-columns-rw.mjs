import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing insert only rw...');
const { data, error } = await supabase.from('kependudukan_rw').insert([{ rw: 'RW TEST' }]).select();

if (error) {
  console.error('INSERT ERROR:', error);
} else {
  console.log('INSERT SUCCESS, COLUMNS ARE:', Object.keys(data[0]), data);
}
