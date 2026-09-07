import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Delete test item with nama_produk 'd' or incomplete items
  await supabase.from('umkm').delete().eq('nama_produk', 'd');

  const { data: existing } = await supabase.from('umkm').select('*');

  const defaultProducts = [
    {
      nama_produk: 'Kripik Rumput Laut "Lestari"',
      pemilik: 'Ibu Ratna',
      deskripsi: 'Keripik renyah berbahan dasar rumput laut pilihan dari pesisir Bonto Lebang. Sehat, gurih, dan bebas pengawet.',
      gambar_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&q=80',
      kontak: '085255650402',
      harga: 20000,
    },
    {
      nama_produk: 'Ikan Asin Kering Berkualitas',
      pemilik: 'Bapak Jufri',
      deskripsi: 'Ikan asin kualitas super dari tangkapan nelayan lokal Kampung Kaili, dijemur secara higienis di bawah sinar matahari pesisir.',
      gambar_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
      kontak: '082198765432',
      harga: 35000,
    },
    {
      nama_produk: 'Beras Padi Super Pulen',
      pemilik: 'Kelompok Tani Harapan',
      deskripsi: 'Beras putih pulen hasil panen langsung dari lahan persawahan subur seluas 198 Ha milik warga Kelurahan Bonto Lebang.',
      gambar_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
      kontak: '085311223344',
      harga: 14000,
    },
    {
      nama_produk: 'Kerajinan Kerang Hias Pesisir',
      pemilik: 'Daeng Rijal',
      deskripsi: 'Berbagai macam pernak-pernik dan hiasan rumah bernilai seni tinggi yang dibuat dari cangkang kerang laut pesisir.',
      gambar_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      kontak: '081355667788',
      harga: 50000,
    }
  ];

  let inserted = null;
  if (!existing || existing.length === 0) {
    const { data } = await supabase.from('umkm').insert(defaultProducts).select();
    inserted = data;
  }

  const { data: finalData } = await supabase.from('umkm').select('*').order('created_at', { ascending: false });

  return NextResponse.json({
    success: true,
    count: finalData?.length ?? 0,
    items: finalData,
    inserted,
  });
}
