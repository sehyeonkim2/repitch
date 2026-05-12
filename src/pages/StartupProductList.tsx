import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";
import type { Category } from "../data/types";
import type { SampleProduct } from "../data/sampleProducts";

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

type EditDraft = Omit<SampleProduct, "id" | "createdAt"> & { appealPointsRaw: string };

const StartupProductList = () => {
  const navigate = useNavigate();
  const { sampleProducts, removeSampleProduct, updateSampleProduct } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openEdit = (p: SampleProduct) => {
    setDraft({
      brandName: p.brandName,
      productName: p.productName,
      category: p.category,
      description: p.description,
      appealPoints: p.appealPoints,
      appealPointsRaw: p.appealPoints.join("\n"),
      targetCustomer: p.targetCustomer,
      thumbnailColor: p.thumbnailColor,
    });
    setEditingId(p.id);
  };

  const saveEdit = () => {
    if (!editingId || !draft) return;
    updateSampleProduct(editingId, {
      brandName: draft.brandName,
      productName: draft.productName,
      category: draft.category,
      description: draft.description,
      appealPoints: draft.appealPointsRaw.split("\n").map((s) => s.trim()).filter(Boolean),
      targetCustomer: draft.targetCustomer,
      thumbnailColor: draft.thumbnailColor,
    });
    setEditingId(null);
    setDraft(null);
  };

  const set = (key: keyof EditDraft, value: string) =>
    setDraft((prev) => prev ? { ...prev, [key]: value } : prev);

  const inputClass =
    "w-full h-11 px-4 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface";
  const labelClass = "block text-[11px] font-medium text-on-surface mb-1";

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader
        title="등록 제품 관리"
        back={() => navigate("/startup/profile")}
        view="startup"
        subtitle={`${sampleProducts.length}개 등록됨`}
        right={<HomeBtn />}
      />

      <main className="flex-1 px-4 py-4 pb-28 space-y-3">
        {sampleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Icon name="inventory_2" size={40} className="!text-on-surface-variant mb-3" />
            <p className="font-label-sm text-label-sm text-on-surface">등록된 제품이 없어요</p>
            <p className="text-caption text-on-surface-variant mt-1">아래 버튼으로 첫 제품을 등록해 보세요</p>
          </div>
        ) : (
          sampleProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              {/* 카드 헤더 */}
              <div className="flex items-center gap-3 p-4">
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-lg font-bold text-on-surface/25"
                  style={{ backgroundColor: p.thumbnailColor }}
                >
                  {p.brandName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-label-sm text-label-sm text-on-surface truncate">{p.productName}</div>
                  <div className="text-[11px] text-on-surface-variant">{p.brandName} · {p.category}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low text-on-surface-variant"
                  >
                    <Icon name="edit" size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(p.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low text-error"
                  >
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              </div>

              {/* 편집 폼 (인라인 확장) */}
              <AnimatePresence>
                {editingId === p.id && draft && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-outline-variant/40"
                  >
                    <div className="p-4 space-y-3 bg-surface-container-low">
                      <div>
                        <label className={labelClass}>브랜드명</label>
                        <input className={inputClass} value={draft.brandName} onChange={(e) => set("brandName", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>제품명</label>
                        <input className={inputClass} value={draft.productName} onChange={(e) => set("productName", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>카테고리</label>
                        <div className="relative">
                          <select
                            className="w-full h-11 appearance-none bg-surface-container-low border border-outline-variant rounded-2xl pl-4 pr-10 outline-none text-sm text-on-surface"
                            value={draft.category}
                            onChange={(e) => set("category", e.target.value)}
                          >
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline !text-[18px]">expand_more</span>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>소구 포인트</label>
                        <textarea
                          className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant outline-none text-sm text-on-surface resize-none"
                          rows={2}
                          value={draft.appealPointsRaw}
                          onChange={(e) => set("appealPointsRaw", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>타겟 고객층</label>
                        <input className={inputClass} value={draft.targetCustomer} onChange={(e) => set("targetCustomer", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>썸네일 색상</label>
                        <div className="flex gap-2">
                          {COLORS.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => set("thumbnailColor", c.value)}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${draft.thumbnailColor === c.value ? "border-primary scale-110" : "border-transparent"}`}
                              style={{ backgroundColor: c.value }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button variant="ghost" fullWidth onClick={() => { setEditingId(null); setDraft(null); }}>취소</Button>
                        <Button variant="primary" fullWidth icon="check" onClick={saveEdit}>저장</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </main>

      {/* 새 제품 등록 버튼 */}
      <div className="sticky bottom-0 bg-background px-4 pb-5 pt-3">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          icon="add_box"
          onClick={() => navigate("/startup/upload")}
        >
          새 제품 등록
        </Button>
      </div>

      {/* 삭제 확인 모달 */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-on-surface/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.18)] max-w-[28rem] w-full p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="delete" size={32} className="!text-error mb-3" />
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">제품을 삭제할까요?</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-5">
                {sampleProducts.find((p) => p.id === deleteConfirmId)?.productName}<br />
                <span className="text-caption">삭제 후 복구할 수 없습니다.</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" fullWidth onClick={() => setDeleteConfirmId(null)}>취소</Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    removeSampleProduct(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                >
                  삭제
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StartupProductList;
