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

const ViewChip = ({ view }: { view: Exclude<View, "neutral"> }) => {
  if (view === "brand") {
    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
        <span className="material-symbols-outlined !text-[16px]">domain</span>
        <span className="font-label-sm text-label-sm">브랜드 담당자 뷰</span>
      </div>
    );
  }
  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container border border-secondary/30">
      <span className="material-symbols-outlined !text-[16px]">person</span>
      <span className="font-label-sm text-label-sm">인플루언서 뷰</span>
    </div>
  );
};

export const TopNav = ({ view = "neutral" }: TopNavProps) => {
  const isBrand = view === "brand";
  return (
    <nav className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant shadow-sm">
      <div className="flex justify-between items-center px-6 h-16 max-w-[1920px] mx-auto">
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
        <div className="flex items-center gap-4">
          {isBrand ? (
            <Link
              to="/"
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary px-3 py-2 rounded-lg"
            >
              인플루언서 뷰로 돌아가기
            </Link>
          ) : (
            <button className="bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm px-4 py-2 rounded-lg shadow-sm">
              사용자 인증
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
