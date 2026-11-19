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
  gambar?: string;
}

export function InformasiCarousel({ slides }: { slides: InfoSlide[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  useEffect(() => {
    if (idx >= slides.length) setIdx(0);
  }, [slides.length, idx]);

  const s = slides[idx] ?? slides[0];
  const go = (d: number) => setIdx((i) => (i + d + slides.length) % slides.length);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#e8dfc8] shadow-xs bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col md:flex-row min-h-[300px]">
        {s.gambar && (
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="md:w-5/12 bg-stone-100 flex items-center justify-center p-3 md:p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={s.gambar}
              src={s.gambar}
              alt={s.judul}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="max-h-[320px] w-full object-contain rounded-lg"
            />
          </a>
        )}

        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
          <span className="self-start text-[10px] font-bold uppercase tracking-widest bg-[#fbf8ee] text-[#8a6d2b] border border-[#e8dfc8] px-2.5 py-1 rounded-full">
            {s.kategori}
          </span>
          <h2 className="mt-3 text-xl sm:text-2xl font-black leading-tight text-[#1A1410]">{s.judul}</h2>
          <p className="mt-3 text-sm text-stone-600 line-clamp-5">{s.ringkas}</p>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 self-start inline-flex items-center gap-1.5 btn-kemenhaj-primary text-xs sm:text-sm font-bold px-4 py-2 rounded-xl"
          >
            Buka {s.sumber} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Sebelumnya"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-[#e8dfc8] rounded-full p-2 shadow-xs"
      >
        <ChevronLeft className="w-5 h-5 text-[#1A1410]" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Berikutnya"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-[#e8dfc8] rounded-full p-2 shadow-xs"
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
            className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-[#b8941e]' : 'w-2 bg-stone-300'}`}
          />
        ))}
      </div>
    </div>
  );
}
