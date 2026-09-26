import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { HealthService } from '@/application/services/health.service';

const updateHealthSchema = z.object({
  istithaahStatus: z.string().min(1),
  administrativeStatus: z.string().min(1),
  locationName: z.string().optional(),
  isVaccineMeningitis: z.boolean().optional(),
  isVaccinePolio: z.boolean().optional(),
  isVaccineCovid: z.boolean().optional(),
  notesNonMedical: z.string().optional(),
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
    const validated = updateHealthSchema.parse(body);

    const updated = await HealthService.updateRecord(id, validated, session);

    return NextResponse.json({
      success: true,
      message: 'Monitoring kesehatan berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
