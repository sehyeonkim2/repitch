import type { ReactNode } from "react";

interface StickyActionProps {
  children: ReactNode;
}

// Sticky bottom action bar. Sits inside the scroll container at the bottom,
// pinned via `sticky bottom-0`. Pages should add bottom padding to their
// content (e.g. pb-24) to avoid the last bit of content being hidden behind it.
export const StickyAction = ({ children }: StickyActionProps) => (
  <div className="sticky bottom-0 z-20 bg-background px-5 py-4">
    {children}
  </div>
);
