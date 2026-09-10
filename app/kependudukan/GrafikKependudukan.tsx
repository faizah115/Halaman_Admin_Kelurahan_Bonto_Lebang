'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa', '#fb923c', '#84cc16'];

// ─── Shared Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3 shadow-lg text-sm">
        {label && <p className="font-bold text-gray-700 dark:text-white mb-1">{label}</p>}
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color ?? p.fill }}>
            {p.name}: <span className="font-semibold">{Number(p.value).toLocaleString('id-ID')}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Custom Donut Tooltip (Mata Pencaharian & Agama) ──────────────────────────
const CustomDonutTooltip = ({ active, payload, total }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const val = Number(item.value);
    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-bold text-[#1A1A1A] dark:text-white mb-1">{item.name}</p>
        <p style={{ color: item.payload?.fill || item.color }} className="font-semibold text-xs md:text-sm">
          Jumlah: {val.toLocaleString('id-ID')} jiwa ({pct}%)
        </p>
      </div>
    );
  }
  return null;
};

// ─── 1. Grafik Batang per RW ──────────────────────────────────────────────────
export function GrafikRW({ data }: { data: any[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="rw" tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 600 }} />
          <YAxis tick={{ fontSize: 12, fill: '#4b5563' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="laki_laki" name="Laki-laki" fill="#7a1f2b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="perempuan" name="Perempuan" fill="#e8748a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="jumlah_kk" name="Jumlah KK" fill="#c9a227" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── 2. Bar Chart Kelompok Usia (Custom Red/Pink Age Gradient) ────────────────
const USIA_PALETTE = ['#f2a6b3', '#e8748a', '#c9425a', '#7a1f2b', '#4a2530'];

function getUsiaColor(name: string, index: number): string {
  const key = name.toLowerCase().replace(/–/g, '-').trim();
  if (key.includes('0-14')) return '#f2a6b3';
  if (key.includes('15-24')) return '#e8748a';
  if (key.includes('25-44')) return '#c9425a';
  if (key.includes('45-64')) return '#7a1f2b';
  if (key.includes('65')) return '#4a2530';
  return USIA_PALETTE[index % USIA_PALETTE.length];
}

export function GrafikUsia({ data }: { data: any[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="kelompok_umur" tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 600 }} />
          <YAxis tick={{ fontSize: 12, fill: '#4b5563' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="jumlah" name="Jumlah Jiwa" radius={[6, 6, 0, 0]}>
            {data.map((entry: any, i: number) => {
              const label = entry.kelompok_umur ?? entry.name ?? '';
              return <Cell key={i} fill={getUsiaColor(label, i)} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── 3. Pie Chart Generik ─────────────────────────────────────────────────────
export function GrafikPie({ data, title }: { data: { name: string; value: number }[]; title: string }) {
  const total = data.reduce((s, x) => s + x.value, 0);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">{title}</h3>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={40}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: any) => [Number(value).toLocaleString('id-ID'), '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:w-1/2">
          {data.map((d, i) => {
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0';
            return (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1 w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-gray-700 dark:text-gray-300">
                  {d.name}: <strong>{d.value.toLocaleString('id-ID')}</strong>
                  <span className="text-gray-400 text-xs ml-1">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 4. Line Chart: Pertumbuhan Penduduk ─────────────────────────────────────
export function GrafikPertumbuhan({ data }: { data: any[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">Pertumbuhan Penduduk per Tahun</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="jumlah" name="Jumlah Penduduk"
              stroke="#7a1f2b" strokeWidth={3} dot={{ r: 5, fill: '#7a1f2b' }} activeDot={{ r: 7, fill: '#7a1f2b' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── 5. Bar Chart: Stunting ───────────────────────────────────────────────────
export function GrafikStunting({ data }: { data: any[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">Data Stunting Balita per Tahun</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="stunting" name="Stunting" fill="#7a1f2b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="normal" name="Gizi Normal" fill="#16a870" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── 6. Custom Horizontal Bar Chart (Tingkat Pendidikan) ────────────────────
const EDU_RANK: Record<string, number> = {
  'tidak/belum sekolah': 1,
  'belum sekolah': 1,
  'tidak sekolah': 1,
  'sd': 2,
  'smp': 3,
  'sma/smk': 4,
  'sma': 4,
  'smk': 4,
  'diploma': 5,
  'd3': 5,
  's1': 6,
  's2': 7,
  's3': 8
};

export function GrafikPendidikan({ data, title = "Tingkat Pendidikan" }: { data: { name: string; value: number }[]; title?: string }) {
  const sortedData = [...data].sort((a, b) => {
    const rankA = EDU_RANK[a.name.toLowerCase().trim()] ?? 99;
    const rankB = EDU_RANK[b.name.toLowerCase().trim()] ?? 99;
    return rankA - rankB;
  });

  const maxValue = Math.max(...sortedData.map(d => Number(d.value)), 1);
  const total = sortedData.reduce((sum, d) => sum + Number(d.value), 0);

  return (
    <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-white mb-6 text-center">
        {title}
      </h3>

      <div className="flex flex-col gap-4">
        {sortedData.map((item, i) => {
          const val = Number(item.value);
          const pct = maxValue > 0 ? (val / maxValue) * 100 : 0;
          const pctTotal = total > 0 ? ((val / total) * 100).toFixed(1) : '0';

          return (
            <div key={i} className="flex items-center gap-3">
              <span className="w-[140px] md:w-[170px] text-right text-xs md:text-sm font-medium text-[#1A1A1A] dark:text-gray-300 flex-shrink-0 truncate">
                {item.name}
              </span>

              <div className="flex-1 relative h-7 md:h-8 rounded-md overflow-hidden bg-[#f0f0f0] dark:bg-gray-700">
                <div
                  className="absolute inset-y-0 left-0 rounded-md transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(pct, 1.5)}%`,
                    backgroundColor: '#7a1f2b',
                  }}
                />
              </div>

              <span className="w-[85px] md:w-[100px] text-left text-xs md:text-sm font-bold text-[#1A1A1A] dark:text-white flex-shrink-0">
                {val.toLocaleString('id-ID')}
                <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">({pctTotal}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const GrafikBarHorizontal = GrafikPendidikan;

// ─── 7. Donut Chart Mata Pencaharian ──────────────────────────────────────────
const MATA_PENCAHARIAN_COLOR_MAP: Record<string, string> = {
  'nelayan': '#7a1f2b',       // merah maroon tua
  'petani': '#b5354a',        // merah sedang
  'pedagang': '#d9647a',      // merah muda
  'pns/tni/polri': '#e8a5b3', // pink pucat
  'pns': '#e8a5b3',
  'buruh': '#c9a227',         // kuning emas aksen
  'lainnya': '#8a8a8a',       // abu netral
};

const MATA_PENCAHARIAN_PALETTE = ['#7a1f2b', '#b5354a', '#d9647a', '#e8a5b3', '#c9a227', '#8a8a8a'];

function getMataColor(name: string, index: number): string {
  const key = name.toLowerCase().trim();
  if (MATA_PENCAHARIAN_COLOR_MAP[key]) {
    return MATA_PENCAHARIAN_COLOR_MAP[key];
  }
  return MATA_PENCAHARIAN_PALETTE[index % MATA_PENCAHARIAN_PALETTE.length];
}

export function GrafikMataPencaharian({ data, title = "Mata Pencaharian" }: { data: { name: string; value: number }[]; title?: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-white mb-6 text-center">
        {title}
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={58}
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={getMataColor(entry.name, i)} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomDonutTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-1/2">
          {data.map((d, i) => {
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0';
            const color = getMataColor(d.name, i);
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[#1A1A1A] dark:text-gray-200 text-xs md:text-sm">
                  {d.name}: <strong className="font-bold text-gray-900 dark:text-white ml-0.5">{d.value.toLocaleString('id-ID')}</strong>
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-1 font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 8. Donut Chart Agama ──────────────────────────────────────────────────────
const AGAMA_COLOR_MAP: Record<string, string> = {
  'islam': '#7a1f2b',    // merah maroon tema (mayoritas)
  'kristen': '#8a8a8a',  // abu sedang
  'katolik': '#8a8a8a',
  'hindu': '#c9a227',
  'buddha': '#c9a227',
  'khonghucu': '#c9a227',
  'lainnya': '#c9a227',  // kuning emas aksen
};

const AGAMA_PALETTE = ['#7a1f2b', '#8a8a8a', '#c9a227', '#6366f1', '#10b981'];

function getAgamaColor(name: string, index: number): string {
  const key = name.toLowerCase().trim();
  if (AGAMA_COLOR_MAP[key]) {
    return AGAMA_COLOR_MAP[key];
  }
  return AGAMA_PALETTE[index % AGAMA_PALETTE.length];
}

export function GrafikAgama({ data, title = "Agama" }: { data: { name: string; value: number }[]; title?: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-white mb-6 text-center">
        {title}
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={58}
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={getAgamaColor(entry.name, i)} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomDonutTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3.5 w-full md:w-1/2">
          {data.map((d, i) => {
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0';
            const color = getAgamaColor(d.name, i);
            return (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[#1A1A1A] dark:text-gray-200 text-xs md:text-sm">
                  {d.name}: <strong className="font-bold text-gray-900 dark:text-white ml-0.5">{d.value.toLocaleString('id-ID')}</strong>
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-1 font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 9. Donut Chart Status Perkawinan ──────────────────────────────────────────
const PERKAWINAN_COLOR_MAP: Record<string, string> = {
  'kawin': '#7a1f2b',        // merah maroon tua
  'belum kawin': '#b5354a',  // merah sedang
  'cerai hidup': '#d9647a',  // merah muda
  'cerai mati': '#8a8a8a',   // abu netral
};

const PERKAWINAN_PALETTE = ['#7a1f2b', '#b5354a', '#d9647a', '#8a8a8a'];

function getPerkawinanColor(name: string, index: number): string {
  const key = name.toLowerCase().trim();
  if (PERKAWINAN_COLOR_MAP[key]) {
    return PERKAWINAN_COLOR_MAP[key];
  }
  return PERKAWINAN_PALETTE[index % PERKAWINAN_PALETTE.length];
}

export function GrafikPerkawinan({ data, title = "Status Perkawinan" }: { data: { name: string; value: number }[]; title?: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="col-span-1 lg:col-span-2 max-w-2xl mx-auto w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-white mb-6 text-center">
        {title}
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={58}
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={getPerkawinanColor(entry.name, i)} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomDonutTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3.5 w-full md:w-1/2">
          {data.map((d, i) => {
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0';
            const color = getPerkawinanColor(d.name, i);
            return (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[#1A1A1A] dark:text-gray-200 text-xs md:text-sm">
                  {d.name}: <strong className="font-bold text-gray-900 dark:text-white ml-0.5">{d.value.toLocaleString('id-ID')}</strong>
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-1 font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 10. Mutasi & Dinamika Penduduk Bulanan ───────────────────────────────────
export function MutasiBulananSection({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const [selectedIdx, setSelectedIdx] = useState<number>(data.length - 1);
  const current = data[selectedIdx] || data[0];

  const netChange = (current.kelahiran?.total || 0) + (current.pendatang?.total || 0) - (current.kematian?.total || 0) - (current.pindah?.total || 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📋</span>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-['Poppins']">
              Dinamika & Mutasi Penduduk Bulanan
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Rekapitulasi resmi perubahan jumlah penduduk Kelurahan Bonto Lebang
          </p>
        </div>

        {/* Dropdown Periode */}
        {data.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Periode:</label>
            <select
              value={selectedIdx}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A91D3A]"
            >
              {data.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.periode || `${item.bulan} ${item.tahun}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Ringkasan Data Wilayah & KK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Luas Wilayah */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/70 dark:border-amber-800/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Luas Wilayah</span>
            <span className="text-xl">🗺️</span>
          </div>
          <p className="text-2xl font-extrabold text-amber-950 dark:text-amber-100">
            {current.luas_wilayah || '301 Km²'}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Wilayah Kelurahan Bonto Lebang</p>
        </div>

        {/* Jumlah KK */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 border border-indigo-200/70 dark:border-indigo-800/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">Jumlah Kartu Keluarga</span>
            <span className="text-xl">🏠</span>
          </div>
          <p className="text-2xl font-extrabold text-indigo-950 dark:text-indigo-100">
            {Number(current.jumlah_kk || 1127).toLocaleString('id-ID')} KK
          </p>
          <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">Kepala Keluarga Tercatat</p>
        </div>

        {/* Awal Bulan */}
        <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/40 dark:to-cyan-950/30 border border-sky-200/70 dark:border-sky-800/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">Awal Bulan</span>
            <span className="text-xl">👥</span>
          </div>
          <p className="text-2xl font-extrabold text-sky-950 dark:text-sky-100">
            {Number(current.awal_bulan?.total || 0).toLocaleString('id-ID')} Jiwa
          </p>
          <p className="text-xs text-sky-700 dark:text-sky-400 mt-1">
            👨 {current.awal_bulan?.laki_laki} Laki-laki | 👩 {current.awal_bulan?.perempuan} Perempuan
          </p>
        </div>

        {/* Akhir Bulan */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200/70 dark:border-emerald-800/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Akhir Bulan</span>
            <span className="text-xs font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full">
              {netChange >= 0 ? `+${netChange}` : `${netChange}`} Jiwa
            </span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-100">
            {Number(current.akhir_bulan?.total || 0).toLocaleString('id-ID')} Jiwa
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            👨 {current.akhir_bulan?.laki_laki} Laki-laki | 👩 {current.akhir_bulan?.perempuan} Perempuan
          </p>
        </div>
      </div>

      {/* Tabel Parameter / Indikator Kependudukan */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden space-y-3">
        <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center justify-between">
          <span>📋 Data Parameter / Indikator Kependudukan ({current.bulan} {current.tahun})</span>
        </h4>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-xs md:text-sm text-left">
            <thead>
              <tr className="bg-[#7a1f2b] text-white">
                <th className="px-4 py-3 font-bold border-b border-rose-900 w-1/2">Parameter / Indikator</th>
                <th className="px-4 py-3 font-bold border-b border-rose-900 w-1/2">Nilai / Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">Luas Wilayah</td>
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{current.luas_wilayah || '301 Km²'}</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">Jumlah Kartu Keluarga (KK)</td>
                <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{(current.jumlah_kk ?? 1127).toLocaleString('id-ID')} KK</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">Penduduk Awal Bulan ({current.bulan} {current.tahun})</td>
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                  <strong className="text-sky-600 dark:text-sky-400 font-bold">{(current.awal_bulan?.total ?? 0).toLocaleString('id-ID')} jiwa</strong>{' '}
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">({(current.awal_bulan?.laki_laki ?? 0).toLocaleString('id-ID')} Laki-laki, {(current.awal_bulan?.perempuan ?? 0).toLocaleString('id-ID')} Perempuan)</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-400">Kelahiran (+)</td>
                <td className="px-4 py-3 text-emerald-700 dark:text-emerald-400">
                  <strong>+{current.kelahiran?.total ?? 0} jiwa</strong>{' '}
                  <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">({current.kelahiran?.laki_laki ?? 0} Laki-laki, {current.kelahiran?.perempuan ?? 0} Perempuan)</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-semibold text-rose-700 dark:text-rose-400">Kematian (-)</td>
                <td className="px-4 py-3 text-rose-700 dark:text-rose-400">
                  <strong>-{current.kematian?.total ?? 0} jiwa</strong>{' '}
                  <span className="text-xs text-rose-600/80 dark:text-rose-400/80 font-medium">({current.kematian?.laki_laki ?? 0} Laki-laki, {current.kematian?.perempuan ?? 0} Perempuan)</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-semibold text-blue-700 dark:text-blue-400">Pendatang (+)</td>
                <td className="px-4 py-3 text-blue-700 dark:text-blue-400">
                  <strong>+{current.pendatang?.total ?? 0} jiwa</strong>{' '}
                  <span className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">({current.pendatang?.laki_laki ?? 0} Laki-laki, {current.pendatang?.perempuan ?? 0} Perempuan)</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-semibold text-amber-700 dark:text-amber-400">Pindah (-)</td>
                <td className="px-4 py-3 text-amber-700 dark:text-amber-400">
                  <strong>-{current.pindah?.total ?? 0} jiwa</strong>{' '}
                  <span className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium">({current.pindah?.laki_laki ?? 0} Laki-laki, {current.pindah?.perempuan ?? 0} Perempuan)</span>
                </td>
              </tr>
              <tr className="bg-emerald-50 dark:bg-emerald-950/40 font-bold">
                <td className="px-4 py-3.5 text-emerald-950 dark:text-emerald-200">Penduduk Akhir Bulan ({current.bulan} {current.tahun})</td>
                <td className="px-4 py-3.5 text-emerald-900 dark:text-emerald-100">
                  <span className="text-base font-extrabold text-[#7a1f2b] dark:text-rose-400">{(current.akhir_bulan?.total ?? 0).toLocaleString('id-ID')} jiwa</span>{' '}
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">({(current.akhir_bulan?.laki_laki ?? 0).toLocaleString('id-ID')} Laki-laki, {(current.akhir_bulan?.perempuan ?? 0).toLocaleString('id-ID')} Perempuan)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Riwayat Seluruh Periode */}
      {data.length > 0 && (
        <div className="pt-2">
          <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
            <span>🗓️</span> Riwayat Seluruh Periode Mutasi Penduduk
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 font-semibold">
                <tr>
                  <th className="px-3.5 py-2.5">Periode</th>
                  <th className="px-3.5 py-2.5">Luas</th>
                  <th className="px-3.5 py-2.5">KK</th>
                  <th className="px-3.5 py-2.5 text-right">Awal Bulan</th>
                  <th className="px-3.5 py-2.5 text-right">Lahir</th>
                  <th className="px-3.5 py-2.5 text-right">Mati</th>
                  <th className="px-3.5 py-2.5 text-right">Datang</th>
                  <th className="px-3.5 py-2.5 text-right">Pindah</th>
                  <th className="px-3.5 py-2.5 text-right">Akhir Bulan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.map((m, idx) => (
                  <tr
                    key={idx}
                    className={`cursor-pointer transition hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 ${
                      selectedIdx === idx
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/50 font-medium'
                        : ''
                    }`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <td className="px-3.5 py-2.5 font-bold text-gray-800 dark:text-white whitespace-nowrap">
                      {m.periode || `${m.bulan} ${m.tahun}`}
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {m.luas_wilayah || '301 Km²'}
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-600 dark:text-gray-300">
                      {(m.jumlah_kk ?? 1127).toLocaleString('id-ID')}
                    </td>
                    <td className="px-3.5 py-2.5 text-right text-sky-600 dark:text-sky-400 font-semibold">
                      {(m.awal_bulan?.total ?? 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-3.5 py-2.5 text-right text-emerald-600 font-semibold">
                      +{m.kelahiran?.total ?? 0}
                    </td>
                    <td className="px-3.5 py-2.5 text-right text-rose-600 font-semibold">
                      -{m.kematian?.total ?? 0}
                    </td>
                    <td className="px-3.5 py-2.5 text-right text-blue-600 font-semibold">
                      +{m.pendatang?.total ?? 0}
                    </td>
                    <td className="px-3.5 py-2.5 text-right text-amber-600 font-semibold">
                      -{m.pindah?.total ?? 0}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-bold text-gray-900 dark:text-white">
                      {(m.akhir_bulan?.total ?? 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center italic">
            Klik baris untuk melihat detail periode tersebut
          </p>
        </div>
      )}
    </div>
  );
}

