import { createAdminClient } from "@/lib/supabase/admin";
import { embed, chunkText, openai, CHAT_MODEL } from "@/lib/openai";
import { assertPublicUrl } from "@/lib/security";

// Strip HTML down to readable plain text (good enough for store help pages).
export function extractTextFromHtml(html: string): string {
  let t = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  // Turn common block-level tags into line breaks so text stays structured.
  t = t.replace(/<\/(p|div|section|article|li|ul|ol|h[1-6]|tr|br)\s*\/?>/gi, "\n");
  t = t.replace(/<[^>]+>/g, " ");

  // Decode a handful of common HTML entities.
  t = t
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  return t.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

// Fetch a URL and return its title + extracted text.
export async function fetchUrlText(
  url: string,
): Promise<{ title: string; text: string }> {
  const safe = await assertPublicUrl(url); // SSRF guard (blocks localhost/private)
  const res = await fetch(safe, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ShopmateBot/1.0)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Failed to fetch page (HTTP ${res.status}).`);

  const ctype = res.headers.get("content-type") ?? "";
  if (ctype && !/(text\/html|text\/plain|application\/xhtml)/i.test(ctype)) {
    throw new Error("That link isn't a readable web page.");
  }
  const len = Number(res.headers.get("content-length") ?? "0");
  if (len && len > 5_000_000) throw new Error("That page is too large to import.");

  const html = (await res.text()).slice(0, 5_000_000);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch
    ? extractTextFromHtml(titleMatch[1]).slice(0, 120)
    : url;

  return { title, text: extractTextFromHtml(html) };
}

// Heuristic: does the text contain table-like rows worth normalizing?
function looksTabular(text: string): boolean {
  let n = 0;
  for (const l of text.split("\n")) {
    if (
      /(\d[\d.,]*[\s|]{1,}){3,}/.test(l) ||
      l.includes("\t") ||
      /\S {2,}\S {2,}\S/.test(l)
    )
      n++;
  }
  return n >= 4;
}

// Convert tables into self-contained "one sentence per row" text so RAG can
// retrieve precise cell facts. Only runs when the text looks tabular.
async function normalizeTables(text: string): Promise<string> {
  if (text.length > 24000 || !looksTabular(text)) return text;
  try {
    const res = await openai().chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Reformat the document for a knowledge base. For any TABLE, write ONE line per data row that restates every cell together with its column name (e.g. 'Marking 61: Height 2070 mm, Width 307 mm, Quantity 3') so each row is self-contained. Keep ALL other text and ALL information verbatim — do not summarize, omit, translate, or invent anything. Return only the reformatted text.",
        },
        { role: "user", content: text },
      ],
    });
    const out = res.choices[0]?.message?.content?.trim();
    // Guard: if the model returned much less than the input, it likely dropped
    // information — fall back to the raw text.
    return out && out.length > text.length * 0.6 ? out : text;
  } catch {
    return text;
  }
}

// Extract plain text from an uploaded file (PDF, DOCX, TXT, MD).
// Heavy parsers are dynamically imported so they only load when needed.
export async function extractFileText(file: File): Promise<string> {
  const lower = file.name.toLowerCase();
  const buf = await file.arrayBuffer();

  if (lower.endsWith(".pdf") || file.type === "application/pdf") {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    return normalizeTables(Array.isArray(text) ? text.join("\n\n") : text);
  }

  if (
    lower.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = (await import("mammoth")).default;
    const { value } = await mammoth.extractRawText({ buffer: Buffer.from(buf) });
    return normalizeTables(value);
  }

  // Images (photos, screenshots, scans): transcribe text with a vision model.
  if (/\.(png|jpe?g|webp|gif)$/i.test(lower) || file.type.startsWith("image/")) {
    const b64 = Buffer.from(buf).toString("base64");
    const mime = file.type || "image/png";
    const res = await openai().chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Transcribe ALL text visible in this image, keeping the original language. For any TABLE, do NOT output a grid — instead write ONE line per data row that restates every cell together with its column name, e.g. 'Marking 61: Height 2070 mm, Width 307 mm, Quantity 3'. This makes each row self-contained. Keep all other (non-table) text verbatim. If there is no readable text, reply with exactly: NO_TEXT",
            },
            { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
          ],
        },
      ],
    });
    const text = res.choices[0]?.message?.content ?? "";
    return text.trim() === "NO_TEXT" ? "" : text;
  }

  // txt / md / plain text
  return normalizeTables(new TextDecoder().decode(buf));
}

// Core ingestion: chunk -> embed -> store. Uses the admin client (server-only).
export async function ingestDocument(opts: {
  chatbotId: string;
  ownerId: string;
  title: string;
  content: string;
  sourceType: "text" | "file" | "url";
  sourceUrl?: string | null;
}): Promise<{ id: string; chunks: number }> {
  const admin = createAdminClient();
  const chunks = chunkText(opts.content);

  const { data: doc, error } = await admin
    .from("documents")
    .insert({
      chatbot_id: opts.chatbotId,
      user_id: opts.ownerId,
      title: opts.title.slice(0, 200) || "Untitled",
      source_type: opts.sourceType,
      source_url: opts.sourceUrl ?? null,
      char_count: opts.content.length,
      status: chunks.length ? "processing" : "ready",
    })
    .select("id")
    .single();

  if (error || !doc) throw new Error(error?.message ?? "Failed to save document.");

  if (chunks.length) {
    try {
      const batchSize = 96;
      const rows: {
        document_id: string;
        chatbot_id: string;
        content: string;
        embedding: number[];
      }[] = [];

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const vectors = await embed(batch);
        batch.forEach((content, j) =>
          rows.push({
            document_id: doc.id,
            chatbot_id: opts.chatbotId,
            content,
            embedding: vectors[j],
          }),
        );
      }

      const { error: chunkErr } = await admin.from("chunks").insert(rows);
      if (chunkErr) throw new Error(chunkErr.message);

      await admin.from("documents").update({ status: "ready" }).eq("id", doc.id);
    } catch (e) {
      await admin.from("documents").update({ status: "error" }).eq("id", doc.id);
      throw e;
    }
  }

  return { id: doc.id, chunks: chunks.length };
}
