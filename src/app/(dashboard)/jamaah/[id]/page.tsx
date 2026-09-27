import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronLeft,
  User,
  MapPin,
  Calendar,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HeartHandshake,
  Layers,
  FileText,
  Activity,
  History,
} from 'lucide-react';
import { getServerSession } from '@/infrastructure/security/jwt';
import { JamaahService } from '@/application/services/jamaah.service';
import { ReadinessBadge, DataSourceBadge } from '@/components/ui/StatusBadge';
import { Jamaah360Tabs } from '@/components/jamaah/Jamaah360Tabs';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface JamaahDetailProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ unmask?: string }>;
}

export default async function JamaahDetailPage({ params, searchParams }: JamaahDetailProps) {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  const { id } = await params;
  const sParams = await searchParams;
  const shouldUnmask = sParams.unmask === 'true';

  let jamaah;
  try {
    jamaah = await JamaahService.getJamaah360(id, session!, shouldUnmask);
  } catch (error: unknown) {
    const err = error as Error;
    if (err.message.includes('AKSES DITOLAK')) {
      return (
        <div className="bg-red-50 border border-red-200 p-8 rounded-2xl text-center max-w-lg mx-auto my-12">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900">Akses Data Ditolak (Row-Level Authorization)</h2>
          <p className="text-sm text-red-700 mt-2">
            Anda terdaftar sebagai Administrator Wilayah <strong>{session?.regionName}</strong> dan tidak memiliki wewenang untuk melihat data jamaah di luar wilayah kerja Anda.
          </p>
          <Link
            href="/jamaah"
            className="inline-flex items-center gap-1.5 mt-5 bg-gradient-to-r from-[#c9a961] to-[#b8941e] hover:brightness-105 text-[#1A1410] font-bold px-4 py-2 rounded-xl text-xs font-semibold shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Jamaah Wilayah Anda</span>
          </Link>
        </div>
      );
    }
    notFound();
  }

  const birthDateFormatted = new Date(jamaah.birthDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const age = 2026 - new Date(jamaah.birthDate).getFullYear();

  return (
    <div className="space-y-6">
      {/* 1. Back Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/jamaah"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#b8941e]" />
          <span>Kembali ke Daftar Jamaah</span>
        </Link>

        <div className="flex items-center gap-2">
          <DataSourceBadge source={jamaah.dataSource} />
          {jamaah.isPriorityElderly && (
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Prioritas Lansia ({jamaah.elderlyAge} th)</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. JAMAAH 360° MASTER HEADER CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        {/* Subtle Papuan Decorative Top Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#c9a961] via-amber-300 to-[#b8941e]" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Avatar & Personal Identity */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#261F1A] to-[#1A1410] text-[#c9a961] flex items-center justify-center font-extrabold text-2xl border-2 border-[#c9a961] shadow-md shrink-0">
              {jamaah.fullName.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {jamaah.fullName}
                </h1>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded border">
                  {jamaah.gender === 'MALE' ? 'Laki-Laki' : 'Perempuan'} • {age} Tahun
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-500">No. Porsi:</span>
                  <span className="font-mono font-bold text-[#b8941e] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    {jamaah.porsiNumber}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{jamaah.region.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Daftar: {jamaah.registrationYear}</span>
                </div>
              </div>

              {/* NIK & Unmask Privilege */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-xs font-mono">
                <span className="text-gray-500">NIK:</span>
                <span className="font-bold text-gray-800 bg-slate-100 px-2 py-0.5 rounded border">
                  {jamaah.nik}
                </span>

                {jamaah.canUnmask && (
                  <Link
                    href={`/jamaah/${jamaah.id}${jamaah.isUnmasked ? '' : '?unmask=true'}`}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans font-semibold border transition-colors ${
                      jamaah.isUnmasked
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                    title={jamaah.isUnmasked ? 'Sembunyikan NIK lengkap' : 'Buka penyamaran NIK (Tercatat di Audit Log)'}
                  >
                    {jamaah.isUnmasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{jamaah.isUnmasked ? 'Mask Data' : 'Buka Masking'}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right: Readiness Score Card */}
          <div className="lg:border-l lg:border-slate-200 lg:pl-6 flex flex-col justify-center min-w-[240px]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#b8941e] mb-1">
              Indeks Kesiapan Administratif
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-[#b8941e] font-mono">
                {Number(jamaah?.readiness?.score ?? 0).toFixed(1)}%
              </span>
              <ReadinessBadge category={jamaah.readiness.category} showScore={false} size="sm" />
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full ${
                  jamaah.readiness.score >= 90
                    ? 'bg-emerald-600'
                    : jamaah.readiness.score >= 75
                    ? 'bg-blue-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, jamaah.readiness.score))}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 mt-1 italic">
              Decision-support indicator internal
            </span>
          </div>
        </div>
      </div>

      {/* 3. TABBED SECTIONS (OVERVIEW, BIODATA, DOKUMEN, ADMINISTRASI, KESEHATAN, MANASIK, KLOTER, TIMELINE) */}
      <Jamaah360Tabs jamaah={jamaah} birthDateFormatted={birthDateFormatted} />
    </div>
  );
}
