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
    { label: 'Petugas Kesehatan', username: 'petugaskesehatan', role: 'PETUGAS_KESEHATAN', desc: 'Pemeriksaan & Istitha’ah RSUD / BKKP' },
    { label: 'Admin Kota Jayapura', username: 'adminkotajpr', role: 'REGION_ADMIN', desc: 'Scoped: Kota Jayapura' },
    { label: 'Petugas Kloter', username: 'petugaskloter', role: 'OFFICER', desc: 'Scoped: Kloter 01' },
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

      const targetPath = json.data?.user?.roles?.includes('PETUGAS_KESEHATAN') ? '/kesehatan' : '/dashboard';
      window.location.href = targetPath;
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col justify-between">
      <DemoBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-2xl shadow-xl border border-[#e8dfc8] overflow-hidden">
          {/* Left Column: Visual Brand Identity */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#261F1A] via-[#1A1410] to-[#140F0C] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#c9a961_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 border border-[#c9a961]/50 mb-6 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/branding/app-icon.png"
                  alt="SIAP HAJI PAPUA Icon"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white mb-1">
                SIAP <span className="text-[#c9a961]">HAJI</span> PAPUA
              </h1>
              <p className="text-xs text-amber-100 font-semibold tracking-wide uppercase mb-4">
                Command Center Penyelenggaraan Haji
              </p>

              <div className="border-t border-[#c9a961]/30 pt-4 text-xs text-amber-50/90 space-y-2 leading-relaxed">
                <p>Sistem Informasi Administrasi, Monitoring, dan Pelayanan Haji Provinsi Papua.</p>
                <p className="text-[#c9a961] font-semibold italic">
                  &ldquo;Satu Data • Satu Monitoring • Satu Layanan • Haji Papua Siap&rdquo;
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-white/10 text-[11px] text-amber-100/70">
              <div className="flex items-center gap-1 text-[#c9a961] font-semibold mb-1">
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
                  <h2 className="text-xl font-bold text-[#1A1410]">Masuk ke Portal</h2>
                  <p className="text-xs text-stone-500">Silakan masukkan username dan password administratif Anda</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#fbf8f0] text-[#b8941e] flex items-center justify-center border border-[#e8dfc8]">
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
                  <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="username">
                    Username atau Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      id="username"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. superadmin / adminprov"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-[#e8dfc8] rounded-lg focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1" htmlFor="password">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-[#e8dfc8] rounded-lg focus:ring-2 focus:ring-[#c9a961] focus:border-[#c9a961] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#c9a961] to-[#b8941e] hover:brightness-105 text-[#1A1410] font-bold py-2.5 px-4 rounded-lg text-sm shadow-md shadow-[#c9a961]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Memverifikasi...' : 'Masuk ke Command Center'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Demo Role Selector */}
            <div className="mt-6 pt-5 border-t border-[#e8dfc8]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2">
                <Info className="w-3.5 h-3.5 text-[#b8941e]" />
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
                        ? 'border-[#c9a961] bg-[#fbf8f0] text-[#1A1410] font-bold shadow-2xs'
                        : 'border-[#e8dfc8] bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="truncate font-semibold">{acc.label}</div>
                    <div className="text-[10px] text-stone-500 font-mono truncate">{acc.username}</div>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-stone-500 mt-2 text-center">
                Kata sandi untuk seluruh akun demo: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">AdminPapua2026!</code>
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
