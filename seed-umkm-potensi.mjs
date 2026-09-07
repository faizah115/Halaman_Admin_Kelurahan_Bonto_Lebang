import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('--- Inspecting UMKM table ---');
  const { data: umkmData, error: umkmErr } = await supabase.from('umkm').select('*');
  console.log('UMKM count:', umkmData?.length, 'Err:', umkmErr);
  if (umkmData) console.log('UMKM rows:', umkmData);

  console.log('\n--- Inspecting Potensi Unggulan table ---');
  const { data: potensiData, error: potensiErr } = await supabase.from('potensi_unggulan').select('*');
  console.log('Potensi count:', potensiData?.length, 'Err:', potensiErr);
  if (potensiData) console.log('Potensi rows:', potensiData);
}

run();
