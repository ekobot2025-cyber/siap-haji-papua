import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { WarningService } from '@/application/services/warning.service';

const resolveSchema = z.object({
  notes: z.string().default('Telah ditindaklanjuti'),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const validated = resolveSchema.parse(body);

    const updated = await WarningService.resolveWarning(id, validated.notes, session);

    return NextResponse.json({
      success: true,
      message: 'Peringatan dini berhasil diselesaikan',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
