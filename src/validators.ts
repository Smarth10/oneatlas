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