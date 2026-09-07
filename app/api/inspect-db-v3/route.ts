import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  const candidateTables = [
    'umkm', 'potensi', 'potensi_unggulan', 'potensi_desa', 'potensi_kelurahan',
    'berita', 'galeri', 'pengaduan', 'profil', 'kependudukan', 'kependudukan_rw',
    'kependudukan_usia', 'mata_pencaharian', 'pertumbuhan_penduduk', 'agama', 'stunting',
    'struktur_pemerintahan'
  ];

  const results: Record<string, any> = {};

  for (const t of candidateTables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      results[t] = { status: 'error', message: error.message };
    } else {
      results[t] = {
        status: 'ok',
        count: data?.length ?? 0,
        columns: data && data.length > 0 ? Object.keys(data[0]) : 'empty table (exists)',
      };
    }
  }

  return NextResponse.json(results);
}
