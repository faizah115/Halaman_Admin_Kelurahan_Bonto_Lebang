import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * API Route: GET /api/seed-data-februari-2026
 * Menyimpan data mutasi penduduk Bulan Februari 2026 ke database Supabase
 *
 * Data Sumber:
 * - Luas Wilayah       : 301 Ha
 * - Jumlah KK          : 1.127 KK
 * - Awal Bulan Feb     : 3.694 jiwa (L: 1.873, P: 1.821)
 * - Kelahiran          : 5 jiwa (L: 2, P: 3)
 * - Kematian           : 3 jiwa (L: 0, P: 3)
 * - Pendatang          : 0 jiwa
 * - Pindah             : 5 jiwa (L: 3, P: 2)
 * - Akhir Bulan Feb    : 3.691 jiwa (L: 1.872, P: 1.819)
 */
export async function GET() {
  try {
    // ─── 1. Data Mutasi Penduduk Februari 2026 ───────────────────────────────
    const mutasiFebruari2026 = {
      bulan: 'Februari',
      tahun: 2026,
      periode: 'Februari 2026',
      awal_bulan: {
        total: 3694,
        laki_laki: 1873,
        perempuan: 1821,
      },
      kelahiran: {
        total: 5,
        laki_laki: 2,
        perempuan: 3,
      },
      kematian: {
        total: 3,
        laki_laki: 0,
        perempuan: 3,
      },
      pendatang: {
        total: 0,
        laki_laki: 0,
        perempuan: 0,
      },
      pindah: {
        total: 5,
        laki_laki: 3,
        perempuan: 2,
      },
      akhir_bulan: {
        // L = 1873 + 2(lahir) - 0(mati) + 0(datang) - 3(pindah) = 1872
        // P = 1821 + 3(lahir) - 3(mati) + 0(datang) - 2(pindah) = 1819
        total: 3691,
        laki_laki: 1872,
        perempuan: 1819,
      },
      jumlah_kk: 1127,
      luas_wilayah: '301 Ha',
    };

    // ─── 2. Baca profil existing ─────────────────────────────────────────────
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

    // Simpan riwayat mutasi bulanan
    if (!Array.isArray(meta.mutasi_bulanan)) {
      meta.mutasi_bulanan = [];
    }
    // Hapus data Februari 2026 lama jika ada, lalu tambahkan yang baru
    meta.mutasi_bulanan = meta.mutasi_bulanan.filter(
      (m: any) => !(m.bulan === 'Februari' && m.tahun === 2026)
    );
    meta.mutasi_bulanan.push(mutasiFebruari2026);

    // Simpan kembali ke profil
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
      return NextResponse.json({ success: false, error: 'Gagal menyimpan data profil: ' + saveError.message });
    }

    return NextResponse.json({
      success: true,
      message: 'Data mutasi penduduk Februari 2026 berhasil disimpan ke database.',
      summary: {
        periode: 'Februari 2026',
        luas_wilayah: '301 Ha',
        jumlah_kk: '1.127 KK',
        awal_bulan: { total: 3694, laki_laki: 1873, perempuan: 1821 },
        perubahan: {
          lahir: '+ 5 jiwa (L: 2, P: 3)',
          mati: '- 3 jiwa (L: 0, P: 3)',
          datang: '0 jiwa',
          pindah: '- 5 jiwa (L: 3, P: 2)',
        },
        akhir_bulan: { total: 3691, laki_laki: 1872, perempuan: 1819 },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
