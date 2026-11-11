import { MusicTrack, MusicCategory, MUSIC_CATEGORIES } from '../data/musicTracks';

export interface ParsedMediaResult {
  platform: 'youtube' | 'spotify' | 'audio' | 'unknown';
  track: MusicTrack | null;
  error?: string;
}

/**
 * Extracts YouTube Video ID from various YouTube and YouTube Music URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Regex patterns for YouTube
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /music\.youtube\.com\/watch\?v=([^"&?\/\s]{11})/i,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If input is exactly an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Parses Spotify track, album, or playlist URL / URI
 */
export function parseSpotifyLink(url: string): { type: 'track' | 'album' | 'playlist'; id: string } | null {
  if (!url) return null;
  const trimmed = url.trim();

  // URI format: spotify:track:4cOdK2wGLETKBW3PvgPWqT
  const uriMatch = trimmed.match(/^spotify:(track|album|playlist):([a-zA-Z0-9]+)$/i);
  if (uriMatch) {
    return {
      type: uriMatch[1].toLowerCase() as 'track' | 'album' | 'playlist',
      id: uriMatch[2],
    };
  }

  // URL format: https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
  const urlMatch = trimmed.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/i);
  if (urlMatch) {
    return {
      type: urlMatch[1].toLowerCase() as 'track' | 'album' | 'playlist',
      id: urlMatch[2],
    };
  }

  return null;
}

/**
 * Parses any user-provided media link (YouTube, Spotify, Direct Audio MP3) and generates a MusicTrack object
 */
export function parseMediaLink(url: string, customTitle?: string, customArtist?: string, category: MusicCategory = 'tap-trung'): ParsedMediaResult {
  if (!url || !url.trim()) {
    return { platform: 'unknown', track: null, error: 'Đường dẫn không được để trống.' };
  }

  const trimmedUrl = url.trim();
  const categoryInfo = MUSIC_CATEGORIES.find((c) => c.id === category) || MUSIC_CATEGORIES[0];

  // 1. Check YouTube
  const ytVideoId = extractYouTubeVideoId(trimmedUrl);
  if (ytVideoId) {
    const title = customTitle?.trim() || `YouTube Video (${ytVideoId})`;
    const artist = customArtist?.trim() || 'YouTube Music / Video';
    const track: MusicTrack = {
      id: `youtube-${ytVideoId}-${Date.now()}`,
      title,
      artist,
      category,
      categoryLabel: categoryInfo.name,
      src: `https://www.youtube.com/embed/${ytVideoId}?enablejsapi=1&autoplay=1`,
      platform: 'youtube',
      youtubeVideoId: ytVideoId,
      coverUrl: `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`,
      description: 'Phát trực tiếp từ YouTube IFrame Player',
      license: 'YouTube Official Embed',
      audiodownload_allowed: false,
    };
    return { platform: 'youtube', track };
  }

  // 2. Check Spotify
  const spotifyInfo = parseSpotifyLink(trimmedUrl);
  if (spotifyInfo) {
    const title = customTitle?.trim() || `Spotify ${spotifyInfo.type === 'track' ? 'Bài hát' : spotifyInfo.type === 'album' ? 'Album' : 'Danh sách phát'}`;
    const artist = customArtist?.trim() || 'Spotify Embed';
    const embedUrl = `https://open.spotify.com/embed/${spotifyInfo.type}/${spotifyInfo.id}?utm_source=generator&theme=0`;
    const track: MusicTrack = {
      id: `spotify-${spotifyInfo.type}-${spotifyInfo.id}-${Date.now()}`,
      title,
      artist,
      category,
      categoryLabel: categoryInfo.name,
      src: embedUrl,
      platform: 'spotify',
      spotifyUri: `spotify:${spotifyInfo.type}:${spotifyInfo.id}`,
      coverUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=300&auto=format&fit=crop&q=80',
      description: 'Phát trực tiếp qua Spotify Embed Widget',
      license: 'Spotify Official Embed',
      audiodownload_allowed: false,
    };
    return { platform: 'spotify', track };
  }

  // 3. Check Direct Audio URL (.mp3, .wav, blob, etc.)
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('blob:')) {
    const title = customTitle?.trim() || 'Giai điệu trực tuyến tùy chỉnh';
    const artist = customArtist?.trim() || 'Nguồn âm thanh ngoài';
    const track: MusicTrack = {
      id: `audio-${Date.now()}`,
      title,
      artist,
      category,
      categoryLabel: categoryInfo.name,
      src: trimmedUrl,
      platform: trimmedUrl.startsWith('blob:') ? 'local' : 'jamendo',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      description: 'Nguồn âm thanh phát trực tiếp qua trình duyệt',
      license: 'Tùy chọn cá nhân',
      audiodownload_allowed: false,
    };
    return { platform: 'audio', track };
  }

  return {
    platform: 'unknown',
    track: null,
    error: 'Đường dẫn không hợp lệ. Vui lòng nhập link YouTube, link Spotify hoặc link file âm thanh (MP3).',
  };
}
