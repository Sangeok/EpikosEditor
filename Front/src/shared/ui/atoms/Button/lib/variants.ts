import { cva } from "class-variance-authority";

export const ButtonVariants = cva(
  "flex justify-center items-center px-4 py-1 rounded-md cursor-pointer transition-colors duration-200",
  {
    variants: {
      variant: {
        dark: "bg-black text-white dark-button-hover dark-border",
        light: "bg-white text-black hover:bg-gray-100 border border-gray-200",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
      },
    },
    defaultVariants: {
      variant: "dark",
      size: "md",
    },
  }
);
