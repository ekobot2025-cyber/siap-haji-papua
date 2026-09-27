import React from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowRight,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { getServerSession } from '@/infrastructure/security/jwt';
import { JamaahService } from '@/application/services/jamaah.service';
import { prisma } from '@/infrastructure/database/prisma.client';
import { ReadinessBadge, DataSourceBadge } from '@/components/ui/StatusBadge';
import { JamaahFilters } from '@/components/jamaah/JamaahFilters';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface JamaahPageProps {
  searchParams: Promise<{
    search?: string;
    regionId?: string;
    status?: string;
    readinessCategory?: string;
    gender?: string;
    elderly?: string;
    page?: string;
  }>;
}

export default async function JamaahListPage({ searchParams }: JamaahPageProps) {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const search = params.search;
  const regionId = params.regionId;
  const status = params.status;
  const readinessCategory = params.readinessCategory;
  const gender = params.gender;
  const isPriorityElderly = params.elderly === 'true' ? true : undefined;

  // Fetch paginated data with RLA enforcement
  const [data, regions] = await Promise.all([
    JamaahService.listJamaah(
      {
        search,
        regionId,
        status,
        readinessCategory,
        gender,
        isPriorityElderly,
        page,
        pageSize: 15,
      },
      session!
    ),
    prisma.region.findMany({
      where: { isActive: true, type: { in: ['KOTA', 'KABUPATEN'] } },
      orderBy: { name: 'asc' },
    }),
  ]);

  const { items, meta } = data;
  const isRegionAdmin = session?.roles.includes('REGION_ADMIN');

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Master Data Jamaah
            </h1>
            <span className="bg-slate-100 text-slate-800 text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-slate-300">
              {meta.totalRecords} Jamaah
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            {isRegionAdmin
              ? `Data operasional khusus wilayah kerja ${session?.regionName || 'Kabupaten/Kota Anda'}`
              : 'Seluruh data jamaah haji terdaftar di Provinsi Papua (Multi-Kabupaten)'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Jamaah modal/trigger button for Admins */}
          {session?.roles.some((r) => ['SUPER_ADMIN', 'PROV_ADMIN', 'REGION_ADMIN'].includes(r)) && (
            <Link
              href="/jamaah/new"
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#1e40af] to-[#059669] hover:from-[#1e3a8a] hover:to-[#047857] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jamaah</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Interactive Filter Bar Component */}
      <JamaahFilters regions={regions} isRegionAdmin={isRegionAdmin} userRegionId={session?.regionId} />

      {/* 3. Jamaah Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">No. Porsi</th>
                <th className="py-3 px-4">Nama Lengkap & NIK</th>
                <th className="py-3 px-4">Kabupaten / Kota</th>
                <th className="py-3 px-4 text-center">Gender / Usia</th>
                <th className="py-3 px-4">Indeks Kesiapan</th>
                <th className="py-3 px-4 text-center">Sumber</th>
                <th className="py-3 px-4 text-right">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm">Tidak ada data jamaah yang sesuai kriteria pencarian</p>
                    <p className="text-xs text-gray-400 mt-1">Coba sesuaikan filter wilayah atau kata kunci pencarian Anda</p>
                  </td>
                </tr>
              ) : (
                items.map((j) => {
                  const birthYear = new Date(j.birthDate).getFullYear();
                  const age = 2026 - birthYear;

                  return (
                    <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Porsi */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                        {j.porsiNumber}
                      </td>

                      {/* Name & NIK */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{j.fullName}</span>
                          {j.isPriorityElderly && (
                            <span
                              className="inline-flex items-center gap-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-purple-200"
                              title="Prioritas Lansia (Usia >= 65 th)"
                            >
                              <HeartHandshake className="w-3 h-3" />
                              <span>Lansia</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                          NIK: {j.nikMasked}
                        </div>
                      </td>

                      {/* Region */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-medium">{j.region.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 ml-5">{j.district}</div>
                      </td>

                      {/* Gender & Age */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="text-gray-700 font-medium">
                          {j.gender === 'MALE' ? 'L' : 'P'} • {age} th
                        </span>
                      </td>

                      {/* Readiness */}
                      <td className="py-3.5 px-4">
                        <ReadinessBadge
                          category={j.readiness.category}
                          score={j.readiness.score}
                          size="sm"
                        />
                      </td>

                      {/* Data Source */}
                      <td className="py-3.5 px-4 text-center">
                        <DataSourceBadge source={j.dataSource} />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/jamaah/${j.id}`}
                          className="inline-flex items-center gap-1 bg-gradient-to-r from-[#1e40af] to-[#059669] hover:from-[#1e3a8a] hover:to-[#047857] text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs"
                        >
                          <span>Profil 360°</span>
                          <ArrowRight className="w-3 h-3 text-emerald-200" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Bar */}
        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-gray-600">
            <div>
              Halaman <strong className="font-mono">{meta.page}</strong> dari{' '}
              <strong className="font-mono">{meta.totalPages}</strong> ({meta.totalRecords} total jamaah)
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/jamaah?page=${Math.max(1, meta.page - 1)}${search ? `&search=${search}` : ''}${regionId ? `&regionId=${regionId}` : ''}${status ? `&status=${status}` : ''}${readinessCategory ? `&readinessCategory=${readinessCategory}` : ''}`}
                className={`p-1.5 rounded-lg border bg-white flex items-center gap-1 ${
                  meta.page <= 1 ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-100 text-gray-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Link>
              <Link
                href={`/jamaah?page=${Math.min(meta.totalPages, meta.page + 1)}${search ? `&search=${search}` : ''}${regionId ? `&regionId=${regionId}` : ''}${status ? `&status=${status}` : ''}${readinessCategory ? `&readinessCategory=${readinessCategory}` : ''}`}
                className={`p-1.5 rounded-lg border bg-white flex items-center gap-1 ${
                  meta.page >= meta.totalPages ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-100 text-gray-700'
                }`}
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
