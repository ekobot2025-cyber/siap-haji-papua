'use client';

import React, { useEffect, useState } from 'react';
import { InformasiCarousel, type InfoSlide } from './InformasiCarousel';
import { INFO_SLIDES } from './slides';

interface ApiItem {
  id: string;
  judul: string;
  ringkas: string;
  url: string;
  tanggal: string;
  haji: boolean;
}

const WARNA = [
  'bg-gradient-to-br from-emerald-700 to-emerald-950',
  'bg-gradient-to-br from-[#8a6d2b] to-[#1A1410]',
  'bg-gradient-to-br from-blue-700 to-blue-950',
  'bg-gradient-to-br from-purple-700 to-purple-950',
];

function tgl(s: string): string {
  const d = new Date(s);
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jayapura' });
}

/** Slide berita terbaru dari RSS publik Kemenag; tautan kanal resmi tetap sebagai slide penutup. */
export function BeritaLiveCarousel() {
  const [slides, setSlides] = useState<InfoSlide[]>(INFO_SLIDES);

  useEffect(() => {
    let alive = true;
    fetch('/api/public/berita')
      .then((r) => r.json())
      .then((j) => {
        if (!alive || !j.success || !j.items?.length) return;
        const berita: InfoSlide[] = (j.items as ApiItem[]).map((it, i) => ({
          id: it.id,
          kategori: `${it.haji ? 'Berita Haji' : 'Berita Kemenag'}${tgl(it.tanggal) ? ' • ' + tgl(it.tanggal) : ''}`,
          judul: it.judul,
          ringkas: it.ringkas,
          sumber: 'berita selengkapnya di kemenag.go.id',
          url: it.url,
          warna: WARNA[i % WARNA.length],
        }));
        setSlides([...berita, ...INFO_SLIDES]);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return <InformasiCarousel slides={slides} />;
}
