import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { dummyAds, enterpriseKpi, type AdStatus } from "../data/enterpriseDummyData";

const KPI_CARDS = [
  { label: "총 노출수", value: enterpriseKpi.totalViews.toLocaleString("ko-KR"), unit: "회", icon: "visibility" },
  { label: "평균 CTR", value: `${enterpriseKpi.avgCtr}`, unit: "%", icon: "ads_click" },
  { label: "평균 전환율", value: `${enterpriseKpi.avgConversion}`, unit: "%", icon: "conversion_path" },
  { label: "평균 ROI", value: `${enterpriseKpi.totalRoi}`, unit: "%", icon: "trending_up" },
];

const STATUS_STYLE: Record<AdStatus, string> = {
  진행중: "bg-[#e8f4ff] text-[#1a6fb0]",
  검토중: "bg-[#fff8e8] text-[#a06a00]",
  완료: "bg-[#edfaf3] text-[#1a7a4a]",
};

const EnterpriseDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader title="Dashboard" view="brand" />

      <main className="flex-1 px-4 py-4 pb-24 space-y-5">
        {/* ① KPI 섹션 */}
        <section>
          <p className="font-label-sm text-label-sm text-on-surface mb-3">전체 KPI</p>
          <div className="grid grid-cols-2 gap-3">
            {KPI_CARDS.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon name={k.icon} size={16} className="!text-on-surface-variant" />
                  <span className="text-[11px] text-on-surface-variant">{k.label}</span>
                </div>
                <div className="flex items-end gap-0.5">
                  <span className="text-2xl font-bold text-on-surface">{k.value}</span>
                  <span className="text-[12px] text-on-surface-variant mb-0.5">{k.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ② 진행 중인 광고 리스트 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="font-label-sm text-label-sm text-on-surface">진행 중인 광고</p>
            <span className="text-caption text-on-surface-variant">{dummyAds.length}건</span>
          </div>
          <div className="space-y-3">
            {dummyAds.map((ad, i) => (
              <motion.button
                key={ad.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                type="button"
                onClick={() => navigate(`/brand/ad/${ad.id}`)}
                className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 text-left active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container shrink-0">
                    <img
                      src={ad.influencerAvatar}
                      alt={ad.influencerHandle}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface truncate">
                        @{ad.influencerHandle}
                      </span>
                      <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[ad.status]}`}>
                        {ad.status}
                      </span>
                    </div>
                    <p className="text-caption text-on-surface-variant truncate">{ad.productName}</p>
                  </div>
                  <Icon name="chevron_right" size={16} className="!text-on-surface-variant/50 shrink-0" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-surface-container-low rounded-xl p-2 text-center">
                    <div className="text-on-surface-variant">노출</div>
                    <div className="font-semibold text-on-surface">
                      {(ad.kpi.views / 10000).toFixed(1)}만
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-2 text-center">
                    <div className="text-on-surface-variant">CTR</div>
                    <div className="font-semibold text-on-surface">{ad.kpi.ctr}%</div>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-2 text-center">
                    <div className="text-on-surface-variant">ROI</div>
                    <div className="font-semibold text-on-surface">{ad.kpi.roi}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-2.5">
                  <Icon name="schedule" size={12} className="!text-on-surface-variant" />
                  <span className="text-[11px] text-on-surface-variant">
                    {ad.startDate} ~ {ad.endDate}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EnterpriseDashboard;
