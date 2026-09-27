'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plane,
  CreditCard,
  FileCheck,
  BookOpen,
  Filter,
} from 'lucide-react';

export default function KalenderPage() {
  const [filterCategory, setFilterCategory] = useState('ALL');

  const milestones = [
    {
      id: 1,
      title: 'Batas Akhir Pelunasan BPIH Tahap 1',
      date: '10 Februari 2026',
      time: '15:00 WIT',
      category: 'ADMINISTRASI',
      status: 'SELESAI',
      description: 'Pelunasan setoran lunas biaya haji reguler bagi kuota berhak lunas urut porsi.',
      icon: CreditCard,
    },
    {
      id: 2,
      title: 'Batas Akhir Unggah & Verifikasi Paspor RI',
      date: '28 Februari 2026',
      time: '23:59 WIT',
      category: 'DOKUMEN',
      status: 'SELESAI',
      description: 'Seluruh paspor jamaah Papua minimal masa berlaku 6 bulan dan nama 3 suku kata.',
      icon: FileCheck,
    },
    {
      id: 3,
      title: 'Pemeriksaan Kesehatan Tahap 2 & Penetapan Istitha\'ah',
      date: '15 Maret 2026',
      time: '08:00 - 16:00 WIT',
      category: 'KESEHATAN',
      status: 'BERJALAN',
      description: 'Pemeriksaan laboratorium dan rekomendasi kelayakan terbang oleh tim dokter RSUD.',
      icon: AlertCircle,
    },
    {
      id: 4,
      title: 'Bimbingan Manasik Tingkat KUA (Distrik)',
      date: '20 Maret - 05 April 2026',
      time: 'Sesuai Jadwal KUA',
      category: 'MANASIK',
      status: 'AKAN_DATANG',
      description: 'Bimbingan fiqih ibadah tawaf, sa\'i, dan ihram di tingkat KUA masing-masing wilayah.',
      icon: BookOpen,
    },
    {
      id: 5,
      title: 'Bimbingan Manasik Massal & Simulasi Lapangan Kab/Kota',
      date: '10 April 2026',
      time: '08:00 WIT',
      category: 'MANASIK',
      status: 'AKAN_DATANG',
      description: 'Praktik tawaf massal dan pengenalan keselamatan penerbangan di Jayapura & Biak.',
      icon: BookOpen,
    },
    {
      id: 6,
      title: 'Penerbitan Visa Haji & Manifest Final Kloter',
      date: '25 April 2026',
      time: '12:00 WIT',
      category: 'DOKUMEN',
      status: 'AKAN_DATANG',
      description: 'Penyelesaian visa e-Hajj dan penguncian nomor kursi pesawat.',
      icon: FileCheck,
    },
    {
      id: 7,
      title: 'Masuk Asrama Haji Hasanuddin Makassar (Kloter 01 UPG)',
      date: '18 Mei 2026',
      time: '09:00 WITA',
      category: 'PENERBANGAN',
      status: 'AKAN_DATANG',
      description: 'Penerimaan jamaah Papua di asrama embarkasi, gelang identitas, dan living cost.',
      icon: Plane,
    },
    {
      id: 8,
      title: 'Keberangkatan Kloter 01 UPG Menuju Madinah',
      date: '19 Mei 2026',
      time: '14:20 WITA',
      category: 'PENERBANGAN',
      status: 'AKAN_DATANG',
      description: 'Penerbangan maskapai Garuda Indonesia nomor GA-1101 menuju Bandara AMAA Madinah.',
      icon: Plane,
    },
  ];

  const filtered = milestones.filter((m) => filterCategory === 'ALL' || m.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e8dfc8]">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-white font-bold shadow-xs">
            <CalendarIcon className="w-6 h-6 text-white" />
          </span>
          <div>
            <h1 className="text-xl font-black text-[#1A1410] tracking-tight">
              KALENDER OPERASIONAL & TIMELINE HAJI 1447 H / 2026 M
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Jadwal tahapan terpadu, batas waktu krusial, bimbingan manasik, dan operasional Embarkasi Makassar (UPG)
            </p>
          </div>
        </div>

        {/* Filter categories - Tampil penuh responsive */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'ADMINISTRASI', 'DOKUMEN', 'KESEHATAN', 'MANASIK', 'PENERBANGAN'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'btn-kemenhaj-primary text-white font-bold shadow-xs'
                  : 'bg-white border border-[#e8dfc8] text-gray-700 hover:bg-[#fbf8ee]'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Flow */}
      <div className="bg-white rounded-3xl border border-[#e8dfc8] p-6 shadow-xs">
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#e8dfc8]">
          {filtered.map((m) => {
            const Icon = m.icon;
            const isDone = m.status === 'SELESAI';
            const isCurrent = m.status === 'BERJALAN';

            return (
              <div key={m.id} className="relative flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 border-2 ${
                  isDone
                    ? 'bg-[#c9a961] text-white border-[#b8941e] shadow-xs'
                    : isCurrent
                    ? 'bg-[#b8941e] text-white border-[#c9a961] ring-4 ring-[#c9a961]/25 shadow-md'
                    : 'bg-white text-slate-400 border-slate-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                  isCurrent ? 'bg-[#fbf8ee] border-[#c9a961] shadow-xs' : 'bg-slate-50/50 border-slate-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                        {m.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isDone
                          ? 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]'
                          : isCurrent
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs font-mono font-bold text-gray-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {m.date} ({m.time})
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 mt-2">{m.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{m.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
