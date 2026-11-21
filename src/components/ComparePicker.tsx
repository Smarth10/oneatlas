"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchResults } from "@/lib/types";

type Selected = { slug: string; name: string };

export default function ComparePicker({ selected }: { selected: Selected[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResults["models"]>([]);
  const full = selected.length >= 4;

  useEffect(() => {
    const term = q.trim();
    if (!term) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        if (res.ok) setResults((await res.json()).data.models);
      } catch {
        // aborted or network error
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  function go(slugs: string[]) {
    router.push(slugs.length ? `/compare?models=${slugs.join(",")}` : "/compare");
  }

  const chosen = new Set(selected.map((s) => s.slug));
  const options = q.trim() ? results.filter((m) => !chosen.has(m.slug)) : [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        {selected.map((s) => (
          <span key={s.slug} className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {s.name}
            <button
              type="button"
              aria-label={`Remove ${s.name}`}
              onClick={() => go(selected.filter((x) => x.slug !== s.slug).map((x) => x.slug))}
              className="text-indigo-400 hover:text-indigo-700"
            >
              ✕
            </button>
          </span>
        ))}
        {selected.length === 0 && <span className="text-sm text-slate-500">No models selected yet.</span>}
      </div>

      <div className="relative mt-3">
        <input
          type="search"
          value={q}
          disabled={full}
          onChange={(e) => setQ(e.target.value)}
          placeholder={full ? "Maximum of 4 models reached" : "Search a model to add…"}
          aria-label="Add a model to compare"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
        />
        {options.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
            {options.map((m) => (
              <li key={m.slug}>
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setResults([]);
                    go([...selected.map((s) => s.slug), m.slug]);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
                >
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs text-slate-500">{m.lab.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-400">Select 2 to 4 models. The best value in each row is highlighted in green.</p>
    </div>
  );
}