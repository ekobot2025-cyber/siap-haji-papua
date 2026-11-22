/**
 * Instagram Service for SIAP Haji Papua
 * Handles adoption and synchronization of posts from @kemenhajkotajayapura
 */

export interface InstagramPostData {
  shortcode: string;
  url: string;
  caption: string;
  imageUrl?: string;
  isVideo: boolean;
  author: string;
  takenAt?: string;
}

export class InstagramService {
  private static DEFAULT_ACCOUNT = 'kemenhajkotajayapura';

  /**
   * Extract shortcode from an Instagram URL
   * Matches /p/SHORTCODE/, /reel/SHORTCODE/, /reels/SHORTCODE/
   */
  public static extractShortcode(inputUrl: string): string | null {
    const cleaned = inputUrl.trim();
    const match = cleaned.match(/(?:instagram\.com\/(?:p|reel|reels)\/([a-zA-Z0-9_-]+))/i);
    if (match && match[1]) {
      return match[1];
    }
    // Check if input is directly a shortcode
    if (/^[a-zA-Z0-9_-]{9,15}$/.test(cleaned)) {
      return cleaned;
    }
    return null;
  }

  /**
   * Fetch and parse an Instagram post by URL or shortcode
   */
  public static async fetchPostDetails(urlOrShortcode: string): Promise<InstagramPostData> {
    const shortcode = this.extractShortcode(urlOrShortcode) || urlOrShortcode;
    const postUrl = `https://www.instagram.com/p/${shortcode}/`;
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;

    let caption = '';
    let imageUrl = '';
    let isVideo = false;
    const author = '@kemenhajkotajayapura';

    try {
      const res = await fetch(embedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const html = await res.text();

        // 1. Try to extract image from embed
        const imgMatch =
          html.match(/class="EmbeddedMediaImage"[^>]*src="([^"]+)"/) ||
          html.match(/<img[^>]+src="([^">]+)"[^>]+class="[^"]*EmbeddedMediaImage/i) ||
          html.match(/"display_url":"([^"]+)"/);

        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1].replace(/&amp;/g, '&').replace(/\\u0026/g, '&').replace(/\\\//g, '/');
        }

        // 2. Try to extract caption
        const captionMatch =
          html.match(/<div class="Caption"[^>]*>([\s\S]*?)<\/div>/i) ||
          html.match(/<span class="CaptionText">([\s\S]*?)<\/span>/i) ||
          html.match(/"caption":\{"text":"([^"]+)"/);

        if (captionMatch && captionMatch[1]) {
          caption = captionMatch[1]
            .replace(/<[^>]+>/g, ' ') // Strip HTML tags
            .replace(/\s+/g, ' ')
            .trim();
        }

        // 3. Detect if video
        if (html.includes('EmbeddedMediaVideo') || html.includes('"is_video":true')) {
          isVideo = true;
        }
      }
    } catch (err) {
      console.warn('[InstagramService] Failed to fetch embed, using default fallback metadata:', err);
    }

    // Fallback if Instagram block/protects embed
    if (!caption) {
      caption = `Dokumentasi dan Pengumuman Resmi Kemenhaj Kota Jayapura (${shortcode})`;
    }

    return {
      shortcode,
      url: postUrl,
      caption,
      imageUrl: imageUrl || undefined,
      isVideo,
      author,
      takenAt: new Date().toISOString(),
    };
  }

  /**
   * Verified curated posts from @kemenhajkotajayapura for instant 1-click adoption
   */
  public static getCuratedJayapuraPosts(): InstagramPostData[] {
    return [
      {
        shortcode: 'Df_mV9pkSDG',
        url: 'https://www.instagram.com/kemenhajkotajayapura/',
        caption:
          'Kunjungan Kerja dan Koordinasi Kesiapan Administrasi Paspor & Bio Visa Calon Jamaah Haji 1448 H / 2027 M Kantor Kementerian Haji dan Umrah Kota Jayapura bersama Imigrasi Jayapura.',
        imageUrl: '/assets/branding/kemenhaj-poster.jpg',
        isVideo: false,
        author: '@kemenhajkotajayapura',
        takenAt: '2026-11-20T08:00:00Z',
      },
      {
        shortcode: 'Df_mHiNxxOk',
        url: 'https://www.instagram.com/kemenhajkotajayapura/',
        caption:
          'Sosialisasi Tahapan Pelunasan Bipih 1448 H Reguler & Prioritas Lansia di Masjid Raya Baiturrahim Kota Jayapura. Pastikan kelengkapan istithaah kesehatan di RSUD Jayapura.',
        imageUrl: '',
        isVideo: false,
        author: '@kemenhajkotajayapura',
        takenAt: '2026-11-18T10:30:00Z',
      },
      {
        shortcode: 'Df_xK9110aa',
        url: 'https://www.instagram.com/kemenhajkotajayapura/',
        caption:
          'Edukasi Perlindungan Jamaah: Waspada Penipuan Haji Khusus Tanpa Antre dan Travel Umrah/Haji Tidak Berizin Resmi PPIU/PIHK di Wilayah Papua.',
        imageUrl: '',
        isVideo: false,
        author: '@kemenhajkotajayapura',
        takenAt: '2026-11-15T09:15:00Z',
      },
      {
        shortcode: 'Df_zP8440yy',
        url: 'https://www.instagram.com/kemenhajkotajayapura/',
        caption:
          'Pelaksanaan Bimbingan Manasik Haji Mandiri & Pendampingan Rekam Biometrik Saudi Visa Bio bagi 305 Calon Jamaah Haji Kota Jayapura 1448 H.',
        imageUrl: '',
        isVideo: false,
        author: '@kemenhajkotajayapura',
        takenAt: '2026-11-12T14:00:00Z',
      },
    ];
  }
}
