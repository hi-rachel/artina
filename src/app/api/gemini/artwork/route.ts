import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Artwork } from "@/types/met";
import {
  findAIGeneratedDescription,
  saveAIGeneratedDescription,
  AIGeneratedDescription,
} from "@/data/aiGeneratedDescriptions";

// 작품 데이터 검증 함수
function validateArtworkData(artwork: Artwork): {
  isValid: boolean;
  missingFields: string[];
  message: string;
} {
  const missingFields: string[] = [];

  if (!artwork.title || artwork.title.trim() === "") {
    missingFields.push("title");
  }
  if (!artwork.artist || artwork.artist.trim() === "") {
    missingFields.push("artist");
  }
  if (!artwork.year || artwork.year.trim() === "") {
    missingFields.push("year");
  }
  if (!artwork.medium || artwork.medium.trim() === "") {
    missingFields.push("medium");
  }
  if (!artwork.imageUrl || artwork.imageUrl.trim() === "") {
    missingFields.push("imageUrl");
  }

  const isValid = missingFields.length === 0;
  const message = isValid
    ? "All required artwork data is present"
    : `Missing required artwork data: ${missingFields.join(", ")}`;

  return { isValid, missingFields, message };
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Gemini Artwork API 호출 시작 ===");
    const {
      language = "en",
      ...artwork
    }: Artwork & { language?: "ko" | "en" } = await request.json();
    console.log("받은 작품 데이터:", JSON.stringify(artwork, null, 2));
    console.log("선택된 언어:", language);

    // 서버 사이드 검증
    const validation = validateArtworkData(artwork);
    console.log("서버 검증 결과:", validation);

    if (!validation.isValid) {
      console.log("검증 실패 - 누락된 필드:", validation.missingFields);
      return NextResponse.json(
        {
          error: "Invalid artwork data",
          missingFields: validation.missingFields,
        },
        { status: 400 }
      );
    }

    // 저장된 AI 생성 설명이 있는지 확인
    const existingDescription = findAIGeneratedDescription(
      artwork.title,
      artwork.artist
    );
    if (existingDescription && existingDescription.language === language) {
      console.log("저장된 AI 설명 발견:", existingDescription.title);
      return NextResponse.json(existingDescription);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    console.log("=== Gemini 1.5 Flash API 시작 ===");
    const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 이미지 URL에서 이미지 데이터 가져오기
    let imageData;
    try {
      const imageResponse = await fetch(artwork.imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`);
      }
      const imageBuffer = await imageResponse.arrayBuffer();
      imageData = {
        inlineData: {
          data: Buffer.from(imageBuffer).toString("base64"),
          mimeType: "image/jpeg",
        },
      };
      console.log("이미지 데이터 성공적으로 로드됨");
    } catch (imageError) {
      console.error("이미지 로드 실패:", imageError);
      return NextResponse.json(
        { error: "Failed to load artwork image" },
        { status: 500 }
      );
    }

    const prompt =
      language === "ko"
        ? `
당신은 메트로폴리탄 미술관의 전문 큐레이터입니다. 제공된 작품 이미지를 직접 보고 다음 정보를 바탕으로 박물관 방문객들에게 흥미롭고 교육적인 설명을 제공해주세요:

작품 제목: ${artwork.title}
작가: ${artwork.artist}
연도: ${artwork.year}
재료: ${artwork.medium}
크기: ${artwork.dimensions}

이미지를 직접 분석하여 다음 JSON 형식으로 응답해주세요:
{
  "title": "정확한 작품 제목",
  "artist": "작가 이름",
  "year": "제작 연도",
  "medium": "재료와 기법",
  "dimensions": "정확한 크기",
  "location": "현재 소장 위치",
  "description": "큐레이터 스타일의 흥미로운 설명 - 작품의 배경, 재미있는 사실, 역사적 맥락, 작가의 의도, 당시 사회적/문화적 상황 등을 포함하여 방문객들이 작품을 더 깊이 이해할 수 있도록 도와주는 설명 (5-6문장). 일반적인 문구 반복 금지, 이 작품만의 고유한 특징과 흥미로운 점에 집중",
  "significance": "예술사적 의의, 작가의 스타일 발전에서의 위치, 당시 사회적/문화적 맥락 (3-4문장)",
  "technique": "이미지에서 확인되는 기법, 브러시 스트로크, 색채 조화, 빛과 그림자 처리, 공간감 표현 등 (2-3문장)",
  "style": "예술적 스타일, 작가의 특징적인 요소, 시대적 특징 (1-2문장)"
}

중요한 참고사항:
1. 이미지에서 실제로 보이는 시각적 요소만을 기반으로 구체적으로 설명해주세요. 상상하거나 추측하지 마세요.
2. 작가의 특징적인 기법과 스타일을 반영해주세요.
3. 작품의 주제, 분위기, 감정적 효과를 포함해주세요.
4. 박물관 방문객들이 작품을 더 깊이 이해할 수 있도록 도와주세요.
5. "제목 없음"이나 "알 수 없는 작가"를 반환하지 말고 제공된 실제 데이터를 사용해주세요.
6. 이미지에서 보이는 구체적인 시각적 요소(인물, 배경, 색채, 빛, 분위기 등)를 자세히 분석해주세요.
7. 일반적인 문구나 템플릿을 반복하지 말고, 이 작품만의 고유한 특징에 집중해주세요.
8. 상상이나 추측이 아닌, 실제 이미지에서 관찰할 수 있는 사실만을 바탕으로 설명해주세요.
9. 큐레이터처럼 흥미로운 사실과 배경 정보를 포함하여 방문객들이 작품에 더 관심을 가질 수 있도록 해주세요.
10. 작품의 역사적 맥락과 작가의 의도를 설명해주세요.
`
        : `
You are a professional curator at The Metropolitan Museum of Art. Please analyze the provided artwork image directly and provide an interesting and educational explanation for museum visitors based on the following information:

Artwork Title: ${artwork.title}
Artist: ${artwork.artist}
Year: ${artwork.year}
Medium: ${artwork.medium}
Dimensions: ${artwork.dimensions}

Please analyze the image directly and provide your response in the following JSON format:
{
  "title": "Accurate artwork title",
  "artist": "Artist name",
  "year": "Creation year",
  "medium": "Materials and techniques",
  "dimensions": "Accurate dimensions",
  "location": "Current location",
  "description": "Curator-style interesting explanation - including the artwork's background, fascinating facts, historical context, artist's intention, and contemporary social/cultural situation to help visitors understand the work more deeply (5-6 sentences). Avoid generic phrases, focus on unique characteristics and interesting aspects of this specific artwork",
  "significance": "Art historical significance, position in the artist's stylistic development, social/cultural context of the period (3-4 sentences)",
  "technique": "Technical aspects visible in the image including brushwork, color harmony, light and shadow treatment, spatial depth, and distinctive artistic methods (2-3 sentences)",
  "style": "Artistic style, characteristic elements of the artist, period features (1-2 sentences)"
}

Important notes:
1. Base your analysis ONLY on what you actually see in the image - describe specific visual elements in detail. Do not imagine or speculate.
2. Reflect the artist's characteristic techniques and style visible in the artwork.
3. Include the artwork's subject matter, mood, and emotional impact as seen in the image.
4. Help museum visitors understand the artwork more deeply through visual analysis.
5. DO NOT return "Untitled" or "Unknown Artist" - use the actual data provided.
6. Analyze specific visual elements (figures, background, colors, lighting, atmosphere, etc.) that you can see in the image.
7. Avoid repeating generic phrases or templates - focus on unique characteristics of this specific artwork.
8. Provide only factual observations from the image, not imagination or speculation.
9. Include interesting facts and background information like a curator would, to help visitors become more interested in the artwork.
10. Explain the historical context and artist's intention.
`;

    console.log("=== Gemini 1.5 Flash API 호출 시작 ===");
    const result = await flashModel.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    console.log("=== Gemini 1.5 Flash 원본 응답 ===");
    console.log(text);

    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log("Flash API JSON 파싱 성공:", analysis);
      } else {
        throw new Error("JSON 블록을 찾을 수 없음");
      }
    } catch (parseError) {
      console.error("Flash API JSON 파싱 실패:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    console.log("=== Flash API 최종 분석 결과 ===");
    console.log(analysis);

    // AI 생성 설명을 저장
    const descriptionToSave: AIGeneratedDescription = {
      ...analysis,
      language: language,
    };

    saveAIGeneratedDescription(descriptionToSave);
    console.log("AI 생성 설명 저장됨:", artwork.title);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("=== Gemini API 오류 ===");
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate artwork analysis" },
      { status: 500 }
    );
  }
}
