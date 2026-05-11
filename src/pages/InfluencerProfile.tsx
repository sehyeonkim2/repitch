import { useNavigate } from "react-router-dom";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const MENU_ITEMS = [
  { icon: "verified_user", label: "인증 현황", to: "/influencer/auth" },
  { icon: "storefront", label: "Discover", to: "/influencer/samples" },
  { icon: "auto_awesome", label: "Studio", to: "/influencer/studio" },
  { icon: "chat_bubble", label: "채팅", to: "/influencer/chat" },
  { icon: "help_outline", label: "도움말 & 문의", to: null },
  { icon: "logout", label: "처음 화면으로", to: "/" },
];

const InfluencerProfile = () => {
  const navigate = useNavigate();
  const { authScore, submittedProposals } = useApp();
  const proposalCount = Object.keys(submittedProposals).length;

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader title="프로필" view="influencer" />

      <main className="flex-1 px-4 py-4 pb-24 space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface border-2 border-on-surface flex items-center justify-center shrink-0">
            <Icon name="person" size={30} className="!text-on-surface" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-headline-md text-headline-md text-on-surface">내 프로필</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              Influencer · Re:Pitch 크리에이터
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-center">
            <div className="text-2xl font-bold text-on-surface">
              {authScore ? Math.round(authScore.total) : "—"}
            </div>
            <div className="text-caption text-on-surface-variant mt-0.5">인증 점수</div>
          </div>
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-center">
            <div className="text-2xl font-bold text-on-surface">{proposalCount}</div>
            <div className="text-caption text-on-surface-variant mt-0.5">보낸 역제안</div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          {MENU_ITEMS.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => item.to && navigate(item.to)}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left active:bg-surface-container-low transition-colors ${
                i < MENU_ITEMS.length - 1 ? "border-b border-outline-variant/40" : ""
              } ${!item.to ? "opacity-50" : ""}`}
            >
              <Icon name={item.icon} size={20} className="!text-on-surface-variant shrink-0" />
              <span className="flex-1 font-label-sm text-label-sm text-on-surface">{item.label}</span>
              {item.to && (
                <Icon name="chevron_right" size={18} className="!text-on-surface-variant/50" />
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default InfluencerProfile;
