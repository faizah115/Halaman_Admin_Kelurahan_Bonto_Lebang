import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // 1. Delete all existing records in Supabase 'berita' table
    const { error: deleteError } = await supabase
      .from('berita')
      .delete()
      .neq('id', 0); // deletes all rows

    if (deleteError) {
      console.error('Delete error:', deleteError);
    }

    // 2. Insert single requested news article
    const singleBerita = {
      judul: 'Pemerintah Kelurahan Bonto Lebang turut hadir dalam Lokakarya Mini (Lokmin) Lintas Sektor Triwulan II Tingkat UPT Puskesmas Bissappu',
      kategori: 'Berita',
      tanggal: '2024-11-15',
      ringkasan: JSON.stringify({
        ringkasan: 'Pemerintah Kelurahan Bonto Lebang menghadiri kegiatan Lokakarya Mini (Lokmin) Lintas Sektor Triwulan II yang diselenggarakan oleh UPT Puskesmas Bissappu untuk memperkuat sinergi pelayanan kesehatan masyarakat.',
        penulis: 'Humas Kelurahan Bonto Lebang'
      }),
      isi: `Pemerintah Kelurahan Bonto Lebang turut hadir dalam Lokakarya Mini (Lokmin) Lintas Sektor Triwulan II Tingkat UPT Puskesmas Bissappu. Kegiatan ini diselenggarakan sebagai wadah evaluasi dan penguatan sinergi antar instansi dalam meningkatkan kualitas pelayanan kesehatan serta pencegahan masalah kesehatan masyarakat di wilayah Kecamatan Bissappu.

Acara yang berlangsung dengan khidmat ini dihadiri oleh jajaran Pemerintah Kelurahan Bonto Lebang, kepala UPT Puskesmas Bissappu, para kader kesehatan, perwakilan tokoh masyarakat, serta instansi terkait lainnya.

Dalam pertemuan ini, dibahas berbagai agenda strategis pelayanan kesehatan mencakup:
1. Evaluasi capaian program kesehatan ibu dan anak serta cakupan imunisasi.
2. Penanganan dan langkah preventif percepatan penurunan angka stunting di tingkat kelurahan.
3. Sinergitas program kerja lintas sektor untuk menjaga kebersihan lingkungan dan pencegahan penyakit menular.

Pemerintah Kelurahan Bonto Lebang mengapresiasi dan terus berkomitmen mendukung seluruh program UPT Puskesmas Bissappu demi mewujudkan masyarakat Bonto Lebang yang sehat, sejahtera, dan mandiri.`,
      gambar_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80'
    };

    const { data: inserted, error: insertError } = await supabase
      .from('berita')
      .insert([singleBerita])
      .select();

    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message });
    }

    return NextResponse.json({ success: true, message: 'Berita successfully updated to single article', inserted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Unknown error' });
  }
}
