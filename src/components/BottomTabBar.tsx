import { NavLink, useLocation } from "react-router-dom";

const TABS = [
  { to: "/", end: true, label: "인증", icon: "verified_user" },
  { to: "/matching", end: false, label: "매칭", icon: "groups" },
  { to: "/proposal", end: false, label: "제안서", icon: "description" },
] as const;

const HIDE_PATTERNS = [
  /^\/proposal\/sent\//,
  /^\/brand\/inbox\//,
  /^\/brand\/campaign\//,
];

export const BottomTabBar = () => {
  const { pathname } = useLocation();
  const hidden = HIDE_PATTERNS.some((re) => re.test(pathname));
  if (hidden) return null;

  return (
    <nav className="shrink-0 border-t border-outline-variant bg-surface-container-lowest/95 backdrop-blur-sm">
      <ul className="grid grid-cols-3 h-16">
        {TABS.map((tab) => (
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
