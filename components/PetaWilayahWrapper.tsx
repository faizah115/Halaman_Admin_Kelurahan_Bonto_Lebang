'use client';

import dynamic from 'next/dynamic';

const PetaWilayahInteraktif = dynamic(() => import('./PetaWilayahInteraktif'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium animate-pulse">⏳ Memuat peta interaktif...</span>
    </div>
  ),
});

export default function PetaWilayahWrapper() {
  return <PetaWilayahInteraktif />;
}
