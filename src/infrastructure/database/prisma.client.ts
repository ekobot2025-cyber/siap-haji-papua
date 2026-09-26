import { PrismaClient } from '@prisma/client';

const fallbackUrl =
  'postgresql://neondb_owner:npg_ZuDl4Y2SiHtk@ep-lingering-cake-b3xf7qax-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require&pgbouncer=true&connection_limit=10';

// Pastikan DATABASE_URL tidak pernah bernilai empty string di Vercel
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  process.env.DATABASE_URL =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_URL ||
    fallbackUrl;
}

const activeUrl = process.env.DATABASE_URL || fallbackUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

globalForPrisma.prisma = prisma;
