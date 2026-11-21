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