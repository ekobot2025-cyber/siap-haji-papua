import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { prisma } from '@/infrastructure/database/prisma.client';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const neededCount = parseInt(searchParams.get('count') || '10', 10);
  const minScore = parseFloat(searchParams.get('minScore') || '85.0');
  const regionId = searchParams.get('regionId') || undefined;

  try {
    const where: any = {
      // Must not be dead or cancelled
      status: { notIn: ['WAFAT', 'BATAL'] },
      readinessScore: {
        totalScore: { gte: minScore },
      },
    };

    // Scoped Region Admin
    if (session.regionId && !session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN') && !session.roles.includes('EXECUTIVE_LEADER')) {
      where.regionId = session.regionId;
    } else if (regionId) {
      where.regionId = regionId;
    }

    const candidates = await prisma.jamaah.findMany({
      where,
      take: neededCount,
      orderBy: [
        { readinessScore: { totalScore: 'desc' } }, // Most prepared first
        { porsiNumber: 'asc' },                    // Earliest porsi queue
      ],
      include: {
        region: { select: { id: true, name: true, code: true } },
        readinessScore: { select: { totalScore: true, category: true } },
        documents: {
          select: {
            documentType: { select: { code: true } },
            status: true,
          },
        },
        administrationRecords: {
          select: { stageName: true, status: true },
        },
        healthRecords: {
          select: { checkupStage: true, istithaahStatus: true },
        },
      },
    });

    const formatted = candidates.map((c, idx) => ({
      rank: idx + 1,
      id: c.id,
      fullName: c.fullName,
      porsiNumber: c.porsiNumber,
      gender: c.gender,
      isPriorityElderly: c.isPriorityElderly,
      elderlyAge: c.elderlyAge,
      regionName: c.region.name,
      readinessScore: c.readinessScore?.totalScore || 0,
      readinessCategory: c.readinessScore?.category || 'SIAP',
      passportOk: c.documents.some((d) => d.documentType.code === 'PASPOR' && d.status === 'TERVERIFIKASI'),
      bpihOk: c.administrationRecords.some((a) => a.stageName === 'PELUNASAN_BPIH' && a.status === 'SELESAI'),
      healthOk: c.healthRecords.some((h) => ['MEMENUHI_SYARAT', 'MEMENUHI_DENGAN_PENDAMPING'].includes(h.istithaahStatus)),
    }));

    return NextResponse.json({
      success: true,
      data: {
        neededCount,
        minScore,
        totalEligible: candidates.length,
        candidates: formatted,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
