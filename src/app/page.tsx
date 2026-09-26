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
} from 'lucide-react';

export default function ShowcaseLandingPage() {
  const [activeTab, setActiveTab] = useState<'eksekutif' | 'medis' | 'jamaah'>('eksekutif');
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

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
    { code: 'REG-JPR-KOTA', name: 'Kota Jayapura', quota: 420, ready: 97.5, type: 'Ibukota Provinsi / Pesisir Youtefa', hub: 'Bandara Sentani (DJJ)' },
    { code: 'REG-JPR-KAB', name: 'Kab. Jayapura', quota: 210, ready: 96.2, type: 'Daratan Utama / Danau Sentani', hub: 'Bandara Sentani (DJJ)' },
    { code: 'REG-BIAK', name: 'Kab. Biak Numfor', quota: 140, ready: 95.8, type: 'Kepulauan Teluk Cenderawasih', hub: 'Bandara Frans Kaisiepo (BIK)' },
    { code: 'REG-KEEROM', name: 'Kab. Keerom', quota: 95, ready: 94.4, type: 'Perbatasan RI - PNG (Waris/Arso)', hub: 'Transit Jayapura -> Sentani' },
    { code: 'REG-SARMI', name: 'Kab. Sarmi', quota: 65, ready: 93.1, type: 'Pesisir Samudra Pasifik', hub: 'Trans-Papua -> Sentani' },
    { code: 'REG-YAPEN', name: 'Kab. Kepulauan Yapen', quota: 50, ready: 92.5, type: 'Gugusan Kepulauan Serui', hub: 'Pelabuhan Serui -> Biak' },
    { code: 'REG-MAMB-RAYA', name: 'Kab. Mamberamo Raya', quota: 36, ready: 91.0, type: 'DAS Sungai Mamberamo (Burmeso)', hub: 'Perintis Kasonaweja -> DJJ' },
    { code: 'REG-SUPIORI', name: 'Kab. Supiori', quota: 32, ready: 90.5, type: 'Gugusan Kepulauan Sorendiweri', hub: 'Transit Biak -> BIK' },
    { code: 'REG-WAROPEN', name: 'Kab. Waropen', quota: 28, ready: 89.8, type: 'Pesisir Bakau Botawa', hub: 'Speedboat -> Serui/Biak' },
  ];

  return (
    <div className="relative min-h-screen bg-[#040D0A] text-slate-100 overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* =========================================================================
          1. FUTURISTIC AMBIENT BACKGROUND & TWINKLE STARFIELD
          ========================================================================= */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.2); }
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
          background: #D4AF37;
          box-shadow: 0 0 8px 2px rgba(212, 175, 55, 0.8);
          animation-name: twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>

      {/* Ambient Lighting Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-emerald-700/20 blur-[150px]" />
        <div className="absolute top-1/3 -right-20 h-[30rem] w-[30rem] rounded-full bg-[#D4AF37]/15 blur-[160px]" />
        <div className="absolute -bottom-20 left-10 h-[32rem] w-[32rem] rounded-full bg-emerald-900/25 blur-[150px]" />
        {/* Cyber Grid with Fade Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.06)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)]" />
        {/* Twinkling Starfield */}
        <span className="twinkle-dot" style={{ left: '8%', top: '15%', animationDuration: '3.2s', animationDelay: '0.2s' }} />
        <span className="twinkle-dot" style={{ left: '18%', top: '35%', animationDuration: '4.5s', animationDelay: '1.1s' }} />
        <span className="twinkle-dot" style={{ left: '29%', top: '12%', animationDuration: '2.8s', animationDelay: '0.5s' }} />
        <span className="twinkle-dot" style={{ left: '42%', top: '24%', animationDuration: '3.6s', animationDelay: '1.8s' }} />
        <span className="twinkle-dot" style={{ left: '55%', top: '16%', animationDuration: '4.1s', animationDelay: '0.9s' }} />
        <span className="twinkle-dot" style={{ left: '68%', top: '32%', animationDuration: '3.0s', animationDelay: '2.2s' }} />
        <span className="twinkle-dot" style={{ left: '79%', top: '18%', animationDuration: '4.8s', animationDelay: '0.4s' }} />
        <span className="twinkle-dot" style={{ left: '88%', top: '40%', animationDuration: '3.4s', animationDelay: '1.5s' }} />
        <span className="twinkle-dot" style={{ left: '93%', top: '22%', animationDuration: '2.9s', animationDelay: '0.8s' }} />
        <span className="twinkle-dot" style={{ left: '14%', top: '75%', animationDuration: '3.9s', animationDelay: '2.4s' }} />
        <span className="twinkle-dot" style={{ left: '38%', top: '82%', animationDuration: '4.2s', animationDelay: '1.3s' }} />
        <span className="twinkle-dot" style={{ left: '65%', top: '88%', animationDuration: '3.5s', animationDelay: '0.7s' }} />
        <span className="twinkle-dot" style={{ left: '84%', top: '78%', animationDuration: '4.6s', animationDelay: '1.9s' }} />
      </div>

      {/* =========================================================================
          2. GLASSMORPHISM TOP NAVIGATION BAR (ADAPTED FROM SHOWCASE)
          ========================================================================= */}
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[#D4AF37]/30 bg-[#040D0A]/80 backdrop-blur-xl shadow-[0_0_30px_-10px_rgba(212,175,55,0.25)]">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950/80 p-1.5 border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center justify-center group-hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/branding/app-icon.png" alt="Logo Kemenag Papua" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                  SIAP <span className="text-[#D4AF37]">HAJI</span> PAPUA
                </span>
                <span className="hidden sm:inline-block bg-[#15803D]/40 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  1447 H / 2026 M
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Kanwil Kementerian Agama Provinsi Papua
              </p>
            </div>
          </Link>

          {/* Navigation Items with Monospace Labels */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <a href="#hero" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              Beranda
            </a>
            <a href="#pilar" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              3 Pilar Sistem
            </a>
            <a href="#alur" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              Alur Jamaah
            </a>
            <a href="#wilayah" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              9 Wilayah
            </a>
            <Link href="/cek-porsi" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 hover:text-white hover:bg-amber-500/20 transition-colors">
              Cek Porsi
            </Link>
            <Link href="/video-wall" className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-colors">
              Video Wall NOC
            </Link>
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/cek-porsi"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D4AF37]/50 bg-black/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-bold transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              Cek Porsi Mandiri
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0A3E2F] via-[#15803D] to-[#0A3E2F] text-white border border-[#D4AF37]/60 hover:border-[#D4AF37] text-xs font-extrabold shadow-[0_0_20px_rgba(21,128,61,0.5)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all hover:scale-[1.02]"
            >
              Masuk Command Center <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer for Fixed Header */}
      <div className="h-24 sm:h-28" />

      {/* =========================================================================
          3. HERO SECTION (WITH 3D COMMAND HOLOGRAM CARD & STAT COUNTERS)
          ========================================================================= */}
      <section id="hero" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              SISTEM INFORMASI & MONITORING HAJI PROVINSI PAPUA
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
              Satu Data • Satu Monitoring • Satu Layanan.{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-[#D4AF37] to-amber-200 bg-clip-text text-transparent block mt-1">
                Haji Papua Siap 2026 M.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Platform komando digital terintegrasi <strong>Kantor Wilayah Kementerian Agama Provinsi Papua</strong> untuk pemantauan real-time kesiapan administrasi, bio visa, penetapan istitha&apos;ah medis RSUD, dan alokasi 4 Kloter jamaah di 9 Kabupaten/Kota.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#15803D] to-[#0A3E2F] border border-[#D4AF37] text-white text-sm font-black shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] transition-all hover:scale-[1.03]"
              >
                Masuk Command Center <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
              </Link>

              <Link
                href="/cek-porsi"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-bold backdrop-blur-lg transition-all"
              >
                <QrCode className="w-4 h-4 text-[#D4AF37]" /> Cek Porsi Warga
              </Link>

              <Link
                href="/video-wall"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 text-sm font-bold backdrop-blur-lg transition-all"
              >
                <Tv className="w-4 h-4 text-[#D4AF37]" /> Mode Video Wall NOC
              </Link>
            </div>

            {/* 3 Metric Stat Counters */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-xl">
              <div>
                <div className="text-2xl sm:text-4xl font-black font-mono text-white">9</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Kabupaten & Kota</div>
              </div>
              <div className="border-x border-white/10 px-4">
                <div className="text-2xl sm:text-4xl font-black font-mono text-[#D4AF37]">1.076</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Total Kuota Papua</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-black font-mono text-emerald-400">96.2%</div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Indeks Kesiapan</div>
              </div>
            </div>
          </div>

          {/* Right Column: Futuristic Interactive Command Hologram Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#15803D]/30 to-[#D4AF37]/20 blur-2xl opacity-70" />

            <div className="relative rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-b from-[#0A3E2F]/90 via-[#03150F]/95 to-slate-950 p-6 shadow-2xl backdrop-blur-xl">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                    LIVE COMMAND RADAR
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                  1447 H / 2026 M
                </span>
              </div>

              {/* Central Readiness Dial */}
              <div className="py-6 text-center space-y-2">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-4 border-emerald-500/20 border-t-[#D4AF37] border-r-emerald-400 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black font-mono text-white">96.2%</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Provincial Score</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">Kesiapan Keberangkatan Tinggi</h3>
                <p className="text-xs text-slate-300">
                  Konsentrasi Embarkasi Hasanuddin Makassar (UPG)
                </p>
              </div>

              {/* 4 Kloter Quick Manifest Snapshot */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-[11px] font-mono text-[#D4AF37] uppercase font-bold flex justify-between">
                  <span>Manifest 4 Kloter Papua:</span>
                  <span>450 Seat / Kloter</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Kloter 01 (UPG)</span>
                      <span className="text-emerald-400 font-mono">100%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">Kota & Kab. Jayapura</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Kloter 02 (UPG)</span>
                      <span className="text-emerald-400 font-mono">98%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">Biak & Supiori</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Kloter 03 (UPG)</span>
                      <span className="text-amber-300 font-mono">94%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">Keerom & Sarmi</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>Kloter 04 (UPG)</span>
                      <span className="text-emerald-400 font-mono">92%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">Yapen, Waropen, Mamb</p>
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SISKOHAT Terhubung
                </span>
                <span className="font-mono text-emerald-400">STATUS: SIAP OPERASIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. RUNNING MARQUEE TICKER (9 KABUPATEN/KOTA PAPUA)
          ========================================================================= */}
      <div className="relative overflow-hidden border-y border-[#D4AF37]/30 bg-black/50 py-3.5 z-10 backdrop-blur-md">
        <div className="animate-marquee gap-8 pr-8">
          {officialRegencies.map((reg) => (
            <span key={reg.code} className="flex items-center gap-2.5 whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              <strong>{reg.name}:</strong>
              <span className="font-mono text-white">{reg.quota} Kuota</span>
              <span className="text-emerald-400 font-mono">({reg.ready}% Siap)</span>
            </span>
          ))}
          {/* Repeat for seamless loop */}
          {officialRegencies.map((reg) => (
            <span key={`${reg.code}-dup`} className="flex items-center gap-2.5 whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <strong>{reg.name}:</strong>
              <span className="font-mono text-white">{reg.quota} Kuota</span>
              <span className="text-emerald-400 font-mono">({reg.ready}% Siap)</span>
            </span>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. 3 PILAR UTAMA SISTEM (TABBED SHOWCASE & DIAGRAM)
          ========================================================================= */}
      <section id="pilar" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            ARSITEKTUR SATU PINTU TERPADU
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            3 Pilar Layanan Komando SIAP HAJI PAPUA
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Menghubungkan pemangku kepentingan haji dari level warga, dokter pemeriksa, hingga pimpinan komando dalam satu ekosistem.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('eksekutif')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'eksekutif'
                  ? 'bg-gradient-to-r from-[#15803D] to-[#0A3E2F] text-white border border-[#D4AF37] shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4 text-[#D4AF37]" /> Command Center Pimpinan
            </button>
            <button
              onClick={() => setActiveTab('medis')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'medis'
                  ? 'bg-gradient-to-r from-[#15803D] to-[#0A3E2F] text-white border border-[#D4AF37] shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-400" /> Tim Medis & Petugas Wilayah
            </button>
            <button
              onClick={() => setActiveTab('jamaah')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'jamaah'
                  ? 'bg-gradient-to-r from-[#15803D] to-[#0A3E2F] text-white border border-[#D4AF37] shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-400" /> Portal Warga / Jamaah
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="mt-10">
          {activeTab === 'eksekutif' && (
            <div className="grid lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-slate-900/90 via-[#0A3E2F]/40 to-slate-950 p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider block">
                  PILAR 1 • EXECUTIVE COMMAND CENTER
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Pusat Kendali Pengambilan Keputusan Kakanwil & Forkopimda
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Menyajikan ringkasan strategis 9 kabupaten/kota secara real-time. Dilengkapi <strong>Early Warning Engine</strong> untuk mendeteksi potensi keterlambatan paspor atau pelunasan BPIH, serta <strong>Mode Video Wall NOC</strong> untuk display layar besar aula komando.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Indeks Kesiapan Gabungan Dokumen, Medis, Manasik, dan Kloter
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Ekspor Laporan Resmi Kedinasan (Format PDF & Excel Kemenag Papua)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Decision Support System (DSS) Simulasi Alokasi Kuota Cadangan
                  </li>
                </ul>
                <div className="pt-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A3E2F] border border-[#D4AF37] text-[#D4AF37] text-xs font-bold hover:bg-[#15803D] hover:text-white transition-all"
                  >
                    Buka Command Center <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-6 bg-black/60 rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
                  <span className="text-slate-400">MODUL TERSEDIA:</span>
                  <span className="text-[#D4AF37]">7 FITUR UTAMA</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <strong className="block text-white">Action Center</strong>
                    <span className="text-[10px] text-slate-400">65 Tindakan Prioritas</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <strong className="block text-white">Early Warning Engine</strong>
                    <span className="text-[10px] text-slate-400">Deteksi Risiko Dini</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <strong className="block text-white">Peta Spasial Papua</strong>
                    <span className="text-[10px] text-slate-400">9 Wilayah Definitif</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <strong className="block text-white">Laporan & Rekap Resmi</strong>
                    <span className="text-[10px] text-slate-400">Kop Surat Kedinasan</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medis' && (
            <div className="grid lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-slate-900/90 via-rose-950/30 to-slate-950 p-8 rounded-3xl border border-rose-500/30 shadow-2xl">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block">
                  PILAR 2 • TIM MEDIS & OPERASIONAL TAHAPAN
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Verifikasi Kesehatan, Paspor, & BPIH Tanpa Hambatan
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ruang kerja khusus bagi <strong>Dokter RSUD/BKKP</strong> untuk menetapkan status Istitha&apos;ah kesehatan, pemantauan jamaah risiko tinggi (Risti), kelengkapan vaksinasi Meningitis/Polio, serta verifikasi paspor dan administrasi pelunasan Bank BPS-BPIH.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-400" /> Penilaian Istitha&apos;ah Medis & Rekomendasi Kelayakan Terbang
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-400" /> Skrining 17 Jamaah Risiko Tinggi (Risti) di Seluruh Papua
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-400" /> Manajemen Penempatan Rombongan & Manifest Kloter Penerbangan
                  </li>
                </ul>
                <div className="pt-3">
                  <button
                    onClick={() => handleQuickLogin('petugaskesehatan', '/kesehatan')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all cursor-pointer shadow-lg shadow-rose-600/30"
                  >
                    Login Sebagai Petugas Medis <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="lg:col-span-6 bg-black/60 rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
                  <span className="text-slate-400">STATUS MONITORING KESEHATAN:</span>
                  <span className="text-rose-400">92.5% SELESAI</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Memenuhi Syarat Istitha&apos;ah</strong>
                      <p className="text-[10px] text-slate-400">Laboratorium & EKG Clear</p>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">148 Jamaah</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Dengan Pendampingan / Risti</strong>
                      <p className="text-[10px] text-slate-400">Hipertensi / DM Terkontrol</p>
                    </div>
                    <span className="text-amber-400 font-mono font-bold">17 Jamaah</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Vaksinasi Meningitis & Polio</strong>
                      <p className="text-[10px] text-slate-400">Sertifikat Vaksin Internasional (ICV)</p>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">100% Lengkap</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jamaah' && (
            <div className="grid lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-slate-900/90 via-emerald-950/40 to-slate-950 p-8 rounded-3xl border border-emerald-500/30 shadow-2xl">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  PILAR 3 • PORTAL WARGA & CALON JAMAAH
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Transparansi Antrean & Estimasi Keberangkatan Terbuka
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Layanan terbuka bagi masyarakat dan calon jamaah Papua untuk mengecek porsi pendaftaran secara mandiri, melihat estimasi tahun keberangkatan, rincian komponen kesiapan, dan info jadwal kloter.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cek Estimasi Nomor Porsi Resmi Berbasis SISKOHAT Kemenag
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Akses Mandiri Status Verifikasi Paspor & Biometrik Visa
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transparan, Akuntabel, dan Bebas Biaya Tambahan
                  </li>
                </ul>
                <div className="pt-3">
                  <Link
                    href="/cek-porsi"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/30"
                  >
                    Buka Portal Cek Porsi <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-6 bg-black/60 rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
                  <span className="text-slate-400">SIMULASI NOMOR PORSI:</span>
                  <span className="text-emerald-400">DEMO ONLINE</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Contoh Nomor Porsi:</span>
                    <strong className="font-mono text-[#D4AF37]">3100089201</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Nama Jamaah:</span>
                    <strong className="text-white">H. Bambang Sugiarto</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Asal Wilayah:</span>
                    <strong className="text-white">Kota Jayapura</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Status Keberangkatan:</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">SIAP BERANGKAT 1447H</span>
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
          <p className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            ALUR KERJA TERPADU
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Perjalanan Data & Layanan Jamaah Haji Papua
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Diagram integrasi end-to-end dari pendaftaran di pelosok wilayah hingga keberangkatan via Embarkasi Makassar.
          </p>
        </div>

        {/* 5 Connected Step Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-12 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative space-y-2 hover:border-[#D4AF37]/50 transition-colors">
            <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-mono font-bold text-xs flex items-center justify-center">
              01
            </span>
            <strong className="block text-sm text-white font-bold">Kemenag 9 Kab/Kota</strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pendaftaran porsi, validasi berkas fisik KTP/KK, dan penyerahan SPPH.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative space-y-2 hover:border-rose-400/50 transition-colors">
            <span className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400 text-rose-400 font-mono font-bold text-xs flex items-center justify-center">
              02
            </span>
            <strong className="block text-sm text-white font-bold">RSUD & Dinkes Papua</strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pemeriksaan laboratorium, penetapan status Istitha&apos;ah, dan vaksinasi ICV.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative space-y-2 hover:border-amber-400/50 transition-colors">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
              03
            </span>
            <strong className="block text-sm text-white font-bold">Kanwil Kemenag Prov</strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verifikasi paspor RI (3 kata nama), sinkronisasi bio visa & rekonsiliasi BPIH.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative space-y-2 hover:border-emerald-400/50 transition-colors">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
              04
            </span>
            <strong className="block text-sm text-white font-bold">Asrama Sudiang (UPG)</strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Konsentrasi 4 Kloter Papua, pemeriksaan imigrasi akhir, dan pembagian gelang identitas.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative space-y-2 hover:border-[#D4AF37]/50 transition-colors">
            <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-mono font-bold text-xs flex items-center justify-center">
              05
            </span>
            <strong className="block text-sm text-white font-bold">Jeddah / Madinah</strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Penerbangan langsung Garuda/Saudia menuju Tanah Suci dengan pengawalan petugas kloter.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. 9 WILAYAH KABUPATEN/KOTA DEFINITIF PAPUA
          ========================================================================= */}
      <section id="wilayah" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              DISTRIBUSI LOGISTIK EMBARKASI
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              9 Wilayah Kerja Penyelenggara Haji Papua
            </h2>
          </div>
          <Link
            href="/monitoring/peta-wilayah"
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Buka Peta Geospasial Interaktif <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {officialRegencies.map((reg) => (
            <div
              key={reg.code}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/10 transition-all text-left space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase">{reg.code}</span>
                  <h4 className="text-base font-bold text-white">{reg.name}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {reg.ready}% Siap
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-white/10">
                <div className="flex justify-between">
                  <span className="text-slate-400">Alokasi Kuota:</span>
                  <strong className="text-white font-mono">{reg.quota} Jamaah</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Titik Transit:</span>
                  <span className="text-slate-200 truncate max-w-[160px]">{reg.hub}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Karakter:</span>
                  <span className="text-slate-300 text-[11px] truncate max-w-[160px]">{reg.type}</span>
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
        <div className="p-8 rounded-3xl border border-[#D4AF37]/50 bg-gradient-to-r from-emerald-950/80 via-[#0A3E2F]/90 to-emerald-950/80 shadow-[0_0_50px_rgba(212,175,55,0.2)] backdrop-blur-xl text-center space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
              AKSES CEPAT DEMO SISTEM • 1-CLICK INSTANT LOGIN
            </span>
            <h3 className="text-2xl font-black text-white">
              Pilih Peran Pengguna untuk Menguji Sistem Langsung
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto">
              Klik salah satu akun di bawah ini untuk langsung masuk ke modul operasional tanpa mengetik password manual.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <button
              onClick={() => handleQuickLogin('superadmin', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <strong className="block text-xs font-bold text-white group-hover:text-[#D4AF37]">
                Super Admin
              </strong>
              <span className="text-[10px] text-slate-400">Akses Penuh Seluruh Sistem</span>
            </button>

            <button
              onClick={() => handleQuickLogin('pimpinan', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <strong className="block text-xs font-bold text-white group-hover:text-[#D4AF37]">
                Pimpinan Kanwil
              </strong>
              <span className="text-[10px] text-slate-400">Executive Read-Only Monitor</span>
            </button>

            <button
              onClick={() => handleQuickLogin('petugaskesehatan', '/kesehatan')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <strong className="block text-xs font-bold text-rose-300 group-hover:text-white">
                Petugas Kesehatan
              </strong>
              <span className="text-[10px] text-slate-400">Tim Medis & Istitha&apos;ah RSUD</span>
            </button>

            <button
              onClick={() => handleQuickLogin('adminprov', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <strong className="block text-xs font-bold text-white group-hover:text-[#D4AF37]">
                Admin Provinsi
              </strong>
              <span className="text-[10px] text-slate-400">Operasional Tahapan Kanwil</span>
            </button>

            <button
              onClick={() => handleQuickLogin('adminkotajpr', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <strong className="block text-xs font-bold text-white group-hover:text-[#D4AF37]">
                Admin Kota Jayapura
              </strong>
              <span className="text-[10px] text-slate-400">Scoped: Kota Jayapura</span>
            </button>

            <button
              onClick={() => handleQuickLogin('petugaskloter', '/dashboard')}
              disabled={isLoggingIn !== null}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <strong className="block text-xs font-bold text-white group-hover:text-[#D4AF37]">
                Petugas Kloter
              </strong>
              <span className="text-[10px] text-slate-400">Scoped: Kloter 01 Papua</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. OFFICIAL KEMENAG PAPUA FOOTER
          ========================================================================= */}
      <footer className="relative z-10 border-t border-white/10 bg-black/60 pt-12 pb-8 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="text-[#D4AF37]">SIAP HAJI PAPUA</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji Provinsi Papua. Mewujudkan tata kelola haji yang profesional, transparan, dan terpercaya.
            </p>
            <p className="text-emerald-400 font-mono text-[11px]">
              Motto: Ikhlas Beramal • Haji Papua Siap
            </p>
          </div>

          <div className="space-y-2">
            <strong className="block text-white text-xs uppercase font-mono tracking-wider">
              Kontak Satuan Kerja Resmi:
            </strong>
            <p><strong>Kantor Wilayah Kementerian Agama Provinsi Papua</strong></p>
            <p>Bidang Penyelenggaraan Haji dan Umrah (PHU)</p>
            <p>Jl. Raya Abepura, Entrop, Distrik Jayapura Selatan, Kota Jayapura, Papua 99224</p>
            <p>Telepon: (0967) 537427 • Email: kanwilpapua@kemenag.go.id</p>
          </div>

          <div className="space-y-2">
            <strong className="block text-white text-xs uppercase font-mono tracking-wider">
              Tautan Layanan:
            </strong>
            <ul className="space-y-1.5">
              <li>
                <Link href="/cek-porsi" className="hover:text-[#D4AF37] transition-colors">
                  • Portal Cek Estimasi Porsi Mandiri
                </Link>
              </li>
              <li>
                <Link href="/video-wall" className="hover:text-[#D4AF37] transition-colors">
                  • Mode Video Wall NOC Aula Komando
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#D4AF37] transition-colors">
                  • Login Petugas & Administrator
                </Link>
              </li>
              <li>
                <a href="https://papua.kemenag.go.id" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors">
                  • Portal Resmi Kanwil Kemenag Papua (papua.kemenag.go.id)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>
            © 2026 Kementerian Agama Republik Indonesia • Kanwil Provinsi Papua. Hak Cipta Dilindungi.
          </span>
          <span className="font-mono text-slate-400">
            SIAP HAJI PAPUA • v1.0 ENTERPRISE
          </span>
        </div>
      </footer>
    </div>
  );
}
