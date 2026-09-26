import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="bg-amber-600 text-white px-4 sm:px-6 lg:px-8 py-1.5 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs sticky top-0 z-50">
      <div className="flex items-center gap-2 w-full">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-100" />
        <span>
          <strong className="tracking-wide">DATA DEMO — BUKAN DATA RESMI</strong> : Sistem simulasi operasional & evaluasi kesiapan haji internal. Seluruh identitas NIK dan nama merupakan data sintetis.
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1.5 bg-amber-700/60 px-2 py-0.5 rounded text-[11px] font-mono">
        <AlertCircle className="w-3.5 h-3.5 text-amber-200" />
        <span>INTERNAL PILOT v1.0</span>
      </div>
    </div>
  );
}
