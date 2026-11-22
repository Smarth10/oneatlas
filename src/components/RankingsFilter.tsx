"use client";

import { usePathname, useRouter } from "next/navigation";

type Key = "benchmark" | "category" | "type";

export default function RankingsFilter({
  benchmarks,
  categories,
  types,
  current,
}: {
  benchmarks: { name: string; slug: string; category: string }[];
  categories: string[];
  types: string[];
  current: { benchmark?: string; category?: string; type?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();

  // choosing a benchmark clears the benchmark category and vice versa; model type is independent
  function update(key: Key, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value && key === "benchmark") params.delete("category");
    if (value && key === "category") params.delete("benchmark");
    if (value) params.set(key, value);
    else params.delete(key);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const selectClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:max-w-3xl">
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Benchmark</span>
        <select value={current.benchmark ?? ""} onChange={(e) => update("benchmark", e.target.value)} className={selectClass}>
          <option value="">All benchmarks (average)</option>
          {benchmarks.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Benchmark category</span>
        <select value={current.category ?? ""} onChange={(e) => update("category", e.target.value)} className={selectClass}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Model type</span>
        <select value={current.type ?? ""} onChange={(e) => update("type", e.target.value)} className={selectClass}>
          <option value="">All model types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}