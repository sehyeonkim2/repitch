import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";
import type { Category } from "../data/types";

const ALL_CATEGORIES: Array<Category | "전체"> = [
  "전체",
  "뷰티",
  "패션",
  "식품",
  "헬스·피트니스",
  "라이프스타일",
  "전자기기",
  "앱서비스",
];

const SamplesPage = () => {
  const navigate = useNavigate();
  const { sampleProducts } = useApp();
  const [cat, setCat] = useState<Category | "전체">("전체");

  const filtered =
    cat === "전체" ? sampleProducts : sampleProducts.filter((p) => p.category === cat);

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader title="Discover" view="influencer" subtitle="샘플 체험 후 콘텐츠 업로드" />

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 -mb-1 shrink-0">
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              cat === c
                ? "bg-on-surface text-surface"
                : "bg-white text-on-surface-variant border border-outline-variant"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <main className="flex-1 px-4 py-3 pb-24 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
            <Icon name="storefront" size={48} />
            <p className="mt-4 font-body-md text-body-md">해당 카테고리 샘플이 없습니다</p>
          </div>
        ) : (
          filtered.map((product, i) => (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              type="button"
              onClick={() => navigate(`/influencer/samples/${product.id}`)}
              className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-left active:scale-[0.98] transition-all overflow-hidden"
            >
              {/* Thumbnail */}
              <div
                className="h-32 flex items-center justify-center"
                style={{ backgroundColor: product.thumbnailColor }}
              >
                <span className="text-4xl font-bold text-on-surface/20 select-none">
                  {product.brandName[0]}
                </span>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-label-sm text-label-sm text-on-surface leading-snug">
                    {product.productName}
                  </h3>
                  <span className="shrink-0 px-2 py-0.5 bg-surface-container-low rounded-full text-[10px] font-medium text-on-surface-variant">
                    {product.category}
                  </span>
                </div>
                <p className="text-caption text-on-surface-variant">{product.brandName}</p>
                <p className="text-[11px] text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </motion.button>
          ))
        )}
      </main>
    </div>
  );
};

export default SamplesPage;
