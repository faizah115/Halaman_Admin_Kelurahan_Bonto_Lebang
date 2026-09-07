'use client';

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
