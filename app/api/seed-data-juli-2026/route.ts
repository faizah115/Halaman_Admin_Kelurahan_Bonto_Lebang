import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * API Route: GET /api/seed-data-juli-2026
 * Menyimpan data mutasi penduduk Bulan Juli 2026 ke database Supabase
 *
 * Data Sumber:
 * - Luas Wilayah       : 301 Ha
 * - Jumlah KK          : 1.129 KK
 * - Awal Bulan Juli    : 3.700 jiwa (L: 1.875, P: 1.825)
 * - Kelahiran          : 2 jiwa (L: 1, P: 1)
 * - Kematian           : 4 jiwa (L: 2, P: 2)
 * - Pendatang          : 4 jiwa (L: 1, P: 3)
 * - Pindah             : 3 jiwa (L: 0, P: 3)
 * - Akhir Bulan Juli   : 3.699 jiwa (L: 1.875, P: 1.824)
 */
export async function GET() {
  try {
    // ─── 1. Data Mutasi Penduduk Juli 2026 ───────────────────────────────────
    const mutasiJuli2026 = {
      bulan: 'Juli',
      tahun: 2026,
      periode: 'Juli 2026',
      awal_bulan: {
        total: 3700,
        laki_laki: 1875,
        perempuan: 1825,
      },
      kelahiran: {
        total: 2,
        laki_laki: 1,
        perempuan: 1,
      },
      kematian: {
        total: 4,
        laki_laki: 2,
        perempuan: 2,
      },
      pendatang: {
        total: 4,
        laki_laki: 1,
        perempuan: 3,
      },
      pindah: {
        total: 3,
        laki_laki: 0,
        perempuan: 3,
      },
      akhir_bulan: {
        // L = 1875 + 1(lahir) - 2(mati) + 1(datang) - 0(pindah) = 1875
        // P = 1825 + 1(lahir) - 2(mati) + 3(datang) - 3(pindah) = 1824
        total: 3699,
        laki_laki: 1875,
        perempuan: 1824,
      },
      jumlah_kk: 1129,
      luas_wilayah: '301 Ha',
    };

    // ─── 2. Data Umum Wilayah (diperbarui dengan data akhir bulan Juli 2026) ─
    const dataUmum = [
      { id: 1, keterangan: 'Luas Wilayah', jumlah: '301 Ha', icon: '🗺️' },
      { id: 2, keterangan: 'Jumlah Penduduk', jumlah: '3.699 Jiwa', icon: '👥' },
      { id: 3, keterangan: 'Jumlah KK', jumlah: '1.129 KK', icon: '🏠' },
      { id: 4, keterangan: 'Laki-laki', jumlah: '1.875 Jiwa', icon: '👨' },
      { id: 5, keterangan: 'Perempuan', jumlah: '1.824 Jiwa', icon: '👩' },
    ];

    // ─── 3. Baca profil existing ─────────────────────────────────────────────
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

    // Simpan/update data mutasi dan data umum
    meta.data_umum = dataUmum;

    // Simpan riwayat mutasi bulanan (array, append atau replace)
    if (!Array.isArray(meta.mutasi_bulanan)) {
      meta.mutasi_bulanan = [];
    }
    // Hapus data Juli 2026 lama jika ada, lalu tambahkan yang baru
    meta.mutasi_bulanan = meta.mutasi_bulanan.filter(
      (m: any) => !(m.bulan === 'Juli' && m.tahun === 2026)
    );
    meta.mutasi_bulanan.push(mutasiJuli2026);

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

    // ─── 4. Update tabel pertumbuhan_penduduk ────────────────────────────────
    // Cek apakah sudah ada data tahun 2026
    const { data: existingGrowth } = await supabase
      .from('pertumbuhan_penduduk')
      .select('*')
      .eq('tahun', 2026)
      .maybeSingle();

    if (existingGrowth) {
      await supabase
        .from('pertumbuhan_penduduk')
        .update({ jumlah: 3699 })
        .eq('id', existingGrowth.id);
    } else {
      await supabase
        .from('pertumbuhan_penduduk')
        .insert([{ tahun: 2026, jumlah: 3699 }]);
    }

    return NextResponse.json({
      success: true,
      message: 'Data mutasi penduduk Juli 2026 berhasil disimpan ke database.',
      summary: {
        periode: 'Juli 2026',
        luas_wilayah: '301 Ha',
        jumlah_kk: '1.129 KK',
        awal_bulan: { total: 3700, laki_laki: 1875, perempuan: 1825 },
        perubahan: {
          lahir: '+ 2 jiwa (L: 1, P: 1)',
          mati: '- 4 jiwa (L: 2, P: 2)',
          datang: '+ 4 jiwa (L: 1, P: 3)',
          pindah: '- 3 jiwa (L: 0, P: 3)',
        },
        akhir_bulan: { total: 3699, laki_laki: 1875, perempuan: 1824 },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
