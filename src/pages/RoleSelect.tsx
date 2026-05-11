import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

const RoleSelect = () => (
  <div className="flex flex-col min-h-full bg-background">
    <main className="flex-1 flex flex-col items-center justify-center px-gutter py-margin">
      <div className="text-center mb-10">
        <img
          src="/logo.jpeg"
          alt="repitch"
          className="w-48 h-auto mx-auto mb-4 select-none"
          draggable={false}
        />
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          역제안 인플루언서 마케팅 플랫폼
        </p>
      </div>

      <div className="w-full max-w-[28rem] flex flex-col gap-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant text-center mb-1">
          어떻게 시작할까요?
        </p>

        {/* Influencer = outlined card (white bg, thick black border) */}
        <Link
          to="/influencer/auth"
          className="group bg-white active:scale-[0.98] transition-all rounded-2xl p-5 border-2 border-on-surface flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-surface border-2 border-on-surface text-on-surface flex items-center justify-center">
            <Icon name="person" size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-headline-md text-headline-md text-on-surface">
              Influencer
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              인증부터 제안서 작성까지
            </div>
          </div>
          <Icon
            name="arrow_forward"
            size={24}
            className="!text-on-surface group-hover:translate-x-1 transition-transform"
          />
        </Link>

        {/* Enterprise = solid black card */}
        <Link
          to="/brand/matching"
          className="group bg-on-surface hover:bg-[#1a1a1a] active:scale-[0.98] transition-all rounded-2xl p-5 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.18)]"
        >
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-surface text-on-surface flex items-center justify-center">
            <Icon name="domain" size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-headline-md text-headline-md text-surface">
              Enterprise
            </div>
            <div className="font-label-sm text-label-sm text-surface/80 mt-0.5">
              AI 매칭으로 Influencer 찾기
            </div>
          </div>
          <Icon
            name="arrow_forward"
            size={24}
            className="!text-surface group-hover:translate-x-1 transition-transform"
          />
        </Link>

        {/* Startup = outlined with surface-container tint */}
        <Link
          to="/startup/home"
          className="group bg-surface-container-low active:scale-[0.98] transition-all rounded-2xl p-5 border-2 border-on-surface/40 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-on-surface/8 border-2 border-on-surface/40 text-on-surface flex items-center justify-center">
            <Icon name="rocket_launch" size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-headline-md text-headline-md text-on-surface">
              Startup
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              제품 등록 · 역제안서 수령
            </div>
          </div>
          <Icon
            name="arrow_forward"
            size={24}
            className="!text-on-surface/60 group-hover:translate-x-1 transition-transform"
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
