import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const strukturRW = [
      {
        rw: 'RW I',
        ketua_rw: 'Rahman',
        rt_list: [
          { rt: 'RT I', ketua_rt: 'Abd. Hakim' },
          { rt: 'RT II', ketua_rt: 'Abd. Rahim' },
          { rt: 'RT III', ketua_rt: 'Ibrahim' },
        ],
      },
      {
        rw: 'RW II',
        ketua_rw: 'Abd. Hamid',
        rt_list: [
          { rt: 'RT I', ketua_rt: 'H. Arifuddin' },
          { rt: 'RT II', ketua_rt: 'H. Hakim' },
          { rt: 'RT III', ketua_rt: 'M. Alwi' },
          { rt: 'RT IV', ketua_rt: 'Mustafa' },
        ],
      },
      {
        rw: 'RW III',
        ketua_rw: 'Saharuddin Goni',
        rt_list: [
          { rt: 'RT I', ketua_rt: 'Alimuddin' },
          { rt: 'RT II', ketua_rt: 'Rabaling' },
          { rt: 'RT III', ketua_rt: 'Syamsuddin' },
          { rt: 'RT IV', ketua_rt: 'Hamsah' },
        ],
      },
      {
        rw: 'RW IV',
        ketua_rw: 'Syamsiah',
        rt_list: [
          { rt: 'RT I', ketua_rt: 'Kamaruddin' },
          { rt: 'RT II', ketua_rt: 'Sarifuddin R.' },
          { rt: 'RT III', ketua_rt: 'Sampara Gassing' },
        ],
      },
    ];

    const { data: profilData } = await supabase.from('profil').select('*').limit(1).maybeSingle();
    if (profilData) {
      let meta: any = {};
      if (profilData.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
        try {
          meta = JSON.parse(profilData.sejarah);
        } catch (e) {}
      }
      meta.struktur_rw = strukturRW;
      const { error } = await supabase.from('profil').update({ sejarah: JSON.stringify(meta) }).eq('id', profilData.id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message });
      }
    } else {
      const meta = { struktur_rw: strukturRW };
      await supabase.from('profil').insert({ sejarah: JSON.stringify(meta) });
    }

    return NextResponse.json({ success: true, message: 'Struktur RW & RT (termasuk RW IV) successfully updated', strukturRW });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
