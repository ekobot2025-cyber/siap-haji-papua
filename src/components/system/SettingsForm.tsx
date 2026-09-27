'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Check, AlertCircle } from 'lucide-react';
import type { AppConfig } from '@/application/services/settings.service';

export function SettingsForm({ initialConfig }: { initialConfig: AppConfig }) {
  const router = useRouter();
  const [appName, setAppName] = useState(initialConfig.appName);
  const [tagline, setTagline] = useState(initialConfig.tagline);
  const [organizerName, setOrganizerName] = useState(initialConfig.organizerName);
  const [organizerAddress, setOrganizerAddress] = useState(initialConfig.organizerAddress);
  const [contactEmail, setContactEmail] = useState(initialConfig.contactEmail);
  const [contactPhone, setContactPhone] = useState(initialConfig.contactPhone);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const updates = [
      { key: 'APP_NAME', value: appName },
      { key: 'APP_TAGLINE', value: tagline },
      { key: 'ORGANIZER_NAME', value: organizerName },
      { key: 'ORGANIZER_ADDRESS', value: organizerAddress },
      { key: 'CONTACT_EMAIL', value: contactEmail },
      { key: 'CONTACT_PHONE', value: contactPhone },
    ];

    try {
      for (const item of updates) {
        await fetch('/api/system/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }

      setMessage({ text: 'Seluruh konfigurasi sistem berhasil disimpan ke basis data dan dicatat pada Audit Log.', type: 'success' });
      router.refresh();
    } catch {
      setMessage({ text: 'Gagal menyimpan konfigurasi sistem.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {message && (
        <div
          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Group: Branding & Application Identity */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-slate-100 pb-2">
          1. Identitas Branding Aplikasi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nama Aplikasi Sistem
            </label>
            <input
              type="text"
              required
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Slogan / Tagline
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Group: Institution Agnostic Organizer Information */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-gray-900 border-b border-slate-100 pb-2">
          2. Nomenklatur Lembaga / Penyelenggara (Institution-Agnostic)
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nama Instansi / Badan Penyelenggara
          </label>
          <input
            type="text"
            required
            value={organizerName}
            onChange={(e) => setOrganizerName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Dapat disesuaikan jika terjadi perubahan nomenklatur kementerian atau pembentukan badan penyelenggara baru tanpa mengubah kode program.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Alamat Kantor / Komando
          </label>
          <input
            type="text"
            required
            value={organizerAddress}
            onChange={(e) => setOrganizerAddress(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Resmi Layanan
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Telepon / Call Center
            </label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#1e40af] to-[#059669] hover:from-[#1e3a8a] hover:to-[#047857] text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-emerald-200" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>
    </form>
  );
}
