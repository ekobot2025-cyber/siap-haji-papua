import React from 'react';
import { Database, MapPin, Calendar, Sliders, ShieldCheck } from 'lucide-react';
import { prisma } from '@/infrastructure/database/prisma.client';
import { getServerSession } from '@/infrastructure/security/jwt';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MasterDataPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const [regions, seasons, rules] = await Promise.all([
    prisma.region.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    }),
    prisma.hajjSeason.findMany({
      orderBy: { yearGregorian: 'desc' },
    }),
    prisma.readinessRule.findMany({
      include: { season: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  const totalWeight = rules.reduce((sum, r) => sum + r.weightPercentage, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#e8dfc8] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a961] to-[#b8941e] text-white font-bold flex items-center justify-center shadow-xs">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1A1410]">Master Data Sistem</h1>
            <p className="text-xs text-gray-500">
              Konfigurasi master wilayah Papua (11 Kab/Kota), musim haji multi-season, dan bobot aturan Readiness Engine
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Master Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Master Wilayah */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#e8dfc8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e8dfc8]/60 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8a6d2b]" />
              <h2 className="text-base font-bold text-[#1A1410]">Master Wilayah Papua ({regions.length})</h2>
            </div>
            <span className="text-[10px] bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] px-2 py-0.5 rounded font-mono font-bold">
              11 Wilayah Definitif
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] text-gray-600 font-semibold border-b border-[#e8dfc8]">
                  <th className="py-2 px-3">Kode</th>
                  <th className="py-2 px-3">Nama Wilayah</th>
                  <th className="py-2 px-3">Tipe</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dfc8]/60">
                {regions.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 px-3 font-mono font-bold text-[#8a6d2b]">{r.code}</td>
                    <td className="py-2 px-3 font-semibold text-[#1A1410]">{r.name}</td>
                    <td className="py-2 px-3 text-gray-500">{r.type}</td>
                    <td className="py-2 px-3 text-right">
                      <span className="bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] text-[10px] font-bold px-2 py-0.5 rounded">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Master Musim Haji & Readiness Rules */}
        <div className="lg:col-span-6 space-y-6">
          {/* Musim Haji */}
          <div className="bg-white p-5 rounded-2xl border border-[#e8dfc8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e8dfc8]/60 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#8a6d2b]" />
                <h2 className="text-base font-bold text-[#1A1410]">Musim Haji ({seasons.length})</h2>
              </div>
              <span className="text-[10px] bg-[#fbf8ee] text-[#8a6d2b] font-bold px-2 py-0.5 rounded border border-[#e8dfc8]">
                Multi-Season Ready
              </span>
            </div>

            <div className="space-y-3">
              {seasons.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-[#FAF9F5] border border-[#e8dfc8] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1410]">{s.seasonName}</span>
                    {s.isActive && (
                      <span className="btn-kemenhaj-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                        Musim Aktif
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 flex items-center justify-between pt-1">
                    <span>Kuota Total: <strong className="font-mono text-[#8a6d2b]">{s.quotaTotal}</strong> Jamaah</span>
                    <span>Tahun: {s.yearHijri}H / {s.yearGregorian}M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bobot Aturan Readiness Engine */}
          <div className="bg-white p-5 rounded-2xl border border-[#e8dfc8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e8dfc8]/60 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#8a6d2b]" />
                <h2 className="text-base font-bold text-[#1A1410]">Bobot Komponen Readiness</h2>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                totalWeight === 100 ? 'bg-[#fbf8ee] text-[#8a6d2b] border-[#e8dfc8]' : 'bg-red-100 text-red-800 border-red-300'
              }`}>
                Total Bobot: {totalWeight}%
              </span>
            </div>

            <div className="space-y-2">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F5] text-xs border border-[#e8dfc8]">
                  <span className="font-semibold text-gray-800">{rule.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-[#8a6d2b] bg-white px-2 py-0.5 rounded border border-[#e8dfc8] shadow-2xs">
                      {rule.weightPercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 italic">
              * Bobot ini dapat disesuaikan per musim haji dan diverifikasi otomatis agar bernilai 100%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
