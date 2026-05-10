import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  Influencer,
  MatchedInfluencer,
  SubmittedProposal,
} from "../data/types";
import type { ScoreBreakdown } from "../lib/scoring";
import {
  defaultSampleProducts,
  type SampleProduct,
} from "../data/sampleProducts";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "brand" | "influencer";
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  influencer: Influencer;
  proposalId: string;
  messages: ChatMessage[];
  createdAt: string;
}

interface AppState {
  authScore: ScoreBreakdown | null;
  selectedInfluencer: MatchedInfluencer | null;
  submittedProposals: Record<string, SubmittedProposal>;
  chatRooms: Record<string, ChatRoom>;
  sampleProducts: SampleProduct[];
  setAuthScore: (s: ScoreBreakdown | null) => void;
  selectInfluencer: (inf: MatchedInfluencer | null) => void;
  submitProposal: (proposal: SubmittedProposal) => void;
  getProposal: (id: string) => SubmittedProposal | null;
  createChatRoom: (proposalId: string, influencer: Influencer, initialMsg: string) => string;
  sendMessage: (roomId: string, text: string, sender: "brand" | "influencer") => void;
  addSampleProduct: (product: Omit<SampleProduct, "id" | "createdAt">) => void;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [authScore, setAuthScore] = useState<ScoreBreakdown | null>(null);
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<MatchedInfluencer | null>(null);
  const [submittedProposals, setSubmittedProposals] = useState<
    Record<string, SubmittedProposal>
  >({});
  const [chatRooms, setChatRooms] = useState<Record<string, ChatRoom>>({});
  const [sampleProducts, setSampleProducts] = useState<SampleProduct[]>(defaultSampleProducts);

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

  const createChatRoom = useCallback(
    (proposalId: string, influencer: Influencer, initialMsg: string): string => {
      const roomId = `chat_${proposalId}`;
      const now = new Date().toISOString();
      setChatRooms((prev) => {
        if (prev[roomId]) return prev;
        const room: ChatRoom = {
          id: roomId,
          influencer,
          proposalId,
          createdAt: now,
          messages: [
            { id: "msg_0", text: initialMsg, sender: "influencer", timestamp: now },
          ],
        };
        return { ...prev, [roomId]: room };
      });
      return roomId;
    },
    [],
  );

  const addSampleProduct = useCallback(
    (product: Omit<SampleProduct, "id" | "createdAt">) => {
      setSampleProducts((prev) => [
        ...prev,
        { ...product, id: `sp_${Date.now()}`, createdAt: new Date().toISOString() },
      ]);
    },
    [],
  );

  const sendMessage = useCallback(
    (roomId: string, text: string, sender: "brand" | "influencer") => {
      setChatRooms((prev) => {
        const room = prev[roomId];
        if (!room) return prev;
        const msg: ChatMessage = {
          id: `msg_${Date.now()}`,
          text,
          sender,
          timestamp: new Date().toISOString(),
        };
        return { ...prev, [roomId]: { ...room, messages: [...room.messages, msg] } };
      });
    },
    [],
  );

  const value = useMemo<AppState>(
    () => ({
      authScore,
      selectedInfluencer,
      submittedProposals,
      chatRooms,
      sampleProducts,
      setAuthScore,
      selectInfluencer,
      submitProposal,
      getProposal,
      createChatRoom,
      sendMessage,
      addSampleProduct,
    }),
    [
      authScore,
      selectedInfluencer,
      submittedProposals,
      chatRooms,
      sampleProducts,
      selectInfluencer,
      submitProposal,
      getProposal,
      createChatRoom,
      sendMessage,
      addSampleProduct,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
