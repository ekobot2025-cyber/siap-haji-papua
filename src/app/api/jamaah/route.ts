import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/infrastructure/security/jwt';
import { JamaahService } from '@/application/services/jamaah.service';

const createJamaahSchema = z.object({
  seasonId: z.string().min(1, 'Musim haji wajib dipilih'),
  regionId: z.string().min(1, 'Wilayah kabupaten/kota wajib dipilih'),
  porsiNumber: z.string().regex(/^\d{10}$/, 'Nomor Porsi harus 10 digit angka'),
  nik: z.string().regex(/^\d{16}$/, 'NIK harus 16 digit angka'),
  kkNumber: z.string().optional(),
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  birthPlace: z.string().min(2, 'Tempat lahir wajib diisi'),
  birthDate: z.string().min(8, 'Tanggal lahir wajib diisi'),
  gender: z.enum(['MALE', 'FEMALE']),
  maritalStatus: z.string().optional(),
  address: z.string().min(5, 'Alamat wajib diisi'),
  district: z.string().optional(),
  subDistrict: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  bloodType: z.string().optional(),
  occupation: z.string().optional(),
  registrationYear: z.number().int().min(2000).max(2035),
  estimatedDepartureYear: z.number().int().optional(),
  status: z.string().optional(),
  dataSource: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const regionId = searchParams.get('regionId') || undefined;
  const status = searchParams.get('status') || undefined;
  const readinessCategory = searchParams.get('readinessCategory') || undefined;
  const gender = searchParams.get('gender') || undefined;
  const elderly = searchParams.get('isPriorityElderly');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

  try {
    const data = await JamaahService.listJamaah(
      {
        search,
        regionId,
        status,
        readinessCategory,
        gender,
        isPriorityElderly: elderly !== null ? elderly === 'true' : undefined,
        page,
        pageSize,
      },
      session
    );

    return NextResponse.json({
      success: true,
      data: data.items,
      meta: data.meta,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Gagal mengambil data jamaah';
    return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Autentikasi diperlukan' }, { status: 401 });
  }

  // Only Admin can create jamaah
  if (!session.roles.includes('SUPER_ADMIN') && !session.roles.includes('PROV_ADMIN') && !session.roles.includes('REGION_ADMIN')) {
    return NextResponse.json({ success: false, message: 'AKSES DITOLAK: Role Anda tidak memiliki izin menambah jamaah' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  try {
    const body = await request.json();
    const parsed = createJamaahSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Validasi gagal' },
        { status: 400 }
      );
    }

    const created = await JamaahService.createJamaah(parsed.data, session, ip);

    return NextResponse.json(
      { success: true, message: 'Data jamaah berhasil ditambahkan', data: { id: created.id, porsiNumber: created.porsiNumber } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Gagal menambahkan data jamaah';
    return NextResponse.json({ success: false, message: errMessage }, { status: 400 });
  }
}
