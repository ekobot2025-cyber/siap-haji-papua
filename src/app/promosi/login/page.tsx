'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  User,
  Tv,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  Video,
} from 'lucide-react';

export default function PromosiLoginPage() {
  const [identifier, setIdentifier] = useState('admin.promosi');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        setErrorMessage(json.message || 'Login gagal. Periksa kembali username dan kata sandi Anda.');
        setIsLoading(false);
        return;
      }

      // Berhasil login -> langsung arahkan ke Panel Mandiri Promosi
      window.location.href = '/promosi';
    } catch {
      setErrorMessage('Terjadi kesalahan koneksi ke server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-between selection:bg-[#c9a961] selection:text-[#1A1410]">
      {/* Top Bar Navigation */}
      <header className="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#8a6d2b] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda hajipapua.id</span>
        </Link>

        <Link
          href="/video-wall"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a6d2b] hover:underline"
        >
          <Tv className="w-3.5 h-3.5" />
          <span>Buka Layar TV Lobi</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl shadow-xl border border-[#e8dfc8] overflow-hidden">
          {/* Left Column: Brand & Context */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#14100D] via-[#1E1712] to-[#14100D] p-8 text-white flex flex-col justify-between relative overflow-hidden border-r border-[#c9a961]/20">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#c9a961]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 border border-[#c9a961]/40 mb-6 shadow-md backdrop-blur-xs flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/branding/logo-kemenhaj.png"
                  alt="Logo Kementerian Haji dan Umrah"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/40 mb-3">
                <Sparkles className="w-3 h-3 text-[#c9a961]" />
                PANEL HUMAS &amp; INFORMASI
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white mb-2 leading-tight">
                PORTAL ADMIN <span className="text-[#c9a961]">MEDIA PROMOSI</span>
              </h1>

              <p className="text-xs text-stone-300 leading-relaxed mb-6 font-normal">
                Panel kerja mandiri pengelolaan materi flyer promosi, banner informasi, video layanan masyarakat, dan running text TV lobi Kementerian Haji dan Umrah Wilayah Kerja Papua.
              </p>

              <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-stone-400">
                <div className="flex items-center gap-2 text-stone-300">
                  <Tv className="w-4 h-4 text-[#c9a961] shrink-0" />
                  <span>Update slide banner website hajipapua.id</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <Video className="w-4 h-4 text-[#c9a961] shrink-0" />
                  <span>Kelola pemutaran video YouTube / MP4</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <Sparkles className="w-4 h-4 text-[#c9a961] shrink-0" />
                  <span>Kontrol running text ticker TV digital signage</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-[11px] text-stone-400">
              <span className="block font-semibold text-stone-300">Kementerian Haji dan Umrah RI</span>
              <span>Kantor Wilayah Provinsi Papua</span>
            </div>
          </div>

          {/* Right Column: Dedicated Login Form */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1A1410] tracking-tight">
                Masuk ke Panel Promosi
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Silakan masukkan kredensial akun Humas / Pengelola Media Anda.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1410] mb-1.5 uppercase tracking-wider">
                  Username atau Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: admin.promosi"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-hidden bg-[#FAF9F5]/40 text-[#1A1410]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1410] mb-1.5 uppercase tracking-wider">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-[#e8dfc8] focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 outline-hidden bg-[#FAF9F5]/40 text-[#1A1410]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl btn-kemenhaj-primary text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memverifikasi Akun...
                    </span>
                  ) : (
                    <>
                      <span>Masuk ke Panel Media Promosi</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>



            {/* Discrete Link to Technical Operational SIAP Haji */}
            <div className="mt-6 pt-4 border-t border-stone-200 text-center">
              <Link
                href="/login"
                className="text-xs text-stone-500 hover:text-[#8a6d2b] transition-colors"
              >
                Login Petugas Operasional SIAP Haji (Dokter / Verifikator / Kloter) &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-stone-400">
        &copy; {new Date().getFullYear()} Kementerian Haji dan Umrah Wilayah Kerja Papua • Satu Data Satu Layanan
      </footer>
    </div>
  );
}
