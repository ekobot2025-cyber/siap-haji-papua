'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { DemoBanner } from '@/components/layout/DemoBanner';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('superadmin');
  const [password, setPassword] = useState('AdminPapua2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const demoAccounts = [
    { label: 'Super Admin', username: 'superadmin', role: 'SUPER_ADMIN', desc: 'Akses Penuh Seluruh Sistem' },
    { label: 'Pimpinan', username: 'pimpinan', role: 'LEADER', desc: 'Executive Monitoring (Read-Only)' },
    { label: 'Admin Provinsi', username: 'adminprov', role: 'PROV_ADMIN', desc: 'Komando & Operasional Provinsi' },
    { label: 'Admin Kota Jayapura', username: 'adminkotajpr', role: 'REGION_ADMIN', desc: 'Scoped: Kota Jayapura' },
    { label: 'Admin Biak Numfor', username: 'adminbiak', role: 'REGION_ADMIN', desc: 'Scoped: Kab. Biak Numfor' },
    { label: 'Petugas Kloter', username: 'petugaskloter', role: 'OFFICER', desc: 'Scoped: Kloter 01' },
    { label: 'Jamaah (Fatimah)', username: 'jamaahdemo', role: 'JAMAAH', desc: 'Portal Mandiri Jamaah' },
  ];

  const handleQuickSelect = (username: string) => {
    setIdentifier(username);
    setPassword('AdminPapua2026!');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'Login gagal');
        setIsLoading(false);
        return;
      }

      const targetPath = json.data?.user?.roles?.includes('JAMAAH') ? '/portal-jamaah' : '/';
      window.location.href = targetPath;
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col justify-between">
      <DemoBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Left Column: Visual Brand Identity */}
          <div className="md:col-span-5 bg-[#0A3E2F] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 border border-[#D4AF37] mb-6 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/branding/app-icon.png"
                  alt="SIAP HAJI PAPUA Icon"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white mb-1">
                SIAP <span className="text-[#D4AF37]">HAJI</span> PAPUA
              </h1>
              <p className="text-xs text-emerald-100 font-semibold tracking-wide uppercase mb-4">
                Command Center Penyelenggaraan Haji
              </p>

              <div className="border-t border-white/20 pt-4 text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji Provinsi Papua.</p>
                <p className="text-[#D4AF37] font-semibold italic">
                  &ldquo;Satu Data • Satu Monitoring • Satu Layanan • Haji Papua Siap&rdquo;
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-400">
              <div className="flex items-center gap-1 text-emerald-300 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Keamanan Sistem Pemerintahan</span>
              </div>
              <span>Dilindungi enkripsi AES-256, blind index, RBAC, dan append-only audit trail.</span>
            </div>
          </div>

          {/* Right Column: Login Form & Demo Selector */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Masuk ke Portal</h2>
                  <p className="text-xs text-gray-500">Silakan masukkan username dan password administratif Anda</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Lock className="w-4 h-4" />
                </div>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="username">
                    Username atau Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="username"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. superadmin / adminprov"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#15803D] focus:border-[#15803D] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="password">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#15803D] focus:border-[#15803D] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#15803D] hover:bg-[#0A3E2F] text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Memverifikasi...' : 'Masuk ke Command Center'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Demo Role Selector */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Pilih Akun Demo Uji Coba (1-Click) :</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => handleQuickSelect(acc.username)}
                    className={`p-2 rounded-lg border text-left transition-all text-xs cursor-pointer ${
                      identifier === acc.username
                        ? 'border-[#15803D] bg-emerald-50 text-[#0A3E2F] font-bold shadow-2xs'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="truncate font-semibold">{acc.label}</div>
                    <div className="text-[10px] text-gray-500 font-mono truncate">{acc.username}</div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                Kata sandi untuk seluruh akun demo: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-800">AdminPapua2026!</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-3 text-xs text-gray-500">
        © 2026 SIAP HAJI PAPUA • Provinsi Papua
      </footer>
    </div>
  );
}
