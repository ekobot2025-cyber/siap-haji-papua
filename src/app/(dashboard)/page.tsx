import React from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertOctagon,
  HeartHandshake,
  TrendingUp,
  MapPin,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  FileCheck,
  HeartPulse,
  CreditCard,
  BookOpen,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { getServerSession } from '@/infrastructure/security/jwt';
import { DashboardService } from '@/application/services/dashboard.service';
import { ReadinessBadge } from '@/components/ui/StatusBadge';
import { RecalculateButton } from '@/components/dashboard/RecalculateButton';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  if (session.roles.includes('JAMAAH')) {
    redirect('/portal-jamaah');
  }
  const data = await DashboardService.getExecutiveData(session);

  const { kpi, season, componentsReadiness, regionalRanking, recentActivities } = data;

  return (
    <div className="space-y-6">
      {/* 1. Header & Season Notice */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Executive Command Center
            </h1>
            <span className="bg-[#15803D]/10 text-[#0A3E2F] text-xs font-bold px-2 py-0.5 rounded-full border border-[#15803D]/20">
              Musim Aktif: {season?.yearHijri || 1447} H
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Pemantauan Kesiapan Administratif & Penyelenggaraan Haji Tingkat Provinsi Papua
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RecalculateButton seasonId={season?.id} />
          <Link
            href="/jamaah"
            className="flex items-center gap-1.5 bg-[#0A3E2F] hover:bg-[#15803D] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Lihat Data Jamaah</span>
          </Link>
        </div>
      </div>

      {/* 2. PRIMARY KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Jamaah */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Jamaah</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">
              {kpi.totalJamaah}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Kuota Musim: {season?.quotaTotal || 1080}</span>
              <span className="font-semibold text-emerald-700">{Math.round((kpi.totalJamaah / (season?.quotaTotal || 1080)) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Siap Berangkat (>=90) */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Siap Berangkat</span>
            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
              {kpi.siapBerangkat}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              {kpi.totalJamaah > 0 ? `${((kpi.siapBerangkat / kpi.totalJamaah) * 100).toFixed(1)}% dari total` : '-'}
            </div>
          </div>
        </div>

        {/* Dalam Proses (75 - 89.9) */}
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Dalam Proses</span>
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-800 font-mono">
              {kpi.dalamProses}
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">
              {kpi.totalJamaah > 0 ? `${((kpi.dalamProses / kpi.totalJamaah) * 100).toFixed(1)}% dari total` : '-'}
            </div>
          </div>
        </div>

        {/* Perlu Tindak Lanjut (50 - 74.9) */}
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tindak Lanjut</span>
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-800 font-mono">
              {kpi.perluTindakLanjut}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">
              Perlu intervensi berkas
            </div>
          </div>
        </div>

        {/* Prioritas & Lansia */}
        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Lansia Prioritas</span>
            <div className="p-1.5 bg-purple-100 rounded-lg text-purple-700">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-900 font-mono">
              {kpi.lansiaPrioritas}
            </div>
            <div className="text-[11px] text-purple-700 font-semibold mt-1 flex items-center justify-between">
              <span>Usia $\ge 65$ Tahun</span>
              <span className="text-red-700 font-bold">Prioritas: {kpi.prioritasIntervensi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PROVINCIAL READINESS INDEX (INDEKS KESIAPAN ADMINISTRATIF PROVINSI PAPUA) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#D4AF37]">
                Indikator Kesiapan Internal
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                Formula Bobot Dinamis
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Indeks Kesiapan Administratif Provinsi Papua
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-black text-[#0A3E2F] font-mono">
                {Number(kpi?.provincialReadinessIndex ?? 0).toFixed(1)}%
              </div>
              <div className="text-xs font-bold text-[#15803D]">
                Status Agregat: {kpi.provincialReadinessIndex >= 90 ? 'SIAP BERANGKAT' : 'DALAM PROSES'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-100 rounded-full h-4 p-0.5 border border-slate-200 overflow-hidden mb-6">
          <div
            className="bg-linear-to-r from-[#15803D] via-[#10B981] to-[#D4AF37] h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(5, kpi.provincialReadinessIndex))}%` }}
          />
        </div>

        {/* Component Breakdown Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-100">
          {componentsReadiness.map((comp) => (
            <div key={comp.code} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-semibold truncate">{comp.name}</span>
                <span className="font-mono text-[10px] bg-white px-1 py-0.2 rounded border">{comp.weight}%</span>
              </div>
              <div className="text-lg font-black text-[#0A3E2F] font-mono">
                {Number(comp?.averageScore ?? 0).toFixed(1)}%
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-[#15803D] h-full rounded-full"
                  style={{ width: `${comp.averageScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3.5. OPERATIONAL INTERVENTION BAND (4 PILAR OPERASIONAL) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0A3E2F] text-[#D4AF37]">
              <AlertCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Pusat Intervensi & Tindak Lanjut Terpadu (Action Center)
              </h3>
              <p className="text-[11px] text-gray-500">
                Prinsip Komando: MONITOR → IDENTIFY → PRIORITIZE → ACTION → RESOLVE
              </p>
            </div>
          </div>
          <Link
            href="/action-center"
            className="text-xs font-bold text-[#0A3E2F] hover:underline flex items-center gap-1"
          >
            Buka Command Board <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/action-center?category=DOKUMEN"
            className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-800">
                <FileCheck className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-amber-950 block">Dokumen & Paspor</span>
                <span className="text-[10px] text-amber-700">Perlu tindak lanjut</span>
              </div>
            </div>
            <span className="text-xl font-black font-mono text-amber-800">21</span>
          </Link>

          <Link
            href="/action-center?category=PEMERIKSAAN"
            className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-rose-100 text-rose-800">
                <HeartPulse className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-rose-950 block">Pemeriksaan Kesehatan</span>
                <span className="text-[10px] text-rose-700">Butuh perhatian / istitha'ah</span>
              </div>
            </div>
            <span className="text-xl font-black font-mono text-rose-800">17</span>
          </Link>

          <Link
            href="/action-center?category=ADMINISTRASI"
            className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-blue-100 text-blue-800">
                <CreditCard className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-blue-950 block">Administrasi BPIH</span>
                <span className="text-[10px] text-blue-700">Belum lunas berjalan</span>
              </div>
            </div>
            <span className="text-xl font-black font-mono text-blue-800">19</span>
          </Link>

          <Link
            href="/action-center?category=MANASIK"
            className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-purple-100 text-purple-800">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-purple-950 block">Bimbingan Manasik</span>
                <span className="text-[10px] text-purple-700">Butuh pendampingan presensi</span>
              </div>
            </div>
            <span className="text-xl font-black font-mono text-purple-800">8</span>
          </Link>
        </div>
      </div>

      {/* 4. DUAL COLUMN: REGIONAL RANKING & RECENT AUDIT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Regional Readiness Ranking */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Kesiapan Administratif per Wilayah (Kabupaten / Kota)
              </h3>
              <p className="text-xs text-gray-500">
                Peringkat wilayah berdasarkan capaian indeks kesiapan jamaah
              </p>
            </div>
            <Link
              href="/jamaah"
              className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
            >
              <span>Semua Wilayah</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-gray-500 text-xs uppercase tracking-wider font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Kabupaten / Kota</th>
                  <th className="py-2.5 px-3 text-center">Jumlah Jamaah</th>
                  <th className="py-2.5 px-3 text-center">Siap</th>
                  <th className="py-2.5 px-3 text-center">Proses</th>
                  <th className="py-2.5 px-3">Indeks Kesiapan</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regionalRanking.map((reg) => (
                  <tr key={reg.regionId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                      <span>{reg.regionName}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-gray-800">
                      {reg.totalJamaah}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-700">
                      {reg.siapCount}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-amber-700">
                      {reg.perluTindakLanjutCount + reg.prioritasCount}
                    </td>
                    <td className="py-3 px-3 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              reg.averageReadiness >= 90
                                ? 'bg-emerald-600'
                                : reg.averageReadiness >= 75
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, reg.averageReadiness)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-gray-800 shrink-0">
                          {Number(reg?.averageReadiness ?? 0).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/jamaah?regionId=${reg.regionId}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 transition-colors"
                        title="Buka daftar jamaah wilayah ini"
                      >
                        <span>Filter</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Audit Trail Feed */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Aktivitas Sistem</h3>
                <p className="text-xs text-gray-500">Jejak audit append-only operasional</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-[#15803D]" />
            </div>

            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <div className="text-xs text-gray-400 py-6 text-center italic">
                  Belum ada catatan aktivitas baru
                </div>
              ) : (
                recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0A3E2F] font-mono text-[11px]">
                        {act.action}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(act.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIT
                      </span>
                    </div>
                    <p className="text-gray-700 text-[11px] truncate">{act.description}</p>
                    <div className="text-[10px] text-gray-500">
                      Oleh: <strong className="text-gray-700">{act.actor}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/system/audit-logs"
              className="w-full block text-center text-xs font-bold text-[#0A3E2F] hover:underline"
            >
              Lihat Seluruh Log Audit →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
