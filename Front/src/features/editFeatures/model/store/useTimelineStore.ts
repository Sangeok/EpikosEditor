import { create } from "zustand";

interface TimelineState {
  // 기본 상태
  currentTime: number; // 현재 재생 시간 (초)
  zoom: number; // 줌 레벨 (1.0 = 100%)
  isPlaying: boolean; // 재생 상태

  // 뷰 관련 상태
  pixelsPerSecond: number; // 1초당 픽셀 수
  timelineWidth: number; // 타임라인 전체 너비
  viewportStartTime: number; // 현재 뷰포트 시작 시간
  viewportEndTime: number; // 현재 뷰포트 종료 시간
}

interface TimelineActions {
  // 기본 액션
  setCurrentTime: (time: number) => void;
  setZoom: (zoom: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setTimelineClick: (time: number) => void;

  // 뷰 관련 액션
  setTimelineWidth: (width: number) => void;
  updateViewport: () => void;
  /**
   * 스크롤 컨테이너의 상태로부터 뷰포트 범위를 계산/갱신
   * @param scrollLeftPx 현재 가로 스크롤 위치(px)
   * @param clientWidthPx 컨테이너 가시 영역 너비(px)
   */
  setViewportFromContainer: (scrollLeftPx: number, clientWidthPx: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export type TimelineStore = TimelineState & TimelineActions;

const useTimelineStore = create<TimelineStore>((set, get) => ({
  // 초기 상태
  currentTime: 0,
  zoom: 1.0, // 100%(1 ~ 10) => 1은 100%(최소값) 10은 1000%(최대값)
  isPlaying: false,
  pixelsPerSecond: 20, // 기본값: 1초당 20픽셀
  timelineWidth: 800, // 기본값: 800px
  viewportStartTime: 0,
  viewportEndTime: 40, // 기본값: 40초까지 표시

  // 기본 액션
  setCurrentTime: (time: number) => {
    set({ currentTime: Math.max(0, time) }); // 음수만 방지, 최대값 체크는 각 컴포넌트에서
  },

  setZoom: (zoom: number) => {
    const newZoom = Math.max(1, Math.min(10, zoom)); // 1x ~ 10x 제한

    // zoom 레벨 정밀도 처리
    const smoothZoom = Math.round(newZoom * 10) / 10; // 0.1 단위로 반올림

    set({ zoom: smoothZoom });
    get().updateViewport();
  },

  setIsPlaying: (isPlaying: boolean) => {
    set({ isPlaying });
  },

  // 뷰 관련 액션
  setTimelineWidth: (width: number) => {
    set({ timelineWidth: width });
    get().updateViewport();
  },

  updateViewport: () => {
    const { zoom, timelineWidth, viewportStartTime } = get();
    const basePixelsPerSecond = 20; // 1초 = 20px
    const pixelsPerSecond = basePixelsPerSecond * zoom; // zoom 적용된 밀도

    // 뷰포트에 표시될 시간 범위 계산
    const viewportDuration = timelineWidth / pixelsPerSecond;
    const viewportEndTime = viewportStartTime + viewportDuration;

    set({
      pixelsPerSecond,
      viewportStartTime,
      viewportEndTime,
    });
  },

  setTimelineClick: (time: number) => {
    set({ currentTime: Math.max(0, time), isPlaying: false });
  },

  setViewportFromContainer: (scrollLeftPx: number, clientWidthPx: number) => {
    const { zoom } = get();
    const basePixelsPerSecond = 20; // 1초 = 20px
    const pixelsPerSecond = basePixelsPerSecond * zoom;
    const viewportStartTime = Math.max(0, scrollLeftPx / pixelsPerSecond);
    const viewportEndTime = viewportStartTime + clientWidthPx / pixelsPerSecond;

    set({
      pixelsPerSecond,
      timelineWidth: clientWidthPx,
      viewportStartTime,
      viewportEndTime,
    });
  },

  zoomIn: () => {
    const currentZoom = get().zoom;
    get().setZoom(currentZoom * 1.2); // 1.2(20%) 증가
  },

  zoomOut: () => {
    const currentZoom = get().zoom;
    get().setZoom(currentZoom / 1.2);
  },

  resetZoom: () => {
    get().setZoom(1.0); // 기본값이자 최소값으로 리셋
  },
}));

export default useTimelineStore;
