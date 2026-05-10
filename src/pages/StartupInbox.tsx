import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const StartupInbox = () => {
  const navigate = useNavigate();
  const { submittedProposals } = useApp();
  const proposals = Object.values(submittedProposals).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader
        title="역제안서 수령함"
        back={() => navigate("/brand/startup")}
        view="brand"
        subtitle={`총 ${proposals.length}건`}
      />

      <main className="flex-1 px-4 py-3 pb-24">
        {proposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
              <Icon name="inbox" size={36} className="!text-on-surface-variant" />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface">아직 받은 역제안서가 없어요</p>
            <p className="text-caption text-on-surface-variant mt-1 max-w-[220px]">
              인플루언서가 Samples에서 역제안서를 보내면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {proposals.map((proposal, i) => {
              const inf = proposal.influencer;
              const preview = proposal.body.slice(0, 60).replace(/\n/g, " ");
              return (
                <motion.button
                  key={proposal.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  type="button"
                  onClick={() => navigate(`/brand/inbox/${proposal.id}`)}
                  className="w-full flex items-start gap-3 bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.07)] text-left active:scale-[0.98] transition-all"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-container-high bg-surface-container shrink-0">
                    <img
                      src={inf.avatarUrl}
                      alt={inf.handle}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-label-sm text-label-sm text-on-surface">
                        @{inf.handle}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        {new Date(proposal.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">{proposal.brand.name}</p>
                    <p className="text-caption text-on-surface-variant/70 mt-1 line-clamp-2 leading-relaxed">
                      {preview}…
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default StartupInbox;
