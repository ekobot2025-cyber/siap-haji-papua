import type { InfoSlide } from '@/components/informasi/InformasiCarousel';

/**
 * Berita/pengumuman dari portal resmi haji.go.id dan papua.haji.go.id.
 * Situs tersebut tidak menyediakan RSS/API publik, sehingga daftar ini dikurasi admin.
 *
 * Cara menambah slide:
 *  1. Salin tautan artikel dari papua.haji.go.id atau haji.go.id ke `url`.
 *  2. (Opsional) Taruh flyer di folder `public/flyer/` lalu isi `gambar: '/flyer/nama-file.jpg'`.
 *  3. Commit & push: Vercel memperbarui situs otomatis.
 */
export const BERITA_HAJI: InfoSlide[] = [
  {
    id: 'bipih-1448',
    kategori: 'Pengumuman • Kemenhaj Papua',
    judul: 'Pelunasan Bipih Reguler 1448 H / 2027 M',
    ringkas:
      'Tahap pertama pelunasan berlangsung 10 November – 10 Desember 2026 (lunas tunda, alokasi kuota tahun berjalan, dan prioritas lansia). Tahap kedua 16–31 Desember 2026 bila masih ada sisa kuota. Jamaah diimbau segera memeriksa kesehatan (istithaah) dan memastikan BPJS Kesehatan aktif.',
    sumber: 'papua.haji.go.id',
    url: 'https://papua.haji.go.id',
    warna: '',
  },
  {
    id: 'phd-1448',
    kategori: 'Berita • Kanwil Kemenhaj Papua',
    judul: 'Persiapan Seleksi Petugas Haji Daerah (PHD) 1448 H/2027 M',
    ringkas:
      'Kanwil Kemenhaj Papua berkoordinasi dengan Pemerintah Provinsi Papua untuk mematangkan seleksi PHD, berpedoman pada KMHU Nomor 78 Tahun 2026, guna menjaring petugas yang profesional, berintegritas, dan kompeten.',
    sumber: 'papua.haji.go.id',
    url: 'https://papua.haji.go.id',
    warna: '',
  },
  {
    id: 'ppiu-pengawasan',
    kategori: 'Berita • Pengawasan Umrah',
    judul: 'Penguatan Pengawasan Penyelenggara Perjalanan Ibadah Umrah (PPIU)',
    ringkas:
      'Pengawasan dan dorongan kepatuhan PPIU di Kota Jayapura, Kabupaten Jayapura, dan Kabupaten Keerom, berlandaskan PMHU Nomor 2 dan 3 Tahun 2026 demi layanan umrah yang aman dan profesional.',
    sumber: 'papua.haji.go.id',
    url: 'https://papua.haji.go.id',
    warna: '',
  },
];
