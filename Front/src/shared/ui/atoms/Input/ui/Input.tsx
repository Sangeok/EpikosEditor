interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ ...props }: InputProps) {
  return (
    <input
      className="w-full bg-zinc-800 focus:border-none focus:outline-none p-2 rounded-md text-sm pl-2 
                 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
                 [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0
                 [-moz-appearance:textfield]"
      {...props}
    />
  );
}
