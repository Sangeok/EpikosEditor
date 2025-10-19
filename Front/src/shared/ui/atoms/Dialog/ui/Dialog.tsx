"use client";

import React from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children, title, size = "md" }) => {
  if (!open) return null;

  const sizeClass =
    size === "sm"
      ? "max-w-sm"
      : size === "md"
      ? "max-w-md"
      : size === "lg"
      ? "max-w-lg"
      : size === "xl"
      ? "max-w-xl"
      : size === "2xl"
      ? "max-w-2xl"
      : size === "3xl"
      ? "max-w-3xl"
      : size === "4xl"
      ? "max-w-4xl"
      : size === "5xl"
      ? "max-w-5xl"
      : "max-w-md";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog Content */}
      <div
        className={`relative bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg ${sizeClass} w-full mx-4 max-h-[90vh] overflow-auto`}
      >
        {title && (
          <div className="px-6 py-4 border-b border-zinc-700">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
