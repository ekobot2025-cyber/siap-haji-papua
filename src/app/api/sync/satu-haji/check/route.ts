import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { PublicPorsiCheckerService } from '@/application/services/public-porsi-checker.service';

const checkSchema = z.object({
  porsiNumber: z.string().regex(/^\d{10}$/, 'Nomor Porsi harus berupa 10 digit angka'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = checkSchema.parse(body);

    const result = await PublicPorsiCheckerService.checkPublicPorsi(validated.porsiNumber);

    return NextResponse.json({
      success: true,
      message: 'Pemeriksaan status porsi Satu Haji publik berhasil',
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Terjadi kesalahan saat memeriksa data porsi publik',
      },
      { status: 400 }
    );
  }
}
