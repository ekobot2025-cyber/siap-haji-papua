'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, Type, MapPin, Calendar, Sparkles } from 'lucide-react';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

interface HeaderProps {
  session: UserSessionPayload | null;
  config: {
    appName: string;
    organizerName: string;
    activeSeasonName?: string;
  };
}

export function Header({ session, config }: HeaderProps) {
  const router = useRouter();
  const [isLargeText, setIsLargeText] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isLargeText) {
      document.body.classList.add('large-text-mode');
    } else {
      document.body.classList.remove('large-text-mode');
    }
  }, [isLargeText]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white text-stone-800 border-b border-[#e8dfc8] shadow-xs sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding & Dynamic Organizer */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-[#e8dfc8] shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/branding/logo-kemenhaj.png"
                alt="Logo SIAP HAJI PAPUA"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-[#1A1410]">
                  SIAP <span className="text-[#b8941e]">HAJI</span> PAPUA
                </span>
                <span className="hidden sm:inline-block bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  Command Center
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium truncate max-w-[240px] sm:max-w-md">
                {config.organizerName}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Active Season */}
        <div className="hidden lg:flex items-center gap-2 bg-[#fbf8ee] border border-[#e8dfc8] px-3.5 py-1 rounded-full text-xs text-[#7a6122] shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#b8941e]" />
          <span className="font-semibold text-[#1A1410]">{config.activeSeasonName || 'Musim Haji 1447 H / 2026 M'}</span>
        </div>

        {/* Right: Actions, Accessibility Toggle, User Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Large Text Accessibility Toggle */}
          <button
            type="button"
            onClick={() => setIsLargeText(!isLargeText)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isLargeText
                ? 'bg-[#fbf8ee] text-[#8a6d2b] border-[#c9a961] shadow-2xs'
                : 'bg-white hover:bg-[#fbf8ee] text-stone-600 border-[#e8dfc8]'
            }`}
            title="Klik untuk beralih mode teks besar (Lansia-friendly)"
            aria-pressed={isLargeText}
          >
            <Type className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Teks Besar</span>
          </button>

          {/* User Session Pill */}
          {session ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#e8dfc8]">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-[#1A1410] truncate max-w-[140px]">
                  {session.fullName}
                </span>
                <span className="text-[10px] text-[#8a6d2b] font-medium flex items-center justify-end gap-1">
                  {session.regionName && (
                    <span className="flex items-center gap-0.5 text-stone-500">
                      <MapPin className="w-2.5 h-2.5 text-[#b8941e]" />
                      {session.regionName} •
                    </span>
                  )}
                  {session.roles[0]}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-[#c9a961]/25">
                {session.fullName.charAt(0)}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
                title="Keluar dari sistem"
                aria-label="Logout"
              >
                {isLoggingOut ? (
                  <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 btn-kemenhaj-primary px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-transform"
            >
              <User className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
