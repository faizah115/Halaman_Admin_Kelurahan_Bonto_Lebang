import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('--- Inspecting UMKM table schema ---');
  const { data, error } = await supabase.from('umkm').select('*').limit(1);
  console.log('Select result:', data, 'Error:', error);

  // Attempt inserting dummy with minimum fields to discover valid columns
  const { data: insData, error: insErr } = await supabase.from('umkm').insert([{ test_col: 'dummy' }]);
  console.log('Dummy insert error:', insErr);
}

run();
