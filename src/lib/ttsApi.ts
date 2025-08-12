type Language = "ko" | "en";

interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
}

export async function playTTS(
  text: string,
  language: Language
): Promise<TTSResponse> {
  try {
    console.log("TTS 요청 시작:", {
      text: text.substring(0, 50) + "...",
      language,
    });

    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("TTS API 오류:", errorData);
      return {
        success: false,
        error: errorData.error || "TTS 변환 실패",
      };
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    console.log("TTS 성공:", { textLength: text.length, audioUrl });

    return {
      success: true,
      audioUrl,
    };
  } catch (error) {
    console.error("TTS 요청 오류:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    };
  }
}

export async function playTTSAudio(
  text: string,
  language: Language
): Promise<HTMLAudioElement | null> {
  try {
    const result = await playTTS(text, language);

    if (!result.success || !result.audioUrl) {
      console.error("TTS 재생 실패:", result.error);
      return null;
    }

    const audio = new Audio(result.audioUrl);

    // 오디오 재생 완료 후 URL 해제
    audio.onended = () => {
      URL.revokeObjectURL(result.audioUrl!);
    };

    audio.onerror = () => {
      console.error("오디오 재생 오류");
      URL.revokeObjectURL(result.audioUrl!);
    };

    await audio.play();
    return audio;
  } catch (error) {
    console.error("TTS 오디오 재생 오류:", error);
    return null;
  }
}
