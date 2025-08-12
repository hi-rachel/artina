import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Gemini Artist API 호출 시작 ===");
    const {
      artistName,
      language = "en",
    }: { artistName: string; language?: "ko" | "en" } = await request.json();

    console.log("받은 작가 이름:", artistName);
    console.log("선택된 언어:", language);

    if (!artistName || artistName.trim() === "") {
      return NextResponse.json(
        { error: "Artist name is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      language === "ko"
        ? `
당신은 전문 미술 큐레이터입니다. ${artistName}에 대한 정확하고 전문적인 소개를 작성해주세요.

다음 JSON 형식으로 응답해주세요:
{
  "introduction": "작가의 생애, 예술적 스타일, 대표작, 예술사적 의의, 특징적인 기법 등을 포함한 전문적이고 흥미로운 소개 (4-5문장)"
}

중요한 참고사항:
1. 작가의 생애와 예술적 배경을 간략히 설명해주세요.
2. 작가의 특징적인 예술적 스타일과 기법을 구체적으로 언급해주세요.
3. 대표작들과 예술사적 의의를 포함해주세요.
4. 박물관 방문객들이 작가를 더 깊이 이해할 수 있도록 도와주세요.
5. 한국어로 자연스럽게 작성해주세요.
6. 응답은 반드시 유효한 JSON 형식이어야 합니다.
7. 작가의 독특한 예술 세계와 기여를 강조해주세요.
8. 정확한 역사적 사실과 예술사적 맥락을 바탕으로 작성해주세요.
9. 일반적인 문구나 템플릿을 반복하지 말고, 이 작가만의 고유한 특징에 집중해주세요.
`
        : `
You are a professional art curator with deep knowledge of art history. Please provide a comprehensive and engaging introduction for ${artistName}.

Please provide your response in the following JSON format:
{
  "introduction": "Comprehensive introduction including the artist's life, artistic style, masterpieces, art historical significance, and distinctive techniques (4-5 sentences)"
}

Important notes:
1. Briefly describe the artist's life and artistic background.
2. Specifically mention the artist's characteristic artistic style and techniques.
3. Include masterpieces and art historical significance.
4. Help museum visitors understand the artist more deeply.
5. Write in natural English.
6. The response must be in valid JSON format.
7. Emphasize the artist's unique artistic world and contributions.
8. Base your introduction on accurate historical facts and art historical context.
9. Avoid repeating generic phrases or templates - focus on unique characteristics of this specific artist.
`;

    console.log("=== Gemini 1.5 Flash API 호출 시작 ===");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("=== Gemini Artist 원본 응답 ===");
    console.log(text);

    // JSON 파싱 시도
    let data;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
        console.log("Artist API JSON 파싱 성공:", data);
      } else {
        throw new Error("JSON 블록을 찾을 수 없음");
      }
    } catch (parseError) {
      console.error("Artist API JSON 파싱 실패:", parseError);
      console.log("파싱 실패한 텍스트:", text);

      // fallback: 기본 소개 생성
      data = {
        introduction:
          language === "ko"
            ? `${artistName}은(는) 예술사에서 중요한 위치를 차지하는 작가입니다. 이 작가의 작품들은 독특한 스타일과 기법으로 유명하며, 예술계에 큰 영향을 미쳤습니다. 오늘 이 전시회에서 ${artistName}의 대표작들을 통해 작가의 독특한 예술 세계를 경험하실 수 있습니다.`
            : `Welcome to ${artistName}'s exhibition. I am your curator. ${artistName} made significant contributions to art history. Today, you can experience ${artistName}'s unique artistic world through their representative works. Each piece has individual descriptions prepared, so click the sound icon on any artwork you're interested in to hear detailed explanations. Enjoy your visit.`,
      };
      console.log("Fallback 작가 소개 생성:", data);
    }

    console.log("=== Artist API 최종 결과 ===");
    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("=== Gemini Artist API 오류 ===");
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate artist introduction" },
      { status: 500 }
    );
  }
}
