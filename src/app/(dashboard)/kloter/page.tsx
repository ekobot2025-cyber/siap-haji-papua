'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plane,
  Users,
  Calendar,
  Building2,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function KloterPage() {
  const [kloters, setKloters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKloters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kloter');
      const data = await res.json();
      if (data.success) {
        setKloters(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKloters();
  }, [fetchKloters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-[#1A1410] font-bold shadow-xs">
            <Plane className="w-6 h-6 text-white" />
          </span>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              KOMANDO KLOTER & MANIFEST PENERBANGAN
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Alokasi kelompok terbang Provinsi Papua, jadwal asrama haji, jadwal penerbangan, dan rombongan
            </p>
          </div>
        </div>

        <button
          onClick={fetchKloters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-gray-700 bg-white hover:bg-slate-50 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Kloter
        </button>
      </div>

      {/* Kloter Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Memuat data kloter...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kloters.map((k) => {
            const memberCount = k._count?.members || 0;
            const pct = Math.round((memberCount / k.capacityTotal) * 100);

            return (
              <div
                key={k.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Provinsi Papua
                    </span>
                    <h2 className="text-xl font-black text-[#b8941e]">
                      Kloter {k.kloterNumber} ({k.kloterCode})
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    STATUS: {k.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-gray-500 block">Embarkasi Asrama:</span>
                    <p className="font-semibold text-gray-800">{k.embarkationName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-500 block">Penerbangan:</span>
                    <p className="font-semibold text-gray-800">{k.airlineName} ({k.flightNumber})</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-500 block">Masuk Asrama:</span>
                    <p className="font-medium text-gray-700">
                      {k.dormitoryInDate ? new Date(k.dormitoryInDate).toLocaleDateString('id-ID') : '18 Mei 2026'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-500 block">Keberangkatan Udara:</span>
                    <p className="font-medium text-gray-700">
                      {k.flightDepartureDate ? new Date(k.flightDepartureDate).toLocaleDateString('id-ID') : '19 Mei 2026'}
                    </p>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">
                      Okupansi Kursi: {memberCount} / {k.capacityTotal} Jamaah
                    </span>
                    <span className="font-mono font-bold text-[#b8941e]">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#c9a961] to-[#b8941e] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-500">
                    Petugas: <strong>{k._count?.officers || 4} Terdaftar</strong>
                  </span>

                  <Link
                    href={`/kloter/${k.id}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c9a961] to-[#b8941e] hover:brightness-105 text-[#1A1410] font-bold text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    Buka Manifest Internal <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
