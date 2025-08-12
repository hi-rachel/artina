import { NextRequest, NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";

// 환경변수에서 서비스 계정 정보 생성
const getServiceAccountCredentials = () => {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    return {
      type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE || "service_account",
      project_id: process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
      private_key_id: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
      auth_uri: process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI,
      token_uri: process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url:
        process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
      universe_domain: process.env.GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
    };
  }
  return undefined;
};

const client = new textToSpeech.TextToSpeechClient({
  credentials: getServiceAccountCredentials(),
});

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();

    if (!text || !language) {
      return NextResponse.json(
        { error: "Text and language are required" },
        { status: 400 }
      );
    }

    // 언어별 목소리 설정
    let voice;
    if (language === "ko") {
      voice = {
        languageCode: "ko-KR",
        name: "ko-KR-Wavenet-B", // 여성, 활기찬 느낌
        ssmlGender: "FEMALE" as const,
      };
    } else {
      voice = {
        languageCode: "en-US",
        name: "en-US-Wavenet-D", // 남성, 전문적이고 활기찬 느낌
        ssmlGender: "MALE" as const,
      };
    }

    const request = {
      input: { text },
      voice,
      audioConfig: {
        audioEncoding: "MP3" as const,
        speakingRate: 1.05, // 약간 활기차게
        pitch: 2.0, // 밝고 전문적인 느낌
        volumeGainDb: 2.0, // 약간 더 크게
      },
    };

    console.log("Google TTS 요청:", {
      text: text.substring(0, 50) + "...",
      language,
      voice: voice.name,
    });

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      console.error("TTS 응답에 오디오 콘텐츠가 없습니다");
      return NextResponse.json({ error: "No audio content" }, { status: 500 });
    }

    console.log("Google TTS 성공:", {
      textLength: text.length,
      audioSize: response.audioContent.length,
    });

    // 오디오를 바로 반환
    return new NextResponse(Buffer.from(response.audioContent as Uint8Array), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=tts-output.mp3",
        "Cache-Control": "public, max-age=3600", // 1시간 캐시
      },
    });
  } catch (error) {
    console.error("Google TTS API 오류:", error);
    return NextResponse.json(
      {
        error: "TTS 변환 실패",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
