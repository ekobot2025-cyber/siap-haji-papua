'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Plane,
  Users,
  MapPin,
  Calendar,
  HeartPulse,
  Activity,
  Play,
  Pause,
  ExternalLink,
} from 'lucide-react';

export interface KabupatenRadarItem {
  id: string;
  name: string;
  rank: number;
  total: number;
  urut: number;
  lunasTunda: number;
  plansia: number;
  lansia65Plus: number;
  avgAge: number;
  kloter: string;
  transitHub: string;
  distance: string;
  karakter: string;
  readinessScore: number;
}

export const KABUPATEN_RADAR_DATA: KabupatenRadarItem[] = [
  {
    id: 'KOTA-JPR',
    name: 'Kota Jayapura',
    rank: 1,
    total: 295,
    urut: 270,
    lunasTunda: 11,
    plansia: 14,
    lansia65Plus: 60,
    avgAge: 53,
    kloter: 'Kloter 01 UPG (Seat Terpenuhi)',
    transitHub: 'Bandara Internasional Sentani (DJJ)',
    distance: '3.5 Jam Penerbangan Langsung ke Makassar',
    karakter: 'Pusat Komando & Hub Logistik Utama',
    readinessScore: 97.8,
  },
  {
    id: 'KAB-MMK',
    name: 'Kab. Mimika',
    rank: 2,
    total: 172,
    urut: 154,
    lunasTunda: 5,
    plansia: 13,
    lansia65Plus: 30,
    avgAge: 55,
    kloter: 'Kloter 04 UPG',
    transitHub: 'Bandara Mozes Kilangin Timika (TIM)',
    distance: '2.5 Jam Langsung ke Makassar (UPG)',
    karakter: 'Kota Industri Timika & Pesisir Laut Arafura',
    readinessScore: 96.0,
  },
  {
    id: 'KAB-MRK',
    name: 'Kab. Merauke',
    rank: 3,
    total: 124,
    urut: 117,
    lunasTunda: 0,
    plansia: 7,
    lansia65Plus: 25,
    avgAge: 56,
    kloter: 'Kloter 04 UPG',
    transitHub: 'Bandara Mopah Merauke (MKQ)',
    distance: '3.0 Jam Langsung ke Makassar (UPG)',
    karakter: 'Dataran Rendah Selatan / Ujung Timur NKRI',
    readinessScore: 95.2,
  },
  {
    id: 'KAB-JPR',
    name: 'Kab. Jayapura',
    rank: 4,
    total: 81,
    urut: 80,
    lunasTunda: 0,
    plansia: 1,
    lansia65Plus: 15,
    avgAge: 53,
    kloter: 'Kloter 01 UPG',
    transitHub: 'Bandara Internasional Sentani (DJJ)',
    distance: '3.5 Jam Penerbangan ke Makassar (UPG)',
    karakter: 'Kawasan Danau Sentani & Lembah Grime Nawa',
    readinessScore: 96.4,
  },
  {
    id: 'KAB-NBR',
    name: 'Kab. Nabire',
    rank: 5,
    total: 58,
    urut: 53,
    lunasTunda: 0,
    plansia: 5,
    lansia65Plus: 15,
    avgAge: 54,
    kloter: 'Kloter 03 UPG',
    transitHub: 'Bandara Douw Aturure Nabire (NBX)',
    distance: '2.5 Jam Penerbangan ke Makassar (UPG)',
    karakter: 'Hub Pesisir Teluk Cenderawasih Leher Burung',
    readinessScore: 94.0,
  },
  {
    id: 'KAB-BIAK',
    name: 'Kab. Biak Numfor',
    rank: 6,
    total: 52,
    urut: 50,
    lunasTunda: 0,
    plansia: 2,
    lansia65Plus: 14,
    avgAge: 57,
    kloter: 'Kloter 02 UPG',
    transitHub: 'Bandara Internasional Frans Kaisiepo (BIK)',
    distance: '2.5 Jam Langsung ke Makassar (UPG)',
    karakter: 'Hub Pasifik Utara & Kepulauan Biak',
    readinessScore: 95.8,
  },
  {
    id: 'KAB-JWY',
    name: 'Kab. Jayawijaya',
    rank: 7,
    total: 26,
    urut: 26,
    lunasTunda: 0,
    plansia: 0,
    lansia65Plus: 2,
    avgAge: 47,
    kloter: 'Kloter 03 UPG',
    transitHub: 'Bandara Wamena (WMX) -> Sentani',
    distance: 'Transit Perintis Wamena -> Sentani -> UPG',
    karakter: 'Lembah Baliem Pegunungan Tengah Papua',
    readinessScore: 91.8,
  },
  {
    id: 'KAB-BVD',
    name: 'Kab. Boven Digoel',
    rank: 8,
    total: 21,
    urut: 21,
    lunasTunda: 0,
    plansia: 0,
    lansia65Plus: 2,
    avgAge: 50,
    kloter: 'Kloter 04 UPG',
    transitHub: 'Bandara Tanah Merah (TMH) -> MKQ',
    distance: 'Transit Tanah Merah -> Merauke -> UPG',
    karakter: 'Pedalaman DAS Sungai Digoel Perbatasan RI-PNG',
    readinessScore: 92.0,
  },
  {
    id: 'KAB-YAPEN',
    name: 'Kab. Kepulauan Yapen',
    rank: 9,
    total: 21,
    urut: 21,
    lunasTunda: 0,
    plansia: 0,
    lansia65Plus: 0,
    avgAge: 51,
    kloter: 'Kloter 02 UPG',
    transitHub: 'Pelabuhan Serui / Bandara Serui -> Biak',
    distance: 'Transit Laut/Udara -> Biak -> UPG',
    karakter: 'Gugusan Kepulauan Serui Selat Yapen',
    readinessScore: 93.2,
  },
  {
    id: 'KAB-MAPPI',
    name: 'Kab. Mappi',
    rank: 10,
    total: 19,
    urut: 18,
    lunasTunda: 0,
    plansia: 1,
    lansia65Plus: 5,
    avgAge: 57,
    kloter: 'Kloter 04 UPG',
    transitHub: 'Bandara Kepi (KEI) -> MKQ',
    distance: 'Transit Perintis Kepi -> Merauke -> UPG',
    karakter: 'Kawasan Rawa Sepefi DAS Kepi',
    readinessScore: 92.5,
  },
  {
    id: 'KAB-ASMAT',
    name: 'Kab. Asmat',
    rank: 11,
    total: 18,
    urut: 16,
    lunasTunda: 2,
    plansia: 0,
    lansia65Plus: 3,
    avgAge: 51,
    kloter: 'Kloter 04 UPG',
    transitHub: 'Bandara Ewer (EWE) -> TIM',
    distance: 'Transit Speedboat/Ewer -> Timika -> UPG',
    karakter: 'Kawasan Pesisir Rawa Kota Papan Agats',
    readinessScore: 91.5,
  },
  {
    id: 'KAB-WRP',
    name: 'Kab. Waropen',
    rank: 12,
    total: 12,
    urut: 11,
    lunasTunda: 0,
    plansia: 1,
    lansia65Plus: 4,
    avgAge: 58,
    kloter: 'Kloter 02 UPG',
    transitHub: 'Pelabuhan Waren -> Serui -> Biak',
    distance: 'Transit Botawa -> Biak -> UPG',
    karakter: 'Pesisir Teluk Cenderawasih Botawa',
    readinessScore: 92.0,
  },
  {
    id: 'KAB-SRM',
    name: 'Kab. Sarmi',
    rank: 13,
    total: 11,
    urut: 10,
    lunasTunda: 0,
    plansia: 1,
    lansia65Plus: 2,
    avgAge: 55,
    kloter: 'Kloter 01 UPG',
    transitHub: 'Transit Darat Trans-Papua -> Sentani (DJJ)',
    distance: 'Darat 5 Jam ke Sentani -> UPG',
    karakter: 'Pesisir Ombak Pasifik Utara Sarmi',
    readinessScore: 93.0,
  },
  {
    id: 'KAB-KRM',
    name: 'Kab. Keerom',
    rank: 14,
    total: 10,
    urut: 10,
    lunasTunda: 0,
    plansia: 0,
    lansia65Plus: 1,
    avgAge: 58,
    kloter: 'Kloter 03 UPG',
    transitHub: 'Transit Darat Trans-Papua -> Jayapura -> DJJ',
    distance: 'Darat 2 Jam ke Sentani -> UPG',
    karakter: 'Wilayah Perbatasan RI-PNG Arso / Waris',
    readinessScore: 94.5,
  },
  {
    id: 'KAB-YHK',
    name: 'Kab. Yahukimo',
    rank: 15,
    total: 1,
    urut: 0,
    lunasTunda: 0,
    plansia: 1,
    lansia65Plus: 1,
    avgAge: 79,
    kloter: 'Kloter 03 UPG',
    transitHub: 'Bandara Nop Goliat Dekai -> Sentani',
    distance: 'Transit Perintis Dekai -> Sentani -> UPG',
    karakter: 'Dekai Lembah Pegunungan Tengah',
    readinessScore: 90.0,
  },
  {
    id: 'KAB-MBR',
    name: 'Kab. Mamberamo Raya',
    rank: 16,
    total: 1,
    urut: 0,
    lunasTunda: 0,
    plansia: 1,
    lansia65Plus: 1,
    avgAge: 93,
    kloter: 'Kloter 01 UPG',
    transitHub: 'Transit Sungai/Perintis Kasonaweja -> DJJ',
    distance: 'Transit Perintis -> Sentani -> UPG',
    karakter: 'DAS Sungai Purba Mamberamo Kasonaweja',
    readinessScore: 90.0,
  },
  {
    id: 'KAB-PAN',
    name: 'Kab. Paniai',
    rank: 17,
    total: 1,
    urut: 1,
    lunasTunda: 0,
    plansia: 0,
    lansia65Plus: 0,
    avgAge: 45,
    kloter: 'Kloter 03 UPG',
    transitHub: 'Bandara Enarotali -> Nabire (NBX)',
    distance: 'Transit Enarotali -> Nabire -> UPG',
    karakter: 'Enarotali Danau Paniai Pegunungan',
    readinessScore: 90.0,
  },
  {
    id: 'KAB-SUP',
    name: 'Kab. Supiori',
    rank: 18,
    total: 1,
    urut: 1,
    lunasTunda: 0,
    plansia: 0,
    lansia65Plus: 0,
    avgAge: 51,
    kloter: 'Kloter 02 UPG',
    transitHub: 'Transit Darat -> Bandara Frans Kaisiepo Biak',
    distance: 'Darat 1.5 Jam ke Biak -> UPG',
    karakter: 'Kepulauan Karang Supiori Utara',
    readinessScore: 90.0,
  },
];

export function KabupatenRadarSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = KABUPATEN_RADAR_DATA.length;
  const current = KABUPATEN_RADAR_DATA[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (!isAutoPlay) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4500); // 4.5 seconds per slide

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlay, totalSlides]);

  return (
    <div
      className="relative rounded-3xl border border-[#c9a961]/35 bg-gradient-to-b from-[#1A1410] via-[#2A2018] to-[#1A1410] text-white p-5 sm:p-6 shadow-2xl backdrop-blur-xl select-none"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* 1. Header with Live Ping & Slide Indicators */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c9a961] animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-[#c9a961] uppercase">
            LIVE RADAR KABUPATEN
          </span>
        </div>

        {/* Navigation & Auto-Play Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            title={isAutoPlay ? 'Jeda Slide Otomatis' : 'Putar Slide Otomatis'}
            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-[#c9a961] transition-colors"
          >
            {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={prevSlide}
            title="Wilayah Sebelumnya"
            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono font-bold text-gray-300 px-1.5">
            {currentIndex + 1} / {totalSlides}
          </span>
          <button
            onClick={nextSlide}
            title="Wilayah Berikutnya"
            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Slide Content Area */}
      <div className="py-4 space-y-4 transition-all duration-300">
        {/* Top: Region Identity & Rank */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/30">
                RANK #{current.rank} PAPUA
              </span>
              <span className="text-[11px] font-mono text-gray-400">{current.id}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight flex items-center gap-2">
              <span>{current.name}</span>
            </h3>
          </div>

          {/* Quick Dropdown Picker */}
          <select
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="bg-[#1A1410] text-[#c9a961] text-[11px] font-mono font-bold border border-[#c9a961]/40 rounded-lg px-2 py-1 cursor-pointer focus:outline-hidden"
          >
            {KABUPATEN_RADAR_DATA.map((k, idx) => (
              <option key={k.id} value={idx} className="bg-[#1A1410] text-white">
                #{k.rank} {k.name} ({k.total})
              </option>
            ))}
          </select>
        </div>

        {/* Central Metric Dial & Summary */}
        <div className="grid grid-cols-12 gap-3 items-center bg-white/5 border border-white/10 rounded-2xl p-4">
          {/* Dial / Big Number */}
          <div className="col-span-5 text-center border-r border-white/10 pr-2">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">
              Alokasi Kuota Wilayah
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-[#c9a961] my-0.5">
              {current.total}
            </div>
            <span className="text-[10px] text-stone-300 font-medium">Calon Jamaah 1448 H</span>
          </div>

          {/* Quick Metrics */}
          <div className="col-span-7 pl-2 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-[11px]">Kategori Urut:</span>
              <span className="font-mono font-bold text-white">{current.urut} Org</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-[11px]">Prioritas Lansia:</span>
              <span className="font-mono font-bold text-[#c9a961]">
                {current.plansia} Org {current.plansia > 0 ? `(65+ th: ${current.lansia65Plus})` : ''}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-[11px]">Lunas Tunda:</span>
              <span className="font-mono font-bold text-amber-300">{current.lunasTunda} Org</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-white/10">
              <span className="text-gray-400 text-[11px]">Rata-rata Usia:</span>
              <span className="font-mono text-stone-200">{current.avgAge} Tahun</span>
            </div>
          </div>
        </div>

        {/* Logistic & Flight Route Badges */}
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
            <Plane className="w-4 h-4 text-[#c9a961] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-center">
                <strong className="text-white text-[11px] font-bold truncate">Titik Transit Udara:</strong>
                <span className="text-[10px] font-mono text-[#c9a961]">{current.distance}</span>
              </div>
              <p className="text-[11px] text-gray-300 truncate mt-0.5">{current.transitHub}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-center">
                <strong className="text-white text-[11px] font-bold">Alokasi Penerbangan Kloter:</strong>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">SIAP EMBARKASI</span>
              </div>
              <p className="text-[11px] text-gray-300 truncate mt-0.5">{current.kloter}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Slider Progress Dots (18 dots) */}
      <div className="flex justify-center items-center gap-1 py-1">
        {KABUPATEN_RADAR_DATA.map((k, idx) => (
          <button
            key={k.id}
            onClick={() => setCurrentIndex(idx)}
            title={k.name}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === currentIndex
                ? 'w-5 bg-[#c9a961]'
                : 'w-1.5 bg-white/20 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* 4. Card Footer: Official Source Link & Direct Action */}
      <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-300">
        <a
          href="https://haji.go.id/estimasi-keberangkatan?tab=berhak-lunas"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-stone-300 hover:text-[#c9a961] transition-colors group cursor-pointer"
          title="Buka portal resmi Kementerian Haji & Umrah RI"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#c9a961] shrink-0" />
          <span className="text-[11px]">
            Sumber Data:{' '}
            <strong className="font-mono underline text-white group-hover:text-[#c9a961]">
              haji.go.id/estimasi-keberangkatan
            </strong>
          </span>
          <ExternalLink className="w-3 h-3 text-[#c9a961] opacity-80 group-hover:opacity-100" />
        </a>

        <Link
          href="/dashboard"
          className="font-mono text-[#c9a961] hover:text-[#e8dfc8] font-bold flex items-center gap-1 text-[11px] transition-colors"
        >
          <span>Eksplor 924 Jamaah</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
