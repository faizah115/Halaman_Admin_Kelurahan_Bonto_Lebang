import { getStatistikUsia, getMataPencaharian, getPertumbuhanPenduduk, getStatistikAgama, getStunting, getStatistikPendidikan, getStatistikPerkawinan, getDataUmum, getStrukturRWRT, getPetugasKontakData, getMutasiBulanan } from '@/lib/supabaseClient';
import { GrafikUsia, GrafikPie, GrafikPertumbuhan, GrafikStunting, GrafikBarHorizontal, GrafikMataPencaharian, GrafikAgama, GrafikPerkawinan, GrafikPendidikan } from './GrafikKependudukan';

export const dynamic = 'force-dynamic';

const usiaPlaceholder: any[] = [];

export default async function KependudukanPage() {
  const { petugas: dataPetugas, tpk: dataTPK, mbg: dataMBG } = await getPetugasKontakData();
  const dataStrukturRW = await getStrukturRWRT();
  const dataUmum = await getDataUmum();
  const rawUsia = await getStatistikUsia();
  const rawMata = await getMataPencaharian();
  const rawPertumbuhan = await getPertumbuhanPenduduk();
  const rawAgama = await getStatistikAgama();
  const rawStunting = await getStunting();
  const rawPendidikan = await getStatistikPendidikan();
  const rawPerkawinan = await getStatistikPerkawinan();
  const rawMutasi = await getMutasiBulanan();

  const dataUsia = (rawUsia && rawUsia.length > 0) ? rawUsia : usiaPlaceholder;

  const mataPencaharianPlaceholder: any[] = [];
  const agamaPlaceholder: any[] = [];
  const pendidikanPlaceholder: any[] = [];
  const perkawinanPlaceholder: any[] = [];
  const pertumbuhanPlaceholder: any[] = [];
  const stuntingPlaceholder: any[] = [];

  const dataMata = (rawMata && rawMata.length > 0) ? rawMata : mataPencaharianPlaceholder;
  const dataPertumbuhan = (rawPertumbuhan && rawPertumbuhan.length > 0) ? rawPertumbuhan : pertumbuhanPlaceholder;
  const dataAgama = (rawAgama && rawAgama.length > 0) ? rawAgama : agamaPlaceholder;
  const dataStunting = (rawStunting && rawStunting.length > 0) ? rawStunting : stuntingPlaceholder;
  const dataPendidikan = (rawPendidikan && rawPendidikan.length > 0) ? rawPendidikan : pendidikanPlaceholder;
  const dataPerkawinan = (rawPerkawinan && rawPerkawinan.length > 0) ? rawPerkawinan : perkawinanPlaceholder;

  // Check if any kependudukan data exists
  const hasData = (dataPetugas && dataPetugas.length > 0) || (dataStrukturRW && dataStrukturRW.length > 0) || (dataUmum && dataUmum.length > 0) || dataUsia.length > 0 || dataMata.length > 0 || dataPertumbuhan.length > 0 || dataAgama.length > 0 || dataStunting.length > 0 || dataPendidikan.length > 0 || dataPerkawinan.length > 0 || (rawMutasi && rawMutasi.length > 0);

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
            {/* Struktur Petugas & Kontak Penting */}
            {dataPetugas && dataPetugas.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-extrabold text-[#7a1f2b] dark:text-red-400 font-['Poppins'] flex items-center gap-2">
                    <span>☎️</span> Struktur Petugas & Kontak Penting
                  </h2>
                  <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Kontak Aktif
                  </span>
                </div>

                {/* Main Contacts Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#7a1f2b] text-white">
                          <th className="px-6 py-4 text-left font-bold w-1/4">Jabatan</th>
                          <th className="px-6 py-4 text-left font-bold w-1/3">Nama</th>
                          <th className="px-6 py-4 text-left font-bold">Kontak / WhatsApp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {dataPetugas.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-red-50/30 dark:hover:bg-gray-700/50 transition">
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <span>{item.icon || '👤'}</span> {item.jabatan}
                            </td>
                            <td className="px-6 py-4 font-semibold text-[#7a1f2b] dark:text-red-400">
                              {item.nama}
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={`https://wa.me/62${item.kontak.replace(/[^0-9]/g, '').replace(/^0/, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900 transition text-xs"
                              >
                                <span>💬</span> {item.kontak}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sub-Teams Grid: TPK & MBG */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tim Pendamping Keluarga (TPK) */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl p-2 bg-pink-50 dark:bg-pink-950/50 rounded-xl text-pink-600">👨‍👩‍👧‍👦</span>
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">Tim Pendamping Keluarga (TPK)</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pendampingan & Kesejahteraan Keluarga</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {dataTPK.map((nama: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                          <span className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-950 text-[#7a1f2b] dark:text-red-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{nama}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Petugas MBG (Makan Bergizi Gratis) */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600">🍱</span>
                      <div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">Petugas MBG (Makan Bergizi Gratis)</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pelaksana Program Gizi Masyarakat</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {dataMBG.map((nama: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                          <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{nama}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Struktur Wilayah RW & RT */}
            {dataStrukturRW && dataStrukturRW.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-extrabold text-[#7a1f2b] dark:text-red-400 font-['Poppins'] flex items-center gap-2">
                    <span>🏠</span> Struktur Wilayah RW & RT
                  </h2>
                  <span className="text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-[#7a1f2b] dark:text-red-300 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                    Kelurahan Bonto Lebang
                  </span>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#7a1f2b] text-white">
                          <th className="px-6 py-4 text-left font-bold w-1/6">RW</th>
                          <th className="px-6 py-4 text-left font-bold w-1/4">Ketua RW</th>
                          <th className="px-6 py-4 text-left font-bold">RT & Ketua RT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {dataStrukturRW.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-red-50/30 dark:hover:bg-gray-700/50 transition">
                            <td className="px-6 py-4 font-black text-[#7a1f2b] dark:text-red-400 text-base">
                              {item.rw}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200">
                              {item.ketua_rw && item.ketua_rw !== '-' ? (
                                <span className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  {item.ketua_rw}
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {item.rt_list && item.rt_list.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {item.rt_list.map((rt: any, rtIdx: number) => (
                                    <div
                                      key={rtIdx}
                                      className="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200"
                                    >
                                      <span className="font-bold text-[#7a1f2b] dark:text-red-400">{rt.rt}:</span>
                                      <span>{rt.ketua_rt}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic text-xs">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* 1. Data Umum Wilayah */}
            {dataUmum && dataUmum.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-2xl font-extrabold text-[#7a1f2b] dark:text-red-400 font-['Poppins']">
                    1. Data Umum Wilayah
                  </h2>
                </div>

                {/* Grid Cards Data Umum */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {dataUmum.map((item: any) => (
                    <div
                      key={item.keterangan}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{item.icon || '📍'}</span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 text-[#7a1f2b] dark:text-red-400 border border-red-100 dark:border-red-900">
                          Data Terkini
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                          {item.keterangan}
                        </p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          {item.jumlah}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Grafik Kelompok Usia */}
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

            {/* Komposisi Sosial, Pendidikan, dan Perkawinan */}
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

            {/* Mutasi Penduduk Bulanan */}
            {rawMutasi && rawMutasi.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-extrabold text-[#7a1f2b] dark:text-red-400 font-['Poppins'] flex items-center gap-2">
                    <span>📋</span> Mutasi Penduduk Bulanan
                  </h2>
                  <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                    Rekapitulasi Bulanan
                  </span>
                </div>

                {rawMutasi.map((m: any) => (
                  <div key={`${m.bulan}-${m.tahun}`} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                    {/* Header Periode */}
                    <div className="bg-gradient-to-r from-[#7a1f2b] to-[#a91d3a] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold">Bulan {m.periode}</h3>
                        <p className="text-red-200 text-xs mt-0.5">
                          Luas Wilayah: {m.luas_wilayah} &nbsp;|&nbsp; Jumlah KK: {m.jumlah_kk?.toLocaleString('id-ID')} KK
                        </p>
                      </div>
                      <div className="flex gap-4 text-center">
                        <div>
                          <p className="text-2xl font-black">{m.akhir_bulan.total.toLocaleString('id-ID')}</p>
                          <p className="text-red-200 text-xs">Total Akhir</p>
                        </div>
                        <div className="border-l border-red-300/50 pl-4">
                          <p className="text-lg font-bold">{m.akhir_bulan.laki_laki.toLocaleString('id-ID')}</p>
                          <p className="text-red-200 text-xs">Laki-laki</p>
                        </div>
                        <div className="border-l border-red-300/50 pl-4">
                          <p className="text-lg font-bold">{m.akhir_bulan.perempuan.toLocaleString('id-ID')}</p>
                          <p className="text-red-200 text-xs">Perempuan</p>
                        </div>
                      </div>
                    </div>

                    {/* Tabel Mutasi */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                            <th className="px-5 py-3 text-left font-bold text-gray-700 dark:text-gray-300">Keterangan</th>
                            <th className="px-5 py-3 text-right font-bold text-[#7a1f2b] dark:text-red-400">Laki-laki</th>
                            <th className="px-5 py-3 text-right font-bold text-[#e8748a] dark:text-pink-400">Perempuan</th>
                            <th className="px-5 py-3 text-right font-bold text-gray-800 dark:text-white">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          <tr className="bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition">
                            <td className="px-5 py-3 font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Awal Bulan
                            </td>
                            <td className="px-5 py-3 text-right font-medium text-[#7a1f2b] dark:text-red-400">{m.awal_bulan.laki_laki.toLocaleString('id-ID')}</td>
                            <td className="px-5 py-3 text-right font-medium text-[#e8748a] dark:text-pink-400">{m.awal_bulan.perempuan.toLocaleString('id-ID')}</td>
                            <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">{m.awal_bulan.total.toLocaleString('id-ID')}</td>
                          </tr>
                          <tr className="hover:bg-green-50/30 dark:hover:bg-gray-700/50 transition">
                            <td className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Lahir
                            </td>
                            <td className="px-5 py-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">+{m.kelahiran.laki_laki}</td>
                            <td className="px-5 py-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">+{m.kelahiran.perempuan}</td>
                            <td className="px-5 py-3 text-right text-emerald-700 dark:text-emerald-400 font-bold">+{m.kelahiran.total}</td>
                          </tr>
                          <tr className="hover:bg-red-50/30 dark:hover:bg-gray-700/50 transition">
                            <td className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Mati
                            </td>
                            <td className="px-5 py-3 text-right text-rose-600 dark:text-rose-400 font-medium">-{m.kematian.laki_laki}</td>
                            <td className="px-5 py-3 text-right text-rose-600 dark:text-rose-400 font-medium">-{m.kematian.perempuan}</td>
                            <td className="px-5 py-3 text-right text-rose-600 dark:text-rose-400 font-bold">-{m.kematian.total}</td>
                          </tr>
                          <tr className="hover:bg-indigo-50/30 dark:hover:bg-gray-700/50 transition">
                            <td className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span> Pendatang
                            </td>
                            <td className="px-5 py-3 text-right text-indigo-600 dark:text-indigo-400 font-medium">+{m.pendatang.laki_laki}</td>
                            <td className="px-5 py-3 text-right text-indigo-600 dark:text-indigo-400 font-medium">+{m.pendatang.perempuan}</td>
                            <td className="px-5 py-3 text-right text-indigo-600 dark:text-indigo-400 font-bold">+{m.pendatang.total}</td>
                          </tr>
                          <tr className="hover:bg-amber-50/30 dark:hover:bg-gray-700/50 transition">
                            <td className="px-5 py-3 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Pindah
                            </td>
                            <td className="px-5 py-3 text-right text-amber-600 dark:text-amber-400 font-medium">-{m.pindah.laki_laki}</td>
                            <td className="px-5 py-3 text-right text-amber-600 dark:text-amber-400 font-medium">-{m.pindah.perempuan}</td>
                            <td className="px-5 py-3 text-right text-amber-600 dark:text-amber-400 font-bold">-{m.pindah.total}</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="bg-[#7a1f2b]/5 dark:bg-red-950/20 border-t-2 border-[#7a1f2b]/20 font-bold">
                            <td className="px-5 py-4 text-[#7a1f2b] dark:text-red-400 font-extrabold flex items-center gap-2">
                              <span>✅</span> Akhir Bulan
                            </td>
                            <td className="px-5 py-4 text-right text-[#7a1f2b] dark:text-red-400 text-base">{m.akhir_bulan.laki_laki.toLocaleString('id-ID')}</td>
                            <td className="px-5 py-4 text-right text-[#e8748a] dark:text-pink-400 text-base">{m.akhir_bulan.perempuan.toLocaleString('id-ID')}</td>
                            <td className="px-5 py-4 text-right text-gray-900 dark:text-white text-lg">{m.akhir_bulan.total.toLocaleString('id-ID')}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Selisih ringkas */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Selisih bulan ini:&nbsp;
                        <span className={`font-bold ${
                          m.akhir_bulan.total - m.awal_bulan.total >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {m.akhir_bulan.total - m.awal_bulan.total >= 0 ? '+' : ''}
                          {(m.akhir_bulan.total - m.awal_bulan.total).toLocaleString('id-ID')} jiwa
                        </span>
                        &ensp;|&ensp; Sumber: Laporan Bulanan Kelurahan Bonto Lebang
                      </p>
                    </div>
                  </div>
                ))}
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

            {/* Stunting */}
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

            {/* Catatan Sumber Data */}
            <div className="text-center text-sm text-gray-400 dark:text-gray-500 italic pb-4">
              Data kependudukan per tahun {new Date().getFullYear()} — Kelurahan Bonto Lebang
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
