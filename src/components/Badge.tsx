import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { Tier } from "../lib/scoring";

type Variant =
  | "verified"
  | "match-score"
  | "certified-real-user"
  | "tier"
  | "neutral"
  | "secondary";

interface BadgeProps {
  variant?: Variant;
  tier?: Tier;
  children?: ReactNode;
  icon?: string;
  className?: string;
}

const tierClass = (tier: Tier) => {
  switch (tier) {
    case "Gold":
      return "bg-tier-gold/10 text-tier-gold border border-tier-gold/30";
    case "Silver":
      return "bg-tier-silver/10 text-tier-silver border border-tier-silver/40";
    case "Bronze":
      return "bg-tier-bronze/10 text-tier-bronze border border-tier-bronze/40";
    default:
      return "bg-surface-container text-on-surface-variant border border-outline-variant";
  }
};

export const Badge = ({
  variant = "neutral",
  tier,
  children,
  icon,
  className = "",
}: BadgeProps) => {
  let base =
    "inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm";
  let variantClass = "";

  switch (variant) {
    case "verified":
      variantClass = "bg-secondary-container/40 text-on-secondary-container";
      icon = icon ?? "verified";
      break;
    case "match-score":
      variantClass =
        "bg-secondary-container/30 text-on-secondary-container border border-secondary/30";
      icon = icon ?? "hotel_class";
      break;
    case "certified-real-user":
      variantClass =
        "bg-primary-fixed text-on-primary-fixed-variant border border-primary/20 px-3 py-1.5";
      icon = icon ?? "shield_person";
      break;
    case "tier":
      variantClass = tierClass(tier ?? "None");
      break;
    case "secondary":
      variantClass =
        "bg-secondary-container/30 text-on-secondary-container border border-secondary/30";
      break;
    case "neutral":
    default:
      variantClass = "bg-surface-container text-on-surface-variant";
  }

  return (
    <span className={`${base} ${variantClass} ${className}`}>
      {icon && <Icon name={icon} filled className="!text-[16px]" size={16} />}
      {children}
    </span>
  );
};
