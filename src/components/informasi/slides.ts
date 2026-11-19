import type { InfoSlide } from './InformasiCarousel';

/**
 * Halaman Informasi Resmi: hanya memuat tautan ke kanal PUBLIK resmi.
 * Tidak ada scraping; isi berita selalu dibuka di sumber aslinya.
 */
export const INFO_SLIDES: InfoSlide[] = [
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

