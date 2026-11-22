import { z } from "zod";

// Treats empty strings as "not provided"
const optStr = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

export const modelsQuerySchema = z.object({
  q: optStr,
  lab: optStr,
  provider: optStr,
  type: z.enum(["LLM", "IMAGE", "EMBEDDING", "AUDIO", "MULTIMODAL"]).optional(),
  capability: optStr,
  sort: z.enum(["release_desc", "price_asc", "price_desc", "context_desc"]).default("release_desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type ModelsQuery = z.infer<typeof modelsQuerySchema>;

export const compareQuerySchema = z.object({
  models: z
    .string()
    .transform((s) => [...new Set(s.split(",").map((x) => x.trim()).filter(Boolean))])
    .pipe(z.array(z.string()).min(2, "Select at least 2 models").max(4, "Select at most 4 models")),
});

export const rankingsQuerySchema = z.object({
  type: z.enum(["LLM", "IMAGE", "EMBEDDING", "AUDIO", "MULTIMODAL"]).optional(),
  benchmark: optStr,
  category: optStr,
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1, "Query is required").max(100),
});
