"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SearchResults } from "@/lib/types";

function Group({
  title,
  items,
  onPick,
}: {
  title: string;
  items: { href: string; primary: string; secondary?: string }[];
  onPick: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-2 last:mb-0">
      <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          onClick={onPick}
          className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-slate-100"
        >
          <span className="font-medium text-slate-800">{it.primary}</span>
          {it.secondary && <span className="text-xs text-slate-500">{it.secondary}</span>}
        </Link>
      ))}
    </div>
  );
}

export default function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // debounced fetch from /api/search
  useEffect(() => {
    const term = q.trim();
    if (!term) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        if (res.ok) {
          const json = await res.json();
          setResults(json.data);
        }
      } catch {
        // aborted or network error
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  // close dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function pick() {
    setOpen(false);
    setQ("");
    onNavigate?.();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/models?q=${encodeURIComponent(term)}`);
    pick();
  }

  const show = open && q.trim().length > 0;
  const empty = results && !results.models.length && !results.labs.length && !results.providers.length;

  return (
    <div ref={wrapRef} className="relative">
      <form onSubmit={submit}>
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search models, labs, providers…"
          aria-label="Global search"
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </form>

      {show && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          {loading && !results && <p className="px-2 py-2 text-sm text-slate-500">Searching…</p>}
          {empty && <p className="px-2 py-2 text-sm text-slate-500">No results for “{q.trim()}”.</p>}
          {results && (
            <>
              <Group
                title="Models"
                onPick={pick}
                items={results.models.map((m) => ({
                  href: `/models/${m.slug}`,
                  primary: m.name,
                  secondary: m.lab.name,
                }))}
              />
              <Group
                title="Labs"
                onPick={pick}
                items={results.labs.map((l) => ({ href: `/labs/${l.slug}`, primary: l.name }))}
              />
              <Group
                title="Providers"
                onPick={pick}
                items={results.providers.map((p) => ({ href: `/providers/${p.slug}`, primary: p.name }))}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}