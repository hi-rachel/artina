export interface AIGeneratedDescription {
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  location: string;
  description: string;
  significance: string;
  technique: string;
  style: string;
  language: "ko" | "en";
  timestamp: number;
}

// 메모리 기반 저장소 (실제 프로덕션에서는 데이터베이스 사용 권장)
const aiGeneratedDescriptions: AIGeneratedDescription[] = [];

// AI 생성 설명 저장
export function saveAIGeneratedDescription(
  description: AIGeneratedDescription
): void {
  // 중복 제거: 같은 작품과 언어의 기존 설명이 있으면 제거
  const existingIndex = aiGeneratedDescriptions.findIndex(
    (desc) =>
      desc.title === description.title &&
      desc.artist === description.artist &&
      desc.language === description.language
  );

  if (existingIndex !== -1) {
    aiGeneratedDescriptions.splice(existingIndex, 1);
  }

  // 새 설명 추가
  aiGeneratedDescriptions.push({
    ...description,
    timestamp: Date.now(),
  });

  console.log(
    `AI 생성 설명 저장됨: ${description.title} (${description.language})`
  );
}

// AI 생성 설명 찾기
export function findAIGeneratedDescription(
  title: string,
  artist: string,
  language?: "ko" | "en"
): AIGeneratedDescription | null {
  const description = aiGeneratedDescriptions.find(
    (desc) =>
      desc.title === title &&
      desc.artist === artist &&
      (!language || desc.language === language)
  );

  return description || null;
}

// 모든 AI 생성 설명 가져오기
export function getAllAIGeneratedDescriptions(): AIGeneratedDescription[] {
  return [...aiGeneratedDescriptions];
}

// 특정 언어의 AI 생성 설명만 가져오기
export function getAIGeneratedDescriptionsByLanguage(
  language: "ko" | "en"
): AIGeneratedDescription[] {
  return aiGeneratedDescriptions.filter((desc) => desc.language === language);
}

// AI 생성 설명 개수 가져오기
export function getAIGeneratedDescriptionsCount(): number {
  return aiGeneratedDescriptions.length;
}

// AI 생성 설명 삭제
export function deleteAIGeneratedDescription(
  title: string,
  artist: string,
  language?: "ko" | "en"
): boolean {
  const index = aiGeneratedDescriptions.findIndex(
    (desc) =>
      desc.title === title &&
      desc.artist === artist &&
      (!language || desc.language === language)
  );

  if (index !== -1) {
    aiGeneratedDescriptions.splice(index, 1);
    console.log(
      `AI 생성 설명 삭제됨: ${title} (${language || "all languages"})`
    );
    return true;
  }

  return false;
}
