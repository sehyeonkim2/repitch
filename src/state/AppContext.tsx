import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  MatchedInfluencer,
  SubmittedProposal,
} from "../data/types";
import type { ScoreBreakdown } from "../lib/scoring";

interface AppState {
  authScore: ScoreBreakdown | null;
  selectedInfluencer: MatchedInfluencer | null;
  submittedProposals: Record<string, SubmittedProposal>;
  setAuthScore: (s: ScoreBreakdown | null) => void;
  selectInfluencer: (inf: MatchedInfluencer | null) => void;
  submitProposal: (proposal: SubmittedProposal) => void;
  getProposal: (id: string) => SubmittedProposal | null;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [authScore, setAuthScore] = useState<ScoreBreakdown | null>(null);
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<MatchedInfluencer | null>(null);
  const [submittedProposals, setSubmittedProposals] = useState<
    Record<string, SubmittedProposal>
  >({});

  const selectInfluencer = useCallback((inf: MatchedInfluencer | null) => {
    setSelectedInfluencer(inf);
  }, []);

  const submitProposal = useCallback((proposal: SubmittedProposal) => {
    setSubmittedProposals((prev) => ({ ...prev, [proposal.id]: proposal }));
  }, []);

  const getProposal = useCallback(
    (id: string) => submittedProposals[id] ?? null,
    [submittedProposals],
  );

  const value = useMemo<AppState>(
    () => ({
      authScore,
      selectedInfluencer,
      submittedProposals,
      setAuthScore,
      selectInfluencer,
      submitProposal,
      getProposal,
    }),
    [
      authScore,
      selectedInfluencer,
      submittedProposals,
      selectInfluencer,
      submitProposal,
      getProposal,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
