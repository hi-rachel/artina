import { Artwork } from "@/types/met";
import { artistDescriptions } from "@/data/artistDescriptions";
import {
  getArtworkDescription as getArtworkDescriptionFromGenerator,
  getArtworkDescriptionsBatch as getArtworkDescriptionsBatchFromGenerator,
} from "@/lib/artworkDescriptionGenerator";

export interface ArtworkAnalysis {
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
  significance: string;
  technique: string;
  style: string;
}

type Language = "ko" | "en";

// 작품 데이터 검증 함수
export function validateArtworkData(artwork: Artwork): {
  isValid: boolean;
  missingFields: string[];
} {
  const requiredFields = [
    "title",
    "artist",
    "year",
    "medium",
    "imageUrl",
  ] as const;

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!artwork[field] || artwork[field]?.toString().trim() === "") {
      missingFields.push(field);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// 정적 작가 소개 데이터 사용
export async function getArtistIntroduction(
  artistName: string,
  language: Language = "ko"
): Promise<string> {
  console.log("=== 정적 작가 소개 데이터 사용 ===");
  console.log("작가 이름:", artistName);
  console.log("선택된 언어:", language);

  const description = artistDescriptions[artistName];

  if (!description) {
    console.warn(`작가 "${artistName}"에 대한 정적 데이터가 없습니다.`);
    return language === "ko"
      ? `${artistName}은(는) 예술사에서 중요한 위치를 차지하는 작가입니다. 이 작가의 작품들은 독특한 스타일과 기법으로 유명하며, 예술계에 큰 영향을 미쳤습니다.`
      : `${artistName} is an artist who holds an important position in art history. This artist's works are famous for their unique style and technique, and have had a great influence on the art world.`;
  }

  const result = description[language];
  console.log("정적 작가 소개 결과:", result);

  return result;
}

// 새로운 하이브리드 시스템을 사용한 작품 설명 조회
export async function getArtworkDescription(
  artwork: Artwork,
  language: Language = "ko"
): Promise<string> {
  console.log("=== 새로운 하이브리드 시스템 사용 ===");
  console.log("작품 제목:", artwork.title);
  console.log("작가:", artwork.artist);
  console.log("선택된 언어:", language);

  try {
    const description = await getArtworkDescriptionFromGenerator(
      artwork,
      language
    );
    console.log("작품 설명 조회 성공");
    return description;
  } catch (error) {
    console.error("작품 설명 조회 실패:", error);

    // 기본 템플릿 사용
    return language === "ko"
      ? `이 작품은 ${artwork.artist}의 ${artwork.title}입니다. ${artwork.year}에 제작된 ${artwork.medium} 작품으로, 작가의 독특한 스타일과 기법을 보여줍니다.`
      : `This work is ${artwork.title} by ${artwork.artist}. Created in ${artwork.year} using ${artwork.medium}, it demonstrates the artist's unique style and technique.`;
  }
}

// 배치 처리를 위한 작품 설명 조회
export async function getArtworkDescriptionsBatch(
  artworks: Artwork[],
  language: Language = "ko"
): Promise<Map<string, string>> {
  console.log("=== 배치 작품 설명 조회 시작 ===");
  console.log("작품 수:", artworks.length);
  console.log("선택된 언어:", language);

  try {
    const descriptions = await getArtworkDescriptionsBatchFromGenerator(
      artworks,
      language
    );
    console.log("배치 작품 설명 조회 성공");
    return descriptions;
  } catch (error) {
    console.error("배치 작품 설명 조회 실패:", error);

    // 기본 템플릿으로 대체
    const fallbackDescriptions = new Map<string, string>();
    artworks.forEach((artwork) => {
      const fallbackDescription =
        language === "ko"
          ? `이 작품은 ${artwork.artist}의 ${artwork.title}입니다. ${artwork.year}에 제작된 ${artwork.medium} 작품으로, 작가의 독특한 스타일과 기법을 보여줍니다.`
          : `This work is ${artwork.title} by ${artwork.artist}. Created in ${artwork.year} using ${artwork.medium}, it demonstrates the artist's unique style and technique.`;

      fallbackDescriptions.set(artwork.title, fallbackDescription);
    });

    return fallbackDescriptions;
  }
}

// 작품 분석 (정적 데이터 기반으로 간단한 분석 제공)
export async function getArtworkAnalysis(
  artwork: Artwork,
  language: Language = "ko"
): Promise<ArtworkAnalysis> {
  console.log("=== 작품 분석 시작 ===");

  const description = await getArtworkDescription(artwork, language);

  return {
    title: artwork.title,
    artist: artwork.artist,
    year: artwork.year,
    medium: artwork.medium,
    dimensions: artwork.dimensions || "",
    description: description,
    significance:
      language === "ko"
        ? "이 작품은 예술사에서 중요한 의미를 지니며, 작가의 독특한 예술 세계를 보여줍니다."
        : "This work holds significant meaning in art history and demonstrates the artist's unique artistic world.",
    technique:
      language === "ko"
        ? "작가는 독특한 기법과 스타일을 사용하여 이 작품을 완성했습니다."
        : "The artist used unique techniques and style to complete this work.",
    style:
      language === "ko"
        ? "이 작품은 작가의 특징적인 예술적 스타일을 잘 보여줍니다."
        : "This work well demonstrates the artist's characteristic artistic style.",
  };
}
