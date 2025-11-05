import * as React from "react";

export type ButtonAppearance = "primary" | "inverse-surface" | "elevated" | "secondary" | "tertiary" | "outlined" | "tonal" | "text" | "destructive" | "none";;
export type ButtonSize = "xs" | "s" | "m" | "l" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: ButtonAppearance,
  size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, appearance = "text", size = "s", type = "button", ...rest }, ref) => {
    return (
      <button
        className={`button ${className || ""}`}
        data-appearance={appearance} // Use data-attribute for custom prop
        data-size={size}
        type={type}
        ref={ref}
        {...rest}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
