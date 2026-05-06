import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

type View = "influencer" | "brand" | "neutral";

interface TopNavProps {
  view?: View;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-label-sm text-label-sm tracking-tight px-2 py-1 rounded-lg transition-colors ${
    isActive
      ? "text-primary border-b-2 border-primary pb-1"
      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block font-body-md text-body-md px-4 py-3 rounded-lg ${
    isActive
      ? "bg-primary-fixed text-on-primary-fixed-variant"
      : "text-on-surface hover:bg-surface-container-low"
  }`;

const ViewChip = ({ view, mobile = false }: { view: Exclude<View, "neutral">; mobile?: boolean }) => {
  const baseClasses = mobile
    ? "flex items-center gap-2 px-3 py-1 rounded-full"
    : "hidden md:flex items-center gap-2 px-3 py-1 rounded-full";
  if (view === "brand") {
    return (
      <div className={`${baseClasses} bg-on-surface text-surface`}>
        <span className="material-symbols-outlined !text-[16px]">domain</span>
        <span className="font-label-sm text-label-sm">브랜드 담당자 뷰</span>
      </div>
    );
  }
  return (
    <div className={`${baseClasses} bg-surface text-on-surface border border-on-surface`}>
      <span className="material-symbols-outlined !text-[16px]">person</span>
      <span className="font-label-sm text-label-sm">인플루언서 뷰</span>
    </div>
  );
};

export const TopNav = ({ view = "neutral" }: TopNavProps) => {
  const isBrand = view === "brand";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant shadow-sm">
      <div className="flex justify-between items-center px-4 sm:px-6 h-16 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-xl font-black text-primary tracking-tighter"
          >
            Re:Pitch
          </Link>
          <div className="hidden md:flex gap-2">
            <NavLink to="/" end className={navLinkClass}>
              인증
            </NavLink>
            <NavLink to="/matching" className={navLinkClass}>
              AI 매칭
            </NavLink>
            <NavLink to="/proposal" className={navLinkClass}>
              제안서 작성
            </NavLink>
          </div>
          {view !== "neutral" && <ViewChip view={view} />}
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {isBrand ? (
            <Link
              to="/"
              className="hidden sm:inline-block font-label-sm text-label-sm text-on-surface-variant hover:text-primary px-3 py-2 rounded-lg"
            >
              인플루언서 뷰로 돌아가기
            </Link>
          ) : (
            <button className="hidden sm:inline-block bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm px-4 py-2 rounded-lg shadow-sm">
              사용자 인증
            </button>
          )}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-surface-container-low text-on-surface"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
          >
            <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface-container-lowest px-4 py-3 space-y-1">
          {view !== "neutral" && (
            <div className="pb-3 border-b border-outline-variant mb-2">
              <ViewChip view={view} mobile />
            </div>
          )}
          <NavLink to="/" end className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            인증
          </NavLink>
          <NavLink to="/matching" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            AI 매칭
          </NavLink>
          <NavLink to="/proposal" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            제안서 작성
          </NavLink>
          <div className="pt-2 mt-2 border-t border-outline-variant">
            {isBrand ? (
              <Link
                to="/"
                className="block font-body-md text-body-md text-on-surface-variant px-4 py-3 rounded-lg hover:bg-surface-container-low"
                onClick={() => setMenuOpen(false)}
              >
                인플루언서 뷰로 돌아가기
              </Link>
            ) : (
              <button
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm px-4 py-3 rounded-lg shadow-sm"
                onClick={() => setMenuOpen(false)}
              >
                사용자 인증
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
