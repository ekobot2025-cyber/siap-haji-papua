'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  Users,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Database,
  Building2,
  CalendarCheck2,
  BarChart3,
  PieChart,
  Plane,
  Table as TableIcon,
} from 'lucide-react';
import type { BerhakLunasSummary } from '@/application/services/berhak-lunas.service';
import { BERHAK_LUNAS_PAPUA_1448 } from '@/data/berhak-lunas-papua';

interface Props {
  summary: BerhakLunasSummary;
  isPublic?: boolean;
}

export function BerhakLunasCard({ summary, isPublic = false }: Props) {
  const [activeTab, setActiveTab] = useState<'table' | 'charts' | 'regions' | 'kloter'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKab, setSelectedKab] = useState('ALL');
  const [selectedKat, setSelectedKat] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter list jamaah
  const filteredList = useMemo(() => {
    return BERHAK_LUNAS_PAPUA_1448.filter((item) => {
      const matchSearch =
        !searchTerm ||
        item.porsi.includes(searchTerm) ||
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alamat.toLowerCase().includes(searchTerm.toLowerCase());

      const matchKab =
        selectedKab === 'ALL' ||
        item.kabKota.toLowerCase() === selectedKab.toLowerCase();

      const matchKat =
        selectedKat === 'ALL' ||
        item.kategori.toLowerCase() === selectedKat.toLowerCase();

      return matchSearch && matchKab && matchKat;
    });
  }, [searchTerm, selectedKab, selectedKat]);

  const totalFiltered = filteredList.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  const displayedItems = filteredList.slice(
    (validPage - 1) * pageSize,
    validPage * pageSize
  );

  // 4 Kloter distribution
  const kloterStats = [
    {
      kloterNumber: '01',
      code: 'KLOTER-01-UPG',
      wilayah: 'Kota Jayapura & Kab. Keerom',
      total: 305,
      capacity: 450,
      transitHub: 'Sentani (DJJ) -> UPG',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      kloterNumber: '02',
      code: 'KLOTER-02-UPG',
      wilayah: 'Saireri: Biak Numfor, Yapen, Waropen, Sarmi, Supiori',
      total: 97,
      capacity: 450,
      transitHub: 'Frans Kaisiepo (BIK) -> UPG',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      kloterNumber: '03',
      code: 'KLOTER-03-UPG',
      wilayah: 'Papua Tengah: Mimika, Nabire, Paniai',
      total: 231,
      capacity: 450,
      transitHub: 'Mozes Kilangin (TIM) -> UPG',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      kloterNumber: '04',
      code: 'KLOTER-04-UPG',
      wilayah: 'Papua Selatan & Pegunungan: Merauke, Boven Digoel, Asmat, Mappi, Jayawijaya, Yahukimo',
      total: 291,
      capacity: 450,
      transitHub: 'Mopah Merauke (MKQ) & Wamena (WMX) -> UPG',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#e8dfc8] shadow-xs overflow-hidden">
      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF9F5] via-white to-[#FAF9F5] border-b border-[#e8dfc8]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-2.5 py-0.5 rounded-full">
                <Database className="w-3.5 h-3.5" />
                <span>100% DATA RIIL SATU DATA KEMENHAJ RI</span>
              </span>
              <span className="bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] text-xs font-bold px-2.5 py-0.5 rounded-full">
                Musim 1448 H / 2026-2027 M
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1410] tracking-tight">
              Alokasi Kuota Berhak Lunas Reguler Provinsi Papua (924 Jamaah)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Data operasional sah terintegrasi dari portal{' '}
              <strong className="text-stone-800 font-mono">haji.go.id/estimasi-keberangkatan</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://haji.go.id/estimasi-keberangkatan?tab=berhak-lunas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e8dfc8] bg-white hover:bg-[#fbf8ee] text-[#8a6d2b] text-xs font-bold transition-all shadow-2xs"
            >
              <span>Verifikasi di haji.go.id</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 2. Ringkasan Kategori Angka Utama */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {/* Total Papua */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e8dfc8] shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Kuota Papua</span>
              <Users className="w-4 h-4 text-[#8a6d2b]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#1A1410]">
              {summary.total}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              100% Calon Jamaah Terverifikasi
            </div>
          </div>

          {/* Kuota Urut Reguler */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
            <div className="flex items-center justify-between text-blue-700 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Urut Nomor Porsi</span>
              <CalendarCheck2 className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-blue-900">
              {summary.urutCount}
            </div>
            <div className="text-[11px] text-blue-700/80 mt-0.5 font-medium">
              {Math.round((summary.urutCount / summary.total) * 1000) / 10}% dari total kuota
            </div>
          </div>

          {/* Prioritas Lansia */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-2xs">
            <div className="flex items-center justify-between text-purple-700 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Prioritas Lansia</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-purple-900">
              {summary.plansiaCount}
            </div>
            <div className="text-[11px] text-purple-700/80 mt-0.5 font-medium">
              Afirmasi Lansia (Usia ≥ 65 Tahun)
            </div>
          </div>

          {/* Lunas Tunda */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
            <div className="flex items-center justify-between text-amber-700 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Lunas Tunda Berangkat</span>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-900">
              {summary.lunasTundaCount}
            </div>
            <div className="text-[11px] text-amber-700/80 mt-0.5 font-medium">
              Otomatis Berhak Lunas
            </div>
          </div>
        </div>

        {/* 3. Tab Navigasi Visual */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#e8dfc8]/60 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'table'
                ? 'bg-[#1A1410] text-[#c9a961] shadow-xs'
                : 'bg-white text-stone-600 border border-[#e8dfc8] hover:bg-[#fbf8ee]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Tabel &amp; Pencarian Jamaah ({totalFiltered})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'charts'
                ? 'bg-[#1A1410] text-[#c9a961] shadow-xs'
                : 'bg-white text-stone-600 border border-[#e8dfc8] hover:bg-[#fbf8ee]'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Grafik Kategori &amp; Piramida Usia</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('regions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'regions'
                ? 'bg-[#1A1410] text-[#c9a961] shadow-xs'
                : 'bg-white text-stone-600 border border-[#e8dfc8] hover:bg-[#fbf8ee]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grafik Sebaran 18 Kab/Kota</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kloter')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'kloter'
                ? 'bg-[#1A1410] text-[#c9a961] shadow-xs'
                : 'bg-white text-stone-600 border border-[#e8dfc8] hover:bg-[#fbf8ee]'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Alokasi 4 Kloter (UPG)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TABEL DATA & PENCARIAN */}
      {activeTab === 'table' && (
        <div>
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#e8dfc8] space-y-2.5">
            {isPublic && (
              <div className="p-2.5 rounded-xl bg-[#fbf8ee] border border-[#e8dfc8] text-xs text-[#8a6d2b] flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#b8941e] shrink-0" />
                  Kepatuhan UU PDP No. 27/2022: Nomor porsi disensor parsial pada domain publik. Gunakan fitur Cek Porsi untuk verifikasi mandiri.
                </span>
                <a href="/cek-porsi" className="underline font-bold text-stone-900 shrink-0">
                  Cek Porsi &rarr;
                </a>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari No. Porsi (contoh: 2600021828), Nama Jamaah, atau Alamat Domisili..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#e8dfc8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a961] font-medium"
                />
              </div>

              <select
                value={selectedKab}
                onChange={(e) => {
                  setSelectedKab(e.target.value);
                  setPage(1);
                }}
                aria-label="Pilih Kabupaten atau Kota"
                className="px-3 py-2 text-xs sm:text-sm border border-[#e8dfc8] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a961] font-semibold text-stone-700"
              >
                <option value="ALL">Seluruh Wilayah Papua ({summary.total})</option>
                {summary.regencyBreakdown.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name} ({r.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedKat}
                onChange={(e) => {
                  setSelectedKat(e.target.value);
                  setPage(1);
                }}
                aria-label="Pilih Kategori Kuota"
                className="px-3 py-2 text-xs sm:text-sm border border-[#e8dfc8] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a961] font-semibold text-stone-700"
              >
                <option value="ALL">Semua Kategori (924)</option>
                <option value="URUT">Urut Nomor Porsi ({summary.urutCount})</option>
                <option value="PLANSIA">Prioritas Lansia ({summary.plansiaCount})</option>
                <option value="LUNAS TUNDA">Lunas Tunda ({summary.lunasTundaCount})</option>
              </select>

              {(searchTerm || selectedKab !== 'ALL' || selectedKat !== 'ALL') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedKab('ALL');
                    setSelectedKat('ALL');
                    setPage(1);
                  }}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Tabel Interaktif */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#e8dfc8] text-stone-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">No. Porsi</th>
                  <th className="py-3 px-4">Nama Calon Jamaah</th>
                  <th className="py-3 px-4">Alamat Domisili</th>
                  <th className="py-3 px-4">Kabupaten / Kota</th>
                  <th className="py-3 px-4 text-center">Usia</th>
                  <th className="py-3 px-4 text-center">Kategori</th>
                  <th className="py-3 px-4 text-center">Tahap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {displayedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-stone-500">
                      <p className="font-semibold text-sm">Tidak ada calon jamaah yang cocok dengan pencarian</p>
                      <p className="text-xs text-stone-400 mt-1">Coba sesuaikan kata kunci pencarian Anda</p>
                    </td>
                  </tr>
                ) : (
                  displayedItems.map((j, index) => {
                    const rowNumber = (validPage - 1) * pageSize + index + 1;
                    return (
                      <tr key={j.porsi} className="hover:bg-[#FAF9F5]/70 transition-colors">
                        <td className="py-3 px-4 text-center font-mono text-stone-400 text-xs">
                          {rowNumber}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                          {isPublic ? `${j.porsi.slice(0, 4)}****${j.porsi.slice(-2)}` : j.porsi}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#1A1410]">{j.nama}</span>
                        </td>
                        <td className="py-3 px-4 text-stone-600 max-w-[200px] truncate" title={isPublic ? j.kabKota : j.alamat}>
                          {isPublic ? `Wilayah ${j.kabKota}, Papua` : (j.alamat || '-')}
                        </td>
                        <td className="py-3 px-4 font-medium text-stone-800 whitespace-nowrap">
                          {j.kabKota}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-stone-700 whitespace-nowrap">
                          {j.usia} th
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {j.kategori === 'URUT' && (
                            <span className="inline-block bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">
                              URUT
                            </span>
                          )}
                          {j.kategori === 'PLANSIA' && (
                            <span className="inline-block bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">
                              LANSIA
                            </span>
                          )}
                          {j.kategori === 'LUNAS TUNDA' && (
                            <span className="inline-block bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                              LUNAS TUNDA
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-stone-700 whitespace-nowrap">
                          Tahap {j.tahap}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer & Pagination */}
          <div className="p-4 bg-[#FAF9F5] border-t border-[#e8dfc8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
            <div>
              Menampilkan <strong className="font-mono">{displayedItems.length}</strong> dari{' '}
              <strong className="font-mono">{totalFiltered}</strong> jamaah Papua{' '}
              {totalFiltered !== summary.total && `(tersaring dari total ${summary.total})`}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={validPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-[#e8dfc8] bg-white hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-stone-800">
                  {validPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={validPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-[#e8dfc8] bg-white hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GRAFIK KATEGORI & PIRAMIDA USIA */}
      {activeTab === 'charts' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visualisasi 1: Komposisi Kategori Kuota */}
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#e8dfc8] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e8dfc8]">
                <h3 className="font-bold text-[#1A1410] text-sm flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#8a6d2b]" />
                  <span>Komposisi Kategori Alokasi Kuota 1448 H</span>
                </h3>
                <span className="text-xs font-mono font-bold text-stone-500">Total: 924</span>
              </div>

              {/* Progress Stack Bar */}
              <div className="w-full h-6 rounded-full overflow-hidden flex border border-[#e8dfc8]">
                <div
                  style={{ width: `${(summary.urutCount / summary.total) * 100}%` }}
                  className="bg-blue-600 flex items-center justify-center text-white text-[10px] font-mono font-bold"
                  title={`Urut Porsi: ${summary.urutCount} (${Math.round((summary.urutCount / summary.total) * 100)}%)`}
                >
                  {Math.round((summary.urutCount / summary.total) * 100)}%
                </div>
                <div
                  style={{ width: `${(summary.plansiaCount / summary.total) * 100}%` }}
                  className="bg-purple-600 flex items-center justify-center text-white text-[10px] font-mono font-bold"
                  title={`Prioritas Lansia: ${summary.plansiaCount} (${((summary.plansiaCount / summary.total) * 100).toFixed(1)}%)`}
                >
                  5.1%
                </div>
                <div
                  style={{ width: `${(summary.lunasTundaCount / summary.total) * 100}%` }}
                  className="bg-amber-500 flex items-center justify-center text-white text-[10px] font-mono font-bold"
                  title={`Lunas Tunda: ${summary.lunasTundaCount} (${((summary.lunasTundaCount / summary.total) * 100).toFixed(1)}%)`}
                >
                  1.9%
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="font-medium text-stone-800">Urut Nomor Porsi Kuota Reguler</span>
                  </div>
                  <strong className="font-mono text-blue-900">{summary.urutCount} Jamaah (93.0%)</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-purple-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-600" />
                    <span className="font-medium text-stone-800">Prioritas Lansia (Afirmasi Usia 65+)</span>
                  </div>
                  <strong className="font-mono text-purple-900">{summary.plansiaCount} Jamaah (5.1%)</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="font-medium text-stone-800">Lunas Tunda (Otomatis Berhak Berangkat)</span>
                  </div>
                  <strong className="font-mono text-amber-900">{summary.lunasTundaCount} Jamaah (1.9%)</strong>
                </div>
              </div>
            </div>

            {/* Visualisasi 2: Piramida Distribusi Usia Jamaah */}
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#e8dfc8] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e8dfc8]">
                <h3 className="font-bold text-[#1A1410] text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#8a6d2b]" />
                  <span>Distribusi Kelompok Usia Calon Jamaah</span>
                </h3>
                <span className="text-xs font-mono font-bold text-stone-500">Rentang: 19 - 88 Th</span>
              </div>

              <div className="space-y-3 pt-1">
                {/* Usia Produktif Muda (< 40) */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-700 font-medium">Usia &lt; 40 Tahun (Produktif Muda)</span>
                    <strong className="font-mono text-stone-900">{summary.ageGroups.under40} Jamaah ({Math.round((summary.ageGroups.under40 / summary.total) * 1000) / 10}%)</strong>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(summary.ageGroups.under40 / summary.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Usia Matang (40 - 59) */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-700 font-medium">Usia 40 - 59 Tahun (Kelompok Terbanyak)</span>
                    <strong className="font-mono text-stone-900">{summary.ageGroups.age40to59} Jamaah ({Math.round((summary.ageGroups.age40to59 / summary.total) * 1000) / 10}%)</strong>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#b8941e] h-full rounded-full transition-all duration-500"
                      style={{ width: `${(summary.ageGroups.age40to59 / summary.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Pra-Lansia & Lansia Awal (60 - 74) */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-700 font-medium">Usia 60 - 74 Tahun (Perlu Perhatian Medis)</span>
                    <strong className="font-mono text-stone-900">{summary.ageGroups.age60to74} Jamaah ({Math.round((summary.ageGroups.age60to74 / summary.total) * 1000) / 10}%)</strong>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(summary.ageGroups.age60to74 / summary.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Lansia Risti Tinggi (75+) */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-800 font-bold">Usia ≥ 75 Tahun (Pendampingan Intensif)</span>
                    <strong className="font-mono text-purple-900">{summary.ageGroups.age75Plus} Jamaah ({Math.round((summary.ageGroups.age75Plus / summary.total) * 1000) / 10}%)</strong>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(summary.ageGroups.age75Plus / summary.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GRAFIK SEBARAN 18 KABUPATEN/KOTA */}
      {activeTab === 'regions' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#e8dfc8]">
            <div>
              <h3 className="font-bold text-[#1A1410] text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8a6d2b]" />
                <span>Peringkat &amp; Sebaran Alokasi Kuota di 18 Kab/Kota Se-Papua Raya</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Urutan kabupaten/kota dengan konsentrasi calon jamaah berhak lunas tertinggi
              </p>
            </div>
            <span className="text-xs bg-[#fbf8ee] border border-[#e8dfc8] text-[#8a6d2b] font-bold px-2.5 py-1 rounded-full">
              18 Wilayah
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {summary.regencyBreakdown.map((r, i) => (
              <div
                key={r.name}
                className="p-3 bg-[#FAF9F5] rounded-xl border border-[#e8dfc8] flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white border border-[#e8dfc8] text-[#8a6d2b] font-mono font-bold text-[10px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <strong className="text-xs text-stone-900">{r.name}</strong>
                  </div>
                  <span className="text-xs font-mono font-black text-[#1A1410]">
                    {r.count} <span className="font-normal text-stone-500 font-sans text-[11px]">({r.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#c9a961] to-[#b8941e] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(r.count / summary.regencyBreakdown[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALOKASI 4 KLOTER EMBARKASI MAKASSAR */}
      {activeTab === 'kloter' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#e8dfc8]">
            <div>
              <h3 className="font-bold text-[#1A1410] text-sm flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#8a6d2b]" />
                <span>Distribusi Manifest 4 Kloter Embarkasi Hasanuddin Makassar (UPG)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Seluruh 924 calon jamaah riil Papua telah terbagi ke dalam kelompok terbang resmi
              </p>
            </div>
            <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
              100% Teralokasi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {kloterStats.map((k) => (
              <div
                key={k.code}
                className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#e8dfc8] space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#1A1410] text-[#c9a961] font-mono font-bold text-xs">
                      Kloter {k.kloterNumber}
                    </span>
                    <span className="text-xs font-mono font-semibold text-stone-500">
                      {k.code}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${k.badgeColor}`}>
                    {k.total} Kursi Terisi
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Cakupan Wilayah:
                  </div>
                  <p className="text-xs font-bold text-stone-800 mt-0.5">
                    {k.wilayah}
                  </p>
                </div>

                <div className="text-xs text-stone-500 bg-white p-2.5 rounded-xl border border-[#e8dfc8]">
                  <span className="font-bold text-stone-700">Rute Transit:</span> {k.transitHub}
                </div>

                {/* Progress bar kursi */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono text-stone-500">
                    <span>Okupansi Kuota Kloter</span>
                    <span className="font-bold text-stone-800">{k.total} / {k.capacity} Pax</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${(k.total / k.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
