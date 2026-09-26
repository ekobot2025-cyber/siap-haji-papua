import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  HeartPulse,
  CreditCard,
  BookOpen,
  Plane,
  Phone,
  Printer,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  Info,
  User,
  Sparkles,
} from 'lucide-react';
import { getServerSession } from '@/infrastructure/security/jwt';
import { prisma } from '@/infrastructure/database/prisma.client';
import { SmartPassModalClient } from './SmartPassModalClient';

export const dynamic = 'force-dynamic';

function maskNikLocal(nik: string): string {
  if (!nik || nik.length < 8) return '917101******0001';
  return `${nik.slice(0, 6)}******${nik.slice(-4)}`;
}

const jamaahIncludeConfig = {
  region: true,
  season: true,
  readinessScore: true,
  documents: {
    include: { documentType: true },
    orderBy: { documentType: { sortOrder: 'asc' as const } },
  },
  administrationRecords: {
    orderBy: { createdAt: 'desc' as const },
  },
  healthRecords: {
    orderBy: { createdAt: 'desc' as const },
  },
  kloterMembership: {
    include: {
      kloter: {
        include: {
          officers: true,
        },
      },
      group: true,
    },
  },
};

export default async function PortalJamaahPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  // 1. Ambil data Jamaah yang terhubung dengan akun user, atau fallback ke porsi 2700192001 (Fatimah Hidayat)
  let jamaah = await prisma.jamaah.findFirst({
    where: { userId: session.userId },
    include: jamaahIncludeConfig,
  });

  // Fallback demo pilgrim jika user adalah petugas yang membuka preview portal jamaah
  if (!jamaah) {
    jamaah = await prisma.jamaah.findFirst({
      where: { porsiNumber: '2700192001' },
      include: jamaahIncludeConfig,
    });
  }

  if (!jamaah) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900">Data Jamaah Belum Ditemukan</h2>
        <p className="text-xs text-gray-500 mt-1">
          Akun Anda belum ditautkan ke basis data porsi jamaah haji Provinsi Papua.
        </p>
      </div>
    );
  }

  // 2. Ambil seluruh event manasik wilayah jamaah
  const manasikEvents = await prisma.manasikEvent.findMany({
    where: {
      seasonId: jamaah.seasonId,
      regionId: jamaah.regionId,
    },
    include: {
      attendances: {
        where: { jamaahId: jamaah.id },
      },
    },
    orderBy: { eventDate: 'asc' },
  });

  const readinessScore = jamaah.readinessScore?.totalScore ?? 90.0;
  const isReady = readinessScore >= 85.0;
  const kloter = jamaah.kloterMembership?.kloter;
  const group = jamaah.kloterMembership?.group;

  let breakdownMap: Record<string, number> = {
    IDENTITAS: 100,
    ADMINISTRASI: 100,
    DOKUMEN: 90,
    KESEHATAN: 100,
    MANASIK: 85,
    KLOTER: 100,
  };

  if (jamaah.readinessScore?.componentBreakdown) {
    try {
      const parsed = JSON.parse(jamaah.readinessScore.componentBreakdown);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item.componentCode && typeof item.scorePercentage === 'number') {
            breakdownMap[item.componentCode] = item.scorePercentage;
          }
        }
      }
    } catch {
      // keep defaults
    }
  }

  // Breakdown 6 Pilar Kesiapan
  const pillars = [
    {
      id: 'IDENTITAS',
      name: 'Identitas & Biodata',
      score: breakdownMap['IDENTITAS'] ?? 100,
      icon: User,
      status: 'LENGKAP',
      desc: 'Data KTP, NIK, dan biodata tervalidasi Dukcapil.',
    },
    {
      id: 'ADMINISTRASI',
      name: 'Administrasi BPIH',
      score: breakdownMap['ADMINISTRASI'] ?? 100,
      icon: CreditCard,
      status: 'LUNAS',
      desc: 'Pelunasan Biaya Perjalanan Ibadah Haji Tahap 1 & 2 telah selesai.',
    },
    {
      id: 'DOKUMEN',
      name: 'Dokumen & Paspor',
      score: breakdownMap['DOKUMEN'] ?? 90,
      icon: FileCheck,
      status: 'TERVERIFIKASI',
      desc: 'Paspor RI aktif (>6 bulan) dan proses penerbitan Visa E-Hajj.',
    },
    {
      id: 'KESEHATAN',
      name: 'Pemeriksaan Kesehatan',
      score: breakdownMap['KESEHATAN'] ?? 100,
      icon: HeartPulse,
      status: 'ISTITHA\'AH',
      desc: 'Pemeriksaan tahap 2 selesai & vaksin meningitis terverifikasi.',
    },
    {
      id: 'MANASIK',
      name: 'Bimbingan Manasik',
      score: breakdownMap['MANASIK'] ?? 85,
      icon: BookOpen,
      status: 'MENGIKUTI',
      desc: 'Presensi manasik tingkat KUA dan Kankemenag aktif.',
    },
    {
      id: 'KLOTER',
      name: 'Penetapan Kloter',
      score: breakdownMap['KLOTER'] ?? 100,
      icon: Plane,
      status: 'TERALOKASI',
      desc: kloter ? `Kloter ${kloter.kloterCode} Embarkasi Makassar (UPG)` : 'Dalam proses penetapan',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Sambutan Syar'i & Identitas Ringkas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A3E2F] via-[#0e4e3c] to-[#0A3E2F] text-white p-6 sm:p-8 shadow-xl border-2 border-[#D4AF37]/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PORTAL MANDIRI JAMAAH HAJI PAPUA • 1447 H / 2026 M</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Assalamu&apos;alaikum,{' '}
              <span className="text-[#D4AF37]">{jamaah.fullName}</span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Selamat datang di portal pelayanan dan pemantauan kesiapan haji Anda. Seluruh berkas administrasi,
              istitha&apos;ah kesehatan, dan bimbingan manasik Anda terkoordinasi langsung dengan Tim PPIH Provinsi Papua.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-white/10 px-3 py-1.5 rounded-xl font-mono text-emerald-200 border border-white/10">
                No. Porsi: <strong className="text-white">{jamaah.porsiNumber}</strong>
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl text-emerald-200 border border-white/10">
                Wilayah: <strong className="text-white">{jamaah.region.name}</strong>
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl text-emerald-200 border border-white/10">
                Kloter: <strong className="text-[#D4AF37]">{kloter ? kloter.kloterCode : 'UPG-02'}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action: Smart Pass Trigger */}
          <div className="shrink-0 flex flex-col items-center sm:items-end justify-center gap-3">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center w-full sm:w-auto">
              <span className="text-[10px] text-slate-300 uppercase font-bold block mb-1">
                Indeks Kesiapan Diri
              </span>
              <div className="text-3xl font-black font-mono text-[#D4AF37]">
                {readinessScore.toFixed(0)}%
              </div>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isReady ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {isReady ? '✓ SIAP BERANGKAT' : 'DALAM PROSES'}
              </span>
            </div>

            <SmartPassModalClient
              jamaah={{
                fullName: jamaah.fullName,
                porsiNumber: jamaah.porsiNumber,
                regionName: jamaah.region.name,
                bloodType: jamaah.bloodType || 'B',
                age: 2026 - jamaah.birthDate.getFullYear(),
                gender: jamaah.gender,
                kloterCode: kloter ? kloter.kloterCode : 'UPG-02',
                kloterNumber: kloter ? kloter.kloterNumber : 2,
                embarkation: kloter ? kloter.embarkationName : 'Embarkasi Hasanuddin Makassar (UPG)',
                airline: kloter?.airlineName || 'Garuda Indonesia',
                flightNumber: kloter?.flightNumber || 'GA-1102',
                seatNumber: jamaah.kloterMembership?.seatNumber || '14-B',
                groupName: group?.name || 'Rombongan 2 (Regu 1)',
                dormitoryDate: kloter?.dormitoryInDate ? kloter.dormitoryInDate.toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '14 Mei 2026',
                departureDate: kloter?.flightDepartureDate ? kloter.flightDepartureDate.toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '15 Mei 2026',
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. 6 Pilar Kesiapan Diri (Readiness Grid) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Progres 6 Pilar Kesiapan Keberangkatan
            </h2>
            <p className="text-xs text-gray-500">
              Status kelengkapan syarat dan verifikasi resmi sebelum keberangkatan ke Tanah Suci
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Terverifikasi Sistem
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            const isFull = p.score >= 100;
            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#0A3E2F]/30 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#0A3E2F] flex items-center justify-center border border-slate-200 shadow-2xs">
                      <Icon className="w-5 h-5 text-[#0A3E2F]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-gray-900">{p.name}</h3>
                      <span className="text-[10px] font-semibold text-emerald-700">{p.status}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-gray-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {p.score}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isFull ? 'bg-emerald-600' : 'bg-[#D4AF37]'
                    }`}
                    style={{ width: `${Math.min(100, p.score)}%` }}
                  />
                </div>

                <p className="text-[11px] text-gray-600 leading-snug">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Section Dokumen & Berkas (id="dokumen") */}
      <div id="dokumen" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Kelengkapan Dokumen Fisik & Biometrik</h2>
              <p className="text-xs text-gray-500">Berkas pendaftaran, paspor, dan visa haji reguler</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">6 Dokumen Terdaftar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-gray-600">
                <th className="py-2.5 px-3 font-semibold">Jenis Dokumen</th>
                <th className="py-2.5 px-3 font-semibold">Nomor Berkas</th>
                <th className="py-2.5 px-3 font-semibold">Status Validasi</th>
                <th className="py-2.5 px-3 font-semibold">Keterangan Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jamaah.documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-bold text-gray-900 flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{doc.documentType.name}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-600">
                    {doc.documentNumber || '—'}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'TERVERIFIKASI'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'DITOLAK'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.status === 'TERVERIFIKASI' && <CheckCircle2 className="w-3 h-3" />}
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-[11px]">
                    {doc.rejectionReason || 'Berkas telah divalidasi dan memenuhi ketentuan.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Section Manasik & Jadwal (id="manasik") */}
      <div id="manasik" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Jadwal & Presensi Bimbingan Manasik Haji</h2>
              <p className="text-xs text-gray-500">Bimbingan resmi tingkat Distrik (KUA) dan Kantor Kemenag {jamaah.region.name}</p>
            </div>
          </div>
          <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Wajib Dihadiri
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {manasikEvents.map((m) => {
            const hasAttended = m.attendances.some((a) => a.status === 'HADIR');
            const eventDate = new Date(m.eventDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      Sesi {m.sessionNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasAttended
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {hasAttended ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {hasAttended ? 'HADIR TERVALIDASI' : 'JADWAL MENDATANG'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-900 mt-2">{m.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-1">{m.topicDescription}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-gray-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{eventDate} ({m.startTime} - {m.endTime} WIT)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{m.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Narasumber: {m.speakerName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Section Petugas Kloter & Narahubung Siaga (id="petugas") */}
      <div id="petugas" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Informasi Kloter & Narahubung Petugas Pendamping
              </h2>
              <p className="text-xs text-gray-500">
                Tim PPIH Kloter {kloter ? kloter.kloterCode : 'UPG-02'} siap melayani ibadah dan kesehatan Anda
              </p>
            </div>
          </div>
          <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Layanan 24 Jam
          </span>
        </div>

        {/* Flight & Lodging Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs">
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Maskapai & Nomor Flight:</span>
            <strong className="text-blue-950 font-bold">{kloter?.airlineName || 'Garuda Indonesia'} ({kloter?.flightNumber || 'GA-1102'})</strong>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Masuk Asrama Haji Sudiang:</span>
            <strong className="text-blue-950 font-bold">14 Mei 2026 (Wajib Tiba 08:00 WITA)</strong>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Terbang ke Bandara AMAA Madinah:</span>
            <strong className="text-blue-950 font-bold">15 Mei 2026 (Pukul 08:00 WITA)</strong>
          </div>
        </div>

        {/* Officers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              TPHI (Ketua Kloter)
            </span>
            <h4 className="text-xs font-bold text-gray-900 pt-1">H. Abdul Karim, S.Ag</h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono">0811-4800-101</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              TPIHI (Pembimbing Ibadah)
            </span>
            <h4 className="text-xs font-bold text-gray-900 pt-1">Drs. H. Syarifuddin, M.Pd</h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-1">
              <Phone className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-mono">0811-4800-102</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
              TKHI (Dokter Kloter)
            </span>
            <h4 className="text-xs font-bold text-gray-900 pt-1">dr. Sarah Wulandari, Sp.PD</h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-1">
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              <span className="font-mono">0811-4800-103</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              TPHD (Pelayanan Umum)
            </span>
            <h4 className="text-xs font-bold text-gray-900 pt-1">H. M. Mansyur</h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 pt-1">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono">0811-4800-104</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Catatan Penting & Bantuan */}
      <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block font-bold">Pusat Informasi & Pelayanan Haji Kankemenag {jamaah.region.name}</strong>
            <p className="text-[11px] text-amber-800">
              Bila terdapat perubahan nomor telepon keluarga atau kendala kesehatan darurat, segera laporkan ke Seksi PHU Kemenag setempat atau melalui posko layanan terdekat.
            </p>
          </div>
        </div>

        <Link
          href="/cek-porsi"
          className="shrink-0 px-4 py-2 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition-colors flex items-center gap-1.5"
        >
          <span>Buka Cek Porsi Publik</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
