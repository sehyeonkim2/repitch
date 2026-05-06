import type { ReactNode } from "react";

interface StickyActionProps {
  children: ReactNode;
}

// Sticky bottom action bar. Sits inside the scroll container at the bottom,
// pinned via `sticky bottom-0`. Pages should add bottom padding to their
// content (e.g. pb-24) to avoid the last bit of content being hidden behind it.
export const StickyAction = ({ children }: StickyActionProps) => (
  <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur-sm border-t border-outline-variant px-4 py-3">
    {children}
  </div>
);
