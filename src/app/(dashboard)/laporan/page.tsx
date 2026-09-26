import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/infrastructure/security/jwt';
import { prisma } from '@/infrastructure/database/prisma.client';
import { DashboardService } from '@/application/services/dashboard.service';
import { LaporanClientView } from './LaporanClientView';

export const dynamic = 'force-dynamic';

// 30-second server cache to eliminate DB roundtrips on repeated page navigation
let cachedReportData: any = null;
let cachedReportExpiry = 0;

export default async function LaporanPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  // Prevent pilgrims from seeing executive reports
  if (session.roles.includes('JAMAAH')) {
    redirect('/portal-jamaah');
  }

  const now = Date.now();
  if (cachedReportData && now < cachedReportExpiry) {
    return <LaporanClientView {...cachedReportData} />;
  }

  // Fetch all data in parallel (single batch) instead of 10+ sequential queries
  const [executiveData, allJamaah, regions, kloters] = await Promise.all([
    DashboardService.getExecutiveData(session),
    prisma.jamaah.findMany({
      where: { deletedAt: null },
      include: {
        readinessScore: true,
        region: { select: { id: true, code: true, name: true } },
        documents: {
          where: { status: 'TERVERIFIKASI' },
          select: { id: true },
        },
        administrationRecords: {
          where: { status: 'SELESAI' },
          select: { id: true },
        },
      },
    }),
    prisma.region.findMany({
      where: { type: { in: ['KOTA', 'KABUPATEN'] } },
      orderBy: { name: 'asc' },
    }),
    prisma.kloter.findMany({
      include: {
        _count: { select: { members: true } },
        officers: true,
      },
      orderBy: { kloterNumber: 'asc' },
    }),
  ]);

  const quotaMap: Record<string, number> = {
    'REG-JPR-KOTA': 380,
    'REG-JPR-KAB': 180,
    'REG-BIAK': 120,
    'REG-KEEROM': 80,
    'REG-SARMI': 60,
    'REG-MRK': 90,
    'REG-MMK': 70,
    'REG-YAPEN': 40,
    'REG-NABIRE': 40,
    'REG-JWY': 20,
  };

  // Group jamaah by region in-memory (O(n) instead of 10 separate DB queries)
  const regionBuckets = new Map<string, typeof allJamaah>();
  for (const j of allJamaah) {
    const rid = j.regionId;
    if (!regionBuckets.has(rid)) regionBuckets.set(rid, []);
    regionBuckets.get(rid)!.push(j);
  }

  const regionalTableData = regions.map((reg) => {
    const jamaahList = regionBuckets.get(reg.id) || [];
    const total = jamaahList.length;
    const readyCount = jamaahList.filter(
      (j) => (j.readinessScore?.totalScore ?? 0) >= 85
    ).length;
    const avgScore =
      total > 0
        ? jamaahList.reduce((acc, j) => acc + (j.readinessScore?.totalScore ?? 0), 0) / total
        : 0;

    const docCompleteCount = jamaahList.filter(
      (j) => j.documents.length >= 5
    ).length;

    const adminCompleteCount = jamaahList.filter(
      (j) => j.administrationRecords.length >= 1
    ).length;

    return {
      id: reg.id,
      code: reg.code,
      name: reg.name,
      targetQuota: quotaMap[reg.code] || Math.max(total, 50),
      totalJamaah: total,
      readyCount,
      avgScore: parseFloat(avgScore.toFixed(1)),
      docCompleteCount,
      adminCompleteCount,
      status: avgScore >= 85 ? 'SIAP' : avgScore >= 70 ? 'DALAM PROSES' : 'PERLU ATENSI',
    };
  });

  const reportPayload = {
    season: executiveData.season,
    kpi: executiveData.kpi,
    regionalData: regionalTableData,
    kloters: kloters.map((k) => ({
      id: k.id,
      number: k.kloterNumber,
      code: k.kloterCode,
      embarkation: k.embarkationName,
      airline: k.airlineName || 'Garuda Indonesia',
      flight: k.flightNumber || 'GA-1101',
      capacity: k.capacityTotal,
      filled: k._count.members,
      status: k.status,
      departureDate: k.flightDepartureDate
        ? k.flightDepartureDate.toLocaleDateString('id-ID', { dateStyle: 'medium' })
        : '12 Mei 2026',
      dormitoryDate: k.dormitoryInDate
        ? k.dormitoryInDate.toLocaleDateString('id-ID', { dateStyle: 'medium' })
        : '11 Mei 2026',
      leaderName: k.officers[0]?.fullName || 'H. Abdul Karim, S.Ag',
    })),
  };

  cachedReportData = reportPayload;
  cachedReportExpiry = Date.now() + 30_000; // 30 seconds

  return <LaporanClientView {...reportPayload} />;
}
