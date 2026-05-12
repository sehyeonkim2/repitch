import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const InfluencerProposalProducts = () => {
  const navigate = useNavigate();
  const { authScore, sampleProducts } = useApp();
  const isAuthed = authScore !== null;

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader
        title="제안서 작성"
        back={() => navigate("/influencer/home")}
        view="influencer"
        subtitle="제안할 제품을 선택하세요"
      />

      <main className="flex-1 px-4 py-4 pb-24">
        {!isAuthed ? (
          /* 인증 미완료 */
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
              <Icon name="lock" size={36} className="!text-on-surface-variant" />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface mb-1">
              아직 인증된 제품이 없어요
            </p>
            <p className="text-caption text-on-surface-variant mb-6 leading-relaxed max-w-[240px]">
              먼저 인증을 완료해주세요!
            </p>
            <Button
              variant="primary"
              icon="verified_user"
              onClick={() => navigate("/influencer/auth")}
            >
              인증하러 가기
            </Button>
          </div>
        ) : sampleProducts.length === 0 ? (
          /* 인증 완료, 등록 제품 없음 */
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <Icon name="inventory_2" size={40} className="!text-on-surface-variant mb-3" />
            <p className="font-label-sm text-label-sm text-on-surface">제품이 없어요</p>
            <p className="text-caption text-on-surface-variant mt-1 max-w-[220px]">
              Discover에 새 제품이 등록되면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          /* 인증 완료, 제품 리스트 */
          <div className="space-y-3">
            <p className="text-[11px] text-on-surface-variant px-0.5 mb-1">
              총 {sampleProducts.length}개의 제품이 있습니다. 역제안서를 보낼 제품을 선택하세요.
            </p>
            {sampleProducts.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                type="button"
                onClick={() => navigate("/influencer/proposal")}
                className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.07)] text-left active:scale-[0.98] transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-lg font-bold text-on-surface/25"
                  style={{ backgroundColor: p.thumbnailColor }}
                >
                  {p.brandName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-label-sm text-label-sm text-on-surface truncate">
                    {p.productName}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    {p.brandName} · {p.category}
                  </div>
                  {p.appealPoints.length > 0 && (
                    <div className="text-[10px] text-on-surface-variant/70 mt-0.5 truncate">
                      {p.appealPoints.slice(0, 2).join(" · ")}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <span className="text-[11px] font-medium text-primary">작성하기</span>
                  <Icon name="arrow_forward_ios" size={12} className="!text-primary" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InfluencerProposalProducts;
