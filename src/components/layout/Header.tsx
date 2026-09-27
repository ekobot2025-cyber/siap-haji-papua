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
    <header className="bg-[#1A1410] text-white border-b border-[#c9a961]/30 shadow-md sticky top-7 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding & Dynamic Organizer */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-[#c9a961]/50 shadow-inner group-hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/branding/app-icon.png"
                alt="Logo SIAP HAJI PAPUA"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wide text-white">
                  SIAP <span className="text-[#c9a961]">HAJI</span> PAPUA
                </span>
                <span className="hidden sm:inline-block bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-[#1A1410] text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                  Command Center
                </span>
              </div>
              <p className="text-[11px] text-amber-100/80 truncate max-w-[240px] sm:max-w-md">
                {config.organizerName}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Active Season */}
        <div className="hidden lg:flex items-center gap-2 bg-[#2A211B] border border-[#c9a961]/30 px-3 py-1 rounded-full text-xs text-amber-100">
          <Calendar className="w-3.5 h-3.5 text-[#c9a961]" />
          <span className="font-semibold">{config.activeSeasonName || 'Musim Haji 1447 H / 2026 M'}</span>
        </div>

        {/* Right: Actions, Accessibility Toggle, User Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Large Text Accessibility Toggle */}
          <button
            type="button"
            onClick={() => setIsLargeText(!isLargeText)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isLargeText
                ? 'bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-[#1A1410] border-amber-300 shadow-xs'
                : 'bg-white/10 text-white border-[#c9a961]/30 hover:bg-white/20'
            }`}
            title="Klik untuk beralih mode teks besar (Lansia-friendly)"
            aria-pressed={isLargeText}
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teks Besar</span>
          </button>

          {/* User Session Pill */}
          {session ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#c9a961]/30">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white truncate max-w-[140px]">
                  {session.fullName}
                </span>
                <span className="text-[10px] text-[#c9a961] flex items-center justify-end gap-1">
                  {session.regionName && (
                    <span className="flex items-center gap-0.5 text-amber-200/80">
                      <MapPin className="w-2.5 h-2.5" />
                      {session.regionName} •
                    </span>
                  )}
                  {session.roles[0]}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-[#1A1410] border border-amber-200 flex items-center justify-center font-bold text-xs shadow-xs">
                {session.fullName.charAt(0)}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-1.5 text-stone-300 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:scale-110 active:scale-95 flex items-center justify-center"
                title="Keluar dari sistem"
                aria-label="Logout"
              >
                {isLoggingOut ? (
                  <span className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 bg-gradient-to-r from-[#c9a961] to-[#b8941e] hover:brightness-105 text-[#1A1410] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#c9a961] shadow-xs"
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
