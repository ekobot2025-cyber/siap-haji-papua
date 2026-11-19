import React from 'react';
import { ExternalLink, Newspaper } from 'lucide-react';
import { BeritaLiveCarousel } from '@/components/informasi/BeritaLiveCarousel';
import { INFO_SLIDES as SLIDES } from '@/components/informasi/slides';


export const metadata = {
  title: 'Informasi Resmi Kemenhaj | SIAP HAJI PAPUA',
  description: 'Kanal informasi publik resmi Kemenhaj: Instagram, portal haji, dan berita Kemenag.',
};

export default function InformasiResmiPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6 min-h-screen bg-[#FAF9F5]">
      <div className="bg-white p-5 rounded-2xl border border-[#e8dfc8] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Newspaper className="w-5 h-5 text-[#b8941e]" />
          <h1 className="text-xl sm:text-2xl font-black text-[#1A1410] tracking-tight">
            Informasi Resmi Kemenhaj
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600">
          Kanal informasi publik resmi. Konten dibuka langsung di sumber aslinya.
        </p>
      </div>

      <BeritaLiveCarousel />

      <div className="grid sm:grid-cols-2 gap-4">
        {SLIDES.map((s) => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-[#e8dfc8] p-4 hover:bg-[#fbf8ee] transition-colors"
          >
            <p className="text-[10px] font-bold uppercase text-[#8a6d2b]">{s.kategori}</p>
            <p className="font-bold text-[#1A1410] mt-1 flex items-center gap-1.5">
              {s.judul} <ExternalLink className="w-3.5 h-3.5" />
            </p>
            <p className="text-xs text-stone-600 mt-1">{s.sumber}</p>
          </a>
        ))}
      </div>
    </div>
  );
}


