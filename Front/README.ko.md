# VideoEditorH 🎬

> **Language**: [English](README.md) | **한국어**

직관적인 인터페이스와 강력한 편집 기능을 통해 누구나 쉽게 고품질 영상을 제작할 수 있는 웹 기반 비디오 편집 플랫폼입니다.

## 🌟 주요 기능

- **멀티미디어 편집**: 텍스트, 비디오, 이미지, 음악, 자막을 통합적으로 편집
- **직관적 UI**: 다크 테마 기반의 모던한 사용자 인터페이스
- **실시간 미리보기**: 편집 내용을 실시간으로 확인
- **프로젝트 관리**: 작업 내용을 저장하고 관리
- **내보내기/공유**: 완성된 영상을 다양한 형태로 내보내기 및 공유

## 🛠 기술 스택

### Frontend

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Animations**: tw-animate-css

### 개발 도구

- **Package Manager**: npm
- **Linting**: ESLint 9
- **Build Tool**: Turbopack (Next.js)

## 📁 프로젝트 구조

프로젝트는 **Feature-Sliced Design** 아키텍처 패턴을 따릅니다:

## 🚀 시작하기

### 필수 요구사항

- Node.js 20 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/videoEditorH.git
cd videoEditorH/Front

# 의존성 설치
npm install

# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.
