'use client';

import React from 'react';
import Link from 'next/link';
import {
  Tv,
  Globe,
  LogOut,
  User,
  ExternalLink,
} from 'lucide-react';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export function PromosiHeader({ session }: { session: UserSessionPayload }) {
  const handleLogout = async () => {
    if (!confirm('Apakah Anda ingin keluar dari Panel Media Promosi?')) return;
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      window.location.href = '/promosi/login';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8dfc8] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-[#e8dfc8] shadow-xs flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/branding/logo-kemenhaj.png"
              alt="Logo Kementerian Haji dan Umrah"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-[#1A1410] tracking-tight leading-none">
                PANEL MEDIA PROMOSI &amp; TV DISPLAY
              </h1>
            </div>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5 hidden sm:block">
              Kementerian Haji dan Umrah • Wilayah Kerja Papua
            </p>
          </div>
        </div>

        {/* Quick Links & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Link to live landing page */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e8dfc8] bg-[#fbf8ee] hover:bg-[#f5eed6] text-xs font-semibold text-[#8a6d2b] transition-colors"
            title="Buka Website Publik hajipapua.id di tab baru"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Lihat Web hajipapua.id</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          {/* Link to live Video Wall TV */}
          <Link
            href="/video-wall"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
            title="Buka Layar TV Lobi / Video Wall Signage"
          >
            <Tv className="w-3.5 h-3.5 text-[#8a6d2b]" />
            <span className="hidden sm:inline">Layar TV Lobi</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          {/* User profile pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700">
            <div className="w-6 h-6 rounded-full bg-[#c9a961] text-white flex items-center justify-center font-bold text-[10px]">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold max-w-[140px] truncate">{session.fullName || session.username}</span>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition-colors cursor-pointer"
            title="Keluar dari Panel Promosi"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
