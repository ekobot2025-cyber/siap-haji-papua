import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { ActionCenterService } from '@/application/services/action-center.service';

const createActionSchema = z.object({
  jamaahId: z.string().min(1),
  category: z.enum(['DOKUMEN', 'PEMERIKSAAN', 'ADMINISTRASI', 'MANASIK', 'KLOTER', 'VERIFIKASI']),
  title: z.string().min(3),
  description: z.string().optional(),
  priority: z.enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  deadline: z.string().optional().transform((d) => (d ? new Date(d) : undefined)),
  assignedToUserId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const status = searchParams.get('status') || undefined;
  const priority = searchParams.get('priority') || undefined;
  const assignedToUserId = searchParams.get('assignedToUserId') || undefined;
  const regionId = searchParams.get('regionId') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const result = await ActionCenterService.listItems(
      { category, status, priority, assignedToUserId, regionId, search, page, limit },
      session
    );
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createActionSchema.parse(body);

    const item = await ActionCenterService.createItem(validated, session);

    return NextResponse.json({
      success: true,
      message: 'Tugas tindak lanjut berhasil dibuat',
      data: item,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
