import { Artwork } from "@/types/met";

// 캐시를 위한 Map
const cache = new Map<string, CacheEntry>();

interface CacheEntry {
  data: Artwork[];
  timestamp: number;
}

export const fetchArtworksByArtist = async (
  artistName: string,
  max: number = 50
): Promise<Artwork[]> => {
  const cacheKey = `${artistName}-${max}`;

  // 캐시 비활성화 - 항상 새로운 데이터 가져오기

  try {
    // 서버 컴포넌트에서는 절대 URL 사용
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://artina-gallery.vercel.app"
        : "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/met?artist=${encodeURIComponent(artistName)}&max=${max}`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();

    // 결과를 캐시에 저장 (캐시 비활성화로 인해 항상 새로 저장)
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    } as CacheEntry);

    return result;
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
};
