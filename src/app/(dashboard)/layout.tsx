import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/infrastructure/security/jwt';
import { SettingsService } from '@/application/services/settings.service';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  const config = await SettingsService.getAppConfig();

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col">
      <DemoBanner />
      <Header session={session} config={config} />
      <div className="flex-1 flex w-full bg-white">
        <Sidebar session={session} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0 bg-[#F8FAF8]/50">
          {children}
        </main>
      </div>
    </div>
  );
}
