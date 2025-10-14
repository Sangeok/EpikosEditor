import { cn } from "@/shared/lib/utils";

interface TextAreaProps extends React.ComponentProps<"textarea"> {
  value: string;
}

export default function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <div className="flex w-full min-h-[100px] justify-center text-sm">
      <textarea
        className={cn(
          "w-full rounded-md border border-gray-600 p-2 focus:outline-none focus:ring-1 focus:ring-gray-400",
          className
        )}
        {...props}
      />
    </div>
  );
}
