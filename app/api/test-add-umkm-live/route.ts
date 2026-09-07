import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = {
    nama_produk: 'Produk Uji Coba Admin',
    pemilik: 'Warga Bonto Lebang',
    deskripsi: 'Deskripsi produk uji coba dari sistem.',
    harga: 35000,
    kontak: '08123456789',
    gambar_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&q=80',
  };

  const { data, error } = await supabase.from('umkm').insert([payload]).select();

  if (error) {
    return NextResponse.json({ success: false, error: error.message });
  }

  return NextResponse.json({ success: true, inserted: data });
}
