import { useNavigate, useParams } from "react-router-dom";
import { MobileHeader } from "../components/MobileHeader";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { dummyAds, type AdStatus } from "../data/enterpriseDummyData";

const STATUS_STYLE: Record<AdStatus, string> = {
  진행중: "bg-[#e8f4ff] text-[#1a6fb0]",
  검토중: "bg-[#fff8e8] text-[#a06a00]",
  완료: "bg-[#edfaf3] text-[#1a7a4a]",
};

const EnterpriseAdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ad = dummyAds.find((a) => a.id === id);

  if (!ad) {
    return (
      <div className="flex flex-col min-h-full">
        <MobileHeader title="광고 상세" back={() => navigate("/brand/dashboard")} view="brand" />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          <Icon name="campaign" size={48} className="!text-on-surface-variant" />
          <p className="font-body-md text-body-md text-on-surface mt-4">광고를 찾을 수 없습니다</p>
          <Button variant="primary" icon="arrow_back" onClick={() => navigate("/brand/dashboard")} className="mt-6">
            돌아가기
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader
        title="광고 상세"
        back={() => navigate("/brand/dashboard")}
        view="brand"
        subtitle={`${ad.brandName} × @${ad.influencerHandle}`}
      />

      <main className="flex-1 px-4 py-4 pb-28 space-y-4">
        {/* 인플루언서 정보 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container shrink-0">
              <img
                src={ad.influencerAvatar}
                alt={ad.influencerHandle}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-sm text-label-sm text-on-surface">@{ad.influencerHandle}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[ad.status]}`}>
                  {ad.status}
                </span>
              </div>
              <p className="text-caption text-on-surface-variant mt-0.5">{ad.influencerName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-caption">
            <div className="bg-surface-container-low rounded-xl p-2">
              <div className="text-on-surface-variant">팔로워</div>
              <div className="text-on-surface font-semibold">{ad.influencerFollowers.toLocaleString("ko-KR")}명</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-2">
              <div className="text-on-surface-variant">채널</div>
              <div className="text-on-surface font-semibold">{ad.influencerChannel}</div>
            </div>
          </div>
        </div>

        {/* 광고 조건 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="local_offer" size={18} className="!text-on-surface" />
            <span className="font-label-sm text-label-sm text-on-surface">광고 조건</span>
          </div>
          <div className="space-y-2 text-caption">
            {[
              { label: "제품명", value: ad.productName },
              { label: "브랜드", value: ad.brandName },
              { label: "기간", value: `${ad.startDate} ~ ${ad.endDate}` },
              { label: "보수", value: ad.budget },
              { label: "콘텐츠 형태", value: ad.contentFormat },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start">
                <span className="text-on-surface-variant">{label}</span>
                <span className="text-on-surface font-medium text-right max-w-[55%]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 진행 상태 타임라인 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="timeline" size={18} className="!text-on-surface" />
            <span className="font-label-sm text-label-sm text-on-surface">진행 상태</span>
          </div>
          <div className="space-y-0">
            {ad.timeline.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      step.done ? "bg-on-surface" : "bg-surface-container-high"
                    }`}
                  >
                    {step.done ? (
                      <Icon name="check" size={14} className="!text-surface" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                    )}
                  </div>
                  {i < ad.timeline.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${step.done ? "bg-on-surface/30" : "bg-outline-variant/40"}`} />
                  )}
                </div>
                <div className="flex-1 pt-1 pb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[12px] font-medium ${step.done ? "text-on-surface" : "text-on-surface-variant"}`}>
                      {step.label}
                    </span>
                    {step.date && (
                      <span className="text-[10px] text-on-surface-variant">{step.date}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="analytics" size={18} className="!text-on-surface" />
            <span className="font-label-sm text-label-sm text-on-surface">개별 KPI</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-caption">
            <div className="bg-surface-container-low rounded-xl p-3 text-center">
              <div className="text-on-surface-variant mb-0.5">노출수</div>
              <div className="font-headline-md text-headline-md text-on-surface">
                {ad.kpi.views.toLocaleString("ko-KR")}
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 text-center">
              <div className="text-on-surface-variant mb-0.5">CTR</div>
              <div className="font-headline-md text-headline-md text-on-surface">{ad.kpi.ctr}%</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 text-center">
              <div className="text-on-surface-variant mb-0.5">전환율</div>
              <div className="font-headline-md text-headline-md text-on-surface">{ad.kpi.conversion}%</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 text-center">
              <div className="text-on-surface-variant mb-0.5">ROI</div>
              <div className="font-headline-md text-headline-md text-on-surface">{ad.kpi.roi}%</div>
            </div>
          </div>
        </div>
      </main>

      {/* 채팅 바로가기 */}
      <div className="sticky bottom-0 bg-background px-4 pb-5 pt-3">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon="chat_bubble"
          onClick={() => navigate("/brand/chat")}
        >
          채팅 바로가기
        </Button>
      </div>
    </div>
  );
};

export default EnterpriseAdDetail;
