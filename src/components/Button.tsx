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
    "bg-primary hover:bg-[#4a5ce4] text-on-primary shadow-[0_4px_16px_rgba(91,110,245,0.3)] disabled:bg-surface-container-high disabled:text-on-surface-variant disabled:cursor-not-allowed disabled:shadow-none",
  secondary:
    "bg-white border-2 border-primary text-primary hover:bg-surface-container-low shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container-low",
  danger:
    "bg-error hover:bg-error/90 text-on-error shadow-[0_4px_16px_rgba(220,38,38,0.25)]",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-4 font-label-sm text-label-sm",
  md: "h-11 px-5 font-label-sm text-label-sm",
  lg: "h-14 px-7 font-label-sm text-label-sm text-[15px]",
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
      className={`inline-flex items-center justify-center gap-2 rounded-full transition-all active:scale-[0.97] font-medium ${
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
