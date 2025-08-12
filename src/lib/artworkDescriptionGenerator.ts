import { Artwork } from "@/types/met";
import { rubensArtworkDescriptions } from "@/data/rubensArtworkDescriptions";
import { artworkDescriptions } from "@/data/artworkDescriptions";

export interface ArtworkDescription {
  ko: string;
  en: string;
}

type Language = "ko" | "en";

// 로컬 스토리지 키
const CACHE_KEY = "artwork_descriptions_cache";
const CACHE_EXPIRY_KEY = "artwork_descriptions_cache_expiry";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7일

// 캐시 인터페이스
interface CachedDescription {
  title: string;
  artist: string;
  language: Language;
  description: string;
  timestamp: number;
}

// 캐시 관리 클래스
class ArtworkDescriptionCache {
  private static instance: ArtworkDescriptionCache;
  private cache: Map<string, CachedDescription> = new Map();
  private isInitialized = false;

  static getInstance(): ArtworkDescriptionCache {
    if (!ArtworkDescriptionCache.instance) {
      ArtworkDescriptionCache.instance = new ArtworkDescriptionCache();
    }
    return ArtworkDescriptionCache.instance;
  }

  private generateKey(
    title: string,
    artist: string,
    language: Language
  ): string {
    return `${title}-${artist}-${language}`;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(CACHE_KEY);
        const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

        if (cached && expiry) {
          const expiryTime = parseInt(expiry);
          if (Date.now() < expiryTime) {
            const parsedCache: CachedDescription[] = JSON.parse(cached);
            parsedCache.forEach((item) => {
              this.cache.set(
                this.generateKey(item.title, item.artist, item.language),
                item
              );
            });
            console.log(`캐시 로드됨: ${parsedCache.length}개 항목`);
          } else {
            console.log("캐시 만료됨, 초기화");
            this.clearCache();
          }
        }
      }
    } catch (error) {
      console.error("캐시 초기화 실패:", error);
    }

    this.isInitialized = true;
  }

  get(title: string, artist: string, language: Language): string | null {
    const key = this.generateKey(title, artist, language);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.description;
    }

    if (cached) {
      this.cache.delete(key);
    }

    return null;
  }

  set(
    title: string,
    artist: string,
    language: Language,
    description: string
  ): void {
    const key = this.generateKey(title, artist, language);
    const cachedItem: CachedDescription = {
      title,
      artist,
      language,
      description,
      timestamp: Date.now(),
    };

    this.cache.set(key, cachedItem);
    this.persistCache();
  }

  private persistCache(): void {
    if (typeof window !== "undefined") {
      try {
        const cacheArray = Array.from(this.cache.values());
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheArray));
        localStorage.setItem(
          CACHE_EXPIRY_KEY,
          (Date.now() + CACHE_DURATION).toString()
        );
      } catch (error) {
        console.error("캐시 저장 실패:", error);
      }
    }
  }

  clearCache(): void {
    this.cache.clear();
    if (typeof window !== "undefined") {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
    }
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// 작품 설명 생성기 클래스
export class ArtworkDescriptionGenerator {
  private static instance: ArtworkDescriptionGenerator;
  private cache: ArtworkDescriptionCache;

  private constructor() {
    this.cache = ArtworkDescriptionCache.getInstance();
  }

  static getInstance(): ArtworkDescriptionGenerator {
    if (!ArtworkDescriptionGenerator.instance) {
      ArtworkDescriptionGenerator.instance = new ArtworkDescriptionGenerator();
    }
    return ArtworkDescriptionGenerator.instance;
  }

  // 정적 데이터에서 설명 찾기
  private findStaticDescription(
    title: string,
    artist: string,
    language: Language
  ): string | null {
    // 1. 정확한 제목 매칭
    const description =
      artworkDescriptions[title] || rubensArtworkDescriptions[title];

    if (description) {
      return description[language];
    }

    // 2. 부분 매칭 (제목의 주요 키워드 기반)
    const normalizedTitle = this.normalizeTitle(title);
    const allDescriptions = {
      ...artworkDescriptions,
      ...rubensArtworkDescriptions,
    };

    for (const [key, desc] of Object.entries(allDescriptions)) {
      const normalizedKey = this.normalizeTitle(key);

      if (this.isPartialMatch(normalizedTitle, normalizedKey)) {
        return desc[language];
      }
    }

    return null;
  }

  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  private isPartialMatch(title: string, key: string): boolean {
    const titleWords = title.split(" ").filter((word) => word.length > 2);
    const keyWords = key.split(" ").filter((word) => word.length > 2);

    if (titleWords.length === 0 || keyWords.length === 0) return false;

    const commonWords = titleWords.filter((word) => keyWords.includes(word));
    const matchRatio =
      commonWords.length / Math.min(titleWords.length, keyWords.length);

    return matchRatio >= 0.6; // 60% 이상 일치
  }

  // 동적 설명 생성 (API 호출)
  private async generateDynamicDescription(
    artwork: Artwork,
    language: Language
  ): Promise<string> {
    try {
      const response = await fetch("/api/gemini/artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...artwork, language }),
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const result = await response.json();
      return result.description || "";
    } catch (error) {
      console.error("동적 설명 생성 실패:", error);
      throw error;
    }
  }

  // 메인 설명 생성 함수
  async generateDescription(
    artwork: Artwork,
    language: Language = "ko"
  ): Promise<string> {
    await this.cache.initialize();

    // 1. 캐시 확인
    const cachedDescription = this.cache.get(
      artwork.title,
      artwork.artist,
      language
    );
    if (cachedDescription) {
      console.log("캐시된 설명 사용:", artwork.title);
      return cachedDescription;
    }

    // 2. 정적 데이터 확인
    const staticDescription = this.findStaticDescription(
      artwork.title,
      artwork.artist,
      language
    );
    if (staticDescription) {
      console.log("정적 설명 사용:", artwork.title);
      // 정적 설명도 캐시에 저장
      this.cache.set(
        artwork.title,
        artwork.artist,
        language,
        staticDescription
      );
      return staticDescription;
    }

    // 3. 동적 생성 (API 호출)
    try {
      console.log("동적 설명 생성 시작:", artwork.title);
      const dynamicDescription = await this.generateDynamicDescription(
        artwork,
        language
      );

      // 동적 생성 결과 캐시에 저장
      this.cache.set(
        artwork.title,
        artwork.artist,
        language,
        dynamicDescription
      );

      return dynamicDescription;
    } catch (error) {
      console.error("동적 생성 실패, 기본 템플릿 사용:", error);

      // 4. 기본 템플릿 사용
      const fallbackDescription = this.generateFallbackDescription(
        artwork,
        language
      );
      this.cache.set(
        artwork.title,
        artwork.artist,
        language,
        fallbackDescription
      );

      return fallbackDescription;
    }
  }

  private generateFallbackDescription(
    artwork: Artwork,
    language: Language
  ): string {
    return language === "ko"
      ? `이 작품은 ${artwork.artist}의 ${artwork.title}입니다. ${artwork.year}에 제작된 ${artwork.medium} 작품으로, 작가의 독특한 스타일과 기법을 보여줍니다. 더 상세한 설명을 원하시면 잠시 후 다시 시도해주세요.`
      : `This work is ${artwork.title} by ${artwork.artist}. Created in ${artwork.year} using ${artwork.medium}, it demonstrates the artist's unique style and technique. Please try again later for a more detailed description.`;
  }

  // 배치 처리를 위한 함수
  async generateDescriptionsBatch(
    artworks: Artwork[],
    language: Language = "ko"
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    const pendingArtworks: Artwork[] = [];

    // 먼저 캐시와 정적 데이터 확인
    for (const artwork of artworks) {
      const cached = this.cache.get(artwork.title, artwork.artist, language);
      if (cached) {
        results.set(artwork.title, cached);
        continue;
      }

      const staticDesc = this.findStaticDescription(
        artwork.title,
        artwork.artist,
        language
      );
      if (staticDesc) {
        this.cache.set(artwork.title, artwork.artist, language, staticDesc);
        results.set(artwork.title, staticDesc);
        continue;
      }

      pendingArtworks.push(artwork);
    }

    // 동적 생성이 필요한 작품들만 API 호출
    if (pendingArtworks.length > 0) {
      console.log(`${pendingArtworks.length}개 작품에 대해 동적 생성 필요`);

      // 병렬 처리 (동시 요청 제한)
      const batchSize = 3; // 동시 요청 수 제한
      for (let i = 0; i < pendingArtworks.length; i += batchSize) {
        const batch = pendingArtworks.slice(i, i + batchSize);
        const batchPromises = batch.map(async (artwork) => {
          try {
            const description = await this.generateDynamicDescription(
              artwork,
              language
            );
            this.cache.set(
              artwork.title,
              artwork.artist,
              language,
              description
            );
            return { title: artwork.title, description };
          } catch (error) {
            console.error(`배치 처리 실패: ${artwork.title}`, error);
            const fallback = this.generateFallbackDescription(
              artwork,
              language
            );
            this.cache.set(artwork.title, artwork.artist, language, fallback);
            return { title: artwork.title, description: fallback };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(({ title, description }) => {
          results.set(title, description);
        });

        // 배치 간 지연 (API 제한 방지)
        if (i + batchSize < pendingArtworks.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    return results;
  }

  // 캐시 통계
  getCacheStats() {
    return this.cache.getCacheStats();
  }

  // 캐시 초기화
  clearCache() {
    this.cache.clearCache();
  }
}

// 편의 함수들
export const artworkDescriptionGenerator =
  ArtworkDescriptionGenerator.getInstance();

export async function getArtworkDescription(
  artwork: Artwork,
  language: Language = "ko"
): Promise<string> {
  return artworkDescriptionGenerator.generateDescription(artwork, language);
}

export async function getArtworkDescriptionsBatch(
  artworks: Artwork[],
  language: Language = "ko"
): Promise<Map<string, string>> {
  return artworkDescriptionGenerator.generateDescriptionsBatch(
    artworks,
    language
  );
}
