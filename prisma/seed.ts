import { PrismaClient, ModelType } from "@prisma/client";

const prisma = new PrismaClient();

const labs = [
  { slug: "openai", name: "OpenAI", country: "US", website: "https://openai.com", description: "AI research lab behind the GPT family." },
  { slug: "anthropic", name: "Anthropic", country: "US", website: "https://anthropic.com", description: "AI safety company behind the Claude family." },
  { slug: "google", name: "Google DeepMind", country: "US", website: "https://deepmind.google", description: "Google's AI research lab, creator of Gemini." },
  { slug: "meta", name: "Meta AI", country: "US", website: "https://ai.meta.com", description: "Meta's research lab, maker of open-weight Llama models." },
  { slug: "mistral", name: "Mistral AI", country: "FR", website: "https://mistral.ai", description: "European lab building efficient open and commercial models." },
  { slug: "deepseek", name: "DeepSeek", country: "CN", website: "https://deepseek.com", description: "Chinese lab known for efficient open reasoning models." },
  { slug: "alibaba", name: "Alibaba Qwen", country: "CN", website: "https://qwen.ai", description: "Alibaba's Qwen model family." },
  { slug: "xai", name: "xAI", country: "US", website: "https://x.ai", description: "AI lab behind the Grok models." },
];

// mult = price relative to a model's base price
const providers = [
  { slug: "direct", name: "Direct API", website: "https://example.com", description: "First-party lab API.", mult: 1 },
  { slug: "openrouter", name: "OpenRouter", website: "https://openrouter.ai", description: "Unified API gateway for many models.", mult: 1.05 },
  { slug: "together", name: "Together AI", website: "https://together.ai", description: "Inference platform for open models.", mult: 0.9 },
  { slug: "fireworks", name: "Fireworks AI", website: "https://fireworks.ai", description: "Fast inference for open models.", mult: 0.85 },
  { slug: "groq", name: "Groq", website: "https://groq.com", description: "Low-latency LPU inference.", mult: 0.8 },
  { slug: "bedrock", name: "AWS Bedrock", website: "https://aws.amazon.com/bedrock", description: "Managed foundation models on AWS.", mult: 1.1 },
];

const benchmarks = [
  { slug: "mmlu", name: "MMLU", category: "knowledge" },
  { slug: "gpqa", name: "GPQA", category: "reasoning" },
  { slug: "humaneval", name: "HumanEval", category: "coding" },
  { slug: "math", name: "MATH", category: "math" },
  { slug: "swe-bench", name: "SWE-bench", category: "coding" },
];
const benchOrder = benchmarks.map((b) => b.slug);

type Seed = {
  lab: string;
  name: string;
  type?: ModelType;
  ctx: number;
  date: string;
  inp?: string[];
  out?: string[];
  caps: string[];
  price: [number, number]; // illustrative USD per 1M tokens: [input, output]
  open?: boolean;
  s?: number[]; // scores in order: mmlu, gpqa, humaneval, math, swe-bench
};

const T = ["tool-use", "json-mode"];
const V = ["tool-use", "vision", "json-mode"];
const R = ["tool-use", "reasoning", "json-mode"];
const RV = ["tool-use", "vision", "reasoning", "json-mode"];

// ALL DATA IS ILLUSTRATIVE (demo only)
const models: Seed[] = [
  // OpenAI
  { lab: "openai", name: "GPT Flagship", ctx: 400000, date: "2026-03-10", caps: RV, price: [2.5, 10], s: [91, 78, 95, 90, 68] },
  { lab: "openai", name: "GPT Mini", ctx: 200000, date: "2026-03-10", caps: V, price: [0.3, 1.2], s: [84, 62, 89, 80, 45] },
  { lab: "openai", name: "GPT Nano", ctx: 128000, date: "2026-03-10", caps: T, price: [0.1, 0.4], s: [76, 48, 80, 68, 28] },
  { lab: "openai", name: "GPT Reasoner", ctx: 200000, date: "2025-12-18", caps: R, price: [10, 40], s: [90, 82, 94, 95, 66] },
  { lab: "openai", name: "GPT Image", type: "IMAGE", ctx: 4000, date: "2026-01-22", inp: ["text"], out: ["image"], caps: ["image-generation"], price: [5, 40] },
  { lab: "openai", name: "Embedding Large", type: "EMBEDDING", ctx: 8192, date: "2025-09-05", inp: ["text"], out: ["embedding"], caps: ["embeddings"], price: [0.13, 0] },
  { lab: "openai", name: "Speech Transcribe", type: "AUDIO", ctx: 30000, date: "2025-11-14", inp: ["audio"], out: ["text"], caps: ["transcription"], price: [0.6, 2.4] },
  // Anthropic
  { lab: "anthropic", name: "Claude Opus", ctx: 500000, date: "2026-05-02", caps: RV, price: [15, 75], s: [92, 80, 96, 91, 74] },
  { lab: "anthropic", name: "Claude Sonnet", ctx: 500000, date: "2026-05-02", caps: RV, price: [3, 15], s: [90, 75, 94, 88, 70] },
  { lab: "anthropic", name: "Claude Haiku", ctx: 200000, date: "2026-05-02", caps: V, price: [0.8, 4], s: [82, 58, 88, 76, 42] },
  // Google
  { lab: "google", name: "Gemini Pro", type: "MULTIMODAL", ctx: 1000000, date: "2026-02-18", inp: ["text", "image", "audio", "video"], caps: [...RV, "long-context"], price: [1.25, 10], s: [90, 77, 92, 89, 62] },
  { lab: "google", name: "Gemini Flash", type: "MULTIMODAL", ctx: 1000000, date: "2026-02-18", inp: ["text", "image", "audio"], caps: [...V, "long-context"], price: [0.15, 0.6], s: [83, 60, 86, 78, 40] },
  { lab: "google", name: "Gemini Flash Lite", ctx: 500000, date: "2026-02-18", caps: T, price: [0.07, 0.3], s: [77, 50, 78, 70, 28] },
  { lab: "google", name: "Imagen Studio", type: "IMAGE", ctx: 2000, date: "2026-01-09", inp: ["text"], out: ["image"], caps: ["image-generation"], price: [4, 30] },
  { lab: "google", name: "Gemma Open", ctx: 128000, date: "2026-01-30", open: true, caps: T, price: [0.2, 0.4], s: [79, 52, 82, 72, 30] },
  // Meta
  { lab: "meta", name: "Llama Large", ctx: 128000, date: "2026-01-20", open: true, caps: T, price: [0.9, 0.9], s: [86, 65, 88, 80, 38] },
  { lab: "meta", name: "Llama Medium", ctx: 128000, date: "2026-01-20", open: true, caps: T, price: [0.35, 0.4], s: [80, 54, 82, 72, 30] },
  { lab: "meta", name: "Llama Small", ctx: 128000, date: "2026-01-20", open: true, caps: ["json-mode"], price: [0.05, 0.08], s: [70, 40, 70, 58, 18] },
  // Mistral
  { lab: "mistral", name: "Mistral Large", ctx: 128000, date: "2025-12-05", caps: T, price: [2, 6], s: [84, 62, 87, 78, 35] },
  { lab: "mistral", name: "Mistral Medium", ctx: 128000, date: "2025-12-05", caps: T, price: [0.4, 2], s: [79, 54, 82, 70, 28] },
  { lab: "mistral", name: "Mistral Small", ctx: 32000, date: "2025-10-20", open: true, caps: ["json-mode"], price: [0.1, 0.3], s: [72, 44, 74, 62, 20] },
  { lab: "mistral", name: "Mistral Code", ctx: 256000, date: "2026-02-27", open: true, caps: T, price: [0.3, 0.9], s: [74, 46, 93, 66, 48] },
  { lab: "mistral", name: "Mistral Embed", type: "EMBEDDING", ctx: 8000, date: "2025-08-12", inp: ["text"], out: ["embedding"], caps: ["embeddings"], price: [0.1, 0] },
  // DeepSeek
  { lab: "deepseek", name: "DeepSeek Reasoner", ctx: 128000, date: "2026-01-12", open: true, caps: R, price: [0.55, 2.2], s: [88, 72, 90, 92, 55] },
  { lab: "deepseek", name: "DeepSeek Chat", ctx: 128000, date: "2026-01-12", open: true, caps: T, price: [0.27, 1.1], s: [85, 62, 86, 82, 42] },
  { lab: "deepseek", name: "DeepSeek Coder", ctx: 128000, date: "2025-11-30", open: true, caps: T, price: [0.14, 0.28], s: [76, 48, 92, 70, 50] },
  // Alibaba
  { lab: "alibaba", name: "Qwen Max", ctx: 256000, date: "2026-02-01", open: true, caps: V, price: [0.4, 1.2], s: [87, 66, 89, 85, 44] },
  { lab: "alibaba", name: "Qwen Plus", ctx: 128000, date: "2026-02-01", open: true, caps: T, price: [0.2, 0.6], s: [81, 56, 83, 76, 32] },
  { lab: "alibaba", name: "Qwen Coder", ctx: 256000, date: "2026-03-15", open: true, caps: T, price: [0.3, 0.9], s: [78, 50, 93, 72, 52] },
  { lab: "alibaba", name: "Qwen VL", type: "MULTIMODAL", ctx: 128000, date: "2025-12-22", inp: ["text", "image", "video"], open: true, caps: V, price: [0.25, 0.8], s: [80, 54, 80, 72, 26] },
  // xAI
  { lab: "xai", name: "Grok", ctx: 256000, date: "2026-04-08", caps: RV, price: [3, 15], s: [88, 73, 91, 87, 58] },
  { lab: "xai", name: "Grok Mini", ctx: 128000, date: "2026-04-08", caps: R, price: [0.3, 0.5], s: [82, 60, 85, 80, 40] },
  { lab: "xai", name: "Grok Code", ctx: 256000, date: "2026-06-01", caps: T, price: [0.2, 1.5], s: [78, 52, 94, 74, 56] },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const round = (n: number) => Math.round(n * 1000) / 1000;

async function main() {
  // Clear in dependency order so the seed can be re-run safely
  await prisma.benchmarkScore.deleteMany();
  await prisma.modelProvider.deleteMany();
  await prisma.model.deleteMany();
  await prisma.benchmark.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.lab.deleteMany();

  const labRows = await Promise.all(labs.map((l) => prisma.lab.create({ data: l })));
  const labBySlug = Object.fromEntries(labRows.map((l) => [l.slug, l]));

  const providerRows = await Promise.all(
    providers.map(({ mult, ...p }) => prisma.provider.create({ data: p }))
  );
  const providerBySlug = Object.fromEntries(providerRows.map((p) => [p.slug, p]));
  const multBySlug = Object.fromEntries(providers.map((p) => [p.slug, p.mult]));

  const benchRows = await Promise.all(benchmarks.map((b) => prisma.benchmark.create({ data: b })));
  const benchBySlug = Object.fromEntries(benchRows.map((b) => [b.slug, b]));

  for (const [i, m] of models.entries()) {
    const slugs = m.open
      ? ["together", "fireworks", "openrouter", "groq", ...(i % 2 ? ["bedrock"] : [])]
      : ["direct", "openrouter", ...(i % 2 === 0 ? ["bedrock"] : [])];

    const priced = slugs.map((ps) => ({
      providerId: providerBySlug[ps].id,
      inputPricePerM: round(m.price[0] * multBySlug[ps]),
      outputPricePerM: round(m.price[1] * multBySlug[ps]),
    }));
    const minInput = Math.min(...priced.map((p) => p.inputPricePerM));
    const labName = labBySlug[m.lab].name;

    await prisma.model.create({
      data: {
        labId: labBySlug[m.lab].id,
        name: m.name,
        slug: slugify(`${m.lab}-${m.name}`),
        type: m.type ?? "LLM",
        description: `${m.name} from ${labName}. Illustrative demo data for OneAtlas.`,
        contextWindow: m.ctx,
        releaseDate: new Date(m.date),
        inputModalities: m.inp ?? (m.caps.includes("vision") ? ["text", "image"] : ["text"]),
        outputModalities: m.out ?? ["text"],
        capabilities: m.caps,
        minInputPrice: minInput,
        providers: { create: priced },
        scores: m.s
          ? { create: m.s.map((score, idx) => ({ benchmarkId: benchBySlug[benchOrder[idx]].id, score })) }
          : undefined,
      },
    });
  }

  console.log(`Seeded ${labs.length} labs, ${providers.length} providers, ${benchmarks.length} benchmarks, ${models.length} models`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());