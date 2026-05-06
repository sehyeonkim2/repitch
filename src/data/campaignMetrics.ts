// Synthetic 30-day campaign metrics for /brand/campaign/:id demo.
// Deterministic ramp curves keyed by proposal id so each campaign looks distinct
// but stable across re-renders.

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  views: number;
  likes: number;
  comments: number;
}

export interface ContentPost {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string; // YYYY-MM-DD
  totalViews: number;
  todayViewsDelta: number;
  totalLikes: number;
  todayLikesDelta: number;
  platform: string;
}

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const seedRand = (seed: number) => {
  // Mulberry32
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const formatDate = (d: Date) => d.toISOString().slice(0, 10);

export const generateDailyMetrics = (
  campaignId: string,
  days = 30,
  baseViews = 4000,
): DailyMetric[] => {
  const seed = hash(campaignId);
  const rand = seedRand(seed);

  // Pick a curve shape per campaign: early-spike, slow-ramp, or plateau
  const shape: "spike" | "ramp" | "plateau" = ["spike", "ramp", "plateau"][seed % 3] as
    | "spike"
    | "ramp"
    | "plateau";

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - (days - 1));

  const result: DailyMetric[] = [];
  let cumulativeViews = 0;
  let cumulativeLikes = 0;
  let cumulativeComments = 0;

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    let dailyMultiplier: number;
    if (shape === "spike") {
      // Big day-1-3 surge, then taper
      dailyMultiplier = i < 3 ? 8 - i * 1.5 : Math.max(0.3, 2 - i * 0.04);
    } else if (shape === "ramp") {
      // Slow build, peak around day 12
      const peak = 12;
      const distance = Math.abs(i - peak);
      dailyMultiplier = Math.max(0.4, 3 - distance * 0.18);
    } else {
      // Steady plateau with mild fluctuation
      dailyMultiplier = 1.5 + (rand() - 0.5) * 0.6;
    }

    const noise = 0.85 + rand() * 0.3;
    const dailyViews = Math.round(baseViews * dailyMultiplier * noise);
    const dailyLikes = Math.round(dailyViews * (0.04 + rand() * 0.025));
    const dailyComments = Math.round(dailyViews * (0.005 + rand() * 0.004));

    cumulativeViews += dailyViews;
    cumulativeLikes += dailyLikes;
    cumulativeComments += dailyComments;

    result.push({
      date: formatDate(d),
      views: cumulativeViews,
      likes: cumulativeLikes,
      comments: cumulativeComments,
    });
  }

  return result;
};

export const generateContentPosts = (
  campaignId: string,
  platform = "Instagram",
): ContentPost[] => {
  const seed = hash(campaignId);
  const rand = seedRand(seed + 1);
  const today = new Date();

  const titles = [
    "1주일 사용 후기 — 솔직한 변화",
    "이 가격에 이 성능? 비교 리뷰",
    "출근길 루틴에 추가했더니",
  ];

  const thumbnails = [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1522335789203-aaa7d3e7ed2c?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  ];

  return titles.map((title, idx) => {
    const publishedDaysAgo = idx * 7 + Math.floor(rand() * 3);
    const published = new Date(today);
    published.setDate(today.getDate() - publishedDaysAgo);
    const totalViews = Math.round(50000 + rand() * 800000);
    const totalLikes = Math.round(totalViews * (0.04 + rand() * 0.03));
    return {
      id: `post_${campaignId}_${idx}`,
      title,
      thumbnail: thumbnails[idx],
      publishedAt: formatDate(published),
      totalViews,
      todayViewsDelta: Math.round(totalViews * (0.01 + rand() * 0.02)),
      totalLikes,
      todayLikesDelta: Math.round(totalLikes * (0.01 + rand() * 0.025)),
      platform,
    };
  });
};

export type Granularity = "일간" | "주간" | "월간";

export const binMetrics = (data: DailyMetric[], gran: Granularity): DailyMetric[] => {
  if (gran === "일간") return data;
  const binSize = gran === "주간" ? 7 : 30;
  const result: DailyMetric[] = [];
  for (let i = 0; i < data.length; i += binSize) {
    const slice = data.slice(i, i + binSize);
    const last = slice[slice.length - 1];
    result.push(last);
  }
  return result;
};
