import { forwardRef } from "react";
import { ButtonVariants } from "../lib/variants";

interface ButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
  variant?: "dark" | "light";
  size?: "sm" | "md";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "dark", size = "md", ...props }, ref) => {
    return (
      <button ref={ref} className={ButtonVariants({ variant, size, className })} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
