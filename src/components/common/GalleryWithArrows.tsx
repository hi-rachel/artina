"use client";

import { useRef, useState, useEffect } from "react";
import ArtworkCard from "@/components/common/ArtworkCard";
import HorizontalScrollContainer from "@/components/common/HorizontalScrollContainer";
import WaveLoader from "@/components/common/WaveLoader";
import Tooltip from "@/components/common/Tooltip";
import { Artwork } from "@/types/met";
import {
  getArtworkDescription,
  getArtistIntroduction,
  validateArtworkData,
} from "@/lib/geminiApi";
import { playTTSAudio } from "@/lib/ttsApi";

type Language = "ko" | "en";

export default function GalleryWithArrows({
  artworks,
  artistName,
}: {
  artworks: Artwork[];
  artistName: string;
}) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isCurrentlySpeaking, setIsCurrentlySpeaking] = useState(false);
  const [speakingType, setSpeakingType] = useState<"artist" | "artwork" | null>(
    null
  );
  const [speakingArtworkIndex, setSpeakingArtworkIndex] = useState<
    number | null
  >(null);
  const [isLoadingArtist, setIsLoadingArtist] = useState(false);
  const [isLoadingArtwork, setIsLoadingArtwork] = useState<number | null>(null);
  const [dataValidationMessage, setDataValidationMessage] = useState<
    string | null
  >(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("ko");
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTime, setPauseTime] = useState(0);

  useEffect(() => {
    // 컴포넌트 언마운트 시 오디오 정리
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        URL.revokeObjectURL(currentAudio.src);
      }
    };
  }, [currentAudio]);

  const stopCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      // 오디오 URL 해제
      URL.revokeObjectURL(currentAudio.src);
    }
    setIsCurrentlySpeaking(false);
    setSpeakingType(null);
    setSpeakingArtworkIndex(null);
    setIsPaused(false);
    setPauseTime(0);
    setCurrentAudio(null);
  };

  const pauseCurrentAudio = () => {
    if (currentAudio && isCurrentlySpeaking) {
      currentAudio.pause();
      setPauseTime(currentAudio.currentTime);
      setIsPaused(true);
    }
  };

  const resumeCurrentAudio = () => {
    if (currentAudio && isPaused) {
      currentAudio.currentTime = pauseTime;
      currentAudio.play();
      setIsPaused(false);
    }
  };

  // 작가 소개 음성 재생
  const speakArtistIntroduction = async () => {
    try {
      console.log("=== 작가 소개 시작 ===");
      console.log("작가 이름:", artistName);
      console.log("선택된 언어:", selectedLanguage);

      // 기존 오디오 중지
      stopCurrentAudio();
      setIsLoadingArtist(true);
      setSpeakingType("artist");

      console.log("작가 소개 API 호출 시작");
      const artistIntro = await getArtistIntroduction(
        artistName,
        selectedLanguage
      );
      console.log("작가 소개 API 응답:", artistIntro);

      if (!artistIntro || artistIntro.trim() === "") {
        console.error("작가 소개가 비어있음");
        setIsLoadingArtist(false);
        setSpeakingType(null);
        return;
      }

      console.log("작가 소개 TTS 시작");
      // Google TTS 사용
      const audio = await playTTSAudio(artistIntro, selectedLanguage);

      if (!audio) {
        console.error("작가 소개 TTS 실패");
        setIsLoadingArtist(false);
        setSpeakingType(null);
        return;
      }

      console.log("작가 소개 TTS 성공, 오디오 재생 시작");
      setCurrentAudio(audio);
      setIsCurrentlySpeaking(true);
      setIsLoadingArtist(false);

      audio.onended = () => {
        console.log("작가 소개 종료");
        URL.revokeObjectURL(audio.src);
        setIsCurrentlySpeaking(false);
        setSpeakingType(null);
        setSpeakingArtworkIndex(null);
        setIsLoadingArtist(false);
        setIsPaused(false);
        setPauseTime(0);
        setCurrentAudio(null);
      };
      audio.onerror = (event) => {
        console.error("작가 소개 오류:", event);
        URL.revokeObjectURL(audio.src);
        setIsCurrentlySpeaking(false);
        setSpeakingType(null);
        setSpeakingArtworkIndex(null);
        setIsLoadingArtist(false);
        setIsPaused(false);
        setPauseTime(0);
        setCurrentAudio(null);
      };
    } catch (error) {
      console.error("작가 소개 중 오류:", error);
      setIsCurrentlySpeaking(false);
      setSpeakingType(null);
      setSpeakingArtworkIndex(null);
      setIsLoadingArtist(false);
      setIsPaused(false);
      setPauseTime(0);
      setCurrentAudio(null);
    }
  };

  // 개별 작품 설명 음성 재생
  const speakArtworkDescription = async (artwork: Artwork, index: number) => {
    try {
      stopCurrentAudio();
      setIsLoadingArtwork(index);
      setSpeakingType("artwork");
      setSpeakingArtworkIndex(index);

      // 디버깅: 작품 데이터 로그
      console.log(`작품 ${index + 1} 데이터:`, {
        title: artwork.title,
        artist: artwork.artist,
        year: artwork.year,
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        description: artwork.description,
        imageUrl: artwork.imageUrl,
      });

      // 작품 데이터 검증
      const validation = validateArtworkData(artwork);
      console.log(`작품 ${index + 1} 검증 결과:`, validation);

      if (!validation.isValid) {
        const errorMessage =
          selectedLanguage === "ko"
            ? `죄송합니다. 이 작품에 대한 상세한 설명을 제공할 수 없습니다. 누락된 정보: ${validation.missingFields.join(
                ", "
              )}. 모든 작품 데이터가 제대로 로드되었는지 확인해주세요.`
            : `Sorry, I cannot provide a detailed description for this artwork because some information is missing: ${validation.missingFields.join(
                ", "
              )}. Please ensure all artwork data is properly loaded.`;
        setDataValidationMessage(errorMessage);

        // 오류 메시지를 음성으로 재생
        const audio = await playTTSAudio(errorMessage, selectedLanguage);

        if (!audio) {
          console.error("오류 메시지 TTS 실패");
          setIsLoadingArtwork(null);
          setSpeakingType(null);
          setSpeakingArtworkIndex(null);
          return;
        }

        setCurrentAudio(audio);
        setIsCurrentlySpeaking(true);
        setIsLoadingArtwork(null);

        audio.onended = () => {
          URL.revokeObjectURL(audio.src);
          setIsCurrentlySpeaking(false);
          setSpeakingType(null);
          setSpeakingArtworkIndex(null);
          setDataValidationMessage(null);
          setIsPaused(false);
          setPauseTime(0);
          setCurrentAudio(null);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audio.src);
          setIsCurrentlySpeaking(false);
          setSpeakingType(null);
          setSpeakingArtworkIndex(null);
          setDataValidationMessage(null);
          setIsPaused(false);
          setPauseTime(0);
          setCurrentAudio(null);
        };

        return;
      }

      console.log(`작품 ${index + 1} AI 설명 요청 시작`);
      const description = await getArtworkDescription(
        artwork,
        selectedLanguage
      );
      console.log(`작품 ${index + 1} AI 설명 결과:`, description);

      // Google TTS 사용
      const audio = await playTTSAudio(description, selectedLanguage);

      if (!audio) {
        console.error("작품 설명 TTS 실패");
        // TTS 실패 시에도 설명을 텍스트로 표시
        const ttsErrorMessage =
          selectedLanguage === "ko"
            ? `음성 재생에 실패했습니다. 작품 설명: ${description}`
            : `Voice playback failed. Artwork description: ${description}`;
        setDataValidationMessage(ttsErrorMessage);
        setIsLoadingArtwork(null);
        setSpeakingType(null);
        setSpeakingArtworkIndex(null);
        return;
      }

      setCurrentAudio(audio);
      setIsCurrentlySpeaking(true);
      setIsLoadingArtwork(null);

      audio.onended = () => {
        console.log("작품 설명 종료");
        URL.revokeObjectURL(audio.src);
        setIsCurrentlySpeaking(false);
        setSpeakingType(null);
        setSpeakingArtworkIndex(null);
        setIsPaused(false);
        setPauseTime(0);
        setCurrentAudio(null);
      };
      audio.onerror = (event) => {
        console.error("작품 설명 오류:", event);
        URL.revokeObjectURL(audio.src);
        setIsCurrentlySpeaking(false);
        setSpeakingType(null);
        setSpeakingArtworkIndex(null);
        setIsLoadingArtwork(null);
        setIsPaused(false);
        setPauseTime(0);
        setCurrentAudio(null);
      };
    } catch (error) {
      console.error("작품 설명 중 오류:", error);
      setIsCurrentlySpeaking(false);
      setSpeakingType(null);
      setSpeakingArtworkIndex(null);
      setIsLoadingArtwork(null);
      setIsPaused(false);
      setPauseTime(0);
      setCurrentAudio(null);
    }
  };

  const scrollToIndex = (idx: number) => {
    console.log(`화살표 클릭: 작품 ${idx + 1}로 이동`);

    if (cardRefs.current[idx]) {
      const targetElement = cardRefs.current[idx];
      const container = targetElement?.closest(".scrollable-x") as HTMLElement;

      if (container && targetElement) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        // 작품을 컨테이너 중앙에 위치시키기 위한 스크롤 위치 계산
        const scrollLeft =
          targetElement.offsetLeft -
          containerRect.width / 2 +
          targetRect.width / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });

        console.log(`스크롤 위치: ${scrollLeft}px`);
      } else {
        // fallback: 기본 scrollIntoView 사용
        targetElement?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    } else {
      console.warn(`작품 ${idx + 1}의 ref를 찾을 수 없습니다`);
    }
  };

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, artworks.length);
  }, [artworks.length]);

  // 작가 소개 토글 핸들러
  const handleArtistToggle = () => {
    if (speakingType === "artist") {
      if (isPaused) {
        resumeCurrentAudio();
      } else {
        pauseCurrentAudio();
      }
    } else {
      speakArtistIntroduction();
    }
  };

  // 작품 설명 토글 핸들러
  const handleArtworkToggle = (artwork: Artwork, index: number) => {
    if (speakingType === "artwork" && speakingArtworkIndex === index) {
      if (isPaused) {
        resumeCurrentAudio();
      } else {
        pauseCurrentAudio();
      }
    } else {
      speakArtworkDescription(artwork, index);
    }
  };

  const handleGoBack = () => {
    // 현재 오디오가 재생 중이면 중지
    stopCurrentAudio();
    // 브라우저 뒤로가기
    window.history.back();
  };

  return (
    <main className="bg-[#fdf6e3] text-black px-4 py-8 h-screen overflow-hidden relative">
      {/* 스킵 링크 */}
      <a
        href="#artist-title"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-500 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        작가 제목으로 건너뛰기
      </a>

      {/* 오디오 상태 알림 (스크린 리더용) */}
      <div id="artist-audio-status" className="sr-only" aria-live="polite">
        {isLoadingArtist && "작가 소개 로딩 중"}
        {speakingType === "artist" && !isPaused && "작가 소개 재생 중"}
        {speakingType === "artist" && isPaused && "작가 소개 일시정지됨"}
      </div>
      {/* 상단 컨트롤 영역 - 오른쪽 */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 sm:gap-3">
        {/* 언어 선택 버튼 */}
        <Tooltip message="도슨트 언어를 설정하세요" position="left">
          <div
            className="flex rounded-full p-1 bg-white shadow-sm"
            role="radiogroup"
            aria-label="언어 선택"
          >
            <button
              onClick={() => setSelectedLanguage("ko")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedLanguage("ko");
                }
              }}
              aria-checked={selectedLanguage === "ko"}
              role="radio"
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedLanguage === "ko"
                  ? "bg-white text-gray-800 shadow-sm border border-gray-300"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              title="한국어로 듣기"
            >
              🇰🇷 한국어
            </button>
            <button
              onClick={() => setSelectedLanguage("en")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedLanguage("en");
                }
              }}
              aria-checked={selectedLanguage === "en"}
              role="radio"
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedLanguage === "en"
                  ? "bg-white text-gray-800 shadow-sm border border-gray-300"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              title="Listen in English"
            >
              🇺🇸 English
            </button>
          </div>
        </Tooltip>
      </div>

      {/* 데이터 검증 메시지 */}
      {dataValidationMessage && (
        <div className="absolute top-16 right-2 sm:right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-700 px-2 sm:px-4 py-2 rounded shadow-lg max-w-xs sm:max-w-md">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs sm:text-sm">{dataValidationMessage}</span>
          </div>
        </div>
      )}

      {/* 상단 컨트롤 영역 - 왼쪽 */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 sm:gap-3">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleGoBack}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleGoBack();
            }
          }}
          aria-label="뒤로가기"
          className="p-2 sm:p-3 rounded-full bg-white hover:bg-gray-200 shadow-sm text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="뒤로가기"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>

        {/* 작가 소개 토글 버튼 */}
        <Tooltip
          message="클릭 후 작가에 대한 설명을 들어보세요"
          position="right"
        >
          <button
            onClick={handleArtistToggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleArtistToggle();
              }
            }}
            disabled={isLoadingArtist}
            aria-label={
              speakingType === "artist"
                ? isPaused
                  ? "작가 소개 재생"
                  : "작가 소개 일시정지"
                : "작가 소개 듣기"
            }
            aria-pressed={speakingType === "artist"}
            aria-describedby="artist-audio-status"
            className={`p-2 sm:p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              speakingType === "artist"
                ? "bg-white text-gray-700 shadow-lg"
                : "bg-white shadow-sm hover:bg-gray-200 text-gray-700"
            } ${isLoadingArtist ? "animate-pulse" : ""}`}
            title={
              speakingType === "artist"
                ? isPaused
                  ? "작가 소개 재생"
                  : "작가 소개 일시정지"
                : "작가 소개 듣기"
            }
          >
            {isLoadingArtist ? (
              <WaveLoader size="lg" color="gray" />
            ) : speakingType === "artist" ? (
              isPaused ? (
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h12v16H6V4zm2 2v12h8V6H8zm3 3h2v6h-2V9z" />
                </svg>
              )
            ) : (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </Tooltip>
      </div>

      <h1
        className="text-xl sm:text-2xl md:text-3xl font-bold text-center font-display mb-4 sm:mb-6 md:mb-8 mt-8"
        id="artist-title"
      >
        {artistName}
      </h1>

      <HorizontalScrollContainer>
        <div className="flex gap-4 sm:gap-6 px-2 sm:px-4">
          {artworks.map((art, idx) => (
            <div
              key={idx}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="relative shrink-0 w-[85vw] sm:w-[70vw] md:w-[60vw]"
            >
              {/* 작품별 스피커 버튼 - 각 작품 우상단 */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-10 z-40">
                <Tooltip
                  message="작품에 대한 세부 설명을 들어보세요"
                  position="bottom"
                >
                  <button
                    onClick={() => handleArtworkToggle(art, idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleArtworkToggle(art, idx);
                      }
                    }}
                    disabled={isLoadingArtwork === idx}
                    aria-label={
                      speakingType === "artwork" && speakingArtworkIndex === idx
                        ? isPaused
                          ? `${art.title} 작품 설명 재생`
                          : `${art.title} 작품 설명 일시정지`
                        : `${art.title} 작품 설명 듣기`
                    }
                    aria-pressed={
                      speakingType === "artwork" && speakingArtworkIndex === idx
                    }
                    className={`p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      speakingType === "artwork" && speakingArtworkIndex === idx
                        ? "text-gray-800"
                        : "text-gray-600 hover:text-gray-800"
                    } ${isLoadingArtwork === idx ? "animate-pulse" : ""}`}
                    title={
                      speakingType === "artwork" && speakingArtworkIndex === idx
                        ? isPaused
                          ? "작품 설명 재생"
                          : "작품 설명 일시정지"
                        : "작품 설명 듣기"
                    }
                  >
                    {isLoadingArtwork === idx ? (
                      <WaveLoader size="md" color="gray" />
                    ) : speakingType === "artwork" &&
                      speakingArtworkIndex === idx ? (
                      isPaused ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 4h12v16H6V4zm2 2v12h8V6H8zm3 3h2v6h-2V9z" />
                        </svg>
                      )
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                </Tooltip>
              </div>

              <div
                role="article"
                aria-labelledby={`artwork-title-${idx}`}
                aria-describedby={`artwork-info-${idx}`}
              >
                <ArtworkCard
                  imageUrl={art.imageUrl}
                  title={art.title}
                  year={art.year}
                  artist={art.artist}
                  medium={art.medium}
                  dimensions={art.dimensions}
                  description={art.description}
                />
                <div id={`artwork-title-${idx}`} className="sr-only">
                  {art.title}
                </div>
                <div id={`artwork-info-${idx}`} className="sr-only">
                  {art.artist && `${art.artist}, `}
                  {art.year && `${art.year}, `}
                  {art.medium && `${art.medium}, `}
                  {art.dimensions && `${art.dimensions}`}
                </div>
              </div>

              {/* 개별 작품 화살표 네비게이션 - 데스크톱에서만 표시 */}
              {idx > 0 && (
                <div className="hidden sm:flex absolute inset-y-0 left-0 items-center">
                  <button
                    onClick={() => scrollToIndex(idx - 1)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        scrollToIndex(idx - 1);
                      }
                    }}
                    aria-label={`이전 작품: ${
                      artworks[idx - 1]?.title || "이전 작품"
                    }`}
                    className="text-4xl text-gray-400/70 hover:text-gray-600 transition-colors duration-200 -left-12 md:-left-20 relative z-30 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="이전 작품"
                  >
                    <svg
                      className="w-7 h-7 md:w-8 md:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}
              {idx < artworks.length - 1 && (
                <div className="hidden sm:flex absolute inset-y-0 right-0 items-center">
                  <button
                    onClick={() => scrollToIndex(idx + 1)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        scrollToIndex(idx + 1);
                      }
                    }}
                    aria-label={`다음 작품: ${
                      artworks[idx + 1]?.title || "다음 작품"
                    }`}
                    className="text-4xl text-gray-400/70 hover:text-gray-600 transition-colors duration-200 -right-12 md:-right-20 relative z-30 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="다음 작품"
                  >
                    <svg
                      className="w-7 h-7 md:w-8 md:h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </HorizontalScrollContainer>

      {/* 전체 화살표 네비게이션 (첫/마지막 작품으로 이동) - 데스크톱에서만 표시 */}
      {artworks.length > 1 && (
        <>
          <div className="hidden sm:flex absolute inset-y-0 left-0 items-center">
            <button
              onClick={() => scrollToIndex(0)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  scrollToIndex(0);
                }
              }}
              aria-label={`첫 번째 작품: ${
                artworks[0]?.title || "첫 번째 작품"
              }`}
              className="text-4xl text-gray-400/70 hover:text-gray-600 transition-colors duration-200 -left-16 md:-left-24 relative z-20 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="첫 번째 작품"
            >
              <svg
                className="w-7 h-7 md:w-8 md:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex absolute inset-y-0 right-0 items-center">
            <button
              onClick={() => scrollToIndex(artworks.length - 1)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  scrollToIndex(artworks.length - 1);
                }
              }}
              aria-label={`마지막 작품: ${
                artworks[artworks.length - 1]?.title || "마지막 작품"
              }`}
              className="text-4xl text-gray-400/70 hover:text-gray-600 transition-colors duration-200 -right-16 md:-right-24 relative z-20 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="마지막 작품"
            >
              <svg
                className="w-7 h-7 md:w-8 md:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7m-8 0l7-7-7-7"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </main>
  );
}
