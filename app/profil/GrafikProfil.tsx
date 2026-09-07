'use client';

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa', '#fb923c', '#84cc16'];

type PieEntry = { name: string; value: number };
type LineEntry = { tahun: number; jumlah: number };
type StuntEntry = { tahun: number; stunting: number; normal: number };

// ─── Tooltip Custom ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3 shadow-lg text-sm">
        {label && <p className="font-bold text-gray-700 dark:text-white mb-1">{label}</p>}
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color ?? p.fill }}>
            {p.name}: <span className="font-semibold">{Number(p.value).toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Pie Chart: Mata Pencaharian & Agama ─────────────────────────────────────
export function GrafikPie({ data, title }: { data: PieEntry[]; title: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">{title}</h3>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={45}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: any) => [Number(value).toLocaleString(), '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:w-1/2">
          {data.map((d, i) => {
            const total = data.reduce((s, x) => s + x.value, 0);
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0';
            return (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1 w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-gray-700 dark:text-gray-300">
                  {d.name}: <strong>{d.value.toLocaleString()}</strong>
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

// ─── Line Chart: Pertumbuhan Penduduk ────────────────────────────────────────
export function GrafikPertumbuhan({ data }: { data: LineEntry[] }) {
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
            <Line
              type="monotone" dataKey="jumlah" name="Jumlah Penduduk"
              stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Bar Chart: Stunting ──────────────────────────────────────────────────────
export function GrafikStunting({ data }: { data: StuntEntry[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">Kasus Stunting per Tahun</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="stunting" name="Stunting" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="normal" name="Gizi Normal" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
