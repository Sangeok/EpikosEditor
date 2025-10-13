# Timeline Zoom & Ruler 기능 문서

## 📖 개요

이 문서는 비디오 에디터의 Timeline에서 zoom in/out 기능과 동적 ruler 표시 기능의 구현에 대해 설명합니다. 사용자가 zoom 레벨을 조정할 때 ruler가 실시간으로 반응하여 적절한 시간 간격을 표시하는 기능을 제공합니다.

## 🎯 주요 기능

### 1. 동적 Zoom 제어

- **범위**: 0.1x ~ 10x (10% ~ 1000%)
- **조작 방식**:
  - 버튼 클릭 (1.2배씩 증가/감소)
  - 슬라이더 드래그 (로그 스케일)
  - 퍼센트 클릭 (100% 리셋)

### 2. 스마트 Ruler 시스템

- **자동 시간 간격 조정**: zoom 레벨에 따라 최적의 시간 눈금 표시
- **이중 눈금 시스템**: 주 눈금(라벨 포함) + 보조 눈금
- **실시간 업데이트**: zoom 변경 시 즉시 ruler 갱신

### 3. 시각적 피드백

- **현재 시간 인디케이터**: 빨간색 라인으로 현재 위치 표시
- **기준선**: 0초 위치 표시
- **제약 조건 시각화**: 최소/최대 zoom 시 버튼 비활성화

## 🏗️ 아키텍처

### 파일 구조

```
Front/src/features/Edit/
├── model/store/
│   └── useTimelineStore.ts          # 전역 상태 관리
├── ui/editor-footer/
│   ├── utils/
│   │   └── zoomUtils.ts             # zoom 계산 유틸리티
│   └── ui/_component/
│       ├── TImeline/
│       │   ├── Timeline.tsx         # 메인 타임라인 컴포넌트
│       │   └── _component/
│       │       └── TimelineRuler.tsx # 동적 ruler 컴포넌트
│       └── TimelineToolBar/_component/
│           └── ZoomControl.tsx      # zoom 제어 컴포넌트
```

### 컴포넌트 관계도

```
Timeline
├── TimelineRuler (ruler 표시)
└── (트랙 영역)

TimelineToolBar
├── ZoomControl (zoom 제어)
├── PlaybackDisplay
└── ToolButton
```

## 🔧 핵심 컴포넌트

### 1. TimelineStore (`useTimelineStore.ts`)

**목적**: Timeline 관련 모든 상태를 중앙 집중식으로 관리

**주요 상태**:

```typescript
interface TimelineState {
  currentTime: number; // 현재 재생 시간 (초)
  duration: number; // 전체 지속 시간 (초)
  zoom: number; // 줌 레벨 (1.0 = 100%)
  isPlaying: boolean; // 재생 상태
  pixelsPerSecond: number; // 1초당 픽셀 수
  timelineWidth: number; // 타임라인 전체 너비
  viewportStartTime: number; // 뷰포트 시작 시간
  viewportEndTime: number; // 뷰포트 종료 시간
}
```

**핵심 로직**:

- **updateViewport()**: zoom 변경 시 뷰포트 및 픽셀 계산 업데이트
- **setZoom()**: 0.1x~10x 범위 제한 및 부드러운 단계 조정
- **zoomIn/zoomOut()**: 1.2배 증가/감소 로직

### 2. ZoomControl (`ZoomControl.tsx`)

**목적**: 사용자가 zoom 레벨을 조작할 수 있는 UI 제공

**핵심 기능**:

```typescript
// 슬라이더 값(0-100) ↔ zoom 레벨(0.1-10) 변환
const zoomLevel = Math.pow(10, (value / 100) * 2 - 1);
const sliderValue = ((Math.log10(zoom) + 1) / 2) * 100;
```

**UI 구성**:

- **Zoom Out 버튼**: 최소 zoom 시 비활성화
- **로그 스케일 슬라이더**: 자연스러운 zoom 조작
- **클릭 가능한 퍼센트 표시**: 100% 리셋 기능
- **Zoom In 버튼**: 최대 zoom 시 비활성화

### 3. TimelineRuler (`TimelineRuler.tsx`)

**목적**: zoom 레벨에 따라 동적으로 시간 눈금을 표시

**핵심 로직**:

```typescript
// 눈금 계산
const { majorTicks, minorTicks } = calculateTicks(
  viewportStartTime,
  viewportEndTime,
  zoom,
  pixelsPerSecond
);

// 현재 시간 위치 계산
const currentTimePosition = currentTime * pixelsPerSecond;
```

**시각적 요소**:

- **배경**: 그라데이션 배경으로 깊이감 표현
- **보조 눈금**: 회색 짧은 선으로 세밀한 구간 표시
- **주 눈금**: 흰색 긴 선 + 시간 라벨
- **현재 시간 인디케이터**: 빨간색 라인 + 원형 헤더
- **기준선**: 0초 위치의 반투명 흰색 선

### 4. Zoom 유틸리티 (`zoomUtils.ts`)

**목적**: zoom 레벨에 따른 시간 간격 계산 및 포맷팅

**시간 간격 로직**:

```typescript
export const getTimeIntervals = (zoom: number): number[] => {
  if (zoom >= 8) return [0.1, 0.5, 1]; // 매우 높은 zoom
  if (zoom >= 4) return [0.5, 1, 5]; // 높은 zoom
  if (zoom >= 2) return [1, 5, 10]; // 중간 zoom
  if (zoom >= 1) return [5, 10, 30]; // 기본 zoom
  if (zoom >= 0.5) return [10, 30, 60]; // 낮은 zoom
  return [30, 60, 300]; // 매우 낮은 zoom
};
```

**핵심 함수들**:

- **calculateTicks()**: 주/보조 눈금 위치 및 라벨 계산
- **formatTime()**: 시간 포맷팅 (0.5s, 30s, 2:30 등)
- **timeToPixels() / pixelsToTime()**: 시간-픽셀 변환

## 🎨 사용자 경험 (UX) 고려사항

### 1. 자연스러운 Zoom 조작

- **로그 스케일**: 낮은 zoom에서 더 세밀한 조정, 높은 zoom에서 더 큰 변화
- **1.2배 증가/감소**: 부드러운 단계별 조정
- **범위 제한**: 0.1x~10x로 실용적 범위 유지

### 2. 시각적 피드백

- **제약 조건 표시**: 최소/최대 zoom 시 버튼 비활성화
- **실시간 업데이트**: 조작 즉시 ruler 변경
- **상태 표시**: 현재 zoom 레벨을 %로 표시

### 3. 적응형 인터페이스

- **창 크기 대응**: 리사이즈 시 자동 재계산
- **zoom 레벨별 최적화**: 각 zoom 레벨에서 가장 읽기 쉬운 간격 선택

## 🔄 동작 플로우

### Zoom 변경 시 업데이트 플로우

```
1. 사용자 액션 (버튼 클릭/슬라이더 이동)
   ↓
2. ZoomControl에서 setZoom() 호출
   ↓
3. TimelineStore의 zoom 상태 업데이트
   ↓
4. updateViewport() 자동 호출
   ↓
5. pixelsPerSecond 재계산
   ↓
6. TimelineRuler 리렌더링
   ↓
7. calculateTicks()로 새로운 눈금 계산
   ↓
8. 화면에 업데이트된 ruler 표시
```

### 컴포넌트 마운트 시 초기화 플로우

```
1. TimelineRuler 마운트
   ↓
2. useRef로 DOM 요소 크기 측정
   ↓
3. setTimelineWidth() 호출
   ↓
4. updateViewport() 자동 호출
   ↓
5. 초기 pixelsPerSecond 계산
   ↓
6. 초기 ruler 렌더링
```

## 🛠️ 기술적 세부사항

### 1. 성능 최적화

- **useRef 활용**: DOM 요소 직접 접근으로 불필요한 리렌더링 방지
- **계산 최적화**: 복잡한 계산은 유틸리티 함수로 분리
- **이벤트 리스너 정리**: 컴포넌트 언마운트 시 resize 이벤트 리스너 제거

### 2. 반응성 보장

- **Zustand 활용**: 상태 변경 시 자동 리렌더링
- **의존성 최소화**: 필요한 상태만 구독하여 불필요한 업데이트 방지

### 3. 타입 안정성

- **TypeScript 엄격 모드**: 모든 타입 명시적 정의
- **인터페이스 활용**: 컴포넌트 간 데이터 구조 명확히 정의

## 📝 사용 예시

### 기본 사용법

```typescript
// ZoomControl 컴포넌트 사용
<ZoomControl />

// Timeline 컴포넌트 사용 (TimelineRuler 포함)
<Timeline />
```

### 프로그래밍 방식 제어

```typescript
// 상태 접근
const { zoom, setZoom, zoomIn, zoomOut } = useTimelineStore();

// zoom 레벨 직접 설정
setZoom(2.5); // 250%

// 단계별 zoom 조정
zoomIn(); // 현재 zoom * 1.2
zoomOut(); // 현재 zoom / 1.2
```

### 커스텀 시간 간격 설정

```typescript
// zoomUtils.ts에서 getTimeIntervals 함수 수정
export const getTimeIntervals = (zoom: number): number[] => {
  // 커스텀 로직 구현
  return [minInterval, majorInterval, maxInterval];
};
```

## 🔧 설정 및 커스터마이징

### 1. Zoom 범위 조정

```typescript
// useTimelineStore.ts
setZoom: (zoom: number) => {
  const newZoom = Math.max(0.05, Math.min(20, zoom)); // 범위 변경
  // ...
};
```

### 2. 기본 픽셀 밀도 변경

```typescript
// useTimelineStore.ts
updateViewport: () => {
  const basePixelsPerSecond = 30; // 기본값 변경
  // ...
};
```

### 3. 색상 테마 커스터마이징

```typescript
// TimelineRuler.tsx
<div className="bg-custom-dark border-custom-light"> // 색상 변경 // ...</div>
```

## 🐛 알려진 제한사항

1. **최소 픽셀 간격**: 매우 높은 zoom에서 눈금이 너무 조밀해질 수 있음
2. **브라우저 호환성**: CSS 슬라이더 스타일링이 일부 브라우저에서 다르게 표시될 수 있음
3. **성능**: 매우 긴 duration에서 많은 눈금 계산 시 성능 저하 가능성

## 🚀 향후 개선 계획

1. **가상화**: 매우 긴 timeline에서 성능 최적화
2. **키보드 단축키**: 키보드로 zoom 조작 지원
3. **마우스 휠**: 마우스 휠로 zoom 조작 지원
4. **미니맵**: 전체 timeline 미리보기 기능
5. **커스텀 마커**: 사용자 정의 시간 마커 추가
