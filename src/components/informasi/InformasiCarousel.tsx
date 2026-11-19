'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export interface InfoSlide {
  id: string;
  kategori: string;
  judul: string;
  ringkas: string;
  sumber: string;
  url: string;
  warna: string;
}

export function InformasiCarousel({ slides }: { slides: InfoSlide[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const s = slides[idx];
  const go = (d: number) => setIdx((i) => (i + d + slides.length) % slides.length);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#e8dfc8] shadow-xs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`p-8 sm:p-12 min-h-[260px] text-white ${s.warna}`}>
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
          {s.kategori}
        </span>
        <h2 className="mt-4 text-2xl sm:text-3xl font-black leading-tight max-w-3xl">{s.judul}</h2>
        <p className="mt-3 text-sm sm:text-base text-white/90 max-w-3xl">{s.ringkas}</p>
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 bg-white text-[#1A1410] text-xs sm:text-sm font-bold px-4 py-2 rounded-xl"
        >
          Buka {s.sumber} <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Sebelumnya"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
      >
        <ChevronLeft className="w-5 h-5 text-[#1A1410]" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Berikutnya"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
      >
        <ChevronRight className="w-5 h-5 text-[#1A1410]" />
      </button>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
