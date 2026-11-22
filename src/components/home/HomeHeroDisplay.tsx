'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Tv,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Sparkles,
  Megaphone,
  QrCode,
  ShieldAlert,
  HeartPulse,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { KabupatenRadarSlider } from './KabupatenRadarSlider';
import type { PromotionSlide } from '@/application/services/promotion.service';

const DEFAULT_PROMOS: PromotionSlide[] = [
  {
    id: 'bipih-1448',
    kategori: 'Pengumuman • Kemenhaj Papua',
    judul: 'Pelunasan Bipih Reguler 1448 H / 2027 M',
    ringkas:
      'Tahap pertama pelunasan berlangsung 10 November – 10 Desember 2026. Pastikan status istithaah kesehatan terpenuhi dan BPJS Kesehatan aktif sebelum melakukan pelunasan di BPS BPIH.',
    sumber: 'papua.haji.go.id',
    url: 'https://papua.haji.go.id',
    gambar: '/logo-kemenhaj.png',
    targetChannel: 'ALL',
    isActive: true,
    priority: 1,
    runningText: 'Pelunasan Bipih Tahap 1 dibuka s.d 10 Desember 2026. Lakukan pelunasan di Bank Penerima Setoran (BPS BPIH).',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'edukasi-istithaah',
    kategori: 'Layanan Medis & Kesehatan',
    judul: 'Pemeriksaan Kesehatan & Syarat Istitha’ah Calon Jamaah Haji',
    ringkas:
      'Pemeriksaan kesehatan haji di seluruh Puskesmas & RSUD rujukan Papua telah dibuka. Penetapan Istithaah Kesehatan adalah syarat wajib sebelum pelunasan biaya haji.',
    sumber: 'Dinkes & Kemenhaj Papua',
    url: '/kesehatan',
    gambar: '',
    targetChannel: 'ALL',
    isActive: true,
    priority: 2,
    runningText: 'Pemeriksaan kesehatan haji terpadu di 18 Kabupaten/Kota se-Papua bebas biaya retribusi dasar di Puskesmas.',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'waspada-penipuan-visa',
    kategori: 'Edukasi & Perlindungan Jamaah',
    judul: 'Waspada Tawaran Haji Cepat Tanpa Antre & Visa Non-Resmi',
    ringkas:
      'Kemenhaj Papua mengimbau seluruh warga waspada terhadap penipuan berkedok haji furoda menggunakan visa kerja atau turis. Pastikan izin resmi travel berizin PPIU/PIHK.',
    sumber: 'Humas Kemenhaj Papua',
    url: '/cek-porsi',
    gambar: '',
    targetChannel: 'ALL',
    isActive: true,
    priority: 3,
    runningText: 'Jangan tergiur haji tanpa antre! Laporkan travel haji/umrah tak berizin ke Helpdesk Kemenhaj Papua.',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'bimbingan-manasik-papua',
    kategori: 'Bimbingan & Manasik',
    judul: 'Jadwal Bimbingan Manasik Haji Sepanjang Tahun di Kab/Kota',
    ringkas:
      'Kanwil Kemenhaj menyelenggarakan bimbingan manasik intensif di KUA Kecamatan se-Papua untuk kemandirian ibadah jamaah tanah Papua.',
    sumber: 'Bidang PHU Papua',
    url: '/manasik',
    gambar: '',
    targetChannel: 'ALL',
    isActive: true,
    priority: 4,
    runningText: 'Bimbingan manasik haji berkala dilaksanakan di KUA Kecamatan terdekat Anda.',
    createdAt: '',
    updatedAt: '',
  },
];

export function HomeHeroDisplay() {
  const [activeTab, setActiveTab] = useState<'PROMOTIONS' | 'RADAR'>('PROMOTIONS');
  const [promos, setPromos] = useState<PromotionSlide[]>(DEFAULT_PROMOS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch dynamic promotions from API (auto-updated by Admin Kemenhaj)
  useEffect(() => {
    async function loadPromos() {
      try {
        const res = await fetch('/api/promotions?channel=WEB&active=true');
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPromos(json.data);
        }
      } catch (err) {
        console.warn('Fallback to default promo slides:', err);
      }
    }
    loadPromos();
  }, []);

  // Auto-play timer for promotions slide (6.5s per slide)
  useEffect(() => {
    if (!isAutoPlay || activeTab !== 'PROMOTIONS' || promos.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % promos.length);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlay, activeTab, promos.length]);

  const currentPromo = promos[currentIdx] || promos[0] || DEFAULT_PROMOS[0];

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % promos.length);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + promos.length) % promos.length);
  };

  return (
    <div className="relative">
      {/* Top Mode Tabs */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="inline-flex p-1 rounded-2xl bg-black/40 backdrop-blur-md border border-[#c9a961]/40 shadow-lg">
          <button
            onClick={() => setActiveTab('PROMOTIONS')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PROMOTIONS'
                ? 'bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-[#1A1410] shadow-md'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Slide Promosi &amp; Layanan</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('RADAR')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'RADAR'
                ? 'bg-[#c9a961] text-[#1A1410] shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Radar 18 Kab/Kota</span>
          </button>
        </div>

        <Link
          href="/video-wall"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#c9a961] hover:underline"
        >
          <span>Layar Full TV</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* CONTENT AREA */}
      {activeTab === 'RADAR' ? (
        <KabupatenRadarSlider />
      ) : (
        /* =========================================================================
           TV DIGITAL SIGNAGE PROMOTION SLIDER (HOTEL & PUBLIC OFFICE STYLE)
           ========================================================================= */
        <div
          className="relative rounded-3xl border border-[#c9a961]/40 bg-gradient-to-b from-[#14100D] via-[#1E1712] to-[#14100D] text-white p-5 sm:p-6 shadow-2xl backdrop-blur-xl select-none flex flex-col justify-between min-h-[440px]"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* 1. Header Display Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a961] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c9a961]"></span>
              </span>
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#c9a961] uppercase">
                MEDIA PROMOSI &amp; INFORMASI RESMI
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                title={isAutoPlay ? 'Jeda Slide Otomatis' : 'Putar Slide Otomatis'}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-[#c9a961] transition-colors cursor-pointer"
              >
                {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={prevSlide}
                title="Slide Sebelumnya"
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-gray-300 px-1">
                {currentIdx + 1} / {promos.length}
              </span>
              <button
                onClick={nextSlide}
                title="Slide Berikutnya"
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Main Slide Body (TV Style) */}
          <div className="py-3 flex-1 flex flex-col justify-center space-y-3">
            {/* Category Tag & Source */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/40">
                {currentPromo.kategori}
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                {currentPromo.sumber}
              </span>
            </div>

            {/* Media Image / Visual Flyer (if available) */}
            {currentPromo.gambar ? (
              <div className="w-full h-32 rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center p-2 relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={currentPromo.gambar}
                  src={currentPromo.gambar}
                  alt={currentPromo.judul}
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : null}

            {/* Headline */}
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug line-clamp-2 tracking-tight">
              {currentPromo.judul}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-3">
              {currentPromo.ringkas}
            </p>

            {/* Action CTA */}
            <div className="pt-1 flex items-center gap-2">
              {currentPromo.url.startsWith('http') ? (
                <a
                  href={currentPromo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-[#1A1410] hover:brightness-110 shadow-sm transition-all"
                >
                  <span>Buka Informasi Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  href={currentPromo.url || '/cek-porsi'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-[#1A1410] hover:brightness-110 shadow-sm transition-all"
                >
                  <span>Buka Layanan Terkait</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

              <Link
                href="/informasi-resmi"
                className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
              >
                Semua Informasi
              </Link>
            </div>
          </div>

          {/* 3. Bottom Running Ticker & Dot Indicators */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            {/* Ticker marquee */}
            {currentPromo.runningText ? (
              <div className="flex items-center gap-2 overflow-hidden bg-black/40 px-2.5 py-1 rounded-lg border border-white/5 text-[11px] text-stone-300">
                <Megaphone className="w-3 h-3 text-[#c9a961] shrink-0" />
                <span className="truncate">{currentPromo.runningText}</span>
              </div>
            ) : null}

            {/* Dots */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                {promos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === currentIdx ? 'w-6 bg-[#c9a961]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-stone-400 font-mono">
                Kanwil Kemenhaj Papua
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
