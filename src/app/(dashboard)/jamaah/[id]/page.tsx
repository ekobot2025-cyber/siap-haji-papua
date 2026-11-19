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
            className="inline-flex items-center gap-1.5 mt-5 btn-kemenhaj-primary px-4 py-2 rounded-xl text-xs font-semibold shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Jamaah Wilayah Anda</span>
          </Link>
        </div>
      );
    }
    return (
      <div className="bg-white border border-[#e8dfc8] p-8 rounded-2xl text-center max-w-lg mx-auto my-12 shadow-xs space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] flex items-center justify-center mx-auto">
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-[#1A1410]">Data Jamaah Tidak Ditemukan</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          ID jamaah <code className="bg-stone-100 font-mono text-[11px] px-1.5 py-0.5 rounded border border-stone-200">{id}</code> tidak ditemukan dalam basis data aktif.
          Kemungkinan data ini berasal dari data simulasi lama yang telah dibersihkan secara tuntas, atau sesi peramban Anda masih menyimpan tautan riwayat lama.
        </p>
        <div className="pt-2">
          <Link
            href="/jamaah"
            className="inline-flex items-center gap-1.5 btn-kemenhaj-primary px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Buka Daftar 924 Calon Jamaah Riil Papua</span>
          </Link>
        </div>
      </div>
    );
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
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700 hover:text-[#1A1410] bg-white px-3 py-1.5 rounded-xl border border-[#e8dfc8] shadow-2xs hover:bg-[#fbf8ee] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#b8941e]" />
          <span>Kembali ke Daftar Jamaah</span>
        </Link>

        <div className="flex items-center gap-2">
          <DataSourceBadge source={jamaah.dataSource} />
          {jamaah.isPriorityElderly && (
            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
              <span>Prioritas Lansia ({jamaah.elderlyAge} th)</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. JAMAAH 360° MASTER HEADER CARD */}
      <div className="bg-white rounded-2xl border border-[#e8dfc8] p-6 shadow-xs relative overflow-hidden">
        {/* Kemenhaj Royal Gold Accent Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a961] via-[#d4af37] to-[#b8941e]" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Avatar & Personal Identity */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-white flex items-center justify-center font-black text-3xl shadow-sm border-2 border-white ring-4 ring-[#c9a961]/20 shrink-0">
              {jamaah.fullName.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-[#1A1410] tracking-tight">
                  {jamaah.fullName}
                </h1>
                <span className="bg-[#fbf8ee] text-stone-700 text-xs font-semibold px-2 py-0.5 rounded border border-[#e8dfc8]">
                  {jamaah.gender === 'MALE' ? 'Laki-Laki' : 'Perempuan'} • {age} Tahun
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-stone-500">No. Porsi:</span>
                  <span className="font-mono font-bold text-[#8a6d2b] bg-[#fbf8ee] px-2 py-0.5 rounded-lg border border-[#e8dfc8]">
                    {jamaah.porsiNumber}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#b8941e] shrink-0" />
                  <span className="font-medium text-stone-800">{jamaah.region?.name || 'Papua'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Daftar: {jamaah.registrationYear}</span>
                </div>
              </div>

              {/* Kategori Kuota & Status Kemenhaj */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-500 font-sans">Kategori Kuota 1448 H:</span>
                <span className="font-bold text-[#8a6d2b] bg-[#fbf8ee] px-2.5 py-0.5 rounded-lg border border-[#e8dfc8]">
                  {jamaah.isPriorityElderly ? 'Prioritas Lansia' : 'Reguler Urut Porsi'} • Tahap 1
                </span>
                <span className="text-stone-400 font-mono text-[11px]">(Satu Data haji.go.id)</span>
              </div>
            </div>
          </div>

          {/* Right: Readiness Score Card */}
          <div className="lg:border-l lg:border-[#e8dfc8] lg:pl-6 flex flex-col justify-center min-w-[240px]">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              Indeks Kesiapan Administratif
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-black text-[#967412] font-mono">
                {Number(jamaah?.readiness?.score ?? 0).toFixed(1)}%
              </span>
              <ReadinessBadge category={jamaah?.readiness?.category || 'PRIORITAS'} showScore={false} size="sm" />
            </div>

            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-[#e8dfc8]">
              <div
                className={`h-full rounded-full ${
                  (jamaah?.readiness?.score ?? 0) >= 90
                    ? 'bg-gradient-to-r from-[#c9a961] to-[#b8941e]'
                    : (jamaah?.readiness?.score ?? 0) >= 75
                    ? 'bg-blue-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, jamaah?.readiness?.score ?? 0))}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-400 mt-1 italic">
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
