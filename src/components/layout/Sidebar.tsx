'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  CreditCard,
  HeartPulse,
  BookOpen,
  Plane,
  AlertCircle,
  Settings,
  Database,
  History,
  ShieldAlert,
  Calendar,
  Compass,
  Sparkles,
  Tv,
  QrCode,
  FileText,
  Loader2,
  ArrowUpRight,
  Globe,
} from 'lucide-react';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

interface SidebarProps {
  session: UserSessionPayload | null;
}

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Clear pending state when navigation completes
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const isSuperAdmin = session?.roles.includes('SUPER_ADMIN');
  const isPetugasKesehatan = session?.roles.includes('PETUGAS_KESEHATAN');

  const navSections = isPetugasKesehatan
    ? [
        {
          title: 'LAYANAN KESEHATAN HAJI',
          items: [
            { label: 'Monitoring Kesehatan', href: '/kesehatan', icon: HeartPulse, active: pathname.startsWith('/kesehatan'), badge: '17 Risti', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
            { label: 'Early Warning Risiko', href: '/monitoring/early-warning', icon: ShieldAlert, active: pathname.startsWith('/monitoring/early-warning'), badge: 'MEDIS', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
            { label: 'Data Medis Jamaah', href: '/jamaah', icon: Users, active: pathname.startsWith('/jamaah') },
            { label: 'Kalender Pemeriksaan', href: '/kalender', icon: Calendar, active: pathname.startsWith('/kalender') },
          ],
        },
        {
          title: 'MONITORING & EMBARKASI',
          items: [
            { label: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard, active: pathname === '/dashboard' },
            { label: 'Manifest & Kloter', href: '/kloter', icon: Plane, active: pathname.startsWith('/kloter'), badge: '4 Kloter', badgeColor: 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]' },
            { label: 'Peta Spasial Papua', href: '/monitoring/peta-wilayah', icon: Compass, active: pathname.startsWith('/monitoring/peta-wilayah') },
            { label: 'Laporan Rekapitulasi', href: '/laporan', icon: FileText, active: pathname === '/laporan', badge: 'RESMI', badgeColor: 'bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-white font-bold' },
          ],
        },
        {
          title: 'LAYANAN TERBUKA',
          items: [
            { label: 'Portal Cek Porsi Mandiri', href: '/cek-porsi', icon: QrCode, active: pathname === '/cek-porsi', badge: 'PUBLIK', badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' },
          ],
        },
      ]
    : [
        {
          title: 'COMMAND CENTER',
          items: [
            { label: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard, active: pathname === '/dashboard' },
            { label: 'Action Center', href: '/action-center', icon: AlertCircle, active: pathname.startsWith('/action-center'), badge: '65', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
            { label: 'Early Warning Engine', href: '/monitoring/early-warning', icon: ShieldAlert, active: pathname.startsWith('/monitoring/early-warning'), badge: 'RISIKO', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
            { label: 'Peta Spasial Papua', href: '/monitoring/peta-wilayah', icon: Compass, active: pathname.startsWith('/monitoring/peta-wilayah') },
            { label: 'Mode Video Wall', href: '/video-wall', icon: Tv, active: pathname === '/video-wall', badge: 'BIG SCREEN', badgeColor: 'bg-[#1A1410] text-[#c9a961] border border-[#c9a961]/40 font-bold' },
            { label: 'Laporan & Rekap Resmi', href: '/laporan', icon: FileText, active: pathname === '/laporan', badge: 'RESMI', badgeColor: 'bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-white font-bold' },
            { label: 'Kalender Operasional', href: '/kalender', icon: Calendar, active: pathname.startsWith('/kalender') },
          ],
        },
        {
          title: 'OPERASIONAL TAHAPAN',
          items: [
            { label: 'Data Jamaah', href: '/jamaah', icon: Users, active: pathname.startsWith('/jamaah') },
            { label: 'Dokumen & Paspor', href: '/dokumen', icon: FileCheck, active: pathname.startsWith('/dokumen'), badge: '21', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
            { label: 'Administrasi BPIH', href: '/administrasi', icon: CreditCard, active: pathname.startsWith('/administrasi'), badge: '19', badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200' },
            { label: 'Monitoring Kesehatan', href: '/kesehatan', icon: HeartPulse, active: pathname.startsWith('/kesehatan'), badge: '17', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
            { label: 'Bimbingan Manasik', href: '/manasik', icon: BookOpen, active: pathname.startsWith('/manasik'), badge: '8', badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200' },
            { label: 'Manajemen Kloter', href: '/kloter', icon: Plane, active: pathname.startsWith('/kloter'), badge: '4 Kloter', badgeColor: 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]' },
            { label: 'Simulasi Kuota Cadangan', href: '/monitoring/simulasi-kuota', icon: Sparkles, active: pathname.startsWith('/monitoring/simulasi-kuota'), badge: 'DSS', badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
          ],
        },
        {
          title: 'LAYANAN PUBLIK',
          items: [
            { label: 'Showcase Beranda', href: '/', icon: Sparkles, active: pathname === '/' },
            { label: 'Portal Cek Porsi Mandiri', href: '/cek-porsi', icon: QrCode, active: pathname === '/cek-porsi', badge: 'WARGA', badgeColor: 'bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8]' },
          ],
        },
        {
          title: 'SISTEM & AUDIT',
          items: [
            { label: 'Audit Trail', href: '/system/audit-logs', icon: History, active: pathname === '/system/audit-logs' },
            { label: 'Master Data', href: '/system/master-data', icon: Database, active: pathname === '/system/master-data' },
            ...(isSuperAdmin
              ? [{ label: 'Pengaturan Sistem', href: '/system/settings', icon: Settings, active: pathname === '/system/settings' }]
              : []),
          ],
        },
      ];

  return (
    <aside className="w-64 bg-white text-stone-700 border-r border-[#e8dfc8] flex flex-col shrink-0 min-h-[calc(100vh-5.75rem)] select-none">
      {/* Scope Info Card */}
      <div className="p-3.5 mx-3 my-3 rounded-xl bg-[#fbf8ee] border border-[#e8dfc8] text-xs">
        <span className="text-[10px] uppercase font-bold text-[#8a6d2b] block mb-0.5">
          {isPetugasKesehatan ? 'Tim Medis & Petugas Kesehatan' : 'Lingkup Otorisasi Data'}
        </span>
        <div className="font-bold text-[#1A1410] truncate">
          {isPetugasKesehatan
            ? (session?.fullName || 'dr. Siti Rahmawati, Sp.PD')
            : (session?.regionName ? session.regionName : 'Seluruh Provinsi Papua')}
        </div>
        <div className="text-[11px] text-stone-500 mt-0.5">
          {isPetugasKesehatan ? (
            <span className="text-[#8a6d2b] font-medium">Balai Karantina / RSUD Papua</span>
          ) : (
            <>Peran: <strong className="text-[#1A1410]">{session?.roles[0] || 'GUEST'}</strong></>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto pb-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8a6d2b]">
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isPending = pendingHref === item.href;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      onClick={() => {
                        if (!item.active && item.href !== pathname) {
                          setPendingHref(item.href);
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        item.active
                          ? 'bg-gradient-to-r from-[#c9a961] to-[#b8941e] text-white font-bold shadow-xs shadow-[#c9a961]/25'
                          : isPending
                          ? 'bg-[#fbf8ee] text-[#8a6d2b] shadow-xs ring-1 ring-[#c9a961]/30 animate-pulse'
                          : 'text-stone-600 hover:bg-[#fbf8ee] hover:text-[#1A1410]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isPending ? (
                          <Loader2 className="w-4 h-4 text-[#b8941e] animate-spin" />
                        ) : (
                          <Icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-stone-400 group-hover:text-[#b8941e]'}`} />
                        )}
                        <span>{item.label}</span>
                      </div>
                      {isPending ? (
                        <span className="text-[10px] font-mono text-[#8a6d2b] font-bold">
                          Memuat...
                        </span>
                      ) : (
                        item.badge && (
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            item.active ? 'bg-white/20 text-white' : (item.badgeColor || 'bg-stone-100 text-stone-600')
                          }`}>
                            {item.badge}
                          </span>
                        )
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Official External Portals */}
      <div className="px-3 py-2 border-t border-[#e8dfc8] space-y-1">
        <a
          href="https://haji.go.id"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#8a6d2b] hover:text-[#1A1410] hover:bg-[#fbf8ee] transition-colors"
        >
          <span className="flex items-center gap-2 truncate">
            <Globe className="w-3.5 h-3.5 text-[#b8941e] shrink-0" />
            <span>Kemenhaj (haji.go.id)</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#b8941e] shrink-0" />
        </a>
      </div>

      {/* Footer Branding Notice */}
      <div className="p-3 border-t border-[#e8dfc8] text-[10px] text-stone-400 text-center font-mono">
        SIAP HAJI PAPUA • v1.0 ENTERPRISE
      </div>
    </aside>
  );
}
