import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  const numHarga = 25000;
  const testPayload = {
    nama_produk: 'Ikan Asin Super Kering',
    pemilik: 'Bapak Jufri',
    deskripsi: 'Ikan asin kualitas super dari tangkapan nelayan lokal.',
    harga: numHarga,
    kontak: '082198765432',
    gambar_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
  };

  const { data, error } = await supabase.from('umkm').insert([testPayload]).select();

  if (error) {
    return NextResponse.json({ success: false, error: error.message });
  }

  // Delete test row if successful
  if (data && data.length > 0) {
    await supabase.from('umkm').delete().eq('id', data[0].id);
  }

  return NextResponse.json({ success: true, inserted: data });
}
