import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { DocumentService } from '@/application/services/document.service';

const verifySchema = z.object({
  action: z.enum(['VERIFY', 'REJECT', 'NEED_REVISION']),
  notes: z.string().default(''),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const doc = await DocumentService.getDocumentById(id);
    if (!doc) {
      return NextResponse.json({ success: false, message: 'Dokumen tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

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
    const validated = verifySchema.parse(body);

    const updated = await DocumentService.verifyDocument(
      id,
      validated.action,
      validated.notes,
      session
    );

    return NextResponse.json({
      success: true,
      message: `Dokumen berhasil di-${validated.action === 'VERIFY' ? 'verifikasi' : 'tolak'}`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
