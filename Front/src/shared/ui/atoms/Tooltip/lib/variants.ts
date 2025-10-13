import { cva } from "class-variance-authority";

export const TooltipPortalVariants = cva(
  "fixed z-[9999] text-sm font-medium rounded-lg transition-all duration-200 pointer-events-none",
  {
    variants: {
      size: {
        sm: "text-sm px-3 py-2",
        md: "text-md px-4 py-3",
      },
      theme: {
        dark: "bg-black text-white border dark-border",
        light: "bg-white text-gray-900 border dark-border shadow-lg",
      },
      position: {
        top: "transform -translate-x-1/2 -translate-y-full",
        bottom: "transform -translate-x-1/2 translate-y-2",
        left: "transform -translate-x-full -translate-y-1/2 -translate-x-2",
        right: "transform translate-x-2 -translate-y-1/2",
      },
      visible: {
        true: "opacity-100 visible",
        false: "opacity-0 invisible",
      },
    },
    defaultVariants: {
      size: "md",
      theme: "dark",
      position: "top",
      visible: false,
    },
  }
);
