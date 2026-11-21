import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, apiGet } from "@/lib/api-client";
import type { ProviderDetail } from "@/lib/types";
import { formatContext, formatPrice } from "@/lib/format";
import Badge from "@/components/Badge";

export default async function ProviderDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let provider: ProviderDetail;
  try {
    provider = (await apiGet<{ data: ProviderDetail }>(`/api/providers/${encodeURIComponent(slug)}`)).data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">
        <Link href="/providers" className="hover:text-indigo-600">Providers</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{provider.name}</span>
      </nav>

      <header>
        <h1 className="text-3xl font-bold">{provider.name}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">{provider.description}</p>
        <p className="mt-2 text-sm">
          <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
            {provider.website}
          </a>
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-semibold">Supported models ({provider.models.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Lab</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Context</th>
                <th className="px-4 py-3 font-medium">Input / 1M</th>
                <th className="px-4 py-3 font-medium">Output / 1M</th>
              </tr>
            </thead>
            <tbody>
              {provider.models.map((row) => (
                <tr key={row.model.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/models/${row.model.slug}`} className="font-medium text-slate-900 hover:text-indigo-600">
                      {row.model.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/labs/${row.model.lab.slug}`} className="text-slate-600 hover:text-indigo-600">
                      {row.model.lab.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3"><Badge tone="indigo">{row.model.type}</Badge></td>
                  <td className="px-4 py-3">{formatContext(row.model.contextWindow)}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(row.inputPricePerM)}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(row.outputPricePerM)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}