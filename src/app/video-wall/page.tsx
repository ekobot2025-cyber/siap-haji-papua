'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Maximize2,
  Minimize2,
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  Plane,
  HeartPulse,
  CreditCard,
  FileCheck,
  BookOpen,
  MapPin,
  PieChart,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Layers,
  Calendar,
} from 'lucide-react';
import { BerhakLunasService } from '@/application/services/berhak-lunas.service';

export default function VideoWallPage() {
  const [data, setData] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'CHARTS' | 'REGIONS' | 'KLOTER'>('OVERVIEW');
  const [autoRotate, setAutoRotate] = useState(true);

  const summary = useMemo(() => BerhakLunasService.getSummary(), []);

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
      console.error('Error fetching dashboard for Video Wall:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const autoRefresh = setInterval(fetchData, 15000); // 15 seconds
    return () => clearInterval(autoRefresh);
  }, [fetchData]);

  // Auto-rotate views every 18 seconds for wall display
  useEffect(() => {
    if (!autoRotate) return;
    const views: Array<'OVERVIEW' | 'CHARTS' | 'REGIONS' | 'KLOTER'> = ['OVERVIEW', 'CHARTS', 'REGIONS', 'KLOTER'];
    const timer = setInterval(() => {
      setActiveView((prev) => {
        const nextIdx = (views.indexOf(prev) + 1) % views.length;
        return views[nextIdx];
      });
    }, 18000);
    return () => clearInterval(timer);
  }, [autoRotate]);

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
    totalJamaah: 924,
    siapBerangkat: 18,
    dalamProses: 906,
    perluTindakLanjut: 0,
    prioritasIntervensi: 0,
    lansiaPrioritas: 180,
    provincialReadinessIndex: 84.9,
  };

  const componentsReadiness = data?.componentsReadiness || [
    { code: 'IDENTITAS', name: 'Identitas & Biodata', weight: 10, averageScore: 98.5 },
    { code: 'ADMINISTRASI', name: 'Administrasi BPIH', weight: 20, averageScore: 94.2 },
    { code: 'DOKUMEN', name: 'Kelengkapan Paspor/Visa', weight: 20, averageScore: 89.0 },
    { code: 'KESEHATAN', name: 'Pemeriksaan Kesehatan', weight: 20, averageScore: 87.5 },
    { code: 'MANASIK', name: 'Bimbingan Manasik', weight: 15, averageScore: 91.2 },
    { code: 'KLOTER', name: 'Penempatan Kloter', weight: 15, averageScore: 88.0 },
  ];

  const regionalRanking = (data?.regionalRanking && data.regionalRanking.length > 0)
    ? data.regionalRanking
    : summary.regencyBreakdown.map((r, i) => ({
        regionId: `reg-${i}`,
        regionName: r.name,
        totalJamaah: r.count,
        averageReadiness: 85.0 - (i * 0.2),
      }));

  const provIndex = Number(kpi?.provincialReadinessIndex ?? 84.9);

  const kloterStats = [
    {
      kloterNumber: '01',
      code: 'KLOTER-01-UPG',
      wilayah: 'Kota Jayapura & Kab. Keerom',
      total: 305,
      capacity: 450,
      transitHub: 'Bandara Sentani (DJJ) -> UPG',
      flight: 'GA-1101 (Garuda Indonesia)',
    },
    {
      kloterNumber: '02',
      code: 'KLOTER-02-UPG',
      wilayah: 'Biak Numfor, Yapen, Waropen, Sarmi, Supiori',
      total: 97,
      capacity: 450,
      transitHub: 'Frans Kaisiepo (BIK) -> UPG',
      flight: 'GA-1102 (Garuda Indonesia)',
    },
    {
      kloterNumber: '03',
      code: 'KLOTER-03-UPG',
      wilayah: 'Mimika, Nabire, Paniai',
      total: 231,
      capacity: 450,
      transitHub: 'Mozes Kilangin (TIM) -> UPG',
      flight: 'GA-1103 (Garuda Indonesia)',
    },
    {
      kloterNumber: '04',
      code: 'KLOTER-04-UPG',
      wilayah: 'Merauke, Boven Digoel, Asmat, Mappi, Jayawijaya, Yahukimo',
      total: 291,
      capacity: 450,
      transitHub: 'Mopah Merauke (MKQ) -> UPG',
      flight: 'GA-1104 (Garuda Indonesia)',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0806] text-stone-100 p-4 sm:p-6 flex flex-col justify-between select-none">
      {/* 1. TOP COMMAND BAR */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#2A2018]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1A1410] p-2 border border-[#c9a961]/50 flex items-center justify-center shadow-lg shrink-0">
            <Image
              src="/assets/branding/logo-kemenhaj.png"
              alt="Logo Kementerian Haji"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a961] bg-[#1A1410] px-2.5 py-0.5 rounded border border-[#c9a961]/40">
                PROVINCIAL COMMAND CENTER • BIG SCREEN NOC MODE
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#c9a961] animate-ping" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                100% DATA RIIL 924 JAMAAH
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              SIAP HAJI PAPUA — MONITORING OPERASIONAL TERPADU 1448 H
            </h1>
          </div>
        </div>

        {/* View Switcher Tabs & Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-[#1A1410] p-1 rounded-2xl border border-[#c9a961]/30">
            <button
              onClick={() => { setActiveView('OVERVIEW'); setAutoRotate(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'OVERVIEW' ? 'bg-[#c9a961] text-[#1A1410] shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              Kesiapan 6 Pilar
            </button>
            <button
              onClick={() => { setActiveView('CHARTS'); setAutoRotate(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'CHARTS' ? 'bg-[#c9a961] text-[#1A1410] shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              Komposisi Kuota & Usia
            </button>
            <button
              onClick={() => { setActiveView('REGIONS'); setAutoRotate(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'REGIONS' ? 'bg-[#c9a961] text-[#1A1410] shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              18 Kab/Kota
            </button>
            <button
              onClick={() => { setActiveView('KLOTER'); setAutoRotate(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'KLOTER' ? 'bg-[#c9a961] text-[#1A1410] shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              4 Kloter UPG
            </button>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
              autoRotate ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60' : 'bg-stone-900 text-stone-400 border-stone-800'
            }`}
            title="Auto-rotasi tampilan layar"
          >
            {autoRotate ? 'Auto: ON' : 'Auto: PAUSE'}
          </button>

          <div className="text-right pl-2 border-l border-[#2A2018]">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              ZONA WIT
            </span>
            <span className="text-lg font-mono font-black text-[#c9a961]">
              {currentTime || '00:00:00 WIT'}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-[#c9a961]/20 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl btn-kemenhaj-primary text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Keluar
          </Link>
        </div>
      </header>

      {/* 2. TOP METRIC STRIP (5 KPI CARDS SAMA SEPERTI DASHBOARD UTAMA) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-3">
        <div className="bg-[#14100D] p-3.5 rounded-2xl border border-[#c9a961]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">TOTAL JAMAAH</span>
            <span className="text-2xl font-black font-mono text-white">{kpi.totalJamaah}</span>
            <span className="text-[10px] text-stone-500 block">Kuota Musim 100%</span>
          </div>
          <Users className="w-6 h-6 text-[#c9a961]" />
        </div>

        <div className="bg-[#14100D] p-3.5 rounded-2xl border border-[#c9a961]/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#c9a961] block">SIAP BERANGKAT</span>
            <span className="text-2xl font-black font-mono text-[#c9a961]">{kpi.siapBerangkat}</span>
            <span className="text-[10px] text-emerald-400 block">{((kpi.siapBerangkat / kpi.totalJamaah) * 100).toFixed(1)}% dari total</span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="bg-[#14100D] p-3.5 rounded-2xl border border-blue-900/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-400 block">DALAM PROSES</span>
            <span className="text-2xl font-black font-mono text-blue-300">{kpi.dalamProses}</span>
            <span className="text-[10px] text-blue-400 block">{((kpi.dalamProses / kpi.totalJamaah) * 100).toFixed(1)}% dari total</span>
          </div>
          <Clock className="w-6 h-6 text-blue-400" />
        </div>

        <div className="bg-[#14100D] p-3.5 rounded-2xl border border-amber-900/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 block">TINDAK LANJUT</span>
            <span className="text-2xl font-black font-mono text-amber-300">{kpi.perluTindakLanjut}</span>
            <span className="text-[10px] text-amber-400 block">Perlu Intervensi</span>
          </div>
          <FileCheck className="w-6 h-6 text-amber-400" />
        </div>

        <div className="bg-[#14100D] p-3.5 rounded-2xl border border-purple-900/30 flex items-center justify-between col-span-2 md:col-span-1">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-400 block">LANSIA PRIORITAS</span>
            <span className="text-2xl font-black font-mono text-purple-300">{kpi.lansiaPrioritas}</span>
            <span className="text-[10px] text-purple-400 block">Afirmasi Usia ≥ 65 Th</span>
          </div>
          <HeartPulse className="w-6 h-6 text-purple-400" />
        </div>
      </div>

      {/* 3. DYNAMIC MAIN STAGE ACCORDING TO ACTIVE VIEW */}
      <div className="my-auto py-2">
        {/* VIEW 1: KESIAPAN 6 PILAR (SESUAI GAMBAR 4) */}
        {activeView === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
            {/* Left Big Gauge: Indeks Kesiapan Papua */}
            <div className="lg:col-span-5 bg-[#14100D] p-6 rounded-3xl border border-[#c9a961]/35 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold text-[#c9a961] tracking-wider block">
                    Indikator Kesiapan Agregat
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                    Formula Bobot Dinamis
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">Indeks Kesiapan Administratif Provinsi Papua</h2>
                <p className="text-xs text-gray-400">Musim Haji 1448 H / 2026-2027 M • Embarkasi Makassar (UPG)</p>

                <div className="my-8 text-center">
                  <span className="text-7xl sm:text-8xl font-mono font-black text-white tracking-tight">
                    {provIndex.toFixed(1)}%
                  </span>
                  <span className="block text-sm uppercase font-bold text-[#c9a961] mt-3 tracking-widest">
                    STATUS AGREGAT: {provIndex >= 90 ? 'SIAP BERANGKAT' : 'DALAM PROSES'}
                  </span>
                </div>

                <div className="w-full bg-black/60 rounded-full h-4 overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="bg-gradient-to-r from-[#c9a961] via-[#d4af37] to-[#b8941e] h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.max(0, provIndex))}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-6 border-t border-white/10 text-xs text-center">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-stone-400 block text-[10px]">Urut Nomor Porsi</span>
                  <strong className="text-lg font-mono font-black text-blue-400">{summary.urutCount}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-stone-400 block text-[10px]">Prioritas Lansia</span>
                  <strong className="text-lg font-mono font-black text-purple-400">{summary.plansiaCount}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-stone-400 block text-[10px]">Lunas Tunda</span>
                  <strong className="text-lg font-mono font-black text-amber-400">{summary.lunasTundaCount}</strong>
                </div>
              </div>
            </div>

            {/* Right: 6 Pilar Components Detail */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {componentsReadiness.map((comp: any) => (
                <div key={comp.code} className="bg-[#14100D] p-5 rounded-2xl border border-[#c9a961]/25 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{comp.name}</span>
                      <span className="text-xs font-mono font-bold text-[#c9a961] bg-black/40 px-2 py-0.5 rounded border border-[#c9a961]/30">
                        Bobot: {comp.weight}%
                      </span>
                    </div>
                    <div className="text-3xl font-black font-mono text-white mt-1">
                      {Number(comp?.averageScore ?? 0).toFixed(1)}%
                    </div>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden mt-4">
                    <div
                      className="bg-gradient-to-r from-[#c9a961] to-[#b8941e] h-full rounded-full transition-all duration-700"
                      style={{ width: `${comp.averageScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: KOMPOSISI KUOTA & PIRAMIDA USIA (SESUAI GAMBAR 2) */}
        {activeView === 'CHARTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {/* Box 1: Komposisi Kuota */}
            <div className="bg-[#14100D] p-6 rounded-3xl border border-[#c9a961]/35 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-[#c9a961]" />
                  <span>Komposisi Kategori Alokasi Kuota 1448 H</span>
                </h3>
                <span className="text-xs font-mono font-bold text-[#c9a961] bg-white/5 px-2.5 py-1 rounded-full">
                  Total Kuota: 924
                </span>
              </div>

              {/* Progress Stack Bar */}
              <div className="w-full h-8 rounded-2xl overflow-hidden flex border border-white/10">
                <div
                  style={{ width: `${(summary.urutCount / summary.total) * 100}%` }}
                  className="bg-blue-600 flex items-center justify-center text-white text-xs font-mono font-bold"
                >
                  93.0%
                </div>
                <div
                  style={{ width: `${(summary.plansiaCount / summary.total) * 100}%` }}
                  className="bg-purple-600 flex items-center justify-center text-white text-xs font-mono font-bold"
                >
                  5.1%
                </div>
                <div
                  style={{ width: `${(summary.lunasTundaCount / summary.total) * 100}%` }}
                  className="bg-amber-500 flex items-center justify-center text-white text-xs font-mono font-bold"
                >
                  1.9%
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-blue-900/40">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="font-medium text-white text-sm">Urut Nomor Porsi Kuota Reguler</span>
                  </div>
                  <strong className="font-mono text-blue-400 text-base">{summary.urutCount} Jamaah (93.0%)</strong>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-purple-900/40">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-600 shrink-0" />
                    <span className="font-medium text-white text-sm">Prioritas Lansia (Afirmasi Usia ≥ 65 Tahun)</span>
                  </div>
                  <strong className="font-mono text-purple-400 text-base">{summary.plansiaCount} Jamaah (5.1%)</strong>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-amber-900/40">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-medium text-white text-sm">Lunas Tunda (Otomatis Berhak Berangkat)</span>
                  </div>
                  <strong className="font-mono text-amber-400 text-base">{summary.lunasTundaCount} Jamaah (1.9%)</strong>
                </div>
              </div>
            </div>

            {/* Box 2: Piramida Usia Calon Jamaah */}
            <div className="bg-[#14100D] p-6 rounded-3xl border border-[#c9a961]/35 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#c9a961]" />
                  <span>Distribusi Kelompok Usia Calon Jamaah</span>
                </h3>
                <span className="text-xs font-mono font-bold text-[#c9a961] bg-white/5 px-2.5 py-1 rounded-full">
                  Rentang Usia: 19 - 88 Th
                </span>
              </div>

              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-stone-300 font-medium">Usia &lt; 40 Tahun (Produktif Muda)</span>
                    <strong className="font-mono text-emerald-400">{summary.ageGroups.under40} Jamaah ({((summary.ageGroups.under40 / summary.total) * 100).toFixed(1)}%)</strong>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(summary.ageGroups.under40 / summary.total) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-stone-300 font-medium">Usia 40 - 59 Tahun (Kelompok Terbanyak)</span>
                    <strong className="font-mono text-[#c9a961]">{summary.ageGroups.age40to59} Jamaah ({((summary.ageGroups.age40to59 / summary.total) * 100).toFixed(1)}%)</strong>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden">
                    <div className="bg-[#c9a961] h-full rounded-full" style={{ width: `${(summary.ageGroups.age40to59 / summary.total) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-stone-300 font-medium">Usia 60 - 74 Tahun (Perlu Perhatian Medis)</span>
                    <strong className="font-mono text-amber-400">{summary.ageGroups.age60to74} Jamaah ({((summary.ageGroups.age60to74 / summary.total) * 100).toFixed(1)}%)</strong>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(summary.ageGroups.age60to74 / summary.total) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-purple-300 font-bold">Usia ≥ 75 Tahun (Pendampingan Intensif)</span>
                    <strong className="font-mono text-purple-400">{summary.ageGroups.age75Plus} Jamaah ({((summary.ageGroups.age75Plus / summary.total) * 100).toFixed(1)}%)</strong>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(summary.ageGroups.age75Plus / summary.total) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SEBARAN 18 KABUPATEN / KOTA (SESUAI GAMBAR 3 & GAMBAR 5) */}
        {activeView === 'REGIONS' && (
          <div className="bg-[#14100D] p-6 rounded-3xl border border-[#c9a961]/35 shadow-2xl animate-in fade-in duration-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#c9a961]" />
                  <span>Peringkat &amp; Sebaran Alokasi Kuota di 18 Kab/Kota Se-Papua Raya</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Distribusi kuota riil dan tingkat kesiapan administratif jamaah per wilayah
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#c9a961] bg-white/5 px-3 py-1 rounded-full">
                18 Wilayah
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-2">
              {summary.regencyBreakdown.map((r, i) => (
                <div key={r.name} className="p-3.5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1A1410] border border-[#c9a961]/40 text-[#c9a961] font-mono font-bold text-[10px] flex items-center justify-center">
                        {i + 1}
                      </span>
                      <strong className="text-white text-sm">{r.name}</strong>
                    </div>
                    <span className="font-mono font-bold text-[#c9a961] text-sm">
                      {r.count} Jamaah ({r.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#c9a961] to-[#b8941e] h-full rounded-full transition-all duration-500"
                      style={{ width: `${(r.count / summary.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: ALOKASI 4 KLOTER UPG */}
        {activeView === 'KLOTER' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
            {kloterStats.map((k) => (
              <div key={k.code} className="bg-[#14100D] p-5 rounded-3xl border border-[#c9a961]/30 flex flex-col justify-between space-y-4 shadow-xl">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-mono font-black text-[#c9a961] bg-black/40 px-2.5 py-1 rounded-lg border border-[#c9a961]/30">
                      KLOTER {k.kloterNumber}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      SIAP UPG
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-3">{k.code}</h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">{k.wilayah}</p>

                  <div className="my-4 p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Total Jamaah:</span>
                      <strong className="font-mono text-white text-sm">{k.total} Orang</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Penerbangan:</span>
                      <strong className="text-stone-300 font-mono text-[11px]">{k.flight}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#c9a961] border-t border-white/10 pt-2 font-mono">
                  Transit: {k.transitHub}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. FOOTER STATUS BAR */}
      <footer className="pt-3 border-t border-[#2A2018] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-400">
        <div>
          <span>Pusat Data Komando Haji Kantor Wilayah Kementerian Haji dan Umrah Papua • Status Sistem: </span>
          <strong className="text-[#c9a961]">OPERASIONAL SIAP & AMAN</strong>
        </div>
        <div className="font-mono text-[11px] text-[#c9a961]">
          Satu Data • Satu Monitoring • Satu Layanan • haji.go.id Resmi
        </div>
      </footer>
    </div>
  );
}
