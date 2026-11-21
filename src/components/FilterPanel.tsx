"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { FiltersData } from "@/lib/types";

const SORTS = [
  { value: "release_desc", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "context_desc", label: "Context window: largest" },
];

function Select({
  label,
  defaultValue,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  allLabel?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <select
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {allLabel && <option value="">{allLabel}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function FilterPanel({
  filters,
  current,
}: {
  filters: FiltersData;
  current: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(current.q ?? "");
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // All filter state lives in the URL; changing a filter resets pagination
  function setParam(key: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function onSearch(value: string) {
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setParam("q", value.trim()), 300);
  }

  function clearAll() {
    clearTimeout(timer.current);
    setQ("");
    router.replace(pathname, { scroll: false });
  }

  const active = ["q", "lab", "provider", "type", "capability"].filter((k) => current[k]).length;
  // remount the selects when the URL changes (e.g. after "Clear all")
  const selectKey = [current.sort, current.type, current.lab, current.provider, current.capability].join("|");

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mb-3 flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium lg:hidden"
      >
        <span>Filters{active > 0 ? ` (${active})` : ""}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      <div className={`${open ? "block" : "hidden"} space-y-4 rounded-xl border border-slate-200 bg-white p-4 lg:block`}>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Search</span>
          <input
            type="search"
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Model name or lab…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>

        <div key={selectKey} className="space-y-4">
          <Select
            label="Sort by"
            defaultValue={current.sort ?? "release_desc"}
            options={SORTS}
            onChange={(v) => setParam("sort", v)}
          />
          <Select
            label="Model type"
            defaultValue={current.type ?? ""}
            allLabel="All types"
            options={filters.types.map((t) => ({ value: t, label: t }))}
            onChange={(v) => setParam("type", v)}
          />
          <Select
            label="Lab"
            defaultValue={current.lab ?? ""}
            allLabel="All labs"
            options={filters.labs.map((l) => ({ value: l.slug, label: l.name }))}
            onChange={(v) => setParam("lab", v)}
          />
          <Select
            label="Provider"
            defaultValue={current.provider ?? ""}
            allLabel="All providers"
            options={filters.providers.map((p) => ({ value: p.slug, label: p.name }))}
            onChange={(v) => setParam("provider", v)}
          />
          <Select
            label="Capability"
            defaultValue={current.capability ?? ""}
            allLabel="Any capability"
            options={filters.capabilities.map((c) => ({ value: c, label: c }))}
            onChange={(v) => setParam("capability", v)}
          />
        </div>

        {active > 0 && (
          <button type="button" onClick={clearAll} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Clear all filters
          </button>
        )}
      </div>
    </aside>
  );
}