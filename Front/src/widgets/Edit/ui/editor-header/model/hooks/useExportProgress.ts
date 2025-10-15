"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface ExportProgressState {
  jobId: string | null;
  progress: number;
  status: "idle" | "exporting" | "completed" | "error";
  error?: string;
  outputPath?: string;
  filename?: string;
  downloadUrl?: string;
}

export const useExportProgress = () => {
  const [state, setState] = useState<ExportProgressState>({
    jobId: null,
    progress: 0,
    status: "idle",
  });

  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);

  // WebSocket 연결 함수
  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) {
      return socketRef.current;
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const socket = io(API_BASE_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("WebSocket 연결됨:", socket.id);
      isConnectedRef.current = true;
    });

    socket.on("disconnect", () => {
      console.log("WebSocket 연결 해제됨");
      isConnectedRef.current = false;
    });

    socket.on("progress", (data: { jobId: string; progress: number }) => {
      // console.log('진행률 업데이트:', data);
      setState((prev) => ({
        ...prev,
        jobId: data.jobId,
        progress: data.progress,
        status: "exporting",
      }));
    });

    socket.on("completed", (data: { jobId: string; outputPath: string; filename?: string; downloadUrl?: string }) => {
      console.log("내보내기 완료:", data);
      setState((prev) => ({
        ...prev,
        jobId: data.jobId,
        progress: 100,
        status: "completed",
        outputPath: data.outputPath,
        filename: data.filename,
        downloadUrl: data.downloadUrl,
      }));
    });

    socket.on("error", (data: { jobId: string; error: string }) => {
      console.log("내보내기 오류:", data);
      setState((prev) => ({
        ...prev,
        jobId: data.jobId,
        status: "error",
        error: data.error,
      }));
    });

    socketRef.current = socket;
    return socket;
  }, []);

  // 상태 초기화 함수
  const resetState = useCallback(() => {
    setState({
      jobId: null,
      progress: 0,
      status: "idle",
      error: undefined,
      outputPath: undefined,
      filename: undefined,
      downloadUrl: undefined,
    });
  }, []);

  const cancelJob = useCallback(
    (jobId: string) => {
      const socket = socketRef.current;
      if (socket && isConnectedRef.current && jobId) {
        socket.emit("cancelJob", { jobId });
        resetState();
        console.log("작업 취소됨:", jobId);
      } else {
        resetState();
        console.error("작업 취소 실패");
      }
    },
    [resetState]
  );

  // 작업 구독 함수
  const subscribeToJob = useCallback(
    (jobId: string) => {
      const socket = connectSocket();

      if (socket && isConnectedRef.current) {
        // 백엔드의 subscribeToJob 메서드를 호출하기 위해 이벤트 발송
        socket.emit("subscribeToJob", { jobId, clientId: socket.id });

        setState((prev) => ({
          ...prev,
          jobId,
          progress: 0,
          status: "exporting",
          error: undefined,
          outputPath: undefined,
        }));
      } else {
        // 연결이 안 된 경우 연결 후 구독
        socket.on("connect", () => {
          socket.emit("subscribeToJob", { jobId, clientId: socket.id });
          setState((prev) => ({
            ...prev,
            jobId,
            progress: 0,
            status: "exporting",
            error: undefined,
            outputPath: undefined,
          }));
        });
      }
    },
    [connectSocket]
  );

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        isConnectedRef.current = false;
      }
    };
  }, []);

  return {
    ...state,
    subscribeToJob,
    resetState,
    cancelJob,
    isConnected: isConnectedRef.current,
  };
};
