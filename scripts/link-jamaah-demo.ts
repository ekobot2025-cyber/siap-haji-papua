import { prisma } from '../src/infrastructure/database/prisma.client';
import { hashPassword } from '../src/infrastructure/security/crypto';

async function main() {
  console.log('⏳ Menyiapkan akun demo role JAMAAH...');

  // 1. Dapatkan Role JAMAAH
  let jamaahRole = await prisma.role.findUnique({
    where: { code: 'JAMAAH' },
  });

  if (!jamaahRole) {
    jamaahRole = await prisma.role.create({
      data: {
        code: 'JAMAAH',
        name: 'Jamaah Mandiri',
        description: 'Akses portal mandiri kesiapan dan informasi personal',
        isSystemRole: true,
      },
    });
    console.log('✓ Role JAMAAH berhasil dibuat.');
  }

  // 2. Dapatkan Region Kota Jayapura
  const region = await prisma.region.findFirst({
    where: { code: 'REG-JPR-KOTA' },
  });

  const defaultHash = await hashPassword('AdminPapua2026!');

  // 3. Upsert User jamaahdemo
  const user = await prisma.user.upsert({
    where: { username: 'jamaahdemo' },
    update: {
      fullName: 'Hj. Fatimah Hidayat',
      email: 'fatimah.jamaah@siaphaji.papua.go.id',
      regionId: region?.id,
      passwordHash: defaultHash,
      isActive: true,
    },
    create: {
      username: 'jamaahdemo',
      email: 'fatimah.jamaah@siaphaji.papua.go.id',
      fullName: 'Hj. Fatimah Hidayat',
      passwordHash: defaultHash,
      regionId: region?.id,
      isActive: true,
    },
  });
  console.log(`✓ User demo jamaah dibuat: ${user.username} (${user.fullName})`);

  // 4. Assign Role JAMAAH
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: jamaahRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: jamaahRole.id,
    },
  });
  console.log(`✓ Role JAMAAH di-assign ke user ${user.username}`);

  // 5. Link User ke data Jamaah Fatimah Hidayat (Porsi: 2700192001)
  const jamaah = await prisma.jamaah.findFirst({
    where: { porsiNumber: '2700192001' },
  });

  if (jamaah) {
    await prisma.jamaah.update({
      where: { id: jamaah.id },
      data: { userId: user.id },
    });
    console.log(`✓ Akun ${user.username} berhasil dihubungkan ke Jamaah: ${jamaah.fullName} (No. Porsi: ${jamaah.porsiNumber})`);
  } else {
    console.warn('⚠️ Data jamaah 2700192001 belum ditemukan.');
  }

  console.log('✅ Setup akun demo role JAMAAH selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
