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
} from 'lucide-react';
import type { BerhakLunasSummary } from '@/application/services/berhak-lunas.service';
import { BERHAK_LUNAS_PAPUA_1448, type JamaahBerhakLunas } from '@/data/berhak-lunas-papua';

interface Props {
  summary: BerhakLunasSummary;
}

export function BerhakLunasCard({ summary }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKab, setSelectedKab] = useState('ALL');
  const [selectedKat, setSelectedKat] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 8;

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

  return (
    <div className="bg-white rounded-2xl border border-[#e8dfc8] shadow-xs overflow-hidden">
      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF9F5] via-white to-[#FAF9F5] border-b border-[#e8dfc8]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-2.5 py-0.5 rounded-full">
                <Database className="w-3.5 h-3.5" />
                <span>SATU DATA KEMENHAJ RI</span>
              </span>
              <span className="bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] text-xs font-bold px-2.5 py-0.5 rounded-full">
                Musim 1448 H / 2026-2027 M
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1410] tracking-tight">
              Alokasi Kuota Berhak Lunas Reguler Provinsi Papua
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Data resmi teradopsi langsung dari portal{' '}
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
              Calon Jamaah Terverifikasi
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
              {Math.round((summary.urutCount / summary.total) * 1000) / 10}% dari total alokasi
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
              Afirmasi Lansia (Usia 65+)
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

        {/* 3. Sebaran 6 Wilayah Terbesar */}
        <div className="mt-4 pt-4 border-t border-[#e8dfc8]/60">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-stone-700">
            <MapPin className="w-3.5 h-3.5 text-[#b8941e]" />
            <span>Sebaran Wilayah Terbanyak (Papua):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.regencyBreakdown.slice(0, 8).map((reg) => (
              <button
                key={reg.name}
                type="button"
                onClick={() => {
                  setSelectedKab(selectedKab === reg.name ? 'ALL' : reg.name);
                  setPage(1);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  selectedKab === reg.name
                    ? 'bg-[#8a6d2b] text-white border-[#8a6d2b] font-bold'
                    : 'bg-white text-stone-700 border-[#e8dfc8] hover:bg-[#fbf8ee]'
                }`}
              >
                <span>{reg.name}</span>
                <strong className="ml-1.5 font-mono">{reg.count}</strong>
              </button>
            ))}
            {summary.regencyBreakdown.length > 8 && (
              <span className="text-xs text-stone-400 self-center">
                +{summary.regencyBreakdown.length - 8} kab/kota lainnya
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Filter & Pencarian Langsung Data Jamaah */}
      <div className="p-4 sm:p-5 bg-white border-b border-[#e8dfc8]">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Input Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Cari No. Porsi (contoh: 2600021828), Nama, atau Alamat..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#e8dfc8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a961] font-medium"
            />
          </div>

          {/* Filter Kategori */}
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

          {/* Reset Filter jika aktif */}
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
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* 5. Tabel Data Interaktif */}
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
                  <p className="text-xs text-stone-400 mt-1">Coba periksa kembali kata kunci nomor porsi atau nama yang Anda masukkan</p>
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
                      {j.porsi}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#1A1410]">{j.nama}</span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-[200px] truncate" title={j.alamat}>
                      {j.alamat || '-'}
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

      {/* 6. Footer & Pagination */}
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
              className="p-1.5 rounded-lg border border-[#e8dfc8] bg-white hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none"
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
              className="p-1.5 rounded-lg border border-[#e8dfc8] bg-white hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
