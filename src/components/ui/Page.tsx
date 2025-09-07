import * as React from "react";
// import "../../styles/Page.css";

export function Page({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`page ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}