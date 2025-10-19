"use client";

import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * CreateMediaAssetPage 헤더 컴포넌트
 *
 * 책임:
 * - 페이지 제목 표시
 * - 뒤로가기 버튼 제공
 */
export default function MediaAssetCreatePageHeader() {
  const router = useRouter();

  return (
    <header className="flex w-full justify-between p-2">
      <h2 className="text-2xl font-bold mt-2 p-4">Create New Video</h2>
      <IconButton onClick={() => router.back()}>
        <ArrowLeft />
      </IconButton>
    </header>
  );
}
