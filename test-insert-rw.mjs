import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const payload = {
  rw: 'RW 01',
  rt: 'RT 01, RT 02, RT 03',
  jumlah_kk: 150,
  laki_laki: 250,
  perempuan: 260
};

console.log('Testing insert to kependudukan_rw...');
const { data, error } = await supabase.from('kependudukan_rw').insert([payload]).select();

if (error) {
  console.error('INSERT ERROR:', error);
} else {
  console.log('INSERT SUCCESS:', data);
}
