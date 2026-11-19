import { NextResponse } from 'next/server';

// Cache 30 menit di server; hanya membaca RSS publik resmi Kemenag.
export const revalidate = 1800;

const FEED_URL = 'https://kemenag.go.id/rss';
const HAJI_KEYWORDS = /haji|umrah|jamaah|jemaah|embarkasi|kloter|bpih|jemaah|manasik|porsi/i;

interface BeritaItem {
  id: string;
  judul: string;
  ringkas: string;
  url: string;
  tanggal: string;
  haji: boolean;
}

function clean(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? clean(m[1]) : '';
}

export async function GET() {
  try {
    const res = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'SiapHajiPapua/1.0 (+informasi publik)' },
      next: { revalidate: 1800 },
    });
    if (!res.ok) throw new Error(`Feed ${res.status}`);
    const xml = await res.text();

    const items: BeritaItem[] = (xml.match(/<item>[\s\S]*?<\/item>/g) || []).map((block) => {
      const judul = pick(block, 'title');
      const ringkas = pick(block, 'description');
      const url = pick(block, 'link');
      return {
        id: url,
        judul,
        ringkas: ringkas.length > 240 ? `${ringkas.slice(0, 237)}...` : ringkas,
        url,
        tanggal: pick(block, 'pubDate'),
        haji: HAJI_KEYWORDS.test(`${judul} ${ringkas}`),
      };
    });

    const haji = items.filter((i) => i.haji);
    const lain = items.filter((i) => !i.haji);
    const hasil = [...haji, ...lain].slice(0, Math.max(6, Math.min(haji.length, 8)));

    // Ambil gambar publik (og:image) tiap artikel; gagal = tanpa gambar.
    const dgGambar = await Promise.all(
      hasil.map(async (it) => {
        try {
          const ctl = new AbortController();
          const t = setTimeout(() => ctl.abort(), 6000);
          const page = await fetch(it.url, {
            headers: { 'User-Agent': 'SiapHajiPapua/1.0 (+informasi publik)' },
            signal: ctl.signal,
            next: { revalidate: 1800 },
          });
          clearTimeout(t);
          const html = await page.text();
          const m =
            html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
          const img = m?.[1] ?? '';
          return { ...it, gambar: img.startsWith('https://') ? img : '' };
        } catch {
          return { ...it, gambar: '' };
        }
      })
    );

    return NextResponse.json({ success: true, sumber: 'kemenag.go.id/rss', items: dgGambar });
  } catch {
    return NextResponse.json({ success: false, items: [] });
  }
}
