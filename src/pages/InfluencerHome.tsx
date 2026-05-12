import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const DUMMY_ADS = [
  {
    id: "ad1",
    brand: "라운드랩",
    product: "1025 닥터어드벤처 크림",
    deadline: "2026-05-25",
    status: "촬영 중",
    fee: "150만원",
    platform: "Instagram",
    color: "#fce4f3",
  },
  {
    id: "ad2",
    brand: "닥터자르트",
    product: "시카페어 크림",
    deadline: "2026-06-10",
    status: "검토 중",
    fee: "120만원",
    platform: "YouTube",
    color: "#e8e8f8",
  },
];

const DUMMY_PROPOSALS = [
  {
    id: "recv1",
    brand: "이니스프리",
    product: "그린티 씨드 세럼",
    fee: "200만원",
    platform: "Instagram",
    receivedAt: "2026-05-11",
    color: "#e0f4ec",
  },
  {
    id: "recv2",
    brand: "핏바이트",
    product: "단백질 스낵바",
    fee: "80만원",
    platform: "YouTube",
    receivedAt: "2026-05-09",
    color: "#fef9e0",
  },
];

const STATUS_STYLE: Record<string, string> = {
  "촬영 중": "bg-primary/10 text-primary",
  "검토 중": "bg-surface-container-high text-on-surface-variant",
  "편집 중": "bg-secondary/10 text-secondary",
  "완료": "bg-surface-container text-on-surface",
};

const InfluencerHome = () => {
  const navigate = useNavigate();
  const { authScore } = useApp();
  const isAuthed = authScore !== null;

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader title="홈" view="influencer" />

      <main className="flex-1 px-4 py-4 pb-24 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-center">
            <div className="text-2xl font-bold text-on-surface">{DUMMY_PROPOSALS.length}</div>
            <div className="text-[10px] text-on-surface-variant mt-0.5">받은 역제안</div>
          </div>
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-center">
            <div className="text-2xl font-bold text-on-surface">{DUMMY_ADS.length}</div>
            <div className="text-[10px] text-on-surface-variant mt-0.5">진행중 광고</div>
          </div>
        </div>

        {/* ① 인증 섹션 */}
        <button
          type="button"
          onClick={() => navigate("/influencer/auth")}
          className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 flex items-center gap-3 active:scale-[0.98] transition-all text-left"
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isAuthed ? "bg-on-surface" : "bg-surface-container-low"
            }`}
          >
            <Icon
              name={isAuthed ? "verified_user" : "person_add"}
              size={20}
              filled={isAuthed}
              className={isAuthed ? "!text-surface" : "!text-on-surface-variant"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-label-sm text-label-sm text-on-surface">
              {isAuthed ? "인증 완료" : "인증 현황"}
            </div>
            <div className="text-[11px] text-on-surface-variant mt-0.5">
              {isAuthed
                ? `종합 점수 ${authScore.total}점 · ${authScore.tier} 등급`
                : "실사용자 인증을 완료하고 제안서를 보내세요"}
            </div>
          </div>
          {isAuthed ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <Icon name="check_circle" size={18} filled className="!text-secondary" />
              <Icon name="chevron_right" size={16} className="!text-on-surface-variant/50" />
            </div>
          ) : (
            <span className="shrink-0 bg-on-surface text-surface text-[11px] font-medium px-3 py-1.5 rounded-full">
              인증하기
            </span>
          )}
        </button>

        {/* ② 제안서 작성 섹션 */}
        <button
          type="button"
          onClick={() => navigate("/influencer/proposal-products")}
          className="w-full bg-on-surface rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 flex items-center gap-3 active:scale-[0.98] transition-all text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-surface/15 flex items-center justify-center shrink-0">
            <Icon name="draw" size={20} className="!text-surface" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-label-sm text-label-sm text-surface">제안서 작성</div>
            <div className="text-[11px] text-surface/60 mt-0.5">
              역제안서로 브랜드에게 직접 제안하기
            </div>
          </div>
          <Icon name="arrow_forward" size={18} className="!text-surface/50" />
        </button>

        {/* Ongoing ads */}
        <div>
          <div className="flex items-center justify-between mb-2 px-0.5">
            <span className="font-label-sm text-label-sm text-on-surface">진행중인 광고</span>
            <span className="text-caption text-primary">{DUMMY_ADS.length}건</span>
          </div>
          <div className="space-y-2">
            {DUMMY_ADS.map((ad, i) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.07)] p-4 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold text-on-surface/30"
                  style={{ backgroundColor: ad.color }}
                >
                  {ad.brand[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-label-sm text-label-sm text-on-surface truncate">{ad.product}</div>
                  <div className="text-[11px] text-on-surface-variant">{ad.brand} · {ad.platform}</div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">마감 {ad.deadline}</div>
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <span
                    className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      STATUS_STYLE[ad.status] ?? "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {ad.status}
                  </span>
                  <div className="text-[10px] text-on-surface-variant">{ad.fee}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent proposals received */}
        <div>
          <div className="flex items-center justify-between mb-2 px-0.5">
            <span className="font-label-sm text-label-sm text-on-surface">최근 받은 역제안</span>
            <span className="text-caption text-primary">{DUMMY_PROPOSALS.length}건</span>
          </div>
          <div className="space-y-2">
            {DUMMY_PROPOSALS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.07)] p-4 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold text-on-surface/30"
                  style={{ backgroundColor: p.color }}
                >
                  {p.brand[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-label-sm text-label-sm text-on-surface truncate">{p.product}</div>
                  <div className="text-[11px] text-on-surface-variant">{p.brand} · {p.platform}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[11px] font-semibold text-on-surface">{p.fee}</div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">{p.receivedAt}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfluencerHome;
