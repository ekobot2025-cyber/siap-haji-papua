'use client';

import React from 'react';
import { InformasiCarousel } from './InformasiCarousel';
import { BERITA_HAJI } from '@/data/berita-haji';
import { INFO_SLIDES } from './slides';

/** Slide: berita/pengumuman haji.go.id & papua.haji.go.id, lalu kartu kanal resmi (tanpa Kemenag umum). */
export function BeritaLiveCarousel() {
  const kanal = INFO_SLIDES.filter((s) => s.id !== 'web-kemenag');
  return <InformasiCarousel slides={[...BERITA_HAJI, ...kanal]} />;
}
