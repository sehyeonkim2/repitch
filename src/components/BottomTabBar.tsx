import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../state/AppContext";

type Tab = { to: string; end?: boolean; label: string; icon: string };

const INFLUENCER_TABS_BASE: Tab[] = [
  { to: "/influencer/auth", label: "인증", icon: "verified_user" },
  { to: "/influencer/samples", label: "Discover", icon: "storefront" },
];
const PROPOSAL_TAB: Tab = { to: "/influencer/proposal", label: "제안서", icon: "description" };

const BRAND_TABS: Tab[] = [
  { to: "/brand/matching", label: "매칭", icon: "groups" },
  { to: "/brand/chat", label: "Chat", icon: "chat_bubble" },
];

const STARTUP_TABS: Tab[] = [
  { to: "/brand/startup", end: true, label: "홈", icon: "home" },
  { to: "/brand/startup/upload", label: "제품등록", icon: "add_box" },
  { to: "/brand/startup/inbox", label: "수령함", icon: "inbox" },
  { to: "/brand/chat", label: "Chat", icon: "chat_bubble" },
];

const HIDE_PATTERNS = [
  /^\/$/,
  /^\/influencer\/proposal\/sent\//,
  /^\/brand\/inbox\//,
  /^\/brand\/campaign\//,
];

export const BottomTabBar = () => {
  const { pathname } = useLocation();
  const { authScore } = useApp();
  if (HIDE_PATTERNS.some((re) => re.test(pathname))) return null;

  const isAuthDone = authScore !== null && authScore.total > 0;

  let tabs: Tab[];
  if (pathname.startsWith("/influencer")) {
    tabs = isAuthDone
      ? [...INFLUENCER_TABS_BASE, PROPOSAL_TAB]
      : INFLUENCER_TABS_BASE;
  } else if (pathname.startsWith("/brand/startup")) {
    tabs = STARTUP_TABS;
  } else if (pathname.startsWith("/brand")) {
    tabs = BRAND_TABS;
  } else {
    return null;
  }

  return (
    <nav className="shrink-0 bg-background px-4 pb-5 pt-2">
      <ul
        className="grid h-[60px] bg-on-surface rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 h-full rounded-2xl transition-all ${
                  isActive ? "text-surface" : "text-surface/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined !text-[22px] ${
                      isActive ? "[font-variation-settings:'FILL'_1]" : ""
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
