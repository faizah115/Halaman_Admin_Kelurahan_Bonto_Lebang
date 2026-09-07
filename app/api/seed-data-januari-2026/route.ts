import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * API Route: GET /api/seed-data-januari-2026
 * Menyimpan data mutasi penduduk Bulan Januari 2026 ke database Supabase
 *
 * Data Sumber:
 * - Luas Wilayah       : 301 Ha
 * - Jumlah KK          : 1.127 KK
 * - Awal Bulan Jan     : 3.692 jiwa (L: 1.872, P: 1.820)
 * - Kelahiran          : 5 jiwa (L: 4, P: 1)
 * - Kematian           : 2 jiwa (L: 2, P: 0)
 * - Pendatang          : 0 jiwa
 * - Pindah             : 1 jiwa (L: 1, P: 0)
 * - Akhir Bulan Jan    : 3.694 jiwa (L: 1.873, P: 1.821)
 */
export async function GET() {
  try {
    // ─── 1. Data Mutasi Penduduk Januari 2026 ────────────────────────────────
    const mutasiJanuari2026 = {
      bulan: 'Januari',
      tahun: 2026,
      periode: 'Januari 2026',
      awal_bulan: {
        total: 3692,
        laki_laki: 1872,
        perempuan: 1820,
      },
      kelahiran: {
        total: 5,
        laki_laki: 4,
        perempuan: 1,
      },
      kematian: {
        total: 2,
        laki_laki: 2,
        perempuan: 0,
      },
      pendatang: {
        total: 0,
        laki_laki: 0,
        perempuan: 0,
      },
      pindah: {
        total: 1,
        laki_laki: 1,
        perempuan: 0,
      },
      akhir_bulan: {
        // L = 1872 + 4(lahir) - 2(mati) + 0(datang) - 1(pindah) = 1873
        // P = 1820 + 1(lahir) - 0(mati) + 0(datang) - 0(pindah) = 1821
        total: 3694,
        laki_laki: 1873,
        perempuan: 1821,
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

    // Simpan riwayat mutasi bulanan (array, append atau replace)
    if (!Array.isArray(meta.mutasi_bulanan)) {
      meta.mutasi_bulanan = [];
    }
    // Hapus data Januari 2026 lama jika ada, lalu tambahkan yang baru
    meta.mutasi_bulanan = meta.mutasi_bulanan.filter(
      (m: any) => !(m.bulan === 'Januari' && m.tahun === 2026)
    );
    meta.mutasi_bulanan.push(mutasiJanuari2026);

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
      message: 'Data mutasi penduduk Januari 2026 berhasil disimpan ke database.',
      summary: {
        periode: 'Januari 2026',
        luas_wilayah: '301 Ha',
        jumlah_kk: '1.127 KK',
        awal_bulan: { total: 3692, laki_laki: 1872, perempuan: 1820 },
        perubahan: {
          lahir: '+ 5 jiwa (L: 4, P: 1)',
          mati: '- 2 jiwa (L: 2, P: 0)',
          datang: '0 jiwa',
          pindah: '- 1 jiwa (L: 1, P: 0)',
        },
        akhir_bulan: { total: 3694, laki_laki: 1873, perempuan: 1821 },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
