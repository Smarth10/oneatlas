import type { Metadata } from "next";
import Link from "next/link";
import { apiGet } from "@/lib/api-client";
import type { ProviderSummary } from "@/lib/types";

export const metadata: Metadata = { title: "Providers" };

export default async function ProvidersPage() {
  const { data: providers } = await apiGet<{ data: ProviderSummary[] }>("/api/providers");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Providers</h1>
        <p className="text-sm text-slate-500">Platforms that serve models through an API.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <Link key={p.id} href={`/providers/${p.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.description}</p>
            <p className="mt-4 text-sm font-medium text-indigo-600">
              {p._count.models} model{p._count.models === 1 ? "" : "s"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}