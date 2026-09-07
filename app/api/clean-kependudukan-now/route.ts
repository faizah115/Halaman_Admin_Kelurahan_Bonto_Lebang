import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const results: any = {};

    // 1. Clean kependudukan_rw
    const { error: e1 } = await supabase.from('kependudukan_rw').delete().neq('id', 0);
    results.kependudukan_rw = e1 ? e1.message : 'deleted';

    // 2. Clean kependudukan_usia
    const { error: e2 } = await supabase.from('kependudukan_usia').delete().neq('id', 0);
    results.kependudukan_usia = e2 ? e2.message : 'deleted';

    // 3. Clean mata_pencaharian
    const { error: e3 } = await supabase.from('mata_pencaharian').delete().neq('id', 0);
    results.mata_pencaharian = e3 ? e3.message : 'deleted';

    // 4. Clean pertumbuhan_penduduk
    const { error: e4 } = await supabase.from('pertumbuhan_penduduk').delete().neq('id', 0);
    results.pertumbuhan_penduduk = e4 ? e4.message : 'deleted';

    // 5. Clean agama
    const { error: e5 } = await supabase.from('agama').delete().neq('id', 0);
    results.agama = e5 ? e5.message : 'deleted';

    // 6. Clean stunting
    const { error: e6 } = await supabase.from('stunting').delete().neq('id', 0);
    results.stunting = e6 ? e6.message : 'deleted';

    // 7. Clean pendidikan & perkawinan in profil table meta
    const { data: profilData } = await supabase.from('profil').select('*').limit(1).maybeSingle();
    if (profilData) {
      let meta: any = {};
      if (profilData.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
        try {
          meta = JSON.parse(profilData.sejarah);
        } catch (e) {}
      }
      meta.pendidikan = [];
      meta.perkawinan = [];
      await supabase.from('profil').update({ sejarah: JSON.stringify(meta) }).eq('id', profilData.id);
      results.profil_meta = 'updated pendidikan and perkawinan to empty';
    }

    return NextResponse.json({ success: true, message: 'All kependudukan tables & meta successfully cleaned', results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
