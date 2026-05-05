import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface GaugeProps {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export const Gauge = ({
  value,
  max = 100,
  size = 200,
  stroke = 14,
  label,
  sublabel,
}: GaugeProps) => {
  const [display, setDisplay] = useState(0);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useMotionValue(0);
  const dashOffset = useTransform(
    progress,
    (p: number) => circumference - (p / max) * circumference,
  );

  useEffect(() => {
    const controls = animate(progress, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest: number) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, progress]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-surface-container-high"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          className="text-primary"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display-kpi text-display-kpi text-on-surface leading-none">
          {display}
        </span>
        {label && (
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-2">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="font-caption text-caption text-on-surface-variant mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
