'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  ArrowUpRight,
  Tv,
  QrCode,
  Users,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  HeartPulse,
  Plane,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Activity,
  Award,
  Zap,
  Menu,
  X,
} from 'lucide-react';

export default function ShowcaseLandingPage() {
  const [activeTab, setActiveTab] = useState<'eksekutif' | 'medis' | 'jamaah'>('eksekutif');
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Quick 1-click login handler for demo users
  const handleQuickLogin = async (username: string, defaultPath: string) => {
    setIsLoggingIn(username);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username, password: 'AdminPapua2026!' }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = defaultPath;
      } else {
        window.location.href = '/login';
      }
    } catch {
      window.location.href = '/login';
    } finally {
      setIsLoggingIn(null);
    }
  };

  const officialRegencies = [
    { code: 'REG-JPR-KOTA', name: 'Kota Jayapura', quota: 350, ready: 97.8, type: 'Pusat Pemerintahan / Pesisir Youtefa', hub: 'Bandara Sentani (DJJ)' },
    { code: 'REG-KEEROM', name: 'Kab. Keerom', quota: 75, ready: 94.5, type: 'Wilayah Perbatasan RI-PNG (Arso/Waris)', hub: 'Transit Jayapura -> Sentani' },
    { code: 'REG-JPR-KAB', name: 'Kab. Jayapura', quota: 140, ready: 96.4, type: 'Danau Sentani / Hub Utama Embarkasi', hub: 'Bandara Sentani (DJJ)' },
    { code: 'REG-MRK', name: 'Kab. Merauke', quota: 120, ready: 95.2, type: 'Dataran Rendah Selatan / Ujung Timur NKRI', hub: 'Bandara Mopah (MKQ) -> UPG' },
    { code: 'REG-BVD', name: 'Kab. Boven Digoel', quota: 30, ready: 92.0, type: 'Pedalaman DAS Sungai Digoel / Perbatasan', hub: 'Bandara Tanah Merah (TMH) -> MKQ' },
    { code: 'REG-ASMAT', name: 'Kab. Asmat', quota: 20, ready: 91.5, type: 'Kawasan Pesisir Rawa / Kota Papan Agats', hub: 'Bandara Ewer (EWE) -> TIM -> UPG' },
    { code: 'REG-MMK', name: 'Kab. Mimika', quota: 135, ready: 96.0, type: 'Kota Industri Timika / Pesisir Laut Arafura', hub: 'Bandara Mozes Kilangin (TIM) -> UPG' },
    { code: 'REG-BIAK', name: 'Kab. Biak Numfor', quota: 95, ready: 95.8, type: 'Kepulauan Teluk Cenderawasih / Hub Utara', hub: 'Bandara Frans Kaisiepo (BIK)' },
    { code: 'REG-YAPEN', name: 'Kab. Kepulauan Yapen', quota: 40, ready: 93.2, type: 'Gugusan Kepulauan Serui / Selat Yapen', hub: 'Pelabuhan Serui -> Biak' },
    { code: 'REG-NBR', name: 'Kab. Nabire', quota: 50, ready: 94.0, type: 'Pesisir Teluk Cenderawasih Leher Burung', hub: 'Bandara Douw Aturure (NBX) -> UPG' },
    { code: 'REG-JWY', name: 'Kab. Jayawijaya', quota: 21, ready: 91.8, type: 'Lembah Baliem Pegunungan Tengah Papua', hub: 'Bandara Wamena (WMX) -> Sentani' },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden selection:bg-[#c9a961] selection:text-[#1A1410]">
      {/* =========================================================================
          1. FUTURISTIC AMBIENT BACKGROUND & GOVERNMENT PATTERN
          ========================================================================= */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 0.9; transform: scale(1.1); }
        }
        @keyframes flowDash {
          to {
            stroke-dashoffset: -40;
          }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .flow-cable {
          stroke-dasharray: 6 6;
          animation: flowDash 1.2s linear infinite;
        }
        .twinkle-dot {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: #c9a961;
          box-shadow: 0 0 8px 1px rgba(201, 169, 97, 0.4);
          animation-name: twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>

      {/* Ambient Lighting Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#c9a961]/10 blur-[160px]" />
        <div className="absolute top-1/3 -right-20 h-[30rem] w-[30rem] rounded-full bg-[#b8941e]/10 blur-[160px]" />
        <div className="absolute -bottom-20 left-10 h-[32rem] w-[32rem] rounded-full bg-amber-500/10 blur-[150px]" />
        {/* Soft Grid with Fade Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,169,97,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,169,97,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)]" />
      </div>

      {/* =========================================================================
          2. GLASSMORPHISM TOP NAVIGATION BAR (HAJI.GO.ID MODERN STYLE)
          ========================================================================= */}
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[#e8dfc8] bg-white/95 backdrop-blur-xl shadow-xs">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#c9a961] via-[#d4af37] to-[#b8941e]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-[#e8dfc8] shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/branding/logo-kemenhaj.png" alt="Logo Kementerian Haji dan Umrah" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#1A1410] whitespace-nowrap">
                  SIAP <span className="text-[#b8941e]">HAJI</span> PAPUA
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-[#8a6d2b] bg-[#fbf8ee] border border-[#e8dfc8] whitespace-nowrap shrink-0">
                  1447 H / 2026 M
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium tracking-tight whitespace-nowrap hidden sm:block">
                Kementerian Haji dan Umrah • Wilayah Kerja Papua
              </p>
            </div>
          </Link>

          {/* Navigation Capsule */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100/80 border border-[#e8dfc8] p-1 rounded-full shadow-2xs shrink-0">
            <a
              href="#hero"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-[#8a6d2b] hover:bg-white transition-all whitespace-nowrap"
            >
              Beranda
            </a>
            <a
              href="#pilar"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-[#8a6d2b] hover:bg-white transition-all whitespace-nowrap"
            >
              3 Pilar Layanan
            </a>
            <a
              href="#alur"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-[#8a6d2b] hover:bg-white transition-all whitespace-nowrap"
            >
              Alur Jamaah
            </a>
            <a
              href="#wilayah"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-[#8a6d2b] hover:bg-white transition-all whitespace-nowrap"
            >
              11 Wilayah
            </a>
            <Link
              href="/video-wall"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#8a6d2b] hover:text-[#1A1410] hover:bg-[#fbf8ee] transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <Tv className="w-3.5 h-3.5 text-[#b8941e]" />
              <span>Video Wall</span>
            </Link>
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/cek-porsi"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e8dfc8] bg-[#fbf8ee] hover:bg-[#f4ebd0] text-[#8a6d2b] text-xs font-bold transition-all whitespace-nowrap shrink-0 shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5 text-[#b8941e]" />
              <span>Cek Porsi</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl btn-kemenhaj-primary text-white text-xs font-extrabold shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-stone-100 border border-[#e8dfc8] text-stone-700 hover:text-[#8a6d2b] hover:bg-[#fbf8ee] transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#b8941e]" /> : <Menu className="w-5 h-5 text-stone-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu Sheet */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e8dfc8] bg-white/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in fade-in duration-200 shadow-lg">
            <a
              href="#hero"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#8a6d2b] hover:bg-[#fbf8ee] transition-colors"
            >
              Beranda
            </a>
            <a
              href="#pilar"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#8a6d2b] hover:bg-[#fbf8ee] transition-colors"
            >
              3 Pilar Layanan
            </a>
            <a
              href="#alur"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#8a6d2b] hover:bg-[#fbf8ee] transition-colors"
            >
              Alur Jamaah
            </a>
            <a
              href="#wilayah"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#8a6d2b] hover:bg-[#fbf8ee] transition-colors"
            >
              11 Wilayah Kerja Papua
            </a>
            <div className="pt-2 border-t border-[#e8dfc8] flex flex-col gap-2">
              <Link
                href="/video-wall"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#8a6d2b] bg-[#fbf8ee] border border-[#e8dfc8]"
              >
                <span className="flex items-center gap-2">
                  <Tv className="w-3.5 h-3.5 text-[#b8941e]" /> Video Wall NOC
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
              <Link
                href="/cek-porsi"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#8a6d2b] bg-[#fbf8ee] border border-[#e8dfc8]"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5 text-[#b8941e]" /> Cek Porsi Mandiri
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for Fixed Header */}
      <div className="h-24 sm:h-28" />

      {/* =========================================================================
          3. HERO SECTION (HAJI.GO.ID CLEAN CORPORATE GOVERNMENT STYLE)
          ========================================================================= */}
      <section id="hero" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8dfc8] bg-[#fbf8ee] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#8a6d2b] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#b8941e] animate-pulse" />
              SISTEM INFORMASI & MONITORING HAJI PROVINSI PAPUA
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-[#1A1410]">
              Satu Data • Satu Monitoring • Satu Layanan.{' '}
              <span className="bg-gradient-to-r from-[#c9a961] via-[#d4af37] to-[#b8941e] bg-clip-text text-transparent block mt-1">
                Haji Papua Siap 2026 M.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl font-normal">
              Platform komando digital terpadu <strong>Kementerian Haji dan Umrah Wilayah Kerja Papua</strong> untuk pemantauan real-time kesiapan administrasi, bio visa, penetapan istitha&apos;ah medis RSUD, dan alokasi 4 Kloter jamaah di 11 Kabupaten/Kota.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl btn-kemenhaj-primary text-white text-sm font-black shadow-md hover:shadow-lg transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
              >
                Masuk Command Center <ArrowUpRight className="w-4 h-4 text-white" />
              </Link>

              <Link
                href="/cek-porsi"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-[#e8dfc8] bg-white hover:bg-[#fbf8ee] text-[#1A1410] text-sm font-bold shadow-xs transition-all whitespace-nowrap shrink-0"
              >
                <QrCode className="w-4 h-4 text-[#b8941e]" /> Cek Porsi Warga
              </Link>

              <Link
                href="/video-wall"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-[#c9a961]/40 bg-[#1A1410] hover:bg-[#261F1A] text-[#c9a961] text-sm font-bold shadow-xs transition-all whitespace-nowrap shrink-0"
              >
                <Tv className="w-4 h-4 text-[#c9a961]" /> Mode Video Wall NOC
              </Link>
            </div>

            {/* 3 Metric Stat Counters */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#e8dfc8] max-w-xl">
              <div>
                <div className="text-2xl sm:text-4xl font-black font-mono text-[#967412]">11</div>
                <div className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">Kabupaten & Kota</div>
              </div>
              <div className="border-x border-[#e8dfc8] px-4">
                <div className="text-2xl sm:text-4xl font-black font-mono text-[#967412]">1.076</div>
                <div className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">Total Kuota Papua</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-black font-mono text-[#967412]">96.2%</div>
                <div className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">Indeks Kesiapan</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hologram Live Command Radar Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#c9a961]/25 to-[#b8941e]/25 blur-2xl opacity-70" />

            <div className="relative rounded-3xl border border-[#c9a961]/35 bg-gradient-to-b from-[#1A1410] via-[#2A2018] to-[#1A1410] text-white p-6 shadow-2xl backdrop-blur-xl">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#c9a961] animate-ping" />
                  <span className="text-xs font-mono font-bold tracking-wider text-[#c9a961] uppercase">
                    LIVE COMMAND RADAR
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-[#c9a961]/30">
                  1447 H / 2026 M
                </span>
              </div>

              {/* Central Readiness Dial */}
              <div className="py-6 text-center space-y-2">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-4 border-white/15 border-t-[#c9a961] border-r-[#e8dfc8]/40 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black font-mono text-white">96.2%</span>
                    <span className="text-[10px] text-gray-300 font-mono uppercase tracking-wider">Provincial Score</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">Kesiapan Keberangkatan Tinggi</h3>
                <p className="text-xs text-gray-300">
                  Konsentrasi Embarkasi Hasanuddin Makassar (UPG)
                </p>
              </div>

              {/* 4 Kloter Quick Manifest Snapshot */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-[11px] font-mono text-[#c9a961] uppercase font-bold flex justify-between">
                  <span>Manifest 4 Kloter Papua:</span>
                  <span>450 Seat / Kloter</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Kloter 01 (UPG)</span>
                      <span className="text-[#c9a961] font-mono">100%</span>
                    </div>
                    <p className="text-[10px] text-gray-300 truncate">Kota & Kab. Jayapura</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Kloter 02 (UPG)</span>
                      <span className="text-[#c9a961] font-mono">98%</span>
                    </div>
                    <p className="text-[10px] text-gray-300 truncate">Biak & Kepulauan Yapen</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Kloter 03 (UPG)</span>
                      <span className="text-amber-300 font-mono">94%</span>
                    </div>
                    <p className="text-[10px] text-gray-300 truncate">Keerom, Nabire & Jayawijaya</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Kloter 04 (UPG)</span>
                      <span className="text-[#c9a961] font-mono">92%</span>
                    </div>
                    <p className="text-[10px] text-gray-300 truncate">Merauke, Mimika, BVD & Asmat</p>
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c9a961]" /> SISKOHAT & haji.go.id Terhubung
                </span>
                <span className="font-mono text-[#c9a961] font-bold">STATUS: SIAP OPERASIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. RUNNING MARQUEE TICKER (11 KABUPATEN/KOTA PAPUA & INTEGRASI PUSAT)
          ========================================================================= */}
      <div className="relative overflow-hidden border-y border-[#e8dfc8] bg-[#fbf8ee] py-3.5 z-10 backdrop-blur-md">
        <div className="animate-marquee gap-8 pr-8">
          <span className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-bold text-[#8a6d2b] bg-white border border-[#e8dfc8] px-3.5 py-1 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#b8941e] animate-pulse" />
            <span>Kementerian Haji dan Umrah RI:</span>
            <span className="font-mono text-[#8a6d2b] underline">haji.go.id</span>
            <span className="text-[#b8941e] font-mono">(Sinkronisasi Nasional Aktif)</span>
          </span>
          {officialRegencies.map((reg) => (
            <span key={reg.code} className="flex items-center gap-2.5 whitespace-nowrap text-xs sm:text-sm font-semibold text-stone-700">
              <span className="w-2 h-2 rounded-full bg-[#c9a961]" />
              <strong>{reg.name}:</strong>
              <span className="font-mono text-[#8a6d2b] font-bold">{reg.quota} Kuota</span>
              <span className="text-[#b8941e] font-mono">({reg.ready}% Siap)</span>
            </span>
          ))}
          {/* Repeat for seamless loop */}
          <span className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-bold text-[#8a6d2b] bg-white border border-[#e8dfc8] px-3.5 py-1 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#b8941e] animate-pulse" />
            <span>Kementerian Haji dan Umrah RI:</span>
            <span className="font-mono text-[#8a6d2b] underline">haji.go.id</span>
            <span className="text-[#b8941e] font-mono">(Sinkronisasi Nasional Aktif)</span>
          </span>
          {officialRegencies.map((reg) => (
            <span key={`${reg.code}-dup`} className="flex items-center gap-2.5 whitespace-nowrap text-xs sm:text-sm font-semibold text-stone-700">
              <span className="w-2 h-2 rounded-full bg-[#b8941e]" />
              <strong>{reg.name}:</strong>
              <span className="font-mono text-[#8a6d2b] font-bold">{reg.quota} Kuota</span>
              <span className="text-[#b8941e] font-mono">({reg.ready}% Siap)</span>
            </span>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. 3 PILAR UTAMA SISTEM (TABBED SHOWCASE & DIAGRAM)
          ========================================================================= */}
      <section id="pilar" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-[#8a6d2b]">
            ARSITEKTUR SATU PINTU TERPADU
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1410]">
            3 Pilar Layanan Komando SIAP HAJI PAPUA
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Menghubungkan pemangku kepentingan haji dari level warga, dokter pemeriksa, hingga pimpinan komando dalam satu ekosistem.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex justify-center mt-8 overflow-x-auto px-4 pb-2">
          <div className="inline-flex gap-2 p-1.5 rounded-2xl bg-stone-100 border border-[#e8dfc8] shadow-2xs shrink-0">
            <button
              onClick={() => setActiveTab('eksekutif')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'eksekutif'
                  ? 'btn-kemenhaj-primary text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/80'
              }`}
            >
              <Tv className="w-4 h-4 text-white" /> Command Center Pimpinan
            </button>
            <button
              onClick={() => setActiveTab('medis')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'medis'
                  ? 'btn-kemenhaj-primary text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/80'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-400" /> Tim Medis & Petugas Wilayah
            </button>
            <button
              onClick={() => setActiveTab('jamaah')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'jamaah'
                  ? 'btn-kemenhaj-primary text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/80'
              }`}
            >
              <QrCode className="w-4 h-4 text-[#c9a961]" /> Portal Warga / Jamaah
            </button>
          </div>
        </div>

          {/* Tab Content Display */}
          <div className="mt-10">
            {activeTab === 'eksekutif' && (
              <div className="grid lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-[#e8dfc8] shadow-sm text-stone-800">
                <div className="lg:col-span-6 space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-[#8a6d2b] uppercase tracking-wider block">
                    PILAR 1 • EXECUTIVE COMMAND CENTER
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#1A1410]">
                    Pusat Kendali Pengambilan Keputusan Kakanwil & Forkopimda
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Menyajikan ringkasan strategis 11 kabupaten/kota secara real-time. Dilengkapi <strong>Early Warning Engine</strong> untuk mendeteksi potensi keterlambatan paspor atau pelunasan BPIH, serta <strong>Mode Video Wall NOC</strong> untuk display layar besar aula komando.
                  </p>
                  <ul className="space-y-2 text-xs text-stone-600 pt-2 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#b8941e]" /> Indeks Kesiapan Gabungan Dokumen, Medis, Manasik, dan Kloter
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#b8941e]" /> Ekspor Laporan Resmi Kedinasan (Format PDF & Excel Kementerian Haji dan Umrah Papua)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#b8941e]" /> Decision Support System (DSS) Simulasi Alokasi Kuota Cadangan
                    </li>
                  </ul>
                  <div className="pt-3">
                    <Link
                      href="/dashboard"
                      className="btn-kemenhaj-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Buka Command Center <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-6 bg-[#1A1410] text-white rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
                    <span className="text-stone-400">MODUL TERSEDIA:</span>
                    <span className="text-[#c9a961]">7 FITUR UTAMA</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <strong className="block text-white">Action Center</strong>
                      <span className="text-[10px] text-stone-400">65 Tindakan Prioritas</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <strong className="block text-white">Early Warning Engine</strong>
                      <span className="text-[10px] text-stone-400">Deteksi Risiko Dini</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <strong className="block text-white">Peta Spasial Papua</strong>
                      <span className="text-[10px] text-stone-400">11 Wilayah Definitif</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <strong className="block text-white">Laporan & Rekap Resmi</strong>
                      <span className="text-[10px] text-stone-400">Kop Surat Kedinasan</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medis' && (
              <div className="grid lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-rose-200 shadow-sm text-stone-800">
                <div className="lg:col-span-6 space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider block">
                    PILAR 2 • TIM MEDIS & OPERASIONAL TAHAPAN
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                    Verifikasi Kesehatan, Paspor, & BPIH Tanpa Hambatan
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Ruang kerja khusus bagi <strong>Dokter RSUD/BKKP</strong> untuk menetapkan status Istitha&apos;ah kesehatan, pemantauan jamaah risiko tinggi (Risti), kelengkapan vaksinasi Meningitis/Polio, serta verifikasi paspor dan administrasi pelunasan Bank BPS-BPIH.
                  </p>
                  <ul className="space-y-2 text-xs text-stone-600 pt-2 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600" /> Penilaian Istitha&apos;ah Medis & Rekomendasi Kelayakan Terbang
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600" /> Skrining 17 Jamaah Risiko Tinggi (Risti) di Seluruh Papua
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-rose-600" /> Manajemen Penempatan Rombongan & Manifest Kloter Penerbangan
                    </li>
                  </ul>
                  <div className="pt-3">
                    <button
                      onClick={() => handleQuickLogin('petugaskesehatan', '/kesehatan')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all cursor-pointer shadow-md shadow-rose-600/20"
                    >
                      Login Sebagai Petugas Medis <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-6 bg-[#1A1410] text-white rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
                    <span className="text-stone-400">STATUS MONITORING KESEHATAN:</span>
                    <span className="text-rose-400">92.5% SELESAI</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                      <div>
                        <strong className="text-white">Memenuhi Syarat Istitha&apos;ah</strong>
                        <p className="text-[10px] text-stone-400">Laboratorium & EKG Clear</p>
                      </div>
                      <span className="text-[#c9a961] font-mono font-bold">148 Jamaah</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                      <div>
                        <strong className="text-white">Dengan Pendampingan / Risti</strong>
                        <p className="text-[10px] text-stone-400">Hipertensi / DM Terkontrol</p>
                      </div>
                      <span className="text-amber-400 font-mono font-bold">17 Jamaah</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                      <div>
                        <strong className="text-white">Vaksinasi Meningitis & Polio</strong>
                        <p className="text-[10px] text-stone-400">Sertifikat Vaksin Internasional (ICV)</p>
                      </div>
                      <span className="text-[#c9a961] font-mono font-bold">100% Lengkap</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jamaah' && (
              <div className="grid lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-[#e8dfc8] shadow-sm text-stone-800">
                <div className="lg:col-span-6 space-y-4 text-left">
                  <span className="text-xs font-mono font-bold text-[#8a6d2b] uppercase tracking-wider block">
                    PILAR 3 • PORTAL WARGA & CALON JAMAAH
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#1A1410]">
                    Transparansi Antrean & Estimasi Keberangkatan Terbuka
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Layanan terbuka bagi masyarakat dan calon jamaah Papua untuk mengecek porsi pendaftaran secara mandiri, melihat estimasi tahun keberangkatan, rincian komponen kesiapan, dan info jadwal kloter.
                  </p>
                  <ul className="space-y-2 text-xs text-stone-600 pt-2 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#b8941e]" /> Cek Estimasi Nomor Porsi Resmi Berbasis SISKOHAT
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#b8941e]" /> Akses Mandiri Status Verifikasi Paspor & Biometrik Visa
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#b8941e]" /> Transparan, Akuntabel, dan Bebas Biaya Tambahan
                    </li>
                  </ul>
                  <div className="pt-3">
                    <Link
                      href="/cek-porsi"
                      className="btn-kemenhaj-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Buka Portal Cek Porsi <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-6 bg-[#1A1410] text-white rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
                    <span className="text-stone-400">SIMULASI NOMOR PORSI:</span>
                    <span className="text-[#c9a961]">DEMO ONLINE</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-400">Contoh Nomor Porsi:</span>
                      <strong className="font-mono text-[#c9a961]">3100089201</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-400">Nama Jamaah:</span>
                      <strong className="text-white">H. Bambang Sugiarto</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-400">Asal Wilayah:</span>
                      <strong className="text-white">Kota Jayapura</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-400">Status Keberangkatan:</span>
                      <span className="text-[#8a6d2b] font-bold bg-[#fbf8ee] border border-[#e8dfc8] px-2 py-0.5 rounded">SIAP BERANGKAT 1447H</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      {/* =========================================================================
          6. ANIMATED SVG FLOW DIAGRAM (ALUR DATA JAMAAH DARI PAPUA KE ARAB SAUDI)
          ========================================================================= */}
      <section id="alur" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-[#8a6d2b]">
            ALUR KERJA TERPADU
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1410]">
            Perjalanan Data & Layanan Jamaah Haji Papua
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Diagram integrasi end-to-end dari pendaftaran di pelosok wilayah hingga keberangkatan via Embarkasi Makassar.
          </p>
        </div>

        {/* 5 Connected Step Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-12 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8dfc8] hover:border-[#c9a961] shadow-xs relative space-y-2 transition-all">
            <span className="w-8 h-8 rounded-full bg-[#fbf8ee] border border-[#e8dfc8] text-[#8a6d2b] font-mono font-bold text-xs flex items-center justify-center">
              01
            </span>
            <strong className="block text-sm text-stone-900 font-bold">Kantor Kementerian Haji dan Umrah Kab/Kota</strong>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Pendaftaran porsi, validasi berkas fisik KTP/KK, dan penyerahan SPPH.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8dfc8] hover:border-rose-300 shadow-xs relative space-y-2 transition-all">
            <span className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-mono font-bold text-xs flex items-center justify-center">
              02
            </span>
            <strong className="block text-sm text-stone-900 font-bold">RSUD & Dinkes Papua</strong>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Pemeriksaan laboratorium, penetapan status Istitha&apos;ah, dan vaksinasi ICV.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8dfc8] hover:border-amber-300 shadow-xs relative space-y-2 transition-all">
            <span className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-mono font-bold text-xs flex items-center justify-center">
              03
            </span>
            <strong className="block text-sm text-stone-900 font-bold">Kanwil Kemenhaj Prov</strong>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Verifikasi paspor RI (3 kata nama), sinkronisasi bio visa & rekonsiliasi BPIH.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8dfc8] hover:border-[#c9a961] shadow-xs relative space-y-2 transition-all">
            <span className="w-8 h-8 rounded-full bg-[#fbf8ee] border border-[#e8dfc8] text-[#8a6d2b] font-mono font-bold text-xs flex items-center justify-center">
              04
            </span>
            <strong className="block text-sm text-stone-900 font-bold">Asrama Sudiang (UPG)</strong>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Konsentrasi 4 Kloter Papua, pemeriksaan imigrasi akhir, dan pembagian gelang identitas.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8dfc8] hover:border-[#c9a961] shadow-xs relative space-y-2 transition-all">
            <span className="w-8 h-8 rounded-full bg-[#fbf8ee] border border-[#e8dfc8] text-[#8a6d2b] font-mono font-bold text-xs flex items-center justify-center">
              05
            </span>
            <strong className="block text-sm text-stone-900 font-bold">Kemenhaj RI (haji.go.id)</strong>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Integrasi SISKOHAT Pusat (haji.go.id), smart card Nusuk, serta penerbangan langsung Jeddah/Madinah.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. 11 WILAYAH KABUPATEN/KOTA PENYELENGGARA HAJI PAPUA
          ========================================================================= */}
      <section id="wilayah" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-[#8a6d2b]">
              DISTRIBUSI LOGISTIK EMBARKASI
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1410] mt-1">
              11 Wilayah Kerja Penyelenggara Haji Papua
            </h2>
          </div>
          <Link
            href="/monitoring/peta-wilayah"
            className="text-xs font-bold text-[#8a6d2b] hover:text-[#b8941e] flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            Buka Peta Geospasial Interaktif <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {officialRegencies.map((reg) => (
            <div
              key={reg.code}
              className="p-5 rounded-2xl bg-white border border-[#e8dfc8] hover:border-[#c9a961] hover:shadow-md transition-all text-left space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#8a6d2b] uppercase">{reg.code}</span>
                  <h4 className="text-base font-bold text-[#1A1410]">{reg.name}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]">
                  {reg.ready}% Siap
                </span>
              </div>
              <div className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-500">Alokasi Kuota:</span>
                  <strong className="text-stone-900 font-mono">{reg.quota} Jamaah</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Titik Transit:</span>
                  <span className="text-stone-700 truncate max-w-[160px]">{reg.hub}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Karakter:</span>
                  <span className="text-stone-600 text-[11px] truncate max-w-[160px]">{reg.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. DIRECT 1-CLICK DEMO LOGIN (INSTANT ACCESS)
          ========================================================================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="p-8 rounded-3xl border border-[#e8dfc8] bg-white shadow-md text-center space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-[#8a6d2b] uppercase tracking-wider block mb-1">
              AKSES CEPAT DEMO SISTEM • 1-CLICK INSTANT LOGIN
            </span>
            <h3 className="text-2xl font-black text-[#1A1410]">
              Pilih Peran Pengguna untuk Menguji Sistem Langsung
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-lg mx-auto">
              Klik salah satu akun di bawah ini untuk langsung masuk ke modul operasional tanpa mengetik password manual.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <button
              onClick={() => handleQuickLogin('superadmin', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white hover:bg-[#fbf8ee] border border-[#e8dfc8] hover:border-[#c9a961] text-left transition-all cursor-pointer group disabled:opacity-50 shadow-2xs"
            >
              <strong className="block text-xs font-bold text-[#1A1410] group-hover:text-[#8a6d2b]">
                Super Admin
              </strong>
              <span className="text-[10px] text-stone-500">Akses Penuh Seluruh Sistem</span>
            </button>

            <button
              onClick={() => handleQuickLogin('pimpinan', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white hover:bg-[#fbf8ee] border border-[#e8dfc8] hover:border-[#c9a961] text-left transition-all cursor-pointer group disabled:opacity-50 shadow-2xs"
            >
              <strong className="block text-xs font-bold text-[#1A1410] group-hover:text-[#8a6d2b]">
                Pimpinan Wilayah
              </strong>
              <span className="text-[10px] text-stone-500">Executive Read-Only Monitor</span>
            </button>

            <button
              onClick={() => handleQuickLogin('petugaskesehatan', '/kesehatan')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100/70 border border-rose-200 hover:border-rose-300 text-left transition-all cursor-pointer group disabled:opacity-50 shadow-2xs"
            >
              <strong className="block text-xs font-bold text-rose-700 group-hover:text-rose-900">
                Petugas Kesehatan
              </strong>
              <span className="text-[10px] text-rose-600">Tim Medis & Istitha&apos;ah RSUD</span>
            </button>

            <button
              onClick={() => handleQuickLogin('adminprov', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white hover:bg-[#fbf8ee] border border-[#e8dfc8] hover:border-[#c9a961] text-left transition-all cursor-pointer group disabled:opacity-50 shadow-2xs"
            >
              <strong className="block text-xs font-bold text-[#1A1410] group-hover:text-[#8a6d2b]">
                Admin Provinsi
              </strong>
              <span className="text-[10px] text-stone-500">Operasional Tahapan Wilayah</span>
            </button>

            <button
              onClick={() => handleQuickLogin('adminkotajpr', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white hover:bg-[#fbf8ee] border border-[#e8dfc8] hover:border-[#c9a961] text-left transition-all cursor-pointer group disabled:opacity-50 shadow-2xs"
            >
              <strong className="block text-xs font-bold text-[#1A1410] group-hover:text-[#8a6d2b]">
                Admin Kota Jayapura
              </strong>
              <span className="text-[10px] text-stone-500">Scoped: Kota Jayapura</span>
            </button>

            <button
              onClick={() => handleQuickLogin('petugaskloter', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white hover:bg-[#fbf8ee] border border-[#e8dfc8] hover:border-[#c9a961] text-left transition-all cursor-pointer group disabled:opacity-50 shadow-2xs"
            >
              <strong className="block text-xs font-bold text-[#1A1410] group-hover:text-[#8a6d2b]">
                Petugas Kloter
              </strong>
              <span className="text-[10px] text-stone-500">Scoped: Kloter 01 Papua</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. OFFICIAL KEMENHAJ PAPUA FOOTER
          ========================================================================= */}
      <footer className="relative z-10 border-t border-white/10 bg-[#1A1410] pt-12 pb-8 mt-12 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span>SIAP <span className="text-[#b8941e]">HAJI</span> PAPUA</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-xs">
              Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji Provinsi Papua. Mewujudkan tata kelola haji yang profesional, transparan, dan terpercaya.
            </p>
            <p className="text-[#c9a961] font-mono text-[11px]">
              Motto: Ikhlas Beramal • Haji Papua Siap 2026
            </p>
          </div>

          <div className="space-y-2">
            <strong className="block text-white text-xs uppercase font-mono tracking-wider">
              Kontak Satuan Kerja Resmi:
            </strong>
            <p><strong className="text-white">Kementerian Haji dan Umrah Wilayah Provinsi Papua</strong></p>
            <p>Bidang Penyelenggaraan Haji dan Umrah (PHU)</p>
            <p>Jl. Raya Abepura, Entrop, Distrik Jayapura Selatan, Kota Jayapura, Papua 99224</p>
            <p>Telepon: (0967) 537427 • Portal: haji.go.id</p>
          </div>

          <div className="space-y-2">
            <strong className="block text-white text-xs uppercase font-mono tracking-wider">
              Tautan Layanan Resmi:
            </strong>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://haji.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#c9a961] hover:text-white transition-colors flex items-center gap-1.5 font-bold"
                >
                  • Portal Kementerian Haji & Umrah RI (haji.go.id)
                  <ArrowUpRight className="w-3 h-3 text-[#c9a961]" />
                </a>
              </li>
              <li>
                <Link href="/cek-porsi" className="hover:text-[#c9a961] transition-colors">
                  • Portal Cek Estimasi Porsi Mandiri
                </Link>
              </li>
              <li>
                <Link href="/video-wall" className="hover:text-[#c9a961] transition-colors">
                  • Mode Video Wall NOC Aula Komando
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#c9a961] transition-colors">
                  • Login Petugas & Administrator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <span>
            © 2026 Kementerian Haji dan Umrah RI Wilayah Papua • Terintegrasi Vertikal dengan haji.go.id. Hak Cipta Dilindungi.
          </span>
          <span className="font-mono text-[#c9a961]">
            SIAP HAJI PAPUA • v1.0 ENTERPRISE
          </span>
        </div>
      </footer>
    </div>
  );
}
