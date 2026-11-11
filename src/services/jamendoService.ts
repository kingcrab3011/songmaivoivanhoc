import { MusicCategory, MusicTrack, MUSIC_CATEGORIES } from '../data/musicTracks';

export interface JamendoTrackItem {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  album_id: string;
  album_name: string;
  album_image: string;
  image: string;
  audio: string;
  audiodownload: string;
  audiodownload_allowed: boolean;
  license_ccurl: string;
  releasedate?: string;
  shorturl?: string;
}

export interface JamendoApiResponse {
  headers: {
    status: 'success' | 'failed';
    code: number;
    error_message?: string;
    warnings?: string;
    results_count: number;
  };
  results: JamendoTrackItem[];
}

const STORAGE_KEY_JAMENDO_CLIENT_ID = 'van_nghi_luan_jamendo_client_id_v1';
const CACHE_PREFIX = 'jamendo_cache_cat_';

export class JamendoService {
  /**
   * Retrieves user-configured Jamendo Client ID from localStorage or environment
   */
  static getClientId(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_JAMENDO_CLIENT_ID);
      if (stored && stored.trim()) return stored.trim();
    } catch {}

    // Check Vite environment variable if injected
    const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_JAMENDO_CLIENT_ID;
    if (envKey && envKey.trim()) return envKey.trim();

    return '';
  }

  /**
   * Saves user's personal Jamendo Client ID securely to localStorage
   */
  static setClientId(clientId: string): void {
    try {
      if (clientId && clientId.trim()) {
        localStorage.setItem(STORAGE_KEY_JAMENDO_CLIENT_ID, clientId.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_JAMENDO_CLIENT_ID);
      }
      this.clearCache();
    } catch {}
  }

  /**
   * Removes saved Jamendo Client ID
   */
  static removeClientId(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_JAMENDO_CLIENT_ID);
      this.clearCache();
    } catch {}
  }

  /**
   * Tests whether a Client ID is valid by making a lightweight probe request
   */
  static async testConnection(clientId: string): Promise<{ success: boolean; message: string; count?: number }> {
    const key = clientId.trim();
    if (!key) {
      return { success: false, message: 'Vui lòng nhập Client ID' };
    }

    try {
      const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${encodeURIComponent(key)}&format=jsonpretty&limit=1&audioformat=mp32`;
      const res = await fetch(url);
      const data: JamendoApiResponse = await res.json();

      if (data.headers && data.headers.status === 'success') {
        return {
          success: true,
          message: 'Kết nối thành công! Client ID hợp lệ và sẵn sàng phát nhạc trực tuyến.',
          count: data.headers.results_count,
        };
      } else {
        return {
          success: false,
          message: data.headers?.error_message || 'Client ID không hợp lệ hoặc ứng dụng đã bị tạm khóa trên Jamendo.',
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối mạng';
      return { success: false, message: `Không thể kết nối đến Jamendo API: ${msg}` };
    }
  }

  /**
   * Maps application music categories to Jamendo API search parameters and tags
   */
  private static getCategoryQueryParams(category: MusicCategory): { tags: string; fuzzytags?: string } {
    switch (category) {
      case 'tap-trung':
        return { tags: 'ambient,chillout,lofi', fuzzytags: 'study,meditation,zen' };
      case 'khong-loi':
        return { tags: 'instrumental,piano,acoustic', fuzzytags: 'classical,soundtrack' };
      case 'tre':
        return { tags: 'pop,indie,ballad', fuzzytags: 'acousticpop,melodic' };
      case 'house':
        return { tags: 'house,deephouse,tropicalhouse', fuzzytags: 'chillhouse,lounge' };
      case 'remix':
        return { tags: 'remix,electronic,dance', fuzzytags: 'synthwave,futurebass' };
      default:
        return { tags: 'ambient,piano' };
    }
  }

  /**
   * Clears in-memory and session caches
   */
  static clearCache(): void {
    try {
      const keys = Object.keys(sessionStorage);
      for (const k of keys) {
        if (k.startsWith(CACHE_PREFIX)) {
          sessionStorage.removeItem(k);
        }
      }
    } catch {}
  }

  /**
   * Fetches real streamable tracks from Jamendo Music API for a specific category
   */
  static async fetchTracksByCategory(
    category: MusicCategory,
    customClientId?: string
  ): Promise<MusicTrack[] | null> {
    const clientId = customClientId || this.getClientId();
    if (!clientId) {
      return null; // Signals caller to use fallback tracks
    }

    // Check session cache first
    try {
      const cached = sessionStorage.getItem(`${CACHE_PREFIX}${category}`);
      if (cached) {
        const parsed = JSON.parse(cached) as MusicTrack[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}

    const catInfo = MUSIC_CATEGORIES.find((c) => c.id === category) || MUSIC_CATEGORIES[0];
    const { tags, fuzzytags } = this.getCategoryQueryParams(category);

    try {
      const params = new URLSearchParams({
        client_id: clientId,
        format: 'jsonpretty',
        limit: '10',
        include: 'musicinfo+licenses',
        audioformat: 'mp32',
        order: 'popularity_total',
        tags: tags,
      });

      if (fuzzytags) {
        params.append('fuzzytags', fuzzytags);
      }

      const url = `https://api.jamendo.com/v3.0/tracks/?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const data: JamendoApiResponse = await response.json();

      if (data.headers && data.headers.status === 'success' && Array.isArray(data.results) && data.results.length > 0) {
        const tracks: MusicTrack[] = data.results.map((item, idx) => ({
          id: `jamendo-${item.id}`,
          title: item.name,
          artist: item.artist_name || 'Nghệ sĩ Jamendo',
          category: category,
          categoryLabel: catInfo.name,
          // CRITICAL: Jamendo API direct streaming audio URL
          src: item.audio || `https://mp3d.jamendo.com/download/track/${item.id}/mp32/`,
          duration: item.duration || 180,
          coverUrl: item.album_image || item.image || undefined,
          description: item.album_name ? `Album: ${item.album_name}` : `Bản nhạc được cấp phép Creative Commons từ Jamendo Music (#${idx + 1})`,
          license: item.license_ccurl || 'Creative Commons CC-BY-NC 4.0',
          audiodownload_allowed: Boolean(item.audiodownload_allowed),
        }));

        // Cache for current session
        try {
          sessionStorage.setItem(`${CACHE_PREFIX}${category}`, JSON.stringify(tracks));
        } catch {}

        return tracks;
      }

      return null;
    } catch {
      return null;
    }
  }
}
