'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  Tv,
  QrCode,
  Sparkles,
  BarChart3,
  Building2,
  FileCheck,
  HeartPulse,
  CreditCard,
  BookOpen,
  Plane,
} from 'lucide-react';
import { BerhakLunasCard } from '@/components/dashboard/BerhakLunasCard';
import { BERHAK_LUNAS_PAPUA_1448 } from '@/data/berhak-lunas-papua';
import { BerhakLunasService, type BerhakLunasSummary } from '@/application/services/berhak-lunas.service';

interface Props {
  initialSummary?: BerhakLunasSummary;
}

export function PublicTransparencySection({ initialSummary }: Props) {
  const summary = initialSummary || BerhakLunasService.getSummary();
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((d) => {
        if (d.success) {
          setDashboardData(d.data);
        }
      })
      .catch((e) => console.error('Error fetching public dashboard data:', e))
      .finally(() => setLoading(false));
  }, []);

  const kpi = dashboardData?.kpi || {
    totalJamaah: 924,
    siapBerangkat: 18,
    dalamProses: 906,
    perluTindakLanjut: 0,
    prioritasIntervensi: 0,
    lansiaPrioritas: 180,
    provincialReadinessIndex: 84.9,
  };

  const componentsReadiness = dashboardData?.componentsReadiness || [
    { code: 'IDENTITAS', name: 'Identitas & Biodata', weight: 10, averageScore: 98.5 },
    { code: 'ADMINISTRASI', name: 'Administrasi BPIH', weight: 20, averageScore: 94.2 },
    { code: 'DOKUMEN', name: 'Kelengkapan Paspor/Visa', weight: 20, averageScore: 89.0 },
    { code: 'KESEHATAN', name: 'Pemeriksaan Kesehatan', weight: 20, averageScore: 87.5 },
    { code: 'MANASIK', name: 'Bimbingan Manasik', weight: 15, averageScore: 91.2 },
    { code: 'KLOTER', name: 'Penempatan Kloter', weight: 15, averageScore: 88.0 },
  ];

  const regionalRanking = dashboardData?.regionalRanking && dashboardData.regionalRanking.length > 0
    ? dashboardData.regionalRanking
    : [
        { regionId: 'asmat', regionName: 'Kabupaten Asmat', totalJamaah: 18, siapCount: 2, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 86.2 },
        { regionId: 'jpr-kota', regionName: 'Kota Jayapura', totalJamaah: 295, siapCount: 11, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 85.1 },
        { regionId: 'bvd', regionName: 'Kabupaten Boven Digoel', totalJamaah: 21, siapCount: 0, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 85.0 },
        { regionId: 'keerom', regionName: 'Kabupaten Keerom', totalJamaah: 10, siapCount: 0, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 85.0 },
        { regionId: 'mimika', regionName: 'Kabupaten Mimika', totalJamaah: 172, siapCount: 5, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 84.8 },
        { regionId: 'jpr-kab', regionName: 'Kabupaten Jayapura', totalJamaah: 93, siapCount: 0, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 84.8 },
        { regionId: 'yapen', regionName: 'Kabupaten Kepulauan Yapen', totalJamaah: 33, siapCount: 0, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 84.8 },
        { regionId: 'biak', regionName: 'Kabupaten Biak Numfor', totalJamaah: 53, siapCount: 0, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 84.7 },
        { regionId: 'jayawijaya', regionName: 'Kabupaten Jayawijaya', totalJamaah: 27, siapCount: 0, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 84.7 },
        { regionId: 'merauke', regionName: 'Kabupaten Merauke', totalJamaah: 143, siapCount: 0, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 84.6 },
        { regionId: 'nabire', regionName: 'Kabupaten Nabire', totalJamaah: 59, siapCount: 0, perluTindakLanjutCount: 0, prioritasCount: 0, averageReadiness: 84.4 },
      ];

  const provIndex = Number(kpi?.provincialReadinessIndex ?? 84.9);

  return (
    <section id="transparansi-kuota" className="py-12 sm:py-16 space-y-8 scroll-mt-24">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#e8dfc8]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8dfc8] bg-[#fbf8ee] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#8a6d2b] mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b8941e]" />
            TRANSPARANSI PELAYANAN PUBLIK &amp; KUOTA HAJI PAPUA
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1A1410] tracking-tight">
            Dashboard Informasi Publik Kuota Haji Papua
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Pemantauan terbuka alokasi kuota berhak lunas, komposisi usia, capaian kesiapan administratif 6 pilar, serta sebaran 18 Kabupaten/Kota Se-Papua Raya terintegrasi dari Satu Data Kementerian Haji dan Umrah RI.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/video-wall"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#c9a961]/40 bg-[#1A1410] hover:bg-[#261F1A] text-[#c9a961] text-xs font-bold transition-all shadow-xs"
          >
            <Tv className="w-4 h-4 text-[#c9a961]" />
            <span>Mode Video Wall Monitor</span>
          </Link>
          <Link
            href="/cek-porsi"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-kemenhaj-primary text-white text-xs font-bold transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4 text-white" />
            <span>Cek Porsi Mandiri</span>
          </Link>
        </div>
      </div>

      {/* 2. PRIMARY 5 KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Jamaah */}
        <div className="bg-white p-4 rounded-2xl border border-[#e8dfc8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Jamaah</span>
            <div className="p-1.5 bg-[#fbf8ee] rounded-lg text-[#8a6d2b] border border-[#e8dfc8]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A1410] font-mono">
              {kpi.totalJamaah}
            </div>
            <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
              <span>Kuota Musim: 924</span>
              <span className="font-semibold text-[#8a6d2b]">100%</span>
            </div>
          </div>
        </div>

        {/* Siap Berangkat */}
        <div className="bg-white p-4 rounded-2xl border border-[#e8dfc8] bg-[#fbf8ee]/50 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8a6d2b] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Siap Berangkat</span>
            <div className="p-1.5 bg-white rounded-lg text-[#b8941e] border border-[#e8dfc8]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#1A1410] font-mono">
              {kpi.siapBerangkat}
            </div>
            <div className="text-[11px] text-[#8a6d2b] font-semibold mt-1">
              {((kpi.siapBerangkat / kpi.totalJamaah) * 100).toFixed(1)}% dari total
            </div>
          </div>
        </div>

        {/* Dalam Proses */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dalam Proses</span>
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-800 font-mono">
              {kpi.dalamProses}
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">
              {((kpi.dalamProses / kpi.totalJamaah) * 100).toFixed(1)}% dari total
            </div>
          </div>
        </div>

        {/* Tindak Lanjut */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tindak Lanjut</span>
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-800 font-mono">
              {kpi.perluTindakLanjut}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">
              Perlu Intervensi berkas
            </div>
          </div>
        </div>

        {/* Lansia Prioritas */}
        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Lansia Prioritas</span>
            <div className="p-1.5 bg-purple-100 rounded-lg text-purple-700">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-900 font-mono">
              {kpi.lansiaPrioritas}
            </div>
            <div className="text-[11px] text-purple-700 font-semibold mt-1 flex items-center justify-between">
              <span>Usia ≥ 65 Tahun</span>
              <span className="text-red-700 font-bold">Prioritas: {kpi.prioritasIntervensi || 47}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ALOKASI KUOTA BERHAK LUNAS PAPUA 1448 H (TABEL, GRAFIK KATEGORI, PIRAMIDA USIA, 18 KAB/KOTA, 4 KLOTER) */}
      <BerhakLunasCard summary={summary} isPublic={true} />

      {/* 4. INDIKATOR KESIAPAN ADMINISTRATIF PROVINSI PAPUA (6 PILAR OPERASIONAL) */}
      <div className="bg-white p-6 rounded-3xl border border-[#e8dfc8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Indikator Kesiapan Internal
              </span>
              <span className="text-[10px] bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] px-2 py-0.5 rounded font-mono font-bold">
                Formula Bobot Dinamis
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#1A1410] mt-0.5">
              Indeks Kesiapan Administratif Provinsi Papua
            </h3>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-3xl font-black text-[#967412] font-mono">
              {provIndex.toFixed(1)}%
            </div>
            <div className="text-xs font-bold text-[#8a6d2b]">
              Status Agregat: {provIndex >= 90 ? 'SIAP BERANGKAT' : 'DALAM PROSES'}
            </div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-stone-100 rounded-full h-4 p-0.5 border border-[#e8dfc8] overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#c9a961] via-[#d4af37] to-[#b8941e] h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(5, provIndex))}%` }}
          />
        </div>

        {/* 6 Pilar Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {componentsReadiness.map((comp: any) => (
            <div key={comp.code} className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#e8dfc8]">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="font-semibold truncate">{comp.name}</span>
                <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#e8dfc8]">{comp.weight}%</span>
              </div>
              <div className="text-lg font-black text-[#1A1410] font-mono">
                {Number(comp?.averageScore ?? 0).toFixed(1)}%
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#c9a961] to-[#b8941e] h-full rounded-full"
                  style={{ width: `${comp.averageScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. TABEL KESIAPAN ADMINISTRATIF PER WILAYAH (KABUPATEN / KOTA) */}
      <div className="bg-white p-6 rounded-3xl border border-[#e8dfc8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1A1410]">
              Kesiapan Administratif per Wilayah (Kabupaten / Kota)
            </h3>
            <p className="text-xs text-stone-500">
              Peringkat wilayah berdasarkan capaian indeks kesiapan jamaah
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#8a6d2b] bg-[#fbf8ee] px-3 py-1 rounded-full border border-[#e8dfc8] self-start sm:self-auto">
            18 Wilayah Se-Papua
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#e8dfc8] text-stone-600 text-xs uppercase tracking-wider font-semibold bg-[#FAF9F5]">
                <th className="py-3 px-3">Kabupaten / Kota</th>
                <th className="py-3 px-3 text-center">Jumlah Jamaah</th>
                <th className="py-3 px-3 text-center">Siap</th>
                <th className="py-3 px-3 text-center">Proses</th>
                <th className="py-3 px-3">Indeks Kesiapan</th>
                <th className="py-3 px-3 text-right">Layanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {regionalRanking.map((reg: any) => (
                <tr key={reg.regionId} className="hover:bg-[#FAF9F5]/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#1A1410] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#b8941e] shrink-0" />
                    <span>{reg.regionName}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-stone-800">
                    {reg.totalJamaah}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-[#8a6d2b]">
                    {reg.siapCount}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-amber-700">
                    {reg.perluTindakLanjutCount + (reg.prioritasCount || 0)}
                  </td>
                  <td className="py-3 px-3 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            reg.averageReadiness >= 90
                              ? 'bg-gradient-to-r from-[#c9a961] to-[#b8941e]'
                              : reg.averageReadiness >= 75
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, reg.averageReadiness)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-stone-800 shrink-0">
                        {Number(reg?.averageReadiness ?? 0).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/cek-porsi"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8a6d2b] bg-[#fbf8ee] hover:bg-[#f4ebd0] px-2.5 py-1 rounded-lg border border-[#e8dfc8] transition-colors"
                      title="Periksa status porsi jamaah wilayah ini"
                    >
                      <span>Cek Porsi</span>
                      <ChevronRight className="w-3 h-3 text-[#b8941e]" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
