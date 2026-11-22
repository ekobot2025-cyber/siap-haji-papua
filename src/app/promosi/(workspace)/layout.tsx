import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/infrastructure/security/jwt';
import { PromosiHeader } from '../PromosiHeader';

export const dynamic = 'force-dynamic';

export default async function PromosiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/promosi/login');
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans text-stone-800">
      <PromosiHeader session={session} />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="w-full border-t border-[#e8dfc8] bg-white py-4 text-center text-xs text-stone-400">
        &copy; {new Date().getFullYear()} Kementerian Haji dan Umrah Wilayah Kerja Papua • Panel Khusus Humas &amp; Layanan Publik
      </footer>
    </div>
  );
}
