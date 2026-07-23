import OpenAI from "openai";

// We support both a native OpenAI key and an OpenRouter key (sk-or-...).
// OpenRouter is OpenAI-compatible for both chat and embeddings; it just needs
// a different base URL and model names namespaced with "openai/".
const isOpenRouter = (process.env.OPENAI_API_KEY ?? "").startsWith("sk-or-");

export const EMBEDDING_MODEL = isOpenRouter
  ? "openai/text-embedding-3-small"
  : "text-embedding-3-small"; // 1536 dims either way
export const CHAT_MODEL = isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini";

let _client: OpenAI | null = null;

// Lazy init so `next build` doesn't fail when the key isn't present at build time.
export function openai(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : undefined,
      defaultHeaders: isOpenRouter
        ? {
            "HTTP-Referer":
              process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
            "X-Title": "Shopmate",
          }
        : undefined,
    });
  }
  return _client;
}

// Create embeddings for a batch of texts.
export async function embed(texts: string[]): Promise<number[][]> {
  const res = await openai().embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

// Split long text into overlapping chunks (~chunkSize chars) on sensible
// boundaries. Good enough for RAG over store help docs / FAQs.
export function chunkText(text: string, chunkSize = 1200, overlap = 150): string[] {
  const clean = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!clean) return [];

  // Split into paragraphs, then pack them into chunks up to chunkSize.
  const paragraphs = clean.split(/\n\n+/);
  const chunks: string[] = [];
  let current = "";

  const push = () => {
    const trimmed = current.trim();
    if (trimmed) chunks.push(trimmed);
    current = "";
  };

  for (const para of paragraphs) {
    if (para.length > chunkSize) {
      // Very long paragraph: hard-split it with overlap.
      push();
      for (let i = 0; i < para.length; i += chunkSize - overlap) {
        chunks.push(para.slice(i, i + chunkSize).trim());
      }
      continue;
    }
    if ((current + "\n\n" + para).length > chunkSize) {
      push();
      current = para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }
  push();

  return chunks.filter((c) => c.length > 0);
}
