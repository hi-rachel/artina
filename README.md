# 🖼️ Artina - AI-Powered Art Gallery

Artina는 메트로폴리탄 미술관의 작품들을 AI 기술을 활용하여 분석하고 설명하는 인터랙티브 갤러리입니다.

<video src="https://github.com/user-attachments/assets/6f5f63f5-1ed9-40c4-a093-f11c21332895"></video>

## 🎨 주요 기능

### 작품 전시 및 탐색

- **3D 갤러리 환경**: Three.js 기반의 몰입형 갤러리 경험
- **가로 스크롤 갤러리**: 걸으면 감상하는 느낌
- **작가별 큐레이션**: 시대별 작가 그룹화
- **반응형 디자인**: 모바일/데스크톱 최적화

### AI 작품 분석 및 설명

- **하이브리드 설명 시스템**: 정적 데이터 + AI 생성 + 캐싱
- **Gemini AI 통합**: 실시간 작품 분석 및 설명 생성
- **다국어 지원**: 한국어/영어 도슨트 서비스
- **TTS 음성 가이드**: 텍스트 음성 변환으로 음성 설명 제공

### 스마트 캐싱 시스템

- **로컬 스토리지 캐시**: 7일간 유지되는 브라우저 캐시
- **정적 데이터 우선**: 미리 준비된 고품질 설명 데이터
- **API 호출 최적화**: 중복 요청 방지 및 비용 절약
- **배치 처리**: 여러 작품 동시 처리 지원

## 🏗️ 프로젝트 구조

```
src/
├── app/                   # Next.js App Router
│   ├── api/               # API 엔드포인트
│   │   ├── gemini/        # Gemini AI API
│   │   ├── met/           # Metropolitan Museum API
│   │   └── tts/           # Text-to-Speech API
│   ├── gallery/           # 갤러리 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   └── not-found.tsx      # 404 페이지
├── components/            # React 컴포넌트
│   ├── common/            # 공통 컴포넌트
│   │   ├── ArtworkCard.tsx
│   │   ├── GalleryWithArrows.tsx
│   │   ├── HorizontalScrollContainer.tsx
│   │   └── ...
│   └── home/              # 홈페이지 컴포넌트
├── data/                  # 정적 데이터
│   ├── artistData.ts      # 작가 정보
│   ├── artistDescriptions.ts
│   ├── artworkDescriptions.ts
│   └── aiGeneratedDescriptions.ts
├── lib/                   # 유틸리티 라이브러리
│   ├── artworkDescriptionGenerator.ts
│   ├── geminiApi.ts
│   ├── metApi.ts
│   └── ttsApi.ts
├── styles/                # 스타일 파일
└── types/                 # TypeScript 타입 정의
```

## 🚀 기술 스택

### Frontend

- **Next.js 14**: App Router 기반 프레임워크
- **React 18**: 사용자 인터페이스
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 유틸리티 기반 스타일링

### 3D & 애니메이션

- **Three.js**: 3D 그래픽 렌더링
- **React Three Fiber**: React용 Three.js 래퍼
- **GSAP**: 고급 애니메이션
- **Framer Motion**: React 애니메이션

### AI & API

- **Google Gemini AI**: 작품 분석 및 설명 생성
- **Google Cloud TTS**: 텍스트 음성 변환
- **Metropolitan Museum API**: 작품 데이터

### 개발 도구

- **ESLint**: 코드 품질 관리

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음을 추가하세요:

```env
# Gemini AI API
GEMINI_API_KEY=your_gemini_api_key_here

# Google Cloud TTS (Text-to-Speech)
GOOGLE_SERVICE_ACCOUNT_TYPE=service_account
GOOGLE_SERVICE_ACCOUNT_PROJECT_ID=your_project_id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=your_service_account_email
GOOGLE_SERVICE_ACCOUNT_CLIENT_ID=your_client_id
GOOGLE_SERVICE_ACCOUNT_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_SERVICE_ACCOUNT_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email
GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN=googleapis.com
```

### TTS 설정 가이드

1. **Google Cloud Console**에서 프로젝트 생성
2. **Text-to-Speech API** 활성화
3. **서비스 계정** 생성 및 키 다운로드
4. 다운로드한 JSON 파일의 내용을 환경 변수로 설정
5. **Text-to-Speech API 권한** 부여

### 3. 개발 서버 실행

```bash
pnpm dev
```

### 4. 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 🔌 API 엔드포인트

### AI 관련 API

- `POST /api/gemini/artwork` - 작품 설명 생성
- `POST /api/gemini/artist` - 작가 소개 생성

### 데이터 API

- `GET /api/met` - 메트로폴리탄 미술관 작품 데이터

### 음성 API

- `POST /api/tts` - 텍스트 음성 변환

## 🧠 AI 시스템 아키텍처

### 하이브리드 설명 시스템

```
사용자 요청
    ↓
1. 로컬 캐시 확인 (7일 유효)
    ↓ (캐시 미스)
2. 정적 데이터 확인
    ↓ (정적 데이터 없음)
3. AI API 호출 (Gemini)
    ↓
4. 결과 캐시 저장
    ↓
5. 사용자에게 응답
```

## 🔧 개발 가이드

### 새로운 작품 추가

1. `src/data/artworkDescriptions.ts`에 정적 데이터 추가
2. 정확한 제목 매칭 우선
3. 부분 매칭 지원 (60% 이상 일치)

### 캐시 관리

```typescript
import { artworkDescriptionGenerator } from "@/lib/artworkDescriptionGenerator";

// 캐시 통계 확인
const stats = artworkDescriptionGenerator.getCacheStats();

// 캐시 초기화
artworkDescriptionGenerator.clearCache();
```

### TTS 사용

```typescript
import { playTTSAudio } from "@/lib/ttsApi";

const audio = await playTTSAudio(text, "ko");
```

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 문의사항

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**Artina Gallery** - 예술의 아름다움을 AI와 함께 경험하세요 🎨✨
