import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const petugas = [
      { jabatan: 'Lurah', nama: 'Ramli, S.E.', kontak: '0859 5616 9238', icon: '👔' },
      { jabatan: 'Babinsa', nama: 'Abd. Rahman', kontak: '0838 6343 7803', icon: '🛡️' },
      { jabatan: 'Binmas', nama: 'Suyuti', kontak: '0823 4628 4219', icon: '👮' },
    ];

    const tpk = ['Harlinah, S.Sos', 'Asrawati, S.E.', 'Irma Kadir'];
    const mbg = ['Ismawati', 'Hasnawati, S.Sos', 'Rosmawati'];

    const { data: profilData } = await supabase.from('profil').select('*').limit(1).maybeSingle();
    if (profilData) {
      let meta: any = {};
      if (profilData.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
        try {
          meta = JSON.parse(profilData.sejarah);
        } catch (e) {}
      }
      meta.petugas_kontak = petugas;
      meta.tpk_list = tpk;
      meta.mbg_list = mbg;
      const { error } = await supabase.from('profil').update({ sejarah: JSON.stringify(meta) }).eq('id', profilData.id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message });
      }
    } else {
      const meta = { petugas_kontak: petugas, tpk_list: tpk, mbg_list: mbg };
      await supabase.from('profil').insert({ sejarah: JSON.stringify(meta) });
    }

    return NextResponse.json({ success: true, message: 'Petugas, TPK & MBG successfully saved to database' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
