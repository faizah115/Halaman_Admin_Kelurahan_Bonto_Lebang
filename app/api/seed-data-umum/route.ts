import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const dataUmum = [
      { id: 1, keterangan: 'Luas Wilayah', jumlah: '301 Ha', icon: '🗺️' },
      { id: 2, keterangan: 'Jumlah Penduduk', jumlah: '3.700 Jiwa', icon: '👥' },
      { id: 3, keterangan: 'Jumlah KK', jumlah: '1.128 – 1.129 KK', icon: '🏠' },
      { id: 4, keterangan: 'Jumlah KK Miskin', jumlah: '278 KK', icon: '📋' },
    ];

    const { data: profilData } = await supabase.from('profil').select('*').limit(1).maybeSingle();
    if (profilData) {
      let meta: any = {};
      if (profilData.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
        try {
          meta = JSON.parse(profilData.sejarah);
        } catch (e) {}
      }
      meta.data_umum = dataUmum;
      const { error } = await supabase.from('profil').update({ sejarah: JSON.stringify(meta) }).eq('id', profilData.id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message });
      }
    } else {
      const meta = { data_umum: dataUmum };
      await supabase.from('profil').insert({ sejarah: JSON.stringify(meta) });
    }

    return NextResponse.json({ success: true, message: 'Data umum wilayah successfully saved to database', dataUmum });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
