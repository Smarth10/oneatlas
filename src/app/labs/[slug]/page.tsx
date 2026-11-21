import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, apiGet } from "@/lib/api-client";
import type { LabDetail } from "@/lib/types";
import { formatContext, formatDate, formatPrice } from "@/lib/format";
import Badge from "@/components/Badge";

export default async function LabDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let lab: LabDetail;
  try {
    lab = (await apiGet<{ data: LabDetail }>(`/api/labs/${encodeURIComponent(slug)}`)).data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">
        <Link href="/labs" className="hover:text-indigo-600">Labs</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{lab.name}</span>
      </nav>

      <header>
        <h1 className="text-3xl font-bold">{lab.name}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">{lab.description}</p>
        <p className="mt-2 text-sm text-slate-500">
          {lab.country && <span className="mr-4">Based in {lab.country}</span>}
          <a href={lab.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
            {lab.website}
          </a>
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-semibold">Models and releases ({lab.models.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Context</th>
                <th className="px-4 py-3 font-medium">From (input / 1M)</th>
                <th className="px-4 py-3 font-medium">Released</th>
              </tr>
            </thead>
            <tbody>
              {lab.models.map((m) => (
                <tr key={m.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/models/${m.slug}`} className="font-medium text-slate-900 hover:text-indigo-600">
                      {m.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3"><Badge tone="indigo">{m.type}</Badge></td>
                  <td className="px-4 py-3">{formatContext(m.contextWindow)}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(m.minInputPrice)}</td>
                  <td className="px-4 py-3">{formatDate(m.releaseDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}