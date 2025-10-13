"use client";

import React from "react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "There is no element." }: EmptyStateProps) {
  return (
    <div className="absolute top-0 w-full h-full flex items-center justify-center text-gray-500 text-sm">{message}</div>
  );
}
