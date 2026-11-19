import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { PublicPorsiCheckerService } from '@/application/services/public-porsi-checker.service';

const syncSchema = z.object({
  porsiNumber: z.string().regex(/^\d{10}$/, 'Nomor Porsi harus 10 digit angka').optional(),
  isBatch: z.boolean().optional(),
  regionId: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  delayMs: z.number().int().min(0).max(3000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi diperlukan untuk melakukan sinkronisasi data.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = syncSchema.parse(body);

    // 1. Mode Batch Sync
    if (validated.isBatch) {
      // Hanya Super Admin, Prov Admin, atau Region Admin yang boleh memicu batch
      const result = await PublicPorsiCheckerService.batchSyncPapuaJamaah(
        {
          regionId: validated.regionId,
          limit: validated.limit || 20,
          delayMs: validated.delayMs || 300,
        },
        session
      );

      return NextResponse.json({
        success: true,
        message: `Sinkronisasi batch selesai: ${result.updatedCount} diperbarui, ${result.bpihLunasCount} terkonfirmasi lunas BPIH.`,
        data: result,
      });
    }

    // 2. Mode Single Sync
    if (!validated.porsiNumber) {
      return NextResponse.json(
        { success: false, message: 'Nomor Porsi wajib disertakan untuk sinkronisasi perorangan.' },
        { status: 400 }
      );
    }

    const syncResult = await PublicPorsiCheckerService.syncSingleJamaah(
      validated.porsiNumber,
      session
    );

    return NextResponse.json({
      success: true,
      message: syncResult.message,
      data: syncResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Terjadi kesalahan saat memproses sinkronisasi data.',
      },
      { status: 400 }
    );
  }
}
