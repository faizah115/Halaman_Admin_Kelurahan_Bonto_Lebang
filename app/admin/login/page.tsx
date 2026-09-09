'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Check default admin credentials
      if (
        (cleanEmail === 'admin@bontolebang.id' || cleanEmail === 'admin') &&
        (password === 'adminbontolebang' || password === 'admin123' || password === 'bontolebang2026')
      ) {
        localStorage.setItem('admin_session', JSON.stringify({ email: cleanEmail, authenticated: true }));
        document.cookie = "admin_session=true; path=/; max-age=86400";
        router.push('/admin');
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setErrorMessage('Gagal login. Periksa kembali email dan password Anda.');
      } else if (data?.session) {
        localStorage.setItem('admin_session', JSON.stringify({ email: cleanEmail, authenticated: true }));
        document.cookie = "admin_session=true; path=/; max-age=86400";
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kesalahan sistem saat mencoba login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
            🏛️
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Login Admin Kelurahan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sistem Informasi Desa & Kelurahan Bonto Lebang
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Staf / Admin
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bontolebang.id"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kata Sandi (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-700 pt-5">
          <p className="text-xs text-gray-400">
            Khusus perangkat kelurahan Bonto Lebang.
          </p>
        </div>

      </div>
    </div>
  );
}
