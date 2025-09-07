import * as React from "react";

export type ButtonAppearance = "primary" | "inverse-surface" | "elevated" | "secondary" | "tertiary" | "outlined" | "tonal" | "text" | "destructive" | "none";;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: ButtonAppearance
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
