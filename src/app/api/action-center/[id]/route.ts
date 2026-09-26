import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { ActionCenterService } from '@/application/services/action-center.service';

const updateActionSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED']).optional(),
  priority: z.enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW']).optional(),
  assignedToUserId: z.string().nullable().optional(),
  deadline: z.string().nullable().optional().transform((d) => (d ? new Date(d) : d === null ? null : undefined)),
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
    const validated = updateActionSchema.parse(body);

    const updated = await ActionCenterService.updateItem(id, validated, session);

    return NextResponse.json({
      success: true,
      message: 'Status tindak lanjut berhasil diperbarui',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
