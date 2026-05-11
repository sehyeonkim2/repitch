import { useState } from "react";
import { MobileHeader } from "../components/MobileHeader";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import type { Category } from "../data/types";

const CATEGORIES: Category[] = [
  "뷰티", "패션", "식품", "헬스·피트니스", "라이프스타일", "전자기기", "앱서비스",
];

interface ProfileData {
  companyName: string;
  category: Category;
  managerName: string;
  email: string;
  phone: string;
  intro: string;
}

const DEFAULT_PROFILE: ProfileData = {
  companyName: "뷰티랩 코리아",
  category: "뷰티",
  managerName: "김지원",
  email: "contact@beautylab.kr",
  phone: "02-1234-5678",
  intro: "비건 & 클린 뷰티 전문 기업으로, 20대 민감성 피부를 위한 고기능 스킨케어 라인을 개발합니다. 진정성 있는 인플루언서 마케팅을 통해 소비자와 신뢰를 쌓고 있습니다.",
};

const inputClass =
  "w-full h-12 px-4 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface";
const readonlyClass =
  "w-full h-12 px-4 rounded-2xl bg-surface-container-high/50 border border-transparent text-sm text-on-surface flex items-center";
const labelClass = "block text-[12px] font-medium text-on-surface mb-1.5";

const EnterpriseProfile = () => {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(DEFAULT_PROFILE);

  const set = (key: keyof ProfileData, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const data = editing ? draft : profile;

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader
        title="기업 프로필"
        view="brand"
        right={
          !editing ? (
            <button
              type="button"
              onClick={() => { setDraft(profile); setEditing(true); }}
              className="text-[12px] font-medium text-on-surface bg-surface-container-low border border-outline-variant rounded-full px-3 py-1.5"
            >
              수정하기
            </button>
          ) : undefined
        }
      />

      <main className="flex-1 px-4 py-4 pb-28 space-y-4">
        {/* 로고 & 기업명 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-on-surface flex items-center justify-center shrink-0 text-surface text-2xl font-bold select-none">
            {data.companyName[0]}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                className={inputClass}
                value={draft.companyName}
                onChange={(e) => set("companyName", e.target.value)}
                placeholder="기업명"
              />
            ) : (
              <>
                <div className="font-headline-md text-headline-md text-on-surface">{profile.companyName}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Enterprise · Re:Pitch 파트너</div>
              </>
            )}
          </div>
        </div>

        {/* 기업 정보 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="business" size={18} className="!text-on-surface-variant" />
            <span className="font-label-sm text-label-sm text-on-surface">기업 정보</span>
          </div>

          <div>
            <label className={labelClass}>업종 / 카테고리</label>
            {editing ? (
              <div className="relative">
                <select
                  className="w-full h-12 appearance-none bg-surface-container-low border border-outline-variant rounded-2xl pl-4 pr-10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface cursor-pointer"
                  value={draft.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline !text-[18px]">expand_more</span>
              </div>
            ) : (
              <div className={readonlyClass}>{profile.category}</div>
            )}
          </div>

          <div>
            <label className={labelClass}>회사 소개</label>
            {editing ? (
              <textarea
                className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface resize-none"
                rows={4}
                value={draft.intro}
                onChange={(e) => set("intro", e.target.value)}
                placeholder="회사 소개를 입력해 주세요"
              />
            ) : (
              <p className="text-sm text-on-surface leading-relaxed px-1">{profile.intro}</p>
            )}
          </div>
        </div>

        {/* 담당자 정보 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="badge" size={18} className="!text-on-surface-variant" />
            <span className="font-label-sm text-label-sm text-on-surface">담당자 정보</span>
          </div>

          {[
            { key: "managerName" as const, label: "담당자 이름", placeholder: "홍길동", icon: "person" },
            { key: "email" as const, label: "이메일", placeholder: "contact@company.kr", icon: "mail" },
            { key: "phone" as const, label: "연락처", placeholder: "02-0000-0000", icon: "phone" },
          ].map(({ key, label, placeholder, icon }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              {editing ? (
                <input
                  className={inputClass}
                  value={draft[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Icon name={icon} size={16} className="!text-on-surface-variant" />
                  <span className="text-sm text-on-surface">{profile[key]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {editing && (
        <div className="sticky bottom-0 bg-background px-4 pb-5 pt-3 grid grid-cols-2 gap-2">
          <Button variant="ghost" fullWidth onClick={handleCancel}>취소</Button>
          <Button variant="primary" fullWidth icon="check" onClick={handleSave}>저장하기</Button>
        </div>
      )}
    </div>
  );
};

export default EnterpriseProfile;
