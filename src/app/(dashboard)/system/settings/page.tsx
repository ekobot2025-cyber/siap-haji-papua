import React from 'react';
import { notFound } from 'next/navigation';
import { Settings, ShieldCheck, AlertCircle, Save } from 'lucide-react';
import { getServerSession } from '@/infrastructure/security/jwt';
import { SettingsService } from '@/application/services/settings.service';
import { SettingsForm } from '@/components/system/SettingsForm';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SystemSettingsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  // Guard: Only SUPER_ADMIN can configure institution parameters
  if (!session?.roles.includes('SUPER_ADMIN')) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-amber-900">Hak Akses Terbatas</h2>
        <p className="text-sm text-amber-700 mt-2">
          Halaman Pengaturan Sistem Kelembagaan hanya dapat diakses oleh peran <strong>SUPER_ADMIN</strong>.
        </p>
      </div>
    );
  }

  const config = await SettingsService.getAppConfig();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#e8dfc8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-white font-bold flex items-center justify-center shadow-xs">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1A1410]">Pengaturan Sistem Kelembagaan</h1>
            <p className="text-xs text-gray-500">
              Konfigurasi dinamis identitas instansi Kementerian Haji dan Umrah, branding, dan informasi kontak resmi
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Form Component */}
      <SettingsForm initialConfig={config} />
    </div>
  );
}
