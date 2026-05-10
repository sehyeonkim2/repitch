import { useNavigate, useParams } from "react-router-dom";
import { MobileHeader } from "../components/MobileHeader";
import { StickyAction } from "../components/StickyAction";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const OBLIGATION_NOTICE = `본 제품은 샘플 체험 후 수령일로부터 2~3주 이내에\n아래 중 하나를 반드시 이행해야 합니다.\n\n① 광고 콘텐츠 업로드\n② 스타트업 측에 정성스러운 비공개 피드백 제출`;

const PENALTY_ITEMS = [
  "이행 평점 하락 및 투명 공개",
  "예치 포인트 차감 후 제품 원가 자동 정산",
  "플랫폼 내 샘플 신청 제한 패널티 적용",
];

const SampleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sampleProducts } = useApp();
  const product = sampleProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col min-h-full">
        <MobileHeader title="샘플 상세" back view="influencer" />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          <Icon name="storefront" size={48} className="!text-on-surface-variant" />
          <p className="font-body-md text-body-md text-on-surface mt-4">상품을 찾을 수 없습니다</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader title={product.productName} back view="influencer" subtitle={product.brandName} />

      <main className="flex-1 px-4 py-4 pb-28 space-y-4">
        {/* Thumbnail */}
        <div
          className="h-48 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: product.thumbnailColor }}
        >
          <span className="text-7xl font-bold text-on-surface/15 select-none">
            {product.brandName[0]}
          </span>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-surface-container-low rounded-full text-[11px] font-medium text-on-surface-variant">
              {product.category}
            </span>
            <span className="text-caption text-on-surface-variant">{product.brandName}</span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed">{product.description}</p>
        </div>

        {/* Appeal points */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4">
          <h2 className="font-label-sm text-label-sm text-on-surface mb-3 flex items-center gap-2">
            <Icon name="stars" size={16} filled />
            소구 포인트
          </h2>
          <ul className="space-y-2">
            {product.appealPoints.map((pt) => (
              <li key={pt} className="flex items-start gap-2 text-[13px] text-on-surface">
                <Icon name="check_circle" filled size={14} className="!text-primary mt-0.5 shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        </div>

        {/* Target customer */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4">
          <h2 className="font-label-sm text-label-sm text-on-surface mb-2 flex items-center gap-2">
            <Icon name="person_search" size={16} />
            타겟 고객층
          </h2>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">{product.targetCustomer}</p>
        </div>

        {/* Obligation notice */}
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="warning" filled size={18} className="!text-amber-600 shrink-0" />
            <span className="text-sm font-semibold text-amber-800">샘플 수령 후 의무 사항</span>
          </div>
          <p className="text-[12px] text-amber-900 leading-relaxed whitespace-pre-line mb-4">
            {OBLIGATION_NOTICE}
          </p>
          <div className="border-t border-amber-200 pt-3">
            <p className="text-[11px] font-semibold text-amber-900 mb-2">※ 미이행 시 패널티:</p>
            <ul className="space-y-1">
              {PENALTY_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-[11px] text-amber-900">
                  <span className="shrink-0 mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <StickyAction>
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon="description"
          onClick={() => navigate("/influencer/proposal")}
        >
          역제안서 보내기
        </Button>
      </StickyAction>
    </div>
  );
};

export default SampleDetail;
