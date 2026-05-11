import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type View = "influencer" | "brand" | "startup";

interface MobileHeaderProps {
  title: string;
  back?: boolean | (() => void);
  view?: View;
  right?: ReactNode;
  subtitle?: string;
}

const ViewChip = ({ view }: { view: View }) => {
  if (view === "brand") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-on-surface text-surface text-[10px] font-semibold">
        <span className="material-symbols-outlined !text-[12px]">domain</span>
        Enterprise
      </span>
    );
  }
  if (view === "startup") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-on-surface text-surface text-[10px] font-semibold">
        <span className="material-symbols-outlined !text-[12px]">rocket_launch</span>
        Startup
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface text-on-surface border border-on-surface text-[10px] font-semibold">
      <span className="material-symbols-outlined !text-[12px]">person</span>
      Influencer
    </span>
  );
};

export const MobileHeader = ({ title, back, view, right, subtitle }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (typeof back === "function") back();
    else navigate(-1);
  };

  return (
    <header className="sticky top-0 z-30 bg-background">
      <div className="h-16 px-4 flex items-center gap-2">
        {back ? (
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface"
            aria-label="뒤로"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
        ) : (
          <div className="w-2" />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-headline-md text-headline-md text-on-surface truncate">{title}</h1>
          {subtitle && (
            <p className="text-caption text-on-surface-variant truncate -mt-0.5">{subtitle}</p>
          )}
        </div>
        {view && <ViewChip view={view} />}
        {right && <div className="flex items-center gap-1">{right}</div>}
      </div>
    </header>
  );
};
