import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * API Route: GET /api/seed-data-april-2026
 * Menyimpan data mutasi penduduk Bulan April 2026 ke database Supabase
 *
 * Data Sumber:
 * - Luas Wilayah       : 301 Km / Ha
 * - Jumlah KK          : 1.128 KK
 * - Awal Bulan April   : 3.694 jiwa (L: 1.874, P: 1.820)
 * - Kelahiran          : 4 jiwa (L: 2, P: 2)
 * - Kematian           : 3 jiwa (L: 1, P: 2)
 * - Pendatang          : 9 jiwa (L: 5, P: 4)
 * - Pindah             : 4 jiwa (L: 4, P: 0)
 * - Akhir Bulan April  : 3.700 jiwa (L: 1.876, P: 1.824)
 */
export async function GET() {
  try {
    const mutasiApril2026 = {
      bulan: 'April',
      tahun: 2026,
      periode: 'April 2026',
      awal_bulan: {
        total: 3694,
        laki_laki: 1874,
        perempuan: 1820,
      },
      kelahiran: {
        total: 4,
        laki_laki: 2,
        perempuan: 2,
      },
      kematian: {
        total: 3,
        laki_laki: 1,
        perempuan: 2,
      },
      pendatang: {
        total: 9,
        laki_laki: 5,
        perempuan: 4,
      },
      pindah: {
        total: 4,
        laki_laki: 4,
        perempuan: 0,
      },
      akhir_bulan: {
        total: 3700,
        laki_laki: 1876,
        perempuan: 1824,
      },
      jumlah_kk: 1128,
      luas_wilayah: '301 Ha',
    };

    // ─── Baca profil existing ─────────────────────────────────────────────────
    const { data: profilData, error: profilError } = await supabase
      .from('profil')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (profilError) {
      return NextResponse.json({ success: false, error: 'Gagal membaca profil: ' + profilError.message });
    }

    let meta: any = {};
    if (profilData?.sejarah && typeof profilData.sejarah === 'string' && profilData.sejarah.startsWith('{')) {
      try {
        meta = JSON.parse(profilData.sejarah);
      } catch (_) {
        meta = {};
      }
    }

    if (!Array.isArray(meta.mutasi_bulanan)) {
      meta.mutasi_bulanan = [];
    }
    meta.mutasi_bulanan = meta.mutasi_bulanan.filter(
      (m: any) => !(m.bulan === 'April' && m.tahun === 2026)
    );
    meta.mutasi_bulanan.push(mutasiApril2026);

    let saveError: any = null;
    if (profilData) {
      const { error } = await supabase
        .from('profil')
        .update({ sejarah: JSON.stringify(meta) })
        .eq('id', profilData.id);
      saveError = error;
    } else {
      const { error } = await supabase
        .from('profil')
        .insert([{ lokasi: 'Bonto Lebang', sejarah: JSON.stringify(meta) }]);
      saveError = error;
    }

    if (saveError) {
      return NextResponse.json({ success: false, error: 'Gagal menyimpan: ' + saveError.message });
    }

    return NextResponse.json({
      success: true,
      message: 'Data mutasi penduduk April 2026 berhasil disimpan ke database.',
      summary: {
        periode: 'April 2026',
        luas_wilayah: '301 Ha',
        jumlah_kk: '1.128 KK',
        awal_bulan: { total: 3694, laki_laki: 1874, perempuan: 1820 },
        perubahan: {
          lahir: '+ 4 jiwa (L: 2, P: 2)',
          mati: '- 3 jiwa (L: 1, P: 2)',
          datang: '+ 9 jiwa (L: 5, P: 4)',
          pindah: '- 4 jiwa (L: 4, P: 0)',
        },
        akhir_bulan: { total: 3700, laki_laki: 1876, perempuan: 1824 },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
