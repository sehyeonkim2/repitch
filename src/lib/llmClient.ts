import type { ProposalInput } from "../data/types";
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

export const llmClient: LlmClient = mockClient;
