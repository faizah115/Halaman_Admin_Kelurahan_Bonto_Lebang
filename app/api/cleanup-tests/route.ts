import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  await supabase.from('umkm').delete().eq('nama_produk', 'Produk Uji Coba Admin');
  await supabase.from('umkm').delete().eq('nama_produk', 'Ikan Asin Test');
  await supabase.from('umkm').delete().eq('nama_produk', 'Multi Image Test');
  return NextResponse.json({ clean: true });
}
