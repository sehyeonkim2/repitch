import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { useApp } from "../state/AppContext";

const ProposalSent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProposal } = useApp();

  useEffect(() => {
    if (!id || !getProposal(id)) {
      const t = setTimeout(() => navigate("/influencer/proposal"), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => navigate("/"), 2200);
    return () => clearTimeout(t);
  }, [id, navigate, getProposal]);

  const proposal = id ? getProposal(id) : null;

  return (
    <div className="flex flex-col min-h-full">
      <MobileHeader title="전송 완료" view="influencer" />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-24 h-24 rounded-full bg-secondary-container/40 border-2 border-secondary flex items-center justify-center mb-md"
        >
          <Icon name="send" filled className="!text-secondary" size={40} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-headline-lg text-headline-lg text-on-surface mb-2"
        >
          제안서를 전송했어요
        </motion.h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-md">
          {proposal
            ? `${proposal.brand.name} 담당자에게 잘 전달됐습니다.`
            : "처리 중입니다."}
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span
            className="w-2 h-2 rounded-full bg-secondary animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-secondary animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </main>
    </div>
  );
};

export default ProposalSent;
