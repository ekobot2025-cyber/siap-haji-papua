'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Maximize2,
  Minimize2,
  ArrowLeft,
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  Plane,
  HeartPulse,
  CreditCard,
  FileCheck,
  BookOpen,
  MapPin,
} from 'lucide-react';

export default function VideoWallPage() {
  const [data, setData] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live Clock (WIT)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jayapura',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIT'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      const d = await res.json();
      if (d.success) {
        setData(d.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const autoRefresh = setInterval(fetchData, 15000); // 15 seconds
    return () => clearInterval(autoRefresh);
  }, [fetchData]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const kpi = data?.kpi || {
    totalJamaah: 200,
    siapBerangkat: 135,
    dalamProses: 65,
    perluTindakLanjut: 21,
    lansiaPrioritas: 38,
    provincialReadinessIndex: 96.2,
  };

  const regionalRanking = data?.regionalRanking || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col justify-between select-none">
      {/* 1. TOP COMMAND BAR */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/60">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 p-2 border border-[#D4AF37]/50 flex items-center justify-center shadow-lg">
            <Image
              src="/assets/branding/app-icon.png"
              alt="Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-emerald-950 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                PROVINCIAL COMMAND CENTER • BIG SCREEN MODE
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              SIAP HAJI PAPUA — MONITORING OPERASIONAL TERPADU
            </h1>
          </div>
        </div>

        {/* Live Clock & Fullscreen Controls */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              WAKTU PROVINSI PAPUA
            </span>
            <span className="text-xl sm:text-2xl font-mono font-black text-[#D4AF37]">
              {currentTime || '00:00:00 WIT'}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <Link
            href="/"
            className="p-3 rounded-2xl bg-emerald-900/50 hover:bg-emerald-800 text-[#D4AF37] border border-[#D4AF37]/30 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Keluar
          </Link>
        </div>
      </header>

      {/* 2. ALERT TICKER MARQUEE */}
      <div className="my-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-3">
        <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider shrink-0">
          EARLY WARNING
        </span>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <span className="animate-marquee font-medium">
            🔴 KONTROL KESIAPAN: 21 Jamaah memerlukan tindak lanjut perpanjangan paspor RI • 17 Jamaah dalam proses penetapan istitha&apos;ah kesehatan RSUD • 19 Jamaah dalam batas akhir pelunasan BPIH • Kloter 01 UPG dijadwalkan masuk asrama 18 Mei 2026.
          </span>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD WALL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto">
        {/* Left Column (4 cols): Provincial Index & Season */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#0A3E2F]/80 to-slate-900/90 p-6 rounded-3xl border border-emerald-800/40 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#D4AF37] tracking-wider block">
              Indikator Kesiapan Agregat
            </span>
            <h2 className="text-lg font-bold text-white mt-1">Indeks Kesiapan Papua</h2>
            <p className="text-xs text-slate-400">Musim Haji 1447 H / 2026 M</p>

            <div className="my-6 text-center">
              <span className="text-6xl sm:text-7xl font-mono font-black text-[#D4AF37] tracking-tight">
                {kpi.provincialReadinessIndex.toFixed(1)}%
              </span>
              <span className="block text-xs uppercase font-bold text-emerald-400 mt-2 tracking-widest">
                STATUS: SIAP BERANGKAT (OPTIMAL)
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-emerald-500 via-[#D4AF37] to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${kpi.provincialReadinessIndex}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Kuota Jamaah</span>
              <strong className="text-xl font-mono font-black text-white">{kpi.totalJamaah}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Lansia Prioritas</span>
              <strong className="text-xl font-mono font-black text-purple-300">{kpi.lansiaPrioritas}</strong>
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): 4 Operational Pillars */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              4 Pilar Antrean Intervensi (Action Center)
            </h3>
            <span className="text-xs font-mono font-bold text-rose-400">65 Kasus Terdata</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-900/60 text-amber-300">
                  <FileCheck className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">Dokumen & Paspor</h4>
                  <p className="text-[10px] text-amber-400">Perlu tindak lanjut verifikasi</p>
                </div>
              </div>
              <span className="text-2xl font-mono font-black text-amber-300">21</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-rose-900/60 text-rose-300">
                  <HeartPulse className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">Pemeriksaan Kesehatan</h4>
                  <p className="text-[10px] text-rose-400">Penetapan istitha&apos;ah RSUD</p>
                </div>
              </div>
              <span className="text-2xl font-mono font-black text-rose-300">17</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-900/60 text-blue-300">
                  <CreditCard className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">Administrasi BPIH</h4>
                  <p className="text-[10px] text-blue-400">Belum pelunasan biaya haji</p>
                </div>
              </div>
              <span className="text-2xl font-mono font-black text-blue-300">19</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-900/60 text-purple-300">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">Bimbingan Manasik</h4>
                  <p className="text-[10px] text-purple-400">Butuh pendampingan presensi</p>
                </div>
              </div>
              <span className="text-2xl font-mono font-black text-purple-300">8</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Regional Ranking Leaderboard */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Peringkat Kesiapan per Wilayah
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">10 Kab/Kota</span>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {regionalRanking.slice(0, 7).map((r: any, idx: number) => (
              <div key={r.regionId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    {idx + 1}. {r.regionName}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {r.readinessIndex.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${r.readinessIndex}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FOOTER STATUS BAR */}
      <footer className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          <span>Pusat Data Komando Haji Provinsi Papua • Status Sistem: </span>
          <strong className="text-emerald-400">OPERASIONAL AMAN</strong>
        </div>
        <div className="font-mono text-[11px]">
          Satu Data • Satu Monitoring • Satu Layanan • Haji Papua Siap
        </div>
      </footer>
    </div>
  );
}
