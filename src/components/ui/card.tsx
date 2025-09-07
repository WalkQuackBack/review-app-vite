import * as React from "react";

function Card({ className, interactable, ...props }: React.HTMLAttributes<HTMLElement> & { interactable: boolean }) {
  return interactable ? (
    <button
      className={`card ${className || ""}`}
      data-interactable="true"
      {...props}>
    </button>
  ) : (
    <div
      className={`card ${className || ""}`}
      data-interactable="false"
      {...props}>
    </div>
  );
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`card-content ${className || ""}`}
      {...props}
    />
  );
}

export { Card, CardContent };