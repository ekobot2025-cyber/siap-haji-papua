import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { AuditService } from '@/application/services/audit.service';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  // Only Super Admin, Prov Admin, or Leader can view audit trail
  const allowed = session.roles.some((r) => ['SUPER_ADMIN', 'PROV_ADMIN', 'LEADER'].includes(r));
  if (!allowed) {
    return NextResponse.json({ success: false, message: 'AKSES DITOLAK: Anda tidak berwenang melihat Audit Log' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
  const module = searchParams.get('module') || undefined;
  const action = searchParams.get('action') || undefined;

  try {
    const data = await AuditService.listLogs({ page, pageSize, module, action });
    return NextResponse.json({
      success: true,
      data: data.items,
      meta: data.meta,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Gagal memuat log audit';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}
