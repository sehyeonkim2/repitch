import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type View = "influencer" | "brand";

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
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-semibold">
        <span className="material-symbols-outlined !text-[12px]">domain</span>
        브랜드
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container border border-secondary/30 text-[10px] font-semibold">
      <span className="material-symbols-outlined !text-[12px]">person</span>
      인플루언서
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
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-outline-variant">
      <div className="h-14 px-3 flex items-center gap-2">
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
