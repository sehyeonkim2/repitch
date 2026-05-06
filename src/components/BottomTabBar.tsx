import { NavLink, useLocation } from "react-router-dom";

type Tab = { to: string; end?: boolean; label: string; icon: string };

const INFLUENCER_TABS: Tab[] = [
  { to: "/influencer/auth", label: "인증", icon: "verified_user" },
  { to: "/influencer/proposal", label: "제안서", icon: "description" },
];

const BRAND_TABS: Tab[] = [
  { to: "/brand/matching", label: "매칭", icon: "groups" },
];

const HIDE_PATTERNS = [
  /^\/$/,
  /^\/influencer\/proposal\/sent\//,
  /^\/brand\/inbox\//,
  /^\/brand\/campaign\//,
];

export const BottomTabBar = () => {
  const { pathname } = useLocation();
  if (HIDE_PATTERNS.some((re) => re.test(pathname))) return null;

  let tabs: Tab[];
  if (pathname.startsWith("/influencer")) tabs = INFLUENCER_TABS;
  else if (pathname.startsWith("/brand")) tabs = BRAND_TABS;
  else return null;

  return (
    <nav className="shrink-0 border-t border-outline-variant bg-surface-container-lowest/95 backdrop-blur-sm">
      <ul
        className="grid h-16"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined !text-[24px] ${
                      isActive ? "[font-variation-settings:'FILL'_1]" : ""
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span className="text-[11px] font-medium">{tab.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
