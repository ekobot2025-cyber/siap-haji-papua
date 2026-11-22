import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/infrastructure/services/instagram.service';
import { PromotionService } from '@/application/services/promotion.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const curated = InstagramService.getCuratedJayapuraPosts();
    return NextResponse.json({
      success: true,
      account: 'kemenhajkotajayapura',
      profileUrl: 'https://www.instagram.com/kemenhajkotajayapura/',
      posts: curated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal mengambil postingan Instagram',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, shortcode, targetChannel = 'ALL', customTitle } = body;

    const targetUrl = url || shortcode;
    if (!targetUrl) {
      return NextResponse.json(
        { success: false, error: 'URL postingan atau shortcode Instagram diperlukan' },
        { status: 400 }
      );
    }

    // Fetch details
    const postData = await InstagramService.fetchPostDetails(targetUrl);

    // Build title and summary from caption
    const cleanCaption = postData.caption || 'Dokumentasi kegiatan resmi Kemenhaj Kota Jayapura';
    const firstSentence = cleanCaption.split(/[.\n]/)[0].trim();
    const judul = customTitle || (firstSentence.length > 80 ? firstSentence.slice(0, 77) + '...' : firstSentence) || 'Kegiatan Kemenhaj Kota Jayapura';

    const slideId = `ig-${postData.shortcode}`;

    const newSlide = await PromotionService.saveSlide({
      id: slideId,
      judul,
      kategori: 'Instagram @kemenhajkotajayapura',
      ringkas: cleanCaption,
      sumber: 'Instagram @kemenhajkotajayapura',
      url: postData.url,
      gambar: postData.imageUrl || '',
      targetChannel: targetChannel,
      isActive: true,
      priority: 3,
      runningText: `Update Instagram @kemenhajkotajayapura: ${judul}`,
    });

    return NextResponse.json({
      success: true,
      message: `Postingan Instagram (${postData.shortcode}) berhasil diadopsi dan ditayangkan ke Layar TV & Web!`,
      data: newSlide,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal mengadopsi postingan Instagram',
      },
      { status: 500 }
    );
  }
}
