import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconRight?: string;
  fullWidth?: boolean;
  children?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-primary hover:bg-primary-container text-on-primary shadow-sm disabled:bg-surface-container-high disabled:text-on-surface-variant disabled:cursor-not-allowed",
  secondary:
    "bg-surface-container-lowest border-2 border-primary text-primary hover:bg-primary-fixed",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container-low",
  danger:
    "bg-error hover:bg-error/90 text-on-error",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-3 font-label-sm text-label-sm",
  md: "h-11 px-4 font-label-sm text-label-sm",
  lg: "h-12 px-6 font-label-sm text-label-sm",
};

export const Button = ({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  fullWidth = false,
  className = "",
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors font-medium ${
        variantClass[variant]
      } ${sizeClass[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} />}
    </button>
  );
};
