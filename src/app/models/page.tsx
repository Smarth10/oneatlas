import type { Metadata } from "next";
import { apiGet } from "@/lib/api-client";
import type { FiltersData, ModelListItem, Paginated } from "@/lib/types";
import FilterPanel from "@/components/FilterPanel";
import ModelCard from "@/components/ModelCard";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = { title: "Models" };

const KEYS = ["q", "lab", "provider", "type", "capability", "sort", "page"] as const;

export default async function ModelsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const current: Record<string, string | undefined> = {};
  for (const k of KEYS) {
    const v = raw[k];
    current[k] = Array.isArray(v) ? v[0] : v;
  }

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) if (v) qs.set(k, v);

  const [result, filters] = await Promise.all([
    apiGet<Paginated<ModelListItem>>(`/api/models?${qs.toString()}`),
    apiGet<{ data: FiltersData }>("/api/filters"),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Models</h1>
        <p className="text-sm text-slate-500">
          {result.total} model{result.total === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <FilterPanel filters={filters.data} current={current} />

        <section>
          {result.data.length === 0 ? (
            <EmptyState
              title="No models match your filters"
              message="Try removing a filter or searching for something else."
              href="/models"
              cta="Clear filters"
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {result.data.map((m) => (
                  <ModelCard key={m.id} model={m} />
                ))}
              </div>
              <Pagination page={result.page} totalPages={result.totalPages} basePath="/models" params={current} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
