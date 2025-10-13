interface TextAreaProps extends React.ComponentProps<"textarea"> {
  value: string;
}

export default function TextArea({ ...props }: TextAreaProps) {
  return (
    <div className="flex w-full h-[100px] justify-center p-2">
      <textarea
        className="w-full rounded-md border border-gray-600 p-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
        {...props}
      />
    </div>
  );
}
