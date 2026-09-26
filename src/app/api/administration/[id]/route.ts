import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { AdministrationService } from '@/application/services/administration.service';

const updateAdminSchema = z.object({
  status: z.string().min(1),
  amountPaid: z.number().optional(),
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
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
    const validated = updateAdminSchema.parse(body);

    const updated = await AdministrationService.updateRecord(id, validated, session);

    return NextResponse.json({
      success: true,
      message: 'Status administrasi berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
