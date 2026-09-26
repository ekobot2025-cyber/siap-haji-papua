import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma.client';

export async function GET() {
  try {
    const [regions, seasons] = await Promise.all([
      prisma.region.findMany({
        where: { isActive: true },
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
      }),
      prisma.hajjSeason.findMany({
        orderBy: { yearGregorian: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        regions,
        seasons,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Gagal memuat master data';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
