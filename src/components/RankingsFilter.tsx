"use client";

import { usePathname, useRouter } from "next/navigation";

export default function RankingsFilter({
  benchmarks,
  categories,
  current,
}: {
  benchmarks: { name: string; slug: string; category: string }[];
  categories: string[];
  current: { benchmark?: string; category?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();

  // choosing a benchmark clears the category and vice versa
  function update(key: "benchmark" | "category", value: string) {
    router.replace(value ? `${pathname}?${key}=${encodeURIComponent(value)}` : pathname, { scroll: false });
  }

  const selectClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
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
        <span className="mb-1 block font-medium text-slate-700">Category</span>
        <select value={current.category ?? ""} onChange={(e) => update("category", e.target.value)} className={selectClass}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}