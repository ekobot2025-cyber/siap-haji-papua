'use client';

import React, { useState, useEffect } from 'react';
import { InformasiCarousel, InfoSlide } from './InformasiCarousel';
import { BERITA_HAJI } from '@/data/berita-haji';
import { INFO_SLIDES } from './slides';

/** 
 * Slide informasi & media promosi dinamis:
 * Mengambil materi promosi terkini yang diinput oleh Admin Kemenhaj via /api/promotions
 * dengan fallback aman ke daftar resmi BERITA_HAJI.
 */
export function BeritaLiveCarousel() {
  const kanal = INFO_SLIDES.filter((s) => s.id !== 'web-kemenag');
  const defaultSlides: InfoSlide[] = [...BERITA_HAJI, ...kanal];

  const [slides, setSlides] = useState<InfoSlide[]>(defaultSlides);

  useEffect(() => {
    let isMounted = true;

    async function loadDynamicPromotions() {
      try {
        const res = await fetch('/api/promotions?channel=WEB&active=true');
        if (!res.ok) return;
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const dynamicSlides: InfoSlide[] = json.data.map((item: any) => ({
            id: item.id,
            kategori: item.kategori,
            judul: item.judul,
            ringkas: item.ringkas,
            sumber: item.sumber || 'papua.haji.go.id',
            url: item.url || 'https://papua.haji.go.id',
            warna: '',
            gambar: item.gambar || undefined,
          }));

          if (isMounted) {
            setSlides([...dynamicSlides, ...kanal]);
          }
        }
      } catch (err) {
        // Silent fallback to defaultSlides without breaking UI
        console.warn('Fallback to static haji news carousel:', err);
      }
    }

    loadDynamicPromotions();

    return () => {
      isMounted = false;
    };
  }, []);

  return <InformasiCarousel slides={slides} />;
}
