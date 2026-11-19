import React from 'react';
import Link from 'next/link';
import { ChevronLeft, HelpCircle } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="bg-white border border-[#e8dfc8] p-8 sm:p-12 rounded-2xl text-center max-w-md mx-auto my-12 shadow-xs space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] flex items-center justify-center mx-auto">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-[#1A1410]">Halaman Tidak Ditemukan</h2>
      <p className="text-xs text-stone-600 leading-relaxed">
        Halaman atau data yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <div className="pt-2 flex justify-center gap-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 btn-kemenhaj-primary px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Command Center</span>
        </Link>
        <Link
          href="/jamaah"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-[#e8dfc8] bg-white hover:bg-[#fbf8ee] text-stone-700"
        >
          <span>Daftar Jamaah</span>
        </Link>
      </div>
    </div>
  );
}
