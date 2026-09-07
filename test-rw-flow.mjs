import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('1. Inserting RW 01...');
const payload = { rw: 'RW 01', laki: 250, perempuan: 260, jumlah: 130 };
const { data: insData, error: insErr } = await supabase.from('kependudukan_rw').insert([payload]).select();

if (insErr) {
  console.error('INSERT FAILED:', insErr);
} else {
  console.log('INSERT SUCCESS:', insData);
  
  console.log('2. Fetching stats...');
  const { data: rwData } = await supabase.from('kependudukan_rw').select('*');
  const totalPenduduk = rwData.reduce((sum, item) => sum + (item.laki ?? item.laki_laki ?? 0) + (item.perempuan || 0), 0);
  const totalKK = rwData.reduce((sum, item) => sum + (item.jumlah ?? item.jumlah_kk ?? 0), 0);
  const totalRW = rwData.length;
  console.log('STATS CALCULATION RESULT:', { totalPenduduk, totalKK, totalRW });
}
