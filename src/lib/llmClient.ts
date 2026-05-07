import type { FollowerTier, ProposalInput } from "../data/types";
import { buildProposalTemplate, renderProposalText } from "../data/proposalTemplates";

export interface StreamProposalArgs {
  input: ProposalInput;
  estimatedReach: number;
  estimatedCtr: number;
  signal?: AbortSignal;
  charDelayMs?: number;
}

export interface LlmClient {
  streamProposal(args: StreamProposalArgs): AsyncIterable<string>;
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(id);
        reject(new DOMException("aborted", "AbortError"));
      };
      if (signal.aborted) onAbort();
      else signal.addEventListener("abort", onAbort, { once: true });
    }
  });

export const mockClient: LlmClient = {
  async *streamProposal({
    input,
    estimatedReach,
    estimatedCtr,
    signal,
    charDelayMs = 12,
  }: StreamProposalArgs) {
    const template = buildProposalTemplate(input);
    const text = renderProposalText(template, estimatedReach, estimatedCtr);
    let buffer = "";
    for (const ch of text) {
      if (signal?.aborted) return;
      buffer += ch;
      if (buffer.length >= 3 || ch === "\n") {
        yield buffer;
        buffer = "";
        await wait(charDelayMs, signal);
      }
    }
    if (buffer) yield buffer;
  },
};

export const buildBackupProposal = (
  input: ProposalInput,
  estimatedReach: number,
  estimatedCtr: number,
): string => {
  const template = buildProposalTemplate(input);
  return renderProposalText(template, estimatedReach, estimatedCtr);
};

// === Real client (POST → SSE stream from C's FastAPI server) ===
//
// Activated when VITE_PROPOSAL_API_BASE is set at build time. Frontend
// payload uses string-array `핵심_키워드` and TS-friendly tier strings; C's
// schema expects comma-separated keywords and a different tier-string format,
// so we adapt on the wire.

const FOLLOWER_TIER_TO_SERVER: Record<FollowerTier, string> = {
  "나노(1만↓)": "나노(1만 미만)",
  "마이크로(1-10만)": "마이크로(1~10만)",
  "매크로(10-100만)": "매크로(10~100만)",
  "메가(100만↑)": "메가(100만 이상)",
};

const buildServerPayload = (input: ProposalInput) => ({
  브랜드명: input.브랜드명,
  브랜드_카테고리: input.브랜드_카테고리,
  콘텐츠_포맷: input.콘텐츠_포맷,
  플랫폼: input.플랫폼,
  콘텐츠유형: input.콘텐츠유형,
  팔로워규모: FOLLOWER_TIER_TO_SERVER[input.팔로워규모],
  예상_도달: input.예상_도달,
  보수: input.보수,
  핵심_키워드: input.핵심_키워드.join(", "),
  타겟_소구점: input.타겟_소구점,
  전문성: input.전문성,
  신뢰성: input.신뢰성,
  진정성: input.진정성,
  스토리텔링: input.스토리텔링,
  소비자_몰입: input.소비자_몰입,
  브랜드_인플루언서_적합도: input.브랜드_인플루언서_적합도,
});

const PROPOSAL_API_BASE = import.meta.env.VITE_PROPOSAL_API_BASE as
  | string
  | undefined;

export const realClient: LlmClient = {
  async *streamProposal({ input, signal }: StreamProposalArgs) {
    if (!PROPOSAL_API_BASE) throw new Error("VITE_PROPOSAL_API_BASE not set");
    const res = await fetch(`${PROPOSAL_API_BASE}/proposal/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ngrok free plan shows an interstitial HTML warning unless this
        // header is present — would otherwise corrupt the SSE response.
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(buildServerPayload(input)),
      signal,
    });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const isSSE = (res.headers.get("content-type") ?? "").includes(
      "text/event-stream",
    );
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (!isSSE) {
        yield chunk;
        continue;
      }
      buffer += chunk;
      let eventEnd: number;
      while ((eventEnd = buffer.indexOf("\n\n")) !== -1) {
        const event = buffer.slice(0, eventEnd);
        buffer = buffer.slice(eventEnd + 2);
        for (const line of event.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).replace(/^ /, "");
          if (data === "[DONE]") return;
          yield data;
        }
      }
    }
  },
};

export const llmClient: LlmClient = PROPOSAL_API_BASE ? realClient : mockClient;
