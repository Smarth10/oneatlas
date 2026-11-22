import type { Metadata } from "next";
import Link from "next/link";
import { apiGet } from "@/lib/api-client";
import type { FiltersData, RankingRow } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import RankingsFilter from "@/components/RankingsFilter";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = { title: "Rankings" };

// model types that have benchmark scores in the seed data
const RANKED_TYPES = ["LLM", "MULTIMODAL"];

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
  const benchmark = first(raw.benchmark);
  const category = first(raw.category);
  const type = first(raw.type);

  const qs = new URLSearchParams();
  if (benchmark) qs.set("benchmark", benchmark);
  if (category) qs.set("category", category);
  if (type) qs.set("type", type);

  const [ranking, filters] = await Promise.all([
    apiGet<{ data: RankingRow[]; total: number }>(`/api/rankings?${qs.toString()}`),
    apiGet<{ data: FiltersData }>("/api/filters"),
  ]);

  const benchName = filters.data.benchmarks.find((b) => b.slug === benchmark)?.name;
  const scoreLabel = benchName ?? (category ? `${category} (average)` : "Overall (average)");
  const rows = ranking.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rankings</h1>
        <p className="text-sm text-slate-500">
          Leaderboard by <span className="font-medium text-slate-700">{scoreLabel}</span>
          {type ? ` · ${type} models` : ""} · {ranking.total} models
        </p>
      </div>

      <RankingsFilter
        benchmarks={filters.data.benchmarks}
        categories={filters.data.categories}
        types={RANKED_TYPES}
        current={{ benchmark, category, type }}
      />

      {rows.length === 0 ? (
        <EmptyState title="No scores found" message="No models have scores for this selection." href="/rankings" cta="Reset" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Lab</th>
                <th className="w-1/3 px-4 py-3 font-medium">{scoreLabel}</th>
                <th className="px-4 py-3 font-medium">Input / 1M</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.model.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        r.rank <= 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/models/${r.model.slug}`} className="font-medium text-slate-900 hover:text-indigo-600">
                      {r.model.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/labs/${r.model.lab.slug}`} className="text-slate-600 hover:text-indigo-600">
                      {r.model.lab.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min(100, r.score)}%` }} />
                      </div>
                      <span className="w-10 text-right font-semibold tabular-nums">{r.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(r.model.minInputPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}