import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileHeader } from "../components/MobileHeader";
import { StickyAction } from "../components/StickyAction";
import { Button } from "../components/Button";
import { useApp } from "../state/AppContext";
import { influencers } from "../data/influencers";

// Top 20 influencers for the dropdown
const INFLUENCER_OPTIONS = influencers.slice(0, 20);

const selectClass =
  "w-full h-12 appearance-none bg-surface-container-low border border-outline-variant rounded-2xl pl-4 pr-10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface cursor-pointer";
const inputClass =
  "w-full h-12 px-4 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface";
const labelClass = "block text-[12px] font-medium text-on-surface mb-1.5";

const StartupSendProposal = () => {
  const navigate = useNavigate();
  const { sampleProducts, createChatRoom } = useApp();

  const [influencerId, setInfluencerId] = useState(INFLUENCER_OPTIONS[0]?.id ?? "");
  const [productId, setProductId] = useState(sampleProducts[0]?.id ?? "");
  const [budget, setBudget] = useState("");
  const [format, setFormat] = useState("");
  const [memo, setMemo] = useState("");

  const canSubmit = influencerId && budget.trim();

  const handleSend = () => {
    if (!canSubmit) return;

    const inf = INFLUENCER_OPTIONS.find((i) => i.id === influencerId);
    const product = sampleProducts.find((p) => p.id === productId);
    if (!inf) return;

    const proposalId = `startup_prop_${Date.now()}`;
    const initialMsg = [
      `안녕하세요, @${inf.handle}님!`,
      product ? `${product.brandName}의 [${product.productName}] 관련 협업을 제안드립니다.` : "",
      budget ? `제안 보수: ${budget}` : "",
      format ? `콘텐츠 형태: ${format}` : "",
      memo ? `\n${memo}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const roomId = createChatRoom(proposalId, inf, initialMsg);
    navigate(`/brand/chat/${roomId}`);
  };

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader
        title="역제안서 보내기"
        back={() => navigate("/brand/startup")}
        view="brand"
        subtitle="인플루언서에게 직접 제안"
      />

      <main className="flex-1 px-4 py-4 pb-28 space-y-4">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 space-y-4">
          {/* Influencer select */}
          <div>
            <label className={labelClass}>인플루언서 선택 *</label>
            <div className="relative">
              <select
                className={selectClass}
                value={influencerId}
                onChange={(e) => setInfluencerId(e.target.value)}
              >
                {INFLUENCER_OPTIONS.map((inf) => (
                  <option key={inf.id} value={inf.id}>
                    @{inf.handle} · {inf.followers.toLocaleString("ko-KR")}명
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline !text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Product select */}
          {sampleProducts.length > 0 && (
            <div>
              <label className={labelClass}>제품 선택</label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                >
                  {sampleProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.productName} ({p.brandName})
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline !text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          )}

          {/* Budget */}
          <div>
            <label className={labelClass}>제안 보수 *</label>
            <input
              className={inputClass}
              placeholder="예: 150만원, 협의 가능"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          {/* Content format */}
          <div>
            <label className={labelClass}>콘텐츠 형태</label>
            <input
              className={inputClass}
              placeholder="예: 릴스 1편 + 스토리 2회"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            />
          </div>

          {/* Additional memo */}
          <div>
            <label className={labelClass}>추가 메모</label>
            <textarea
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface resize-none"
              rows={3}
              placeholder="전달하고 싶은 내용을 자유롭게 작성해 주세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 p-3 text-caption text-on-surface-variant leading-relaxed">
          제안서 발송 시 채팅방이 자동 생성됩니다. 인플루언서가 확인 후 답변을 드립니다.
        </div>
      </main>

      <StickyAction>
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon="send"
          disabled={!canSubmit}
          onClick={handleSend}
        >
          역제안서 보내기
        </Button>
      </StickyAction>
    </div>
  );
};

export default StartupSendProposal;
