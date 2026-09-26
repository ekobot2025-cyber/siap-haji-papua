'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import {
  Plane,
  ArrowLeft,
  Users,
  ShieldCheck,
  Calendar,
  Building2,
  Search,
  UserCheck,
  RefreshCw,
  Printer,
  Download,
  FileSpreadsheet,
} from 'lucide-react';

export default function KloterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [kloter, setKloter] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const handleExportCSV = () => {
    if (!kloter || !kloter.members) return;
    const headers = [
      'No',
      'Seat Pesawat',
      'Nomor Porsi',
      'Nama Lengkap',
      'Jenis Kelamin',
      'Asal Wilayah',
      'Rombongan / Regu',
      'Indeks Kesiapan (%)',
      'Status Keberangkatan',
      'Kategori Khusus',
    ];

    const rows = kloter.members.map((m: any, idx: number) => [
      idx + 1,
      m.seatNumber || 'Belum Diatur',
      m.jamaah.porsiNumber,
      `"${m.jamaah.fullName.replace(/"/g, '""')}"`,
      m.jamaah.gender === 'MALE' ? 'L' : 'P',
      `"${m.jamaah.region?.name || 'Provinsi Papua'}"`,
      `"${m.group ? `${m.group.name}` : 'Regu 1'}"`,
      m.jamaah.readinessScore?.totalScore?.toFixed(0) || '100',
      m.jamaah.status || 'SIAP_BERANGKAT',
      m.jamaah.isPriorityElderly ? `Prioritas Lansia (${m.jamaah.elderlyAge} Th)` : 'Reguler',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Manifest_Resmi_Kloter_${kloter.kloterCode}_1447H.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/kloter/${id}`);
      const data = await res.json();
      if (data.success) {
        setKloter(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Memuat manifest kloter...</div>;
  }

  if (!kloter) {
    return (
      <div className="text-center py-16 text-gray-400">
        Kloter tidak ditemukan.{' '}
        <Link href="/kloter" className="text-[#0A3E2F] underline">
          Kembali ke daftar kloter
        </Link>
      </div>
    );
  }

  const members = kloter.members || [];
  const filteredMembers = members.filter((m: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.jamaah.fullName.toLowerCase().includes(q) ||
      m.jamaah.porsiNumber.includes(q) ||
      (m.seatNumber && m.seatNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Official Government Print Header (Visible only when printed) */}
      <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-4">
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/branding/app-icon.png" alt="Emblem" className="w-14 h-14 object-contain" />
          <div className="text-center flex-1 px-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black">
              KEMENTERIAN AGAMA REPUBLIK INDONESIA
            </h2>
            <h3 className="text-xs font-bold uppercase text-gray-800">
              DIREKTORAT JENDERAL PENYELENGGARAAN HAJI DAN UMRAH
            </h3>
            <h1 className="text-sm font-black uppercase text-black mt-0.5">
              PANITIA PENYELENGGARA IBADAH HAJI (PPIH) EMBARKASI PAPUA
            </h1>
            <p className="text-[10px] text-gray-700 italic">
              DAFTAR NOMINATIF & MANIFEST RESMI PENERBANGAN HAJI 1447 H / 2026 M
            </p>
          </div>
          <div className="border border-black p-2 text-center text-[9px] font-mono font-bold leading-tight">
            <span>KLOTER</span>
            <span className="text-sm block">{kloter.kloterCode}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2.5 text-[10px] text-left border-t border-black/30 font-mono mt-3 text-black">
          <div>Embarkasi: <strong>{kloter.embarkationName}</strong></div>
          <div>Pesawat: <strong>{kloter.airlineName} ({kloter.flightNumber})</strong></div>
          <div>Kapasitas: <strong>{kloter.capacityTotal} Seat</strong></div>
          <div>Total Terisi: <strong>{members.length} Jamaah</strong></div>
        </div>
      </div>

      {/* Top Navigation (Screen Only) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <Link
          href="/kloter"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Manajemen Kloter
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-gray-700 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekspor CSV / Excel</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-[#0A3E2F] hover:bg-[#072c21] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Cetak Manifest PDF</span>
          </button>
        </div>
      </div>

      {/* Kloter Header Hero (Screen Only) */}
      <div className="no-print bg-gradient-to-r from-[#0A3E2F] to-[#124d3c] p-6 rounded-3xl text-white shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider block">
              Manifest Resmi Internal — Embarkasi Haji
            </span>
            <h1 className="text-2xl font-black mt-1">
              Kloter {kloter.kloterNumber} ({kloter.kloterCode})
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {kloter.embarkationName} • Maskapai {kloter.airlineName || 'Garuda Indonesia'} ({kloter.flightNumber || 'GA-1101'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center border border-white/10">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">Total Jamaah</span>
              <span className="text-xl font-black font-mono text-[#D4AF37]">{members.length} / {kloter.capacityTotal}</span>
            </div>
            <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center border border-white/10">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">Status Kloter</span>
              <span className="text-sm font-bold text-emerald-300">{kloter.status}</span>
            </div>
          </div>
        </div>

        {/* Officers Row */}
        {kloter.officers && kloter.officers.length > 0 && (
          <div className="pt-3 border-t border-white/10">
            <span className="text-[11px] font-bold text-[#D4AF37] block mb-2">Petugas Kloter Terpadu:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {kloter.officers.map((off: any) => (
                <div key={off.id} className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold block">{off.roleType}</span>
                  <strong className="text-white block truncate">{off.fullName}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manifest Search & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-3 print:border-none print:shadow-none">
        <div className="no-print p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari jamaah, porsi, atau nomor seat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0A3E2F]"
            />
          </div>

          <span className="text-xs font-bold text-gray-700">
            Menampilkan {filteredMembers.length} Jamaah Terdata
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs print:border print:border-black">
            <thead className="bg-slate-50 border-b border-slate-200 text-gray-600 font-bold print:bg-gray-100 print:text-black">
              <tr>
                <th className="p-3.5 print:p-2 print:border print:border-black">Seat</th>
                <th className="p-3.5 print:p-2 print:border print:border-black">Nama Jamaah & Porsi</th>
                <th className="p-3.5 print:p-2 print:border print:border-black">Wilayah Asal</th>
                <th className="p-3.5 print:p-2 print:border print:border-black">L/P</th>
                <th className="p-3.5 print:p-2 print:border print:border-black">Rombongan / Regu</th>
                <th className="p-3.5 print:p-2 print:border print:border-black">Kesiapan</th>
                <th className="no-print p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 print:divide-black">
              {filteredMembers.map((m: any) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors print:border-b print:border-black">
                  <td className="p-3.5 print:p-2 print:border print:border-black font-mono font-bold text-[#0A3E2F] print:text-black">
                    {m.seatNumber || '-'}
                  </td>
                  <td className="p-3.5 print:p-2 print:border print:border-black">
                    <span className="font-bold text-[#0A3E2F] print:text-black block">
                      {m.jamaah.fullName}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-gray-500 print:text-black text-[11px]">
                      <span>No. Porsi: {m.jamaah.porsiNumber}</span>
                      {m.jamaah.isPriorityElderly && (
                        <span className="text-[9px] bg-purple-100 print:bg-transparent print:border print:border-black text-purple-800 print:text-black px-1 rounded font-bold font-sans">
                          Lansia ({m.jamaah.elderlyAge} th)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 print:p-2 print:border print:border-black font-medium text-gray-700 print:text-black">
                    {m.jamaah.region?.name || '-'}
                  </td>
                  <td className="p-3.5 print:p-2 print:border print:border-black text-gray-600 print:text-black">
                    {m.jamaah.gender === 'MALE' ? 'L' : 'P'}
                  </td>
                  <td className="p-3.5 print:p-2 print:border print:border-black font-medium text-gray-800 print:text-black">
                    {m.group ? `${m.group.name}` : 'Regu 1'}
                  </td>
                  <td className="p-3.5 print:p-2 print:border print:border-black">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 print:bg-transparent text-emerald-800 print:text-black font-mono">
                      {m.jamaah.readinessScore?.totalScore?.toFixed(0) || 100}%
                    </span>
                  </td>
                  <td className="no-print p-3.5 text-right">
                    <Link
                      href={`/jamaah/${m.jamaah.id}`}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-gray-700 hover:bg-slate-100 inline-block"
                    >
                      Profil 360°
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Sign-off Block (Visible only in print) */}
      <div className="hidden print:grid grid-cols-3 gap-6 pt-8 text-center text-xs border-t border-black mt-8 text-black">
        <div>
          <span className="block text-[10px] text-gray-700">Mengetahui,</span>
          <strong className="block font-bold">Ketua PPIH Embarkasi Papua</strong>
          <div className="h-16" />
          <span className="block font-bold underline">(...................................................)</span>
          <span className="block text-[10px] text-gray-600">NIP. 19740510 200112 1 001</span>
        </div>

        <div>
          <span className="block text-[10px] text-gray-700">Disahkan Oleh,</span>
          <strong className="block font-bold">Ketua Kloter {kloter.kloterCode} (TPHI)</strong>
          <div className="h-16" />
          <span className="block font-bold underline">({kloter.officers?.[0]?.fullName || 'H. Abdul Karim, S.Ag'})</span>
          <span className="block text-[10px] text-gray-600">Petugas Kloter Terpadu</span>
        </div>

        <div>
          <span className="block text-[10px] text-gray-700">Perwakilan Maskapai,</span>
          <strong className="block font-bold">Station Manager {kloter.airlineName || 'Garuda Indonesia'}</strong>
          <div className="h-16" />
          <span className="block font-bold underline">(...................................................)</span>
          <span className="block text-[10px] text-gray-600">Otoritas Bandara Embarkasi</span>
        </div>
      </div>
    </div>
  );
}
