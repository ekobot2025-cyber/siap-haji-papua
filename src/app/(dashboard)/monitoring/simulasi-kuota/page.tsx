'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  Filter,
  Download,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export default function SimulasiKuotaPage() {
  const [neededCount, setNeededCount] = useState<number>(10);
  const [minScore, setMinScore] = useState<number>(85.0);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSimulation = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quota-simulation?count=${neededCount}&minScore=${minScore}`);
      const data = await res.json();
      if (data.success) {
        setCandidates(data.data.candidates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [neededCount, minScore]);

  useEffect(() => {
    fetchSimulation();
  }, [fetchSimulation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8dfc8]">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-white font-bold shadow-xs">
            <Sparkles className="w-6 h-6 text-white" />
          </span>
          <div>
            <h1 className="text-xl font-black text-[#1A1410] tracking-tight">
              SIMULASI KUOTA CADANGAN & REKOMENDASI PENGGANTI
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Decision Support System: Proyeksi pengisian kuota tambahan & pengganti jamaah tunda berdasarkan urut porsi dan skor kesiapan sesuai regulasi Kementerian Haji dan Umrah
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e8dfc8] text-xs font-semibold text-[#8a6d2b] bg-white hover:bg-[#fbf8ee] cursor-pointer self-start md:self-auto transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          Cetak Nominasi Cadangan
        </button>
      </div>

      {/* Scenario Control Panel */}
      <div className="bg-white rounded-3xl border border-[#e8dfc8] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#e8dfc8]/60">
          <Sliders className="w-4 h-4 text-[#8a6d2b]" />
          <h2 className="text-sm font-bold text-[#1A1410]">Parameter Skenario Pengisian Kuota</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Slider 1: Jumlah Kuota Dibutuhkan */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-gray-700">Jumlah Kuota Dibutuhkan / Pengganti:</label>
              <span className="font-mono text-base font-black text-[#8a6d2b] bg-[#fbf8ee] px-2.5 py-0.5 rounded-lg border border-[#e8dfc8]">
                {neededCount} Jamaah
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={neededCount}
              onChange={(e) => setNeededCount(parseInt(e.target.value, 10))}
              className="w-full accent-[#c9a961] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>1 Jamaah</span>
              <span>25 Jamaah</span>
              <span>50 Jamaah</span>
            </div>
          </div>

          {/* Slider 2: Ambang Batas Kesiapan */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-gray-700">Ambang Batas Kesiapan Minimal:</label>
              <span className="font-mono text-base font-black text-[#8a6d2b] bg-[#fbf8ee] px-2.5 py-0.5 rounded-lg border border-[#e8dfc8]">
                $\ge$ {minScore}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={minScore}
              onChange={(e) => setMinScore(parseFloat(e.target.value))}
              className="w-full accent-[#c9a961] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>50% (Perlu Tindak Lanjut)</span>
              <span>75% (Hampir Siap)</span>
              <span>90% (Sangat Siap)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-700">
              Daftar Rekomendasi Teratas Jamaah Cadangan ({candidates.length} Calon Teridentifikasi)
            </span>
            <p className="text-[11px] text-gray-400">
              Diurutkan otomatis dengan prioritas: Kesiapan Tertinggi $\to$ Nomor Porsi Terdahulu (FIFO)
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]">
            Algoritma: Porsi x Readiness Engine
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Menghitung ranking kesiapan jamaah cadangan...</div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12 text-gray-400 italic">
            Tidak ada jamaah cadangan yang memenuhi ambang batas kesiapan {minScore}%.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#e8dfc8] text-[#1A1410] font-bold">
                <tr>
                  <th className="p-3.5 text-center">Rank</th>
                  <th className="p-3.5">Nama Jamaah & Porsi</th>
                  <th className="p-3.5">Wilayah</th>
                  <th className="p-3.5 text-center">Paspor</th>
                  <th className="p-3.5 text-center">BPIH</th>
                  <th className="p-3.5 text-center">Istitha&apos;ah</th>
                  <th className="p-3.5 text-center">Skor Kesiapan</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dfc8]/60">
                {candidates.map((c) => (
                  <tr key={c.id} className="hover:bg-[#fbf8ee]/30 transition-colors">
                    <td className="p-3.5 text-center font-bold font-mono text-[#8a6d2b]">
                      #{c.rank}
                    </td>
                    <td className="p-3.5">
                      <Link
                        href={`/jamaah/${c.id}`}
                        className="font-bold text-[#1A1410] hover:text-[#8a6d2b] block"
                      >
                        {c.fullName}
                      </Link>
                      <div className="flex items-center gap-1.5 font-mono text-gray-400">
                        <span>{c.porsiNumber}</span>
                        {c.isPriorityElderly && (
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-1 rounded font-bold font-sans">
                            Lansia ({c.elderlyAge} th)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-gray-700">{c.regionName}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.passportOk ? 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {c.passportOk ? '✓ Valid' : '✗ Belum'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.bpihOk ? 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {c.bpihOk ? '✓ Lunas' : '✗ Belum'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.healthOk ? 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {c.healthOk ? '✓ Memenuhi Syarat' : 'Proses'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]">
                        {Number(c?.readinessScore ?? 0).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/jamaah/${c.id}`}
                        className="px-3.5 py-1.5 rounded-xl btn-kemenhaj-primary text-xs font-bold transition-all inline-block cursor-pointer shadow-xs"
                      >
                        Pilih Nominasi
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
