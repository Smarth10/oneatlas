import type { Metadata } from "next";
import Link from "next/link";
import { apiGet } from "@/lib/api-client";
import type { LabSummary } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "AI Labs" };

export default async function LabsPage() {
  const { data: labs } = await apiGet<{ data: LabSummary[] }>("/api/labs");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Labs</h1>
        <p className="text-sm text-slate-500">Research labs and companies building AI models.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {labs.map((l) => (
          <Link key={l.id} href={`/labs/${l.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{l.name}</h2>
              {l.country && <span className="text-xs text-slate-400">{l.country}</span>}
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{l.description}</p>
            <p className="mt-4 text-sm font-medium text-indigo-600">
              {l._count.models} model{l._count.models === 1 ? "" : "s"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}