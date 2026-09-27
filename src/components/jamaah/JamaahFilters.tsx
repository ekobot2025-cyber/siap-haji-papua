'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';

interface JamaahFiltersProps {
  regions: { id: string; name: string }[];
  isRegionAdmin?: boolean;
  userRegionId?: string | null;
}

export function JamaahFilters({ regions, isRegionAdmin, userRegionId }: JamaahFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [regionId, setRegionId] = useState(searchParams.get('regionId') || (isRegionAdmin && userRegionId ? userRegionId : ''));
  const [readinessCategory, setReadinessCategory] = useState(searchParams.get('readinessCategory') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [elderly, setElderly] = useState(searchParams.get('elderly') || '');

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (regionId) params.set('regionId', regionId);
    if (readinessCategory) params.set('readinessCategory', readinessCategory);
    if (gender) params.set('gender', gender);
    if (elderly) params.set('elderly', elderly);

    router.push(`/jamaah?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setRegionId(isRegionAdmin && userRegionId ? userRegionId : '');
    setReadinessCategory('');
    setGender('');
    setElderly('');
    router.push('/jamaah');
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Cari Nama, No Porsi, atau NIK..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none"
          />
        </div>

        {/* Region Filter */}
        <div>
          <select
            value={regionId}
            disabled={isRegionAdmin}
            onChange={(e) => setRegionId(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none bg-white disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">Semua Wilayah</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Readiness Category Filter */}
        <div>
          <select
            value={readinessCategory}
            onChange={(e) => setReadinessCategory(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none bg-white"
          >
            <option value="">Semua Status Kesiapan</option>
            <option value="SIAP">Siap Berangkat (≥90%)</option>
            <option value="HAMPIR_SIAP">Hampir Siap (75-89%)</option>
            <option value="PERLU_TINDAK_LANJUT">Perlu Tindak Lanjut (50-74%)</option>
            <option value="PRIORITAS">Prioritas Intervensi (&lt;50%)</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none bg-white"
          >
            <option value="">Semua Gender</option>
            <option value="MALE">Laki-Laki</option>
            <option value="FEMALE">Perempuan</option>
          </select>
        </div>

        {/* Elderly Filter */}
        <div>
          <select
            value={elderly}
            onChange={(e) => setElderly(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] outline-none bg-white"
          >
            <option value="">Semua Usia</option>
            <option value="true">Prioritas Lansia (≥65 th)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Reset Filter</span>
        </button>
        <button
          type="button"
          onClick={applyFilters}
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#1e40af] to-[#059669] hover:from-[#1e3a8a] hover:to-[#047857] text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-emerald-200" />
          <span>Terapkan Filter</span>
        </button>
      </div>
    </div>
  );
}
