import { NavLink, useLocation } from "react-router-dom";

type Tab = { to: string; end?: boolean; label: string; icon: string };

const INFLUENCER_TABS: Tab[] = [
  { to: "/influencer/home", end: true, label: "홈", icon: "home" },
  { to: "/influencer/samples", label: "Samples", icon: "storefront" },
  { to: "/influencer/studio", label: "Studio", icon: "auto_awesome" },
  { to: "/influencer/chat", label: "Chat", icon: "chat_bubble" },
  { to: "/influencer/profile", label: "프로필", icon: "person" },
];

const BRAND_TABS: Tab[] = [
  { to: "/brand/matching", label: "매칭", icon: "groups" },
  { to: "/brand/dashboard", label: "Dashboard", icon: "bar_chart" },
  { to: "/brand/chat", label: "Chat", icon: "chat_bubble" },
  { to: "/brand/profile", label: "프로필", icon: "person" },
];

const STARTUP_TABS: Tab[] = [
  { to: "/startup/home", end: true, label: "홈", icon: "home" },
  { to: "/startup/inbox", label: "수령함", icon: "inbox" },
  { to: "/startup/chat", label: "Chat", icon: "chat_bubble" },
  { to: "/startup/profile", label: "프로필", icon: "person" },
];

const HIDE_PATTERNS = [
  /^\/$/,
  /^\/influencer\/proposal\/sent\//,
  /^\/influencer\/chat\/.+/,
  /^\/brand\/inbox\//,
  /^\/brand\/campaign\//,
  /^\/brand\/ad\//,
  /^\/brand\/chat\/.+/,
  /^\/startup\/inbox\/.+/,
  /^\/startup\/chat\/.+/,
];

export const BottomTabBar = () => {
  const { pathname } = useLocation();
  if (HIDE_PATTERNS.some((re) => re.test(pathname))) return null;

  let tabs: Tab[];
  if (pathname.startsWith("/influencer")) {
    tabs = INFLUENCER_TABS;
  } else if (pathname.startsWith("/startup")) {
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
                  isActive ? "text-primary" : "text-surface/50"
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
