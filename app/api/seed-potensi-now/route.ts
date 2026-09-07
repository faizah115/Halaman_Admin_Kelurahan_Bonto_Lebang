import { NextResponse } from 'next/server';
import { supabase, defaultPotensiList } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data: profilData } = await supabase.from('profil').select('*').limit(1).maybeSingle();
    if (profilData) {
      let meta: any = {};
      if (profilData.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
        try {
          meta = JSON.parse(profilData.sejarah);
        } catch (e) {}
      }
      meta.potensi = defaultPotensiList;
      const { error } = await supabase.from('profil').update({ sejarah: JSON.stringify(meta) }).eq('id', profilData.id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message });
      }
    } else {
      const meta = { potensi: defaultPotensiList };
      await supabase.from('profil').insert({ sejarah: JSON.stringify(meta) });
    }

    return NextResponse.json({ success: true, message: 'Potensi Unggulan successfully saved into profil meta in Supabase', defaultPotensiList });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
