import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MobileHeader } from "../components/MobileHeader";
import { StickyAction } from "../components/StickyAction";
import { Button } from "../components/Button";
import { useApp } from "../state/AppContext";
import { Icon } from "../components/Icon";
import type { Category } from "../data/types";

const HomeBtn = () => (
  <Link to="/startup/home" aria-label="홈" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant">
    <Icon name="home" size={22} />
  </Link>
);

const CATEGORIES: Category[] = [
  "뷰티", "패션", "식품", "헬스·피트니스", "라이프스타일", "전자기기", "앱서비스",
];

const COLORS = [
  { label: "핑크", value: "#fce4f3" },
  { label: "민트", value: "#e0f4ec" },
  { label: "블루", value: "#e8e8f8" },
  { label: "옐로", value: "#fef9e0" },
  { label: "피치", value: "#fdeee8" },
  { label: "라벤더", value: "#f0e8ff" },
];

const StartupProductUpload = () => {
  const navigate = useNavigate();
  const { addSampleProduct } = useApp();

  const [form, setForm] = useState({
    brandName: "",
    productName: "",
    category: "뷰티" as Category,
    description: "",
    appealPointsRaw: "",
    targetCustomer: "",
    thumbnailColor: COLORS[0].value,
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canSubmit =
    form.brandName.trim() &&
    form.productName.trim() &&
    form.description.trim() &&
    form.targetCustomer.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    addSampleProduct({
      brandName: form.brandName.trim(),
      productName: form.productName.trim(),
      category: form.category,
      description: form.description.trim(),
      appealPoints: form.appealPointsRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      targetCustomer: form.targetCustomer.trim(),
      thumbnailColor: form.thumbnailColor,
    });
    navigate("/startup/home");
  };

  const inputClass =
    "w-full h-12 px-4 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface";
  const labelClass = "block text-[12px] font-medium text-on-surface mb-1.5";

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader
        title="제품 등록"
        back={() => navigate(-1)}
        view="startup"
        subtitle="Discover에 노출됩니다"
        right={<HomeBtn />}
      />

      <main className="flex-1 px-4 py-4 pb-28 space-y-4">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 space-y-4">
          <div>
            <label className={labelClass}>브랜드명 *</label>
            <input
              className={inputClass}
              placeholder="예: 뷰티랩 코리아"
              value={form.brandName}
              onChange={(e) => set("brandName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>제품명 *</label>
            <input
              className={inputClass}
              placeholder="예: 퓨어 글로우 세럼"
              value={form.productName}
              onChange={(e) => set("productName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>카테고리 *</label>
            <div className="relative">
              <select
                className="w-full h-12 appearance-none bg-surface-container-low border border-outline-variant rounded-2xl pl-4 pr-10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface cursor-pointer"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline !text-[18px]">
                expand_more
              </span>
            </div>
          </div>
          <div>
            <label className={labelClass}>제품 설명 *</label>
            <textarea
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface resize-none"
              rows={3}
              placeholder="제품의 주요 특징과 효과를 간략히 설명해 주세요"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>소구 포인트 (줄 바꿈으로 구분)</label>
            <textarea
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface resize-none"
              rows={3}
              placeholder={"비타민C 10% 고농축\n72시간 수분 유지\n비건 인증"}
              value={form.appealPointsRaw}
              onChange={(e) => set("appealPointsRaw", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>타겟 고객층 *</label>
            <input
              className={inputClass}
              placeholder="예: 20~30대 피부 케어에 관심 있는 여성"
              value={form.targetCustomer}
              onChange={(e) => set("targetCustomer", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>썸네일 색상</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set("thumbnailColor", c.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    form.thumbnailColor === c.value
                      ? "border-primary scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <StickyAction>
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon="add_box"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          제품 등록하기
        </Button>
      </StickyAction>
    </div>
  );
};

export default StartupProductUpload;
