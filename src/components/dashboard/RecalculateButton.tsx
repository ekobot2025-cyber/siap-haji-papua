'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Check } from 'lucide-react';

interface RecalculateButtonProps {
  seasonId?: string;
}

export function RecalculateButton({ seasonId }: RecalculateButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRecalculate = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/readiness/recalculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seasonId }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to recalculate readiness:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRecalculate}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
        success
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
          : 'bg-white hover:bg-slate-50 text-gray-700 border-slate-300 shadow-2xs'
      }`}
      title="Kalkulasi ulang skor kesiapan seluruh jamaah berdasarkan aturan aktif"
    >
      {loading ? (
        <>
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1e40af]" />
          <span>Menghitung...</span>
        </>
      ) : success ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Terkalkulasi</span>
        </>
      ) : (
        <>
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Kalkulasi Kesiapan</span>
        </>
      )}
    </button>
  );
}
