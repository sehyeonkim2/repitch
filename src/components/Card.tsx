import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: "primary" | "secondary" | "tertiary";
}

export const Card = ({ children, accent, className = "", ...rest }: CardProps) => {
  const accentClass =
    accent === "primary"
      ? "before:bg-primary"
      : accent === "secondary"
        ? "before:bg-secondary"
        : accent === "tertiary"
          ? "before:bg-tertiary"
          : "";
  const accentLayer = accent
    ? `before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:rounded-l-xl ${accentClass}`
    : "";
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${accentLayer} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
