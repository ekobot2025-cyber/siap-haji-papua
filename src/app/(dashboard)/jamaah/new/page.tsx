import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UserPlus, ChevronLeft } from 'lucide-react';
import { getServerSession } from '@/infrastructure/security/jwt';
import { prisma } from '@/infrastructure/database/prisma.client';
import { CreateJamaahForm } from '@/components/jamaah/CreateJamaahForm';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewJamaahPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  // Guard: Only Super Admin, Prov Admin, or Region Admin can create jamaah
  const isAuthorized = session?.roles.some((r) => ['SUPER_ADMIN', 'PROV_ADMIN', 'REGION_ADMIN'].includes(r));
  if (!isAuthorized) {
    return notFound();
  }

  const [regions, seasons] = await Promise.all([
    prisma.region.findMany({
      where: { isActive: true, type: { in: ['KOTA', 'KABUPATEN'] } },
      orderBy: { name: 'asc' },
    }),
    prisma.hajjSeason.findMany({
      where: { isActive: true },
    }),
  ]);

  const activeSeason = seasons[0];
  const isRegionAdmin = session?.roles.includes('REGION_ADMIN');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/jamaah"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#b8941e]" />
          <span>Kembali ke Daftar Jamaah</span>
        </Link>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-[#1A1410] font-bold flex items-center justify-center border border-blue-400/30 shadow-xs">
          <UserPlus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900">Registrasi Jamaah Haji Baru</h1>
          <p className="text-xs text-gray-500">
            Data pribadi (NIK & Telepon) akan dienkripsi secara otomatis menggunakan standar AES-256-GCM
          </p>
        </div>
      </div>

      {/* Form Component */}
      <CreateJamaahForm
        regions={regions}
        activeSeasonId={activeSeason?.id || ''}
        isRegionAdmin={isRegionAdmin}
        userRegionId={session?.regionId}
      />
    </div>
  );
}
