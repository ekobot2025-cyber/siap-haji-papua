import { prisma } from '@/infrastructure/database/prisma.client';
import { BERITA_HAJI } from '@/data/berita-haji';
import type { UserSessionPayload } from '@/infrastructure/security/jwt';

export interface PromotionSlide {
  id: string;
  judul: string;
  kategori: string;
  ringkas: string;
  sumber: string;
  url: string;
  gambar?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  videoUrl?: string;
  targetChannel: 'ALL' | 'WEB' | 'TV';
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  runningText?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

const SETTING_KEY = 'PROMOTION_SLIDES';

const SEED_SLIDES: PromotionSlide[] = [
  {
    id: 'bipih-1448',
    kategori: 'Pengumuman • Kemenhaj Papua',
    judul: 'Pelunasan Bipih Reguler 1448 H / 2027 M',
    ringkas:
      'Tahap pertama pelunasan berlangsung 10 November – 10 Desember 2026 (lunas tunda, alokasi kuota tahun berjalan, dan prioritas lansia). Tahap kedua 16–31 Desember 2026 bila masih ada sisa kuota. Jamaah diimbau segera memeriksa kesehatan (istithaah) dan memastikan BPJS Kesehatan aktif.',
    sumber: 'papua.haji.go.id',
    url: 'https://papua.haji.go.id',
    gambar: '/logo-kemenhaj.png',
    targetChannel: 'ALL',
    isActive: true,
    priority: 1,
    runningText: 'Pelunasan Bipih Tahap 1 berlangsung s.d 10 Desember 2026. Pastikan status istithaah kesehatan terpenuhi di Dinkes/Puskesmas.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'edukasi-istithaah',
    kategori: 'Layanan Medis & Kesehatan',
    judul: 'Pemeriksaan Kesehatan & Syarat Istitha’ah Calon Jamaah Haji',
    ringkas:
      'Pemeriksaan kesehatan haji terpadu di 18 Kabupaten/Kota se-Papua meliputi pemeriksaan fisik, laboratorium, kognitif, dan kesehatan jiwa. Istitha’ah kesehatan merupakan syarat mutlak sebelum melakukan pelunasan Bipih.',
    sumber: 'kemenhaj.go.id',
    url: '/kesehatan',
    gambar: '',
    targetChannel: 'ALL',
    isActive: true,
    priority: 2,
    runningText: 'Pemeriksaan kesehatan haji di seluruh Puskesmas & RSUD rujukan Papua telah dibuka. Hubungi seksi PHU Kemenhaj setempat.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'waspada-penipuan-visa',
    kategori: 'Edukasi & Perlindungan Jamaah',
    judul: 'Waspada Penipuan Haji Cepat Tanpa Antre & Visa Non-Resmi',
    ringkas:
      'Kemenhaj Papua mengimbau seluruh masyarakat untuk berhati-hati terhadap tawaran haji furoda/mujamalah ilegal menggunakan visa turis, kerja, atau ziarah. Berhaji secara sah hanya menggunakan Visa Haji resmi Pemerintah Arab Saudi.',
    sumber: 'Kemenhaj Papua',
    url: '/cek-porsi',
    gambar: '',
    targetChannel: 'ALL',
    isActive: true,
    priority: 3,
    runningText: 'Waspada travel umrah/haji tak berizin! Pastikan travel berizin resmi PPIU/PIHK melalui Kemenhaj Papua.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bimbingan-manasik-papua',
    kategori: 'Bimbingan & Manasik',
    judul: 'Jadwal Bimbingan Manasik Haji Sepanjang Tahun di Kab/Kota',
    ringkas:
      'Kanwil Kemenhaj Papua menyelenggarakan bimbingan manasik di KUA Kecamatan dan Kantor Kemenhaj Kabupaten/Kota untuk membekali jamaah dengan fiqih manasik, ketahanan fisik, serta panduan perjalanan embarkasi.',
    sumber: 'Bidang PHU Papua',
    url: '/manasik',
    gambar: '',
    targetChannel: 'ALL',
    isActive: true,
    priority: 4,
    runningText: 'Ikuti bimbingan manasik haji berkala di KUA terdekat untuk kesiapan ibadah yang mandiri dan mabrur.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let memorySlidesCache: PromotionSlide[] | null = null;
let lastCacheFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 detik

export class PromotionService {
  /**
   * Mengambil semua slide (dengan opsi filter target channel dan status aktif)
   */
  public static async getAll(options?: {
    channel?: 'ALL' | 'WEB' | 'TV';
    activeOnly?: boolean;
  }): Promise<PromotionSlide[]> {
    const slides = await this.loadSlides();

    return slides
      .filter((s) => {
        if (options?.activeOnly && !s.isActive) return false;

        // Validasi rentang tanggal otomatis jika diset
        if (options?.activeOnly) {
          const now = new Date();
          if (s.startDate && new Date(s.startDate) > now) return false;
          if (s.endDate) {
            const end = new Date(s.endDate);
            end.setHours(23, 59, 59, 999);
            if (now > end) return false;
          }
        }

        if (options?.channel && options.channel !== 'ALL') {
          return s.targetChannel === 'ALL' || s.targetChannel === options.channel;
        }

        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Mengambil satu slide berdasarkan ID
   */
  public static async getById(id: string): Promise<PromotionSlide | null> {
    const slides = await this.loadSlides();
    return slides.find((s) => s.id === id) || null;
  }

  /**
   * Menyimpan atau memperbarui slide promosi
   */
  public static async saveSlide(
    slideData: Partial<PromotionSlide> & { judul: string; ringkas: string },
    session?: UserSessionPayload
  ): Promise<PromotionSlide> {
    const slides = await this.loadSlides();
    const nowIso = new Date().toISOString();

    const existingIndex = slides.findIndex((s) => s.id === slideData.id);

    let savedSlide: PromotionSlide;

    if (existingIndex >= 0) {
      // Update existing
      savedSlide = {
        ...slides[existingIndex],
        ...slideData,
        mediaType: slideData.mediaType || (slideData.videoUrl ? 'VIDEO' : slides[existingIndex].mediaType || 'IMAGE'),
        videoUrl: slideData.videoUrl !== undefined ? slideData.videoUrl : slides[existingIndex].videoUrl,
        updatedAt: nowIso,
        updatedBy: session?.fullName || session?.username || 'Admin Kemenhaj',
      };
      slides[existingIndex] = savedSlide;
    } else {
      // Create new
      savedSlide = {
        id: slideData.id || `promo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        judul: slideData.judul,
        kategori: slideData.kategori || 'Pengumuman Resmi',
        ringkas: slideData.ringkas,
        sumber: slideData.sumber || 'Kemenhaj Papua',
        url: slideData.url || 'https://papua.haji.go.id',
        gambar: slideData.gambar || '',
        mediaType: slideData.mediaType || (slideData.videoUrl ? 'VIDEO' : 'IMAGE'),
        videoUrl: slideData.videoUrl || '',
        targetChannel: slideData.targetChannel || 'ALL',
        isActive: slideData.isActive !== undefined ? slideData.isActive : true,
        priority: slideData.priority || slides.length + 1,
        startDate: slideData.startDate,
        endDate: slideData.endDate,
        runningText: slideData.runningText || '',
        createdAt: nowIso,
        updatedAt: nowIso,
        updatedBy: session?.fullName || session?.username || 'Admin Kemenhaj',
      };
      slides.push(savedSlide);
    }

    await this.persistSlides(slides);
    return savedSlide;
  }

  /**
   * Menghapus slide berdasarkan ID
   */
  public static async deleteSlide(id: string): Promise<boolean> {
    const slides = await this.loadSlides();
    const filtered = slides.filter((s) => s.id !== id);

    if (filtered.length !== slides.length) {
      await this.persistSlides(filtered);
      return true;
    }
    return false;
  }

  /**
   * Toggle status aktif slide
   */
  public static async toggleActive(id: string): Promise<PromotionSlide | null> {
    const slides = await this.loadSlides();
    const slide = slides.find((s) => s.id === id);
    if (!slide) return null;

    slide.isActive = !slide.isActive;
    slide.updatedAt = new Date().toISOString();

    await this.persistSlides(slides);
    return slide;
  }

  // --- PRIVATE INTERNAL HELPERS (Safe Database + Memory Fallback) ---

  private static async loadSlides(): Promise<PromotionSlide[]> {
    const now = Date.now();
    if (memorySlidesCache && now - lastCacheFetchTime < CACHE_TTL_MS) {
      return [...memorySlidesCache];
    }

    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { settingKey: SETTING_KEY },
      });

      if (setting && setting.settingValue) {
        const parsed = JSON.parse(setting.settingValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memorySlidesCache = parsed;
          lastCacheFetchTime = now;
          return [...memorySlidesCache];
        }
      }
    } catch (err) {
      console.warn('[PromotionService] Database read failed or offline, using fallback cache:', err);
    }

    // Default / Seed Fallback
    if (!memorySlidesCache) {
      memorySlidesCache = [...SEED_SLIDES];
      lastCacheFetchTime = now;
    }

    return [...memorySlidesCache];
  }

  private static async persistSlides(slides: PromotionSlide[]): Promise<void> {
    memorySlidesCache = [...slides];
    lastCacheFetchTime = Date.now();

    try {
      await prisma.systemSetting.upsert({
        where: { settingKey: SETTING_KEY },
        update: {
          settingValue: JSON.stringify(slides),
          updatedAt: new Date(),
        },
        create: {
          settingKey: SETTING_KEY,
          settingValue: JSON.stringify(slides),
          settingGroup: 'BRANDING',
          description: 'Daftar slide media promosi & layanan publik (hajipapua.id & TV signage)',
          isPublic: true,
        },
      });
    } catch (err) {
      console.warn('[PromotionService] Failed to persist to PostgreSQL, kept in memory cache:', err);
    }
  }
}
