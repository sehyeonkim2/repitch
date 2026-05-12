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
import { startupDummyProposals } from "../data/startupDummyData";

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
  startupInboxProposals: SubmittedProposal[];
  startupChatRooms: Record<string, ChatRoom>;
  setAuthScore: (s: ScoreBreakdown | null) => void;
  selectInfluencer: (inf: MatchedInfluencer | null) => void;
  submitProposal: (proposal: SubmittedProposal) => void;
  getProposal: (id: string) => SubmittedProposal | null;
  createChatRoom: (proposalId: string, influencer: Influencer, initialMsg: string) => string;
  sendMessage: (roomId: string, text: string, sender: "brand" | "influencer") => void;
  addSampleProduct: (product: Omit<SampleProduct, "id" | "createdAt">) => void;
  removeSampleProduct: (id: string) => void;
  updateSampleProduct: (id: string, updates: Partial<Omit<SampleProduct, "id" | "createdAt">>) => void;
  createStartupChatRoom: (proposalId: string, influencer: Influencer, initialMsg: string) => string;
  sendStartupMessage: (roomId: string, text: string, sender: "brand" | "influencer") => void;
  getStartupProposal: (id: string) => SubmittedProposal | null;
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
  const [startupInboxProposals] = useState<SubmittedProposal[]>(startupDummyProposals);
  const [startupChatRooms, setStartupChatRooms] = useState<Record<string, ChatRoom>>({});

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
        { ...product, id: `sp_${Date.now()}`, createdAt: new Date().toISOString() },
        ...prev,
      ]);
    },
    [],
  );

  const removeSampleProduct = useCallback((id: string) => {
    setSampleProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateSampleProduct = useCallback(
    (id: string, updates: Partial<Omit<SampleProduct, "id" | "createdAt">>) => {
      setSampleProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      );
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

  const createStartupChatRoom = useCallback(
    (proposalId: string, influencer: Influencer, initialMsg: string): string => {
      const roomId = `startup_chat_${proposalId}`;
      const now = new Date().toISOString();
      setStartupChatRooms((prev) => {
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

  const sendStartupMessage = useCallback(
    (roomId: string, text: string, sender: "brand" | "influencer") => {
      setStartupChatRooms((prev) => {
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

  const getStartupProposal = useCallback(
    (id: string) => startupInboxProposals.find((p) => p.id === id) ?? null,
    [startupInboxProposals],
  );

  const value = useMemo<AppState>(
    () => ({
      authScore,
      selectedInfluencer,
      submittedProposals,
      chatRooms,
      sampleProducts,
      startupInboxProposals,
      startupChatRooms,
      setAuthScore,
      selectInfluencer,
      submitProposal,
      getProposal,
      createChatRoom,
      sendMessage,
      addSampleProduct,
      removeSampleProduct,
      updateSampleProduct,
      createStartupChatRoom,
      sendStartupMessage,
      getStartupProposal,
    }),
    [
      authScore,
      selectedInfluencer,
      submittedProposals,
      chatRooms,
      sampleProducts,
      startupInboxProposals,
      startupChatRooms,
      selectInfluencer,
      submitProposal,
      getProposal,
      createChatRoom,
      sendMessage,
      addSampleProduct,
      removeSampleProduct,
      updateSampleProduct,
      createStartupChatRoom,
      sendStartupMessage,
      getStartupProposal,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppState => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
