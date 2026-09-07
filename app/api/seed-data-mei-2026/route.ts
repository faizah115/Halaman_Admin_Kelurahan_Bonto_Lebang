import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * API Route: GET /api/seed-data-mei-2026
 * Menyimpan data mutasi penduduk Bulan Mei 2026 ke database Supabase
 *
 * Data Sumber:
 * - Luas Wilayah       : 301 Km / Ha
 * - Jumlah KK          : 1.128 KK
 * - Awal Bulan Mei     : 3.700 jiwa (L: 1.876, P: 1.824)
 * - Kelahiran          : 5 jiwa (L: 1, P: 4)
 * - Kematian           : 3 jiwa (L: 2, P: 1)
 * - Pendatang          : 1 jiwa (L: 1, P: 0)
 * - Pindah             : 0 jiwa (L: 0, P: 0)
 * - Akhir Bulan Mei    : 3.702 jiwa (L: 1.875, P: 1.827)
 */
export async function GET() {
  try {
    const mutasiMei2026 = {
      bulan: 'Mei',
      tahun: 2026,
      periode: 'Mei 2026',
      awal_bulan: {
        total: 3700,
        laki_laki: 1876,
        perempuan: 1824,
      },
      kelahiran: {
        total: 5,
        laki_laki: 1,
        perempuan: 4,
      },
      kematian: {
        total: 3,
        laki_laki: 2,
        perempuan: 1,
      },
      pendatang: {
        total: 1,
        laki_laki: 1,
        perempuan: 0,
      },
      pindah: {
        total: 0,
        laki_laki: 0,
        perempuan: 0,
      },
      akhir_bulan: {
        total: 3702,
        laki_laki: 1875,
        perempuan: 1827,
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
      (m: any) => !(m.bulan === 'Mei' && m.tahun === 2026)
    );
    meta.mutasi_bulanan.push(mutasiMei2026);

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
      message: 'Data mutasi penduduk Mei 2026 berhasil disimpan ke database.',
      summary: {
        periode: 'Mei 2026',
        luas_wilayah: '301 Ha',
        jumlah_kk: '1.128 KK',
        awal_bulan: { total: 3700, laki_laki: 1876, perempuan: 1824 },
        perubahan: {
          lahir: '+ 5 jiwa (L: 1, P: 4)',
          mati: '- 3 jiwa (L: 2, P: 1)',
          datang: '+ 1 jiwa (L: 1, P: 0)',
          pindah: '- 0 jiwa (L: 0, P: 0)',
        },
        akhir_bulan: { total: 3702, laki_laki: 1875, perempuan: 1827 },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
