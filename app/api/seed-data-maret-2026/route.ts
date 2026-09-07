import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * API Route: GET /api/seed-data-maret-2026
 * Menyimpan data mutasi penduduk Bulan Maret 2026 ke database Supabase
 *
 * Data Sumber:
 * - Luas Wilayah       : 301 Ha
 * - Jumlah KK          : 1.126 KK
 * - Awal Bulan Mar     : 3.691 jiwa (L: 1.872, P: 1.819)
 * - Kelahiran          : 5 jiwa (L: 3, P: 2)
 * - Kematian           : 2 jiwa (L: 1, P: 1)
 * - Pendatang          : 1 jiwa (L: 1, P: 0)
 * - Pindah             : 1 jiwa (L: 0, P: 1)
 * - Akhir Bulan Mar    : 3.694 jiwa (L: 1.874, P: 1.820)
 */
export async function GET() {
  try {
    const mutasiMaret2026 = {
      bulan: 'Maret',
      tahun: 2026,
      periode: 'Maret 2026',
      awal_bulan: {
        total: 3691,
        laki_laki: 1872,
        perempuan: 1819,
      },
      kelahiran: {
        total: 5,
        laki_laki: 3,
        perempuan: 2,
      },
      kematian: {
        total: 2,
        laki_laki: 1,
        perempuan: 1,
      },
      pendatang: {
        total: 1,
        laki_laki: 1,
        perempuan: 0,
      },
      pindah: {
        total: 1,
        laki_laki: 0,
        perempuan: 1,
      },
      akhir_bulan: {
        // L = 1872 + 3(lahir) - 1(mati) + 1(datang) - 0(pindah) = 1875 → koreksi: 1874
        // L = 1872 + 3 - 1 + 1 - 1(pindah L:0 → 0) = 1875? No: pindah L=0
        // L = 1872 + 3 - 1 + 1 - 0 = 1875 — tapi laporan = 1874
        // Koreksi: mengikuti data resmi laporan
        // L: 1874, P: 1820 sesuai laporan resmi
        total: 3694,
        laki_laki: 1874,
        perempuan: 1820,
      },
      jumlah_kk: 1126,
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
      (m: any) => !(m.bulan === 'Maret' && m.tahun === 2026)
    );
    meta.mutasi_bulanan.push(mutasiMaret2026);

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
      message: 'Data mutasi penduduk Maret 2026 berhasil disimpan ke database.',
      summary: {
        periode: 'Maret 2026',
        luas_wilayah: '301 Ha',
        jumlah_kk: '1.126 KK',
        awal_bulan: { total: 3691, laki_laki: 1872, perempuan: 1819 },
        perubahan: {
          lahir: '+ 5 jiwa (L: 3, P: 2)',
          mati: '- 2 jiwa (L: 1, P: 1)',
          datang: '+ 1 jiwa (L: 1, P: 0)',
          pindah: '- 1 jiwa (L: 0, P: 1)',
        },
        akhir_bulan: { total: 3694, laki_laki: 1874, perempuan: 1820 },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
