import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="bg-[#fbf8ee] text-[#7a6122] border-b border-[#e8dfc8] px-4 sm:px-6 lg:px-8 py-1.5 text-xs font-medium flex items-center justify-between sticky top-0 z-50 backdrop-blur-xs">
      <div className="flex items-center gap-2 w-full">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#b8941e]" />
        <span>
          <strong className="font-bold text-[#1A1410]">DATA DEMO INTERNAL</strong> : Simulasi operasional & evaluasi kesiapan haji. Seluruh identitas merupakan data sintetis.
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1.5 bg-[#f4ebd0] text-[#7a6122] border border-[#e8dfc8] px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0">
        <AlertCircle className="w-3 h-3 text-[#b8941e]" />
        <span>PILOT v1.0</span>
      </div>
    </div>
  );
}
