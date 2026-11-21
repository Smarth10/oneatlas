export type ModelType = "LLM" | "IMAGE" | "EMBEDDING" | "AUDIO" | "MULTIMODAL";

export interface Ref {
  name: string;
  slug: string;
}

export interface ModelListItem {
  id: string;
  name: string;
  slug: string;
  type: ModelType;
  description: string;
  contextWindow: number;
  releaseDate: string;
  inputModalities: string[];
  outputModalities: string[];
  capabilities: string[];
  minInputPrice: number | null;
  lab: Ref;
  providers: {
    inputPricePerM: number;
    outputPricePerM: number;
    provider: Ref;
  }[];
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FiltersData {
  labs: Ref[];
  providers: Ref[];
  benchmarks: { name: string; slug: string; category: string }[];
  categories: string[];
  capabilities: string[];
  types: string[];
}

export interface SearchResults {
  models: { name: string; slug: string; type: ModelType; lab: { name: string } }[];
  labs: Ref[];
  providers: Ref[];
}
export interface ModelDetail {
  id: string;
  name: string;
  slug: string;
  type: ModelType;
  description: string;
  contextWindow: number;
  releaseDate: string;
  inputModalities: string[];
  outputModalities: string[];
  capabilities: string[];
  minInputPrice: number | null;
  lab: { id: string; name: string; slug: string; description: string; website: string; country: string | null };
  providers: {
    inputPricePerM: number;
    outputPricePerM: number;
    provider: { id: string; name: string; slug: string; description: string; website: string };
  }[];
  scores: {
    score: number;
    benchmark: { id: string; name: string; slug: string; category: string; maxScore: number };
  }[];
}

export interface CompareModel {
  id: string;
  name: string;
  slug: string;
  type: ModelType;
  contextWindow: number;
  releaseDate: string;
  inputModalities: string[];
  outputModalities: string[];
  capabilities: string[];
  lab: Ref;
  providers: { inputPricePerM: number; outputPricePerM: number; provider: Ref }[];
  scores: { score: number; benchmark: { name: string; slug: string; category: string; maxScore: number } }[];
}

export interface RankingRow {
  rank: number;
  score: number;
  benchmarks: string[];
  model: {
    id: string;
    name: string;
    slug: string;
    releaseDate: string;
    minInputPrice: number | null;
    lab: Ref;
  };
}

export interface LabSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  country: string | null;
  _count: { models: number };
}

export interface LabDetail extends Omit<LabSummary, "_count"> {
  models: {
    id: string;
    name: string;
    slug: string;
    type: ModelType;
    description: string;
    contextWindow: number;
    releaseDate: string;
    minInputPrice: number | null;
  }[];
}

export interface ProviderSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  _count: { models: number };
}

export interface ProviderDetail extends Omit<ProviderSummary, "_count"> {
  models: {
    inputPricePerM: number;
    outputPricePerM: number;
    model: {
      id: string;
      name: string;
      slug: string;
      type: ModelType;
      contextWindow: number;
      releaseDate: string;
      lab: Ref;
    };
  }[];
}
