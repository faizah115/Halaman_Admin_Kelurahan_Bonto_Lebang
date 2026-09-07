'use server';

import { supabase } from '@/lib/supabaseClient';

export async function submitPengaduan(formData: FormData) {
  const nama = formData.get('nama') as string;
  const kontak = formData.get('kontak') as string;
  const isi = formData.get('isi') as string;

  const { error } = await supabase.from('pengaduan').insert({
    nama,
    kontak,
    isi,
    status: 'baru',
  });
  
  if (error) {
    console.error('Error inserting pengaduan:', error);
    throw new Error('Gagal mengirim pengaduan');
  }
}
