import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

const RoleSelect = () => (
  <div className="flex flex-col min-h-full bg-surface-container-low">
    <main className="flex-1 flex flex-col items-center justify-center px-gutter py-margin">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-on-primary mb-4 shadow-md">
          <span className="font-black text-2xl tracking-tighter">R:</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Re:Pitch
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          역제안 인플루언서 마케팅 플랫폼
        </p>
      </div>

      <div className="w-full max-w-[28rem] flex flex-col gap-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant text-center mb-1">
          어떻게 시작할까요?
        </p>

        <Link
          to="/influencer/auth"
          className="group bg-secondary-container hover:bg-secondary-container/80 active:scale-[0.98] transition rounded-2xl p-5 shadow-sm border border-secondary/20 flex items-center gap-4"
        >
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center">
            <Icon name="person" size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-headline-md text-headline-md text-on-secondary-container">
              인플루언서
            </div>
            <div className="font-label-sm text-label-sm text-on-secondary-container/80 mt-0.5">
              인증부터 제안서 작성까지
            </div>
          </div>
          <Icon
            name="arrow_forward"
            size={24}
            className="!text-on-secondary-container group-hover:translate-x-1 transition-transform"
          />
        </Link>

        <Link
          to="/brand/matching"
          className="group bg-primary-container hover:bg-primary-container/80 active:scale-[0.98] transition rounded-2xl p-5 shadow-sm border border-primary/20 flex items-center gap-4"
        >
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center">
            <Icon name="domain" size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-headline-md text-headline-md text-on-primary-container">
              기업
            </div>
            <div className="font-label-sm text-label-sm text-on-primary-container/80 mt-0.5">
              AI 매칭으로 인플루언서 찾기
            </div>
          </div>
          <Icon
            name="arrow_forward"
            size={24}
            className="!text-on-primary-container group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <p className="font-label-sm text-label-sm text-on-surface-variant/70 mt-10 text-center">
        데모 화면입니다 · 언제든 처음 화면으로 돌아올 수 있어요
      </p>
    </main>
  </div>
);

export default RoleSelect;
