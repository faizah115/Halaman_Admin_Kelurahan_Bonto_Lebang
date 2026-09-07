import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekonjbqdplpcvkhwtulq.supabase.co';
const supabaseAnonKey = 'sb_publishable_2WYWrmmUSTJEORjg1896ew_uXvAyFdJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Inspecting current potensi_unggulan table...');
  const { data: existing, error: errFetch } = await supabase.from('potensi_unggulan').select('*');
  console.log('Existing data count:', existing?.length, 'Error:', errFetch);
  if (existing) console.log('Existing rows:', JSON.stringify(existing, null, 2));

  // Delete all existing rows
  console.log('Deleting existing rows...');
  const { error: errDel } = await supabase.from('potensi_unggulan').delete().neq('id', 0);
  if (errDel) console.error('Delete error:', errDel);

  const newPotensi = [
    {
      judul: "Potensi Pesisir & Perikanan",
      kategori: "Wisata Bahari",
      deskripsi: "Memiliki wilayah pesisir di Kampung Kaili (RW 004), yang digunakan sebagai tempat aktivitas nelayan lokal, Tempat Pelelangan Ikan (TPI), dan budidaya rumput laut",
      ikon: "🌊",
      urutan: 1,
      foto_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80"
    },
    {
      judul: "Potensi Pertanian",
      kategori: "Pertanian",
      deskripsi: "Memiliki lahan persawahan yang digunakan untuk penanaman padi, dengan rata-rata luas lahan sawah warga sekitar 70 are",
      ikon: "🌾",
      urutan: 2,
      foto_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80"
    },
    {
      judul: "Kondisi Geografis Mendukung",
      kategori: "Agrowisata / Perikanan",
      deskripsi: "Berada di dataran yang relatif datar dan sebagian wilayah pesisir, dengan ketinggian sekitar 5 mdpl memudahkan aktivitas pertanian dan perikanan sekaligus.",
      ikon: "📍",
      urutan: 3,
      foto_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
    }
  ];

  console.log('Inserting new data...');
  const { data: inserted, error: errIns } = await supabase.from('potensi_unggulan').insert(newPotensi).select();
  if (errIns) console.error('Insert error:', errIns);
  else console.log('Successfully inserted new potensi_unggulan:', inserted);
}

run();
