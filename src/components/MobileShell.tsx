import type { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";

interface MobileShellProps {
  children: ReactNode;
}

// Phone-frame wrapper. Below 640px: full-bleed. Above 640px: a centered
// max-w-[440px] phone-shaped card on a muted background — looks intentional
// on a projector during the demo. The BottomTabBar lives inside the frame
// and decides per-route whether to render itself.
export const MobileShell = ({ children }: MobileShellProps) => (
  <div className="min-h-screen bg-surface-dim sm:py-6 flex justify-center sm:items-center">
    <div className="relative w-full max-w-[440px] bg-background flex flex-col min-h-screen sm:min-h-0 sm:h-[844px] sm:rounded-[2.5rem] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] sm:overflow-hidden sm:border sm:border-outline-variant/40">
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
      <BottomTabBar />
    </div>
  </div>
);
