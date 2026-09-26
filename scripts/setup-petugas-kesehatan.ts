import { prisma } from '../src/infrastructure/database/prisma.client';
import { hashPassword } from '../src/infrastructure/security/crypto';

async function main() {
  console.log('🔄 Menyiapkan Role dan Akun Petugas Kesehatan...');

  // 1. Upsert Role PETUGAS_KESEHATAN
  const role = await prisma.role.upsert({
    where: { code: 'PETUGAS_KESEHATAN' },
    update: {
      name: 'Petugas Kesehatan Haji',
      description: 'Pemeriksaan kesehatan, penetapan istitha’ah, dan vaksinasi jamaah RSUD/BKKP',
    },
    create: {
      code: 'PETUGAS_KESEHATAN',
      name: 'Petugas Kesehatan Haji',
      description: 'Pemeriksaan kesehatan, penetapan istitha’ah, dan vaksinasi jamaah RSUD/BKKP',
      isSystemRole: true,
    },
  });
  console.log('✅ Role PETUGAS_KESEHATAN:', role.id);

  // 2. Dapatkan Region Provinsi
  const provRegion = await prisma.region.findFirst({
    where: { code: 'REG-PAPUA-PROV' },
  });

  // 3. Password hash: AdminPapua2026!
  const passwordHash = await hashPassword('AdminPapua2026!');

  // 4. Upsert User petugaskesehatan
  const user = await prisma.user.upsert({
    where: { username: 'petugaskesehatan' },
    update: {
      fullName: 'dr. Siti Rahmawati, Sp.PD (Tim Medis Haji)',
      email: 'petugas.kesehatan@siaphaji.papua.go.id',
      passwordHash,
      isActive: true,
      regionId: provRegion?.id,
    },
    create: {
      username: 'petugaskesehatan',
      fullName: 'dr. Siti Rahmawati, Sp.PD (Tim Medis Haji)',
      email: 'petugas.kesehatan@siaphaji.papua.go.id',
      passwordHash,
      isActive: true,
      regionId: provRegion?.id,
    },
  });
  console.log('✅ User petugaskesehatan:', user.id);

  // 5. Hubungkan UserRole
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: role.id,
    },
  });
  console.log('✅ UserRole assigned successfully');

  // 6. Non-aktifkan atau bersihkan akun demo jamaahdemo jika ada
  const jamaahUser = await prisma.user.findUnique({
    where: { username: 'jamaahdemo' },
  });
  if (jamaahUser) {
    await prisma.user.update({
      where: { id: jamaahUser.id },
      data: { isActive: false },
    });
    console.log('ℹ️ Akun jamaahdemo telah dinonaktifkan.');
  }

  console.log('🎉 Selesai! Akun petugaskesehatan siap digunakan dengan password AdminPapua2026!');
}

main()
  .catch((e) => {
    console.error('❌ Error setup petugas kesehatan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
