import { getStatistikUsia, getMataPencaharian, getPertumbuhanPenduduk, getStatistikAgama, getStunting, getStatistikPendidikan, getStatistikPerkawinan, getMutasiBulanan } from '@/lib/supabaseClient';
import { GrafikUsia, GrafikPertumbuhan, GrafikStunting, GrafikMataPencaharian, GrafikAgama, GrafikPerkawinan, GrafikPendidikan, MutasiBulananSection } from './GrafikKependudukan';

export const dynamic = 'force-dynamic';

export default async function KependudukanPage() {
  const rawUsia = await getStatistikUsia();
  const rawMata = await getMataPencaharian();
  const rawPertumbuhan = await getPertumbuhanPenduduk();
  const rawAgama = await getStatistikAgama();
  const rawStunting = await getStunting();
  const rawPendidikan = await getStatistikPendidikan();
  const rawPerkawinan = await getStatistikPerkawinan();
  const rawMutasi = await getMutasiBulanan();

  const dataUsia = rawUsia && rawUsia.length > 0 ? rawUsia : [];
  const dataMata = rawMata && rawMata.length > 0 ? rawMata : [];
  const dataPertumbuhan = rawPertumbuhan && rawPertumbuhan.length > 0 ? rawPertumbuhan : [];
  const dataAgama = rawAgama && rawAgama.length > 0 ? rawAgama : [];
  const dataStunting = rawStunting && rawStunting.length > 0 ? rawStunting : [];
  const dataPendidikan = rawPendidikan && rawPendidikan.length > 0 ? rawPendidikan : [];
  const dataPerkawinan = rawPerkawinan && rawPerkawinan.length > 0 ? rawPerkawinan : [];
  const dataMutasi = rawMutasi && rawMutasi.length > 0 ? rawMutasi : [];

  const hasData =
    dataMutasi.length > 0 ||
    dataUsia.length > 0 ||
    dataMata.length > 0 ||
    dataPertumbuhan.length > 0 ||
    dataAgama.length > 0 ||
    dataStunting.length > 0 ||
    dataPendidikan.length > 0 ||
    dataPerkawinan.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#7a1f2b] via-[#a91d3a] to-[#7a1f2b] text-white py-16 px-6 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-md">Data Kependudukan</h1>
        <p className="text-red-100 text-lg font-medium">Kelurahan Bonto Lebang — Statistik Penduduk Terkini</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {!hasData ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm max-w-2xl mx-auto my-8">
            <span className="text-6xl mb-4 block">📊</span>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Belum Ada Data Kependudukan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              Data statistik kependudukan Kelurahan Bonto Lebang saat ini sedang disiapkan dan akan segera diperbarui.
            </p>
          </div>
        ) : (
          <div className="space-y-14">

            {/* Mutasi & Dinamika Penduduk Bulanan */}
            {dataMutasi.length > 0 && (
              <section>
                <MutasiBulananSection data={dataMutasi} />
              </section>
            )}

            {/* Kelompok Usia */}
            {dataUsia.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sebaran Kelompok Usia</h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                  <GrafikUsia data={dataUsia} />
                </div>
              </section>
            )}

            {/* Data Sosial Kemasyarakatan */}
            {(dataMata.length > 0 || dataAgama.length > 0 || dataPerkawinan.length > 0 || dataPendidikan.length > 0) && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Data Sosial Kemasyarakatan</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dataMata.length > 0 && (
                    <GrafikMataPencaharian
                      data={dataMata.map((d: any) => ({ name: d.pekerjaan, value: Number(d.jumlah) }))}
                    />
                  )}
                  {dataAgama.length > 0 && (
                    <GrafikAgama
                      data={dataAgama.map((d: any) => ({ name: d.agama, value: Number(d.jumlah) }))}
                    />
                  )}
                  {dataPerkawinan.length > 0 && (
                    <GrafikPerkawinan
                      data={dataPerkawinan.map((d: any) => ({ name: d.name, value: Number(d.value) }))}
                    />
                  )}
                  {dataPendidikan.length > 0 && (
                    <GrafikPendidikan
                      data={dataPendidikan.map((d: any) => ({ name: d.name, value: Number(d.value) }))}
                    />
                  )}
                </div>
              </section>
            )}

            {/* Pertumbuhan Penduduk */}
            {dataPertumbuhan.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pertumbuhan Penduduk</h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                  <GrafikPertumbuhan data={dataPertumbuhan} />
                </div>
              </section>
            )}

            {/* Stunting Balita */}
            {dataStunting.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Data Stunting Balita</h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                  <GrafikStunting data={dataStunting} />
                </div>
              </section>
            )}

            {/* Catatan */}
            <div className="text-center text-sm text-gray-400 dark:text-gray-500 italic pb-4">
              Data kependudukan per tahun {new Date().getFullYear()} — Kelurahan Bonto Lebang
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

