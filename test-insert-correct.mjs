import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const payload = {
  rw: 'RW 01',
  laki: 250,
  perempuan: 260,
  jumlah: 150
};

console.log('Testing insert payload...');
const { data, error } = await supabase.from('kependudukan_rw').insert([payload]).select();

if (error) {
  console.error('INSERT ERROR:', error);
} else {
  console.log('INSERT SUCCESS:', data);
}
