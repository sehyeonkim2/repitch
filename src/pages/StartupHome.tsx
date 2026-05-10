import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const FEATURES = [
  {
    to: "/brand/startup/upload",
    icon: "add_box",
    label: "제품 올리기",
    desc: "샘플 제품을 등록하고\n인플루언서에게 노출",
    color: "#e8f4ff",
  },
  {
    to: "/brand/startup/inbox",
    icon: "inbox",
    label: "역제안서 수령함",
    desc: "인플루언서가 보낸\n역제안서 확인 및 응답",
    color: "#f0ffe8",
  },
  {
    to: "/brand/chat",
    icon: "chat_bubble",
    label: "채팅",
    desc: "매칭된 인플루언서와\n1:1 메시지",
    color: "#fff8e8",
  },
  {
    to: "/brand/startup/send",
    icon: "send",
    label: "역제안서 보내기",
    desc: "특정 인플루언서에게\n직접 제안서 발송",
    color: "#f8e8ff",
  },
];

const StartupHome = () => {
  const navigate = useNavigate();
  const { sampleProducts, submittedProposals } = useApp();
  const proposalCount = Object.keys(submittedProposals).length;

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader
        title="Startup 모드"
        view="brand"
        right={
          <button
            type="button"
            onClick={() => navigate("/brand/matching")}
            className="text-[11px] font-medium text-on-surface-variant bg-surface-container-low border border-outline-variant rounded-full px-3 py-1.5"
          >
            Enterprise 전환
          </button>
        }
      />

      <main className="flex-1 px-4 py-4 pb-24 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-center">
            <div className="text-2xl font-bold text-on-surface">{sampleProducts.length}</div>
            <div className="text-caption text-on-surface-variant mt-0.5">등록된 제품</div>
          </div>
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-center">
            <div className="text-2xl font-bold text-on-surface">{proposalCount}</div>
            <div className="text-caption text-on-surface-variant mt-0.5">받은 역제안서</div>
          </div>
        </div>

        {/* Feature cards 2×2 */}
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f, i) => (
            <motion.button
              key={f.to}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.06 }}
              type="button"
              onClick={() => navigate(f.to)}
              className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-left active:scale-[0.97] transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: f.color }}
              >
                <Icon name={f.icon} size={22} className="!text-on-surface" />
              </div>
              <div className="font-label-sm text-label-sm text-on-surface mb-1">{f.label}</div>
              <div className="text-[11px] text-on-surface-variant leading-relaxed whitespace-pre-line">
                {f.desc}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Registered products preview */}
        {sampleProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-sm text-label-sm text-on-surface">등록 제품</span>
              <button
                type="button"
                onClick={() => navigate("/brand/startup/upload")}
                className="text-caption text-primary font-medium"
              >
                + 추가
              </button>
            </div>
            <div className="space-y-2">
              {sampleProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold text-on-surface/30"
                    style={{ backgroundColor: p.thumbnailColor }}
                  >
                    {p.brandName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-on-surface truncate">{p.productName}</div>
                    <div className="text-[10px] text-on-surface-variant">{p.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StartupHome;
