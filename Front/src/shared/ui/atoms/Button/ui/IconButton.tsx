import { cn } from "@/shared/lib/utils";

interface IconButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
  isActive?: boolean;
}

export default function IconButton({
  children,
  isActive = false,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "p-2 hover:bg-white/20 rounded-lg cursor-pointer",
        isActive && "bg-gray-700"
      )}
      {...props}
    >
      {children}
    </button>
  );
}
