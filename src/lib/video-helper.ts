export interface VideoInfo {
  type: 'youtube' | 'direct' | 'unsupported';
  embedUrl?: string;
  directUrl?: string;
}

/**
 * Mem-parse tautan video (YouTube, shorts, atau MP4) menjadi URL siap putar
 */
export function parseVideoUrl(url?: string): VideoInfo {
  if (!url || typeof url !== 'string') {
    return { type: 'unsupported' };
  }

  const trimmed = url.trim();

  // 1. YouTube Matchers (regular, share link, shorts, embed)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&playsinline=1`,
    };
  }

  // 2. Jika ada query parameter ?v=
  try {
    const u = new URL(trimmed);
    const v = u.searchParams.get('v');
    if (v && v.length === 11) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube-nocookie.com/embed/${v}?autoplay=1&mute=1&loop=1&playlist=${v}&controls=1&rel=0&playsinline=1`,
      };
    }
  } catch {
    // bukan valid absolute URL
  }

  // 3. File Video Langsung (MP4, WebM, OGG)
  if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
    return {
      type: 'direct',
      directUrl: trimmed,
    };
  }

  // 4. URL http/https lainnya diasumsikan direct stream jika dipilih mode VIDEO
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      type: 'direct',
      directUrl: trimmed,
    };
  }

  return { type: 'unsupported' };
}
