interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

export const Icon = ({ name, className = "", filled = false, size }: IconProps) => {
  const style = size ? { fontSize: `${size}px` } : undefined;
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined ${filled ? "filled" : ""} ${className}`}
      style={style}
    >
      {name}
    </span>
  );
};
