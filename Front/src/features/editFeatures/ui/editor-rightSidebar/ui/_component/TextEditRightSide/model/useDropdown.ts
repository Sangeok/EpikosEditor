"use client";

import { useRef, useState } from "react";

export function useDropdown<T extends HTMLElement = HTMLButtonElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<T | null>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, setIsOpen, open, close, toggle, triggerRef };
}
