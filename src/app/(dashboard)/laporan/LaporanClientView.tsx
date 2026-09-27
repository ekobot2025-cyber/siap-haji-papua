'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { exportToPdf, exportToExcel } from '@/lib/export-utils';
import {
  Printer,
  Download,
  FileText,
  Building2,
  Plane,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface RegionalRow {
  id: string;
  code: string;
  name: string;
  targetQuota: number;
  totalJamaah: number;
  readyCount: number;
  avgScore: number;
  docCompleteCount: number;
  adminCompleteCount: number;
  status: string;
}

interface KloterRow {
  id: string;
  number: number;
  code: string;
  embarkation: string;
  airline: string;
  flight: string;
  capacity: number;
  filled: number;
  status: string;
  departureDate: string;
  dormitoryDate: string;
  leaderName: string;
}

interface LaporanClientViewProps {
  season: any;
  kpi: any;
  regionalData: RegionalRow[];
  kloters: KloterRow[];
}

export function LaporanClientView({
  season,
  kpi,
  regionalData,
  kloters,
}: LaporanClientViewProps) {
  const [activeTab, setActiveTab] = useState<'regional' | 'kloter'>('regional');

  const handlePrint = () => {
    window.print();
  };

  const handleExportRegionalCSV = () => {
    const headers = [
      'No',
      'Kode Wilayah',
      'Kabupaten / Kota',
      'Target Kuota',
      'Total Jamaah',
      'Dokumen Valid',
      'BPIH Lunas',
      'Siap Berangkat',
      'Capaian (%)',
      'Status'
    ];

    const rows = regionalData.map((r, idx) => [
      idx + 1,
      r.code,
      r.name,
      r.targetQuota,
      r.totalJamaah,
      r.docCompleteCount,
      r.adminCompleteCount,
      r.readyCount,
      r.avgScore,
      r.status,
    ]);

    const filename = `Rekapitulasi_Haji_Papua_1447H_${new Date().toISOString().slice(0, 10)}`;

    exportToExcel({
      title: 'Rekapitulasi Kesiapan Haji Provinsi Papua 1447 H / 2026 M',
      headers,
      rows,
      filename,
      sheetName: 'Rekapitulasi Regional',
    });
  };

  const handleExportPdf = () => {
    const headers = [
      'No',
      'Kode Wilayah',
      'Kabupaten / Kota',
      'Target Kuota',
      'Total Jamaah',
      'Dokumen Valid',
      'BPIH Lunas',
      'Siap Berangkat',
      'Capaian (%)',
      'Status'
    ];

    const rows = regionalData.map((r, idx) => [
      idx + 1,
      r.code,
      r.name,
      r.targetQuota,
      r.totalJamaah,
      r.docCompleteCount,
      r.adminCompleteCount,
      r.readyCount,
      r.avgScore,
      r.status,
    ]);

    const filename = `Rekapitulasi_Haji_Papua_1447H_${new Date().toISOString().slice(0, 10)}`;

    exportToPdf({
      title: 'Rekapitulasi Kesiapan Haji Provinsi Papua 1447 H / 2026 M',
      subtitle: `Musim 1447 H / 2026 M - Dicetak: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`,
      headers,
      rows,
      filename,
      orientation: 'landscape',
      footerText: 'SIAP HAJI PAPUA - Laporan Rekapitulasi Regional',
    });
  };

  const totalQuota = regionalData.reduce((acc, r) => acc + r.targetQuota, 0);
  const totalPilgrims = regionalData.reduce((acc, r) => acc + r.totalJamaah, 0);
  const totalReady = regionalData.reduce((acc, r) => acc + r.readyCount, 0);
  const totalDocComplete = regionalData.reduce((acc, r) => acc + r.docCompleteCount, 0);
  const totalAdminComplete = regionalData.reduce((acc, r) => acc + r.adminCompleteCount, 0);
  const provincialAverage =
    regionalData.length > 0
      ? (regionalData.reduce((acc, r) => acc + r.avgScore, 0) / regionalData.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. OFFICIAL GOVERNMENT PRINT HEADER (ONLY VISIBLE ON PRINTED DOCUMENT)
          ========================================================================= */}
      <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-4">
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/branding/app-icon.png" alt="Emblem" className="w-16 h-16 object-contain" />
          <div className="text-center flex-1 px-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black">
              KEMENTERIAN AGAMA REPUBLIK INDONESIA
            </h2>
            <h3 className="text-xs font-bold uppercase text-gray-800">
              KANTOR WILAYAH KEMENTERIAN AGAMA PROVINSI PAPUA
            </h3>
            <h1 className="text-sm font-black uppercase text-black mt-0.5">
              BIDANG PENYELENGGARAAN HAJI DAN UMRAH
            </h1>
            <p className="text-[10px] text-gray-700 italic">
              LAPORAN AUDIT & REKAPITULASI KESIAPAN OPERASIONAL HAJI PROVINSI PAPUA 1447 H / 2026 M
            </p>
          </div>
          <div className="border border-black p-2 text-center text-[9px] font-mono font-bold leading-tight">
            <span>DOKUMEN</span>
            <span className="text-xs block">RESMI</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2.5 text-[10px] text-left border-t border-black/30 font-mono mt-3 text-black">
          <div>Musim: <strong>{season?.seasonName || 'Musim 1447 H / 2026 M'}</strong></div>
          <div>Total Kuota: <strong>{totalQuota} Jamaah</strong></div>
          <div>Indeks Provinsi: <strong>{provincialAverage}%</strong></div>
          <div>Tanggal Cetak: <strong>{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</strong></div>
        </div>
      </div>

      {/* =========================================================================
          2. SCREEN HEADER & CONTROLS (SCREEN ONLY)
          ========================================================================= */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              PUSAT LAPORAN & AUDIT
            </span>
            <span className="text-xs text-gray-500 font-mono">1447 H / 2026 M</span>
          </div>
          <h1 className="text-xl font-black text-gray-900">
            Laporan Resmi Penyelenggaraan Haji Papua
          </h1>
          <p className="text-xs text-gray-500">
            Dokumen rekapitulasi operasional untuk kebutuhan rapat pimpinan (Forkopimda) dan pelaporan Kemenag Pusat
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportRegionalCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-gray-700 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel</span>
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#059669] hover:from-[#1e3a8a] hover:to-[#047857] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer border border-blue-400/30"
          >
            <Printer className="w-4 h-4 text-emerald-200" />
            <span>Ekspor PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. TABS (SCREEN ONLY)
          ========================================================================= */}
      <div className="no-print flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('regional')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'regional'
              ? 'bg-gradient-to-r from-[#1e40af] to-[#059669] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-gray-600 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Rekapitulasi 10 Kab / Kota</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kloter')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'kloter'
              ? 'bg-gradient-to-r from-[#1e40af] to-[#059669] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-gray-600 hover:bg-slate-50'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>2. Rekapitulasi 4 Kloter Papua</span>
        </button>
      </div>

      {/* =========================================================================
          4. TAB 1: REKAPITULASI 10 KAB / KOTA
          ========================================================================= */}
      {(activeTab === 'regional' || typeof window === 'undefined') && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 print:border-none print:shadow-none">
          <div className="no-print p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              Tabel Rekapitulasi Kesiapan 10 Kabupaten / Kota Se-Provinsi Papua
            </h2>
            <span className="text-xs text-gray-500 font-mono">
              Indeks Kesiapan Provinsi: <strong className="text-emerald-700">{provincialAverage}%</strong>
            </span>
          </div>

          <div className="overflow-x-auto p-4 pt-0 print:p-0">
            <table className="w-full text-left text-xs print:border print:border-black">
              <thead className="bg-slate-50 border-b border-slate-200 text-gray-600 font-bold print:bg-gray-100 print:text-black">
                <tr>
                  <th className="p-3 print:p-2 print:border print:border-black text-center">No</th>
                  <th className="p-3 print:p-2 print:border print:border-black">Kabupaten / Kota</th>
                  <th className="p-3 print:p-2 print:border print:border-black text-center">Kuota</th>
                  <th className="p-3 print:p-2 print:border print:border-black text-center">Terdaftar</th>
                  <th className="p-3 print:p-2 print:border print:border-black text-center">Dokumen Valid</th>
                  <th className="p-3 print:p-2 print:border print:border-black text-center">BPIH Lunas</th>
                  <th className="p-3 print:p-2 print:border print:border-black text-center">Siap Berangkat</th>
                  <th className="p-3 print:p-2 print:border print:border-black text-center">Capaian (%)</th>
                  <th className="p-3 print:p-2 print:border print:border-black text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-black">
                {regionalData.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 print:border-b print:border-black">
                    <td className="p-3 print:p-2 print:border print:border-black text-center font-mono text-gray-500 print:text-black">
                      {idx + 1}
                    </td>
                    <td className="p-3 print:p-2 print:border print:border-black font-bold text-gray-900 print:text-black">
                      {r.name}
                      <span className="block text-[10px] font-mono text-gray-400 print:text-gray-600 font-normal">
                        {r.code}
                      </span>
                    </td>
                    <td className="p-3 print:p-2 print:border print:border-black text-center font-mono font-bold text-gray-800 print:text-black">
                      {r.targetQuota}
                    </td>
                    <td className="p-3 print:p-2 print:border print:border-black text-center font-mono text-gray-700 print:text-black">
                      {r.totalJamaah}
                    </td>
                    <td className="p-3 print:p-2 print:border print:border-black text-center font-mono text-gray-700 print:text-black">
                      {r.docCompleteCount}
                    </td>
                    <td className="p-3 print:p-2 print:border print:border-black text-center font-mono text-gray-700 print:text-black">
                      {r.adminCompleteCount}
                    </td>
                    <td className="p-3 print:p-2 print:border print:border-black text-center font-mono font-bold text-emerald-700 print:text-black">
                      {r.readyCount}
                    </td>
                    <td className="p-3 print:p-2 print:border print:border-black text-center font-mono font-bold">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 print:bg-transparent print:border-none print:text-black">
                        {r.avgScore}%
                      </span>
                    </td>
                    <td className="p-3 print:p-2 print:border print:border-black text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'SIAP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'DALAM PROSES'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        } print:bg-transparent print:text-black`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 print:bg-gray-200 print:border-t-2 print:border-black print:text-black">
                  <td colSpan={2} className="p-3 print:p-2 print:border print:border-black text-center uppercase tracking-wider">
                    Total Provinsi Papua
                  </td>
                  <td className="p-3 print:p-2 print:border print:border-black text-center font-mono font-black">
                    {totalQuota}
                  </td>
                  <td className="p-3 print:p-2 print:border print:border-black text-center font-mono font-black">
                    {totalPilgrims}
                  </td>
                  <td className="p-3 print:p-2 print:border print:border-black text-center font-mono font-black">
                    {totalDocComplete}
                  </td>
                  <td className="p-3 print:p-2 print:border print:border-black text-center font-mono font-black">
                    {totalAdminComplete}
                  </td>
                  <td className="p-3 print:p-2 print:border print:border-black text-center font-mono font-black text-emerald-800 print:text-black">
                    {totalReady}
                  </td>
                  <td className="p-3 print:p-2 print:border print:border-black text-center font-mono font-black text-emerald-800 print:text-black">
                    {provincialAverage}%
                  </td>
                  <td className="p-3 print:p-2 print:border print:border-black text-center text-emerald-800 print:text-black">
                    TERKENDALI
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. TAB 2: REKAPITULASI 4 KLOTER PAPUA
          ========================================================================= */}
      {activeTab === 'kloter' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              Rekapitulasi 4 Kloter Papua (Embarkasi Hasanuddin Makassar UPG)
            </h2>
            <span className="text-xs text-gray-500 font-mono">Musim 1447 H / 2026 M</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {kloters.map((k) => (
              <div
                key={k.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1e40af] uppercase tracking-wider block">
                      Kloter {k.number}
                    </span>
                    <h3 className="text-base font-black text-gray-900">{k.code}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {k.airline} ({k.flight})
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {k.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-xl bg-white border border-slate-200">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-sans">Kapasitas Seat:</span>
                    <strong>{k.filled} / {k.capacity}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-sans">Ketua Kloter:</span>
                    <strong className="truncate block font-sans text-xs">{k.leaderName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-sans">Masuk Asrama:</span>
                    <span>{k.dormitoryDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-sans">Jadwal Terbang:</span>
                    <span className="text-emerald-700 font-bold">{k.departureDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-[11px] text-gray-500">{k.embarkation}</span>
                  <Link
                    href={`/kloter/${k.id}`}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#1e40af] to-[#059669] hover:from-[#1e3a8a] hover:to-[#047857] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Buka & Cetak Manifest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          6. OFFICIAL SIGN-OFF BLOCK (ONLY VISIBLE ON PRINTED DOCUMENT)
          ========================================================================= */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-8 text-center text-xs border-t border-black mt-8 text-black">
        <div>
          <span className="block text-[10px] text-gray-700">Diverifikasi & Diperiksa Oleh,</span>
          <strong className="block font-bold">Plt. Kepala Bidang Penyelenggaraan Haji dan Umrah</strong>
          <span className="block text-[10px] text-gray-600">Kanwil Kementerian Agama Provinsi Papua</span>
          <div className="h-16" />
          <span className="block font-bold underline">(...................................................)</span>
          <span className="block text-[10px] text-gray-600">NIP. 19780815 200501 1 003</span>
        </div>

        <div>
          <span className="block text-[10px] text-gray-700">Jayapura, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
          <span className="block text-[10px] text-gray-700">Mengetahui & Menyetujui,</span>
          <strong className="block font-bold">Kepala Kantor Wilayah Kementerian Agama</strong>
          <span className="block text-[10px] text-gray-600">Provinsi Papua</span>
          <div className="h-16" />
          <span className="block font-bold underline">(...................................................)</span>
          <span className="block text-[10px] text-gray-600">NIP. 19690320 199403 1 002</span>
        </div>
      </div>
    </div>
  );
}
