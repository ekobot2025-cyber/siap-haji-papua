import React from 'react';
import { redirect } from 'next/navigation';
import { ExternalLink, Newspaper } from 'lucide-react';
import { getServerSession } from '@/infrastructure/security/jwt';
import { InformasiCarousel, type InfoSlide } from '@/components/informasi/InformasiCarousel';

export const dynamic = 'force-dynamic';

/**
 * Halaman Informasi Resmi: hanya memuat tautan ke kanal PUBLIK resmi.
 * Tidak ada scraping; isi berita selalu dibuka di sumber aslinya.
 */
const SLIDES: InfoSlide[] = [
  {
    id: 'ig-jayapura',
    kategori: 'Instagram Resmi',
    judul: 'Kemenhaj Kota Jayapura',
    ringkas:
      'Kabar kegiatan, pengumuman layanan, dan dokumentasi bimbingan jamaah haji dari Kantor Kemenhaj Kota Jayapura.',
    sumber: '@kemenhajkotajayapura',
    url: 'https://www.instagram.com/kemenhajkotajayapura',
    warna: 'bg-gradient-to-br from-[#8a6d2b] to-[#1A1410]',
  },
  {
    id: 'ig-ri',
    kategori: 'Instagram Resmi',
    judul: 'Kementerian Haji dan Umrah RI',
    ringkas:
      'Informasi nasional penyelenggaraan haji dan umrah: kebijakan, jadwal, dan edukasi jamaah dari Kemenhaj RI.',
    sumber: '@kemenhaj.ri',
    url: 'https://www.instagram.com/kemenhaj.ri',
    warna: 'bg-gradient-to-br from-emerald-700 to-emerald-950',
  },
  {
    id: 'web-haji',
    kategori: 'Portal Resmi',
    judul: 'Portal Haji dan Umrah',
    ringkas: 'Pengumuman resmi, regulasi, dan layanan informasi haji dari portal pemerintah.',
    sumber: 'haji.go.id',
    url: 'https://haji.go.id',
    warna: 'bg-gradient-to-br from-blue-700 to-blue-950',
  },
  {
    id: 'web-kemenag',
    kategori: 'Berita Resmi',
    judul: 'Berita Kementerian Agama',
    ringkas: 'Berita dan siaran pers terbaru terkait penyelenggaraan ibadah haji.',
    sumber: 'kemenag.go.id',
    url: 'https://kemenag.go.id',
    warna: 'bg-gradient-to-br from-purple-700 to-purple-950',
  },
];

export default async function InformasiResmiPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return (
    <div className="space-y-6">
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

      <InformasiCarousel slides={SLIDES} />

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
