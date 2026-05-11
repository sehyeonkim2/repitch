import { useNavigate } from "react-router-dom";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const MENU_ITEMS = [
  { icon: "inventory_2", label: "등록 제품 관리", to: "/startup/upload" },
  { icon: "inbox", label: "역제안서 수령함", to: "/startup/inbox" },
  { icon: "chat_bubble", label: "채팅", to: "/startup/chat" },
  { icon: "help_outline", label: "도움말 & 문의", to: null },
  { icon: "logout", label: "처음 화면으로", to: "/" },
];

const StartupProfile = () => {
  const navigate = useNavigate();
  const { sampleProducts, startupInboxProposals } = useApp();

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader title="프로필" view="startup" />

      <main className="flex-1 px-4 py-4 pb-24 space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-on-surface flex items-center justify-center shrink-0">
            <Icon name="rocket_launch" size={30} className="!text-surface" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-headline-md text-headline-md text-on-surface">내 스타트업</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              Startup · Re:Pitch 파트너
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-center">
            <div className="text-2xl font-bold text-on-surface">{sampleProducts.length}</div>
            <div className="text-caption text-on-surface-variant mt-0.5">등록 제품</div>
          </div>
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-center">
            <div className="text-2xl font-bold text-on-surface">{startupInboxProposals.length}</div>
            <div className="text-caption text-on-surface-variant mt-0.5">받은 역제안</div>
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

export default StartupProfile;
