import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TopNav } from "../components/TopNav";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";
import {
  binMetrics,
  generateContentPosts,
  generateDailyMetrics,
  type Granularity,
} from "../data/campaignMetrics";

const formatNumber = (n: number) => n.toLocaleString("ko-KR");

const formatDelta = (n: number) => {
  if (n === 0) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString("ko-KR")}`;
};

const GRANULARITIES: Granularity[] = ["일간", "주간", "월간"];

const CampaignDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { submittedProposals } = useApp();
  const proposal = id ? submittedProposals[id] : undefined;
  const [gran, setGran] = useState<Granularity>("일간");

  const dailyData = useMemo(
    () => (id ? generateDailyMetrics(id) : []),
    [id],
  );

  const chartData = useMemo(() => binMetrics(dailyData, gran), [dailyData, gran]);

  const posts = useMemo(
    () => (proposal && id ? generateContentPosts(id, proposal.input.플랫폼) : []),
    [id, proposal],
  );

  const totals = useMemo(() => {
    const last = dailyData[dailyData.length - 1];
    return {
      views: last?.views ?? 0,
      likes: last?.likes ?? 0,
      comments: last?.comments ?? 0,
    };
  }, [dailyData]);

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <TopNav view="brand" />
        <main className="max-w-3xl mx-auto px-margin py-xl text-center">
          <Icon name="analytics" size={48} className="!text-on-surface-variant" />
          <h1 className="font-headline-lg text-headline-lg text-on-surface mt-4">
            캠페인을 찾을 수 없습니다
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 mb-6">
            먼저 받은 제안서를 수락해야 캠페인 성과를 확인할 수 있습니다.
          </p>
          <Button variant="primary" icon="arrow_back" onClick={() => navigate("/matching")}>
            매칭 화면으로 이동
          </Button>
        </main>
      </div>
    );
  }

  const inf = proposal.influencer;
  const acceptedAt = new Date(proposal.createdAt).toLocaleDateString("ko-KR");

  return (
    <div className="bg-surface-container-low min-h-screen pt-16">
      <TopNav view="brand" />

      <main className="max-w-7xl mx-auto px-margin py-lg space-y-lg">
        {/* Header card */}
        <Card className="p-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-surface-container-high bg-surface-container shrink-0">
                <img
                  src={inf.avatarUrl}
                  alt={inf.handle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-caption text-on-surface-variant mb-1">
                  <Icon name="campaign" size={16} />
                  <span>캠페인 진행 중 · 수락일 {acceptedAt}</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface truncate">
                  {proposal.brand.name} × @{inf.handle}
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 truncate">
                  {proposal.input.콘텐츠_포맷} · {proposal.input.플랫폼} · {proposal.input.타겟_소구점}
                </p>
              </div>
            </div>
            <Badge variant="secondary" icon="trending_up">
              데이터 라이브
            </Badge>
          </div>
        </Card>

        {/* KPI summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          <Card className="p-md">
            <div className="text-caption text-on-surface-variant">누적 조회수</div>
            <div className="font-headline-lg text-headline-lg text-on-surface mt-1">
              {formatNumber(totals.views)}
            </div>
          </Card>
          <Card className="p-md">
            <div className="text-caption text-on-surface-variant">누적 좋아요</div>
            <div className="font-headline-lg text-headline-lg text-on-surface mt-1">
              {formatNumber(totals.likes)}
            </div>
          </Card>
          <Card className="p-md">
            <div className="text-caption text-on-surface-variant">누적 댓글</div>
            <div className="font-headline-lg text-headline-lg text-on-surface mt-1">
              {formatNumber(totals.comments)}
            </div>
          </Card>
          <Card className="p-md">
            <div className="text-caption text-on-surface-variant">콘텐츠</div>
            <div className="font-headline-lg text-headline-lg text-on-surface mt-1">
              {posts.length}건
            </div>
          </Card>
        </div>

        {/* Section 1 — 한눈에 보는 현황 그래프 */}
        <Card className="p-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                한눈에 보는 현황 그래프
              </h2>
              <p className="font-caption text-caption text-on-surface-variant mt-1">
                일·주·월 단위 누적 추이를 그래프로 살펴보고, 급성장하는 콘텐츠를 빠르게 포착하세요.
              </p>
            </div>
            <div className="inline-flex bg-surface-container-low rounded-full p-1">
              {GRANULARITIES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGran(g)}
                  className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-colors ${
                    gran === g
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#666" }}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#666" }}
                  tickFormatter={(v: number) =>
                    v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`
                  }
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v) => formatNumber(Number(v))}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="조회수"
                  stroke="#004ac6"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  name="좋아요"
                  stroke="#006c49"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  name="댓글"
                  stroke="#b00020"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Section 2 — 콘텐츠 상태 추적 */}
        <Card className="p-lg">
          <div className="mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              콘텐츠 상태 추적
            </h2>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              개별 콘텐츠의 누적 지표와 일일 증감을 확인하세요.
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-caption text-on-surface-variant border-b border-outline-variant">
                  <th className="py-2 pr-4 font-label-sm text-label-sm">콘텐츠</th>
                  <th className="py-2 px-3 font-label-sm text-label-sm text-right">누적 조회수</th>
                  <th className="py-2 px-3 font-label-sm text-label-sm text-right">전일 대비</th>
                  <th className="py-2 px-3 font-label-sm text-label-sm text-right">누적 좋아요</th>
                  <th className="py-2 px-3 font-label-sm text-label-sm text-right">전일 대비</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-outline-variant last:border-b-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-surface-container shrink-0">
                          <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-label-sm text-label-sm text-on-surface truncate max-w-[280px]">
                            {p.title}
                          </div>
                          <div className="text-caption text-on-surface-variant">
                            {p.platform} · {p.publishedAt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-label-sm text-on-surface">
                      {formatNumber(p.totalViews)}
                    </td>
                    <td className="py-3 px-3 text-right text-caption text-secondary">
                      {formatDelta(p.todayViewsDelta)}
                    </td>
                    <td className="py-3 px-3 text-right font-label-sm text-on-surface">
                      {formatNumber(p.totalLikes)}
                    </td>
                    <td className="py-3 px-3 text-right text-caption text-secondary">
                      {formatDelta(p.todayLikesDelta)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-3">
            {posts.map((p) => (
              <div
                key={p.id}
                className="border border-outline-variant rounded-lg p-3 bg-surface-container-lowest"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-surface-container shrink-0">
                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-label-sm text-label-sm text-on-surface">{p.title}</div>
                    <div className="text-caption text-on-surface-variant">
                      {p.platform} · {p.publishedAt}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-caption">
                  <div className="bg-surface-container-low rounded p-2">
                    <div className="text-on-surface-variant">누적 조회수</div>
                    <div className="font-label-sm text-on-surface">{formatNumber(p.totalViews)}</div>
                    <div className="text-secondary mt-0.5">{formatDelta(p.todayViewsDelta)}</div>
                  </div>
                  <div className="bg-surface-container-low rounded p-2">
                    <div className="text-on-surface-variant">누적 좋아요</div>
                    <div className="font-label-sm text-on-surface">{formatNumber(p.totalLikes)}</div>
                    <div className="text-secondary mt-0.5">{formatDelta(p.todayLikesDelta)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CampaignDashboard;
