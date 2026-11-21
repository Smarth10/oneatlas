import type { Metadata } from "next";
import { ApiError, apiGet } from "@/lib/api-client";
import type { CompareModel } from "@/lib/types";
import ComparePicker from "@/components/ComparePicker";
import CompareTable from "@/components/CompareTable";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = { title: "Compare models" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const value = Array.isArray(raw.models) ? raw.models[0] : raw.models;
  const slugs = [...new Set((value ?? "").split(",").map((s) => s.trim()).filter(Boolean))].slice(0, 4);

  let models: CompareModel[] = [];
  let selected: { slug: string; name: string }[] = [];
  let error: string | null = null;

  if (slugs.length >= 2) {
    try {
      const res = await apiGet<{ data: CompareModel[] }>(
        `/api/compare?models=${slugs.map(encodeURIComponent).join(",")}`
      );
      models = res.data;
      selected = models.map((m) => ({ slug: m.slug, name: m.name }));
    } catch (e) {
      error = e instanceof ApiError ? e.message : "Could not load the comparison.";
      selected = slugs.map((s) => ({ slug: s, name: s }));
    }
  } else if (slugs.length === 1) {
    try {
      const res = await apiGet<{ data: { slug: string; name: string } }>(`/api/models/${encodeURIComponent(slugs[0])}`);
      selected = [{ slug: res.data.slug, name: res.data.name }];
    } catch (e) {
      error = e instanceof ApiError ? e.message : "Could not load that model.";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Compare models</h1>
        <p className="text-sm text-slate-500">Pricing, context length, capabilities and benchmarks side by side.</p>
      </div>

      <ComparePicker selected={selected} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {models.length >= 2 ? (
        <CompareTable models={models} />
      ) : (
        !error && (
          <EmptyState
            title="Pick at least two models"
            message="Search for models above, or use the Compare link on any model card."
            href="/models"
            cta="Browse models"
          />
        )
      )}
    </div>
  );
}