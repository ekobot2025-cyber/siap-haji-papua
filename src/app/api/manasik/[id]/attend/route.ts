import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { ManasikService } from '@/application/services/manasik.service';

const attendSchema = z.object({
  jamaahId: z.string().min(1),
  status: z.enum(['HADIR', 'TIDAK_HADIR', 'IZIN', 'SAKIT']).default('HADIR'),
  attendanceMethod: z.enum(['QR_SCAN', 'MANUAL_OPERATOR']).default('QR_SCAN'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { id: eventId } = await params;
  try {
    const body = await request.json();
    const validated = attendSchema.parse(body);

    const record = await ManasikService.recordAttendance(
      eventId,
      validated.jamaahId,
      validated.status,
      validated.attendanceMethod,
      session
    );

    return NextResponse.json({
      success: true,
      message: 'Presensi manasik berhasil dicatat',
      data: record,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
