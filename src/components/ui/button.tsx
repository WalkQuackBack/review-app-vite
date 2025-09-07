import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: "primary" | "inverse-surface" | "secondary" | "tertiary" | "outlined" | "tonal" | "text" | "none";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, appearance = "primary", type = "button", ...rest }, ref) => {
    return (
      <button
        className={`button ${className || ""}`}
        data-appearance={appearance} // Use data-attribute for custom prop
        type={type}
        ref={ref}
        {...rest}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
