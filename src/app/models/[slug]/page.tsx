import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, apiGet } from "@/lib/api-client";
import type { ModelDetail } from "@/lib/types";
import { formatContext, formatDate, formatPrice } from "@/lib/format";
import Badge from "@/components/Badge";
import ScoreBar from "@/components/ScoreBar";

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let model: ModelDetail;
  try {
    model = (await apiGet<{ data: ModelDetail }>(`/api/models/${encodeURIComponent(slug)}`)).data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const cheapestInput = model.providers.length ? Math.min(...model.providers.map((p) => p.inputPricePerM)) : null;
  const scores = [...model.scores].sort((a, b) => b.score - a.score);

  const specs = [
    { label: "Context window", value: `${formatContext(model.contextWindow)} tokens` },
    { label: "Released", value: formatDate(model.releaseDate) },
    { label: "Type", value: model.type },
    { label: "Input modalities", value: model.inputModalities.join(", ") },
    { label: "Output modalities", value: model.outputModalities.join(", ") },
    { label: "Providers", value: String(model.providers.length) },
  ];

  return (
    <div className="space-y-8">
      <nav className="text-sm text-slate-500">
        <Link href="/models" className="hover:text-indigo-600">Models</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{model.name}</span>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{model.name}</h1>
            <Badge tone="indigo">{model.type}</Badge>
          </div>
          <p className="mt-1 text-slate-600">
            by{" "}
            <Link href={`/labs/${model.lab.slug}`} className="font-medium text-indigo-600 hover:text-indigo-800">
              {model.lab.name}
            </Link>
          </p>
          <p className="mt-3 max-w-2xl text-slate-600">{model.description}</p>
        </div>
        <Link
          href={`/compare?models=${model.slug}`}
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add to compare
        </Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-1">
          <h2 className="mb-4 font-semibold">Specifications</h2>
          <dl className="space-y-3 text-sm">
            {specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4">
                <dt className="text-slate-500">{s.label}</dt>
                <dd className="text-right font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Pricing by provider</h2>
          {model.providers.length === 0 ? (
            <p className="text-sm text-slate-500">No providers list this model yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-2 font-medium">Provider</th>
                    <th className="pb-2 font-medium">Input / 1M tokens</th>
                    <th className="pb-2 font-medium">Output / 1M tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {model.providers.map((p) => (
                    <tr key={p.provider.id} className="border-t border-slate-100">
                      <td className="py-3">
                        <Link href={`/providers/${p.provider.slug}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                          {p.provider.name}
                        </Link>
                        {p.inputPricePerM === cheapestInput && model.providers.length > 1 && (
                          <span className="ml-2"><Badge tone="green">Cheapest</Badge></span>
                        )}
                      </td>
                      <td className="py-3 tabular-nums">{formatPrice(p.inputPricePerM)}</td>
                      <td className="py-3 tabular-nums">{formatPrice(p.outputPricePerM)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold">Capabilities</h2>
          <div className="flex flex-wrap gap-2">
            {model.capabilities.map((c) => (
              <Badge key={c} tone="indigo">{c}</Badge>
            ))}
          </div>
          <h3 className="mb-2 mt-6 text-sm font-medium text-slate-500">Supported modalities</h3>
          <div className="flex flex-wrap gap-2">
            {model.inputModalities.map((m) => (
              <Badge key={`in-${m}`}>in: {m}</Badge>
            ))}
            {model.outputModalities.map((m) => (
              <Badge key={`out-${m}`}>out: {m}</Badge>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold">Benchmarks</h2>
          {scores.length === 0 ? (
            <p className="text-sm text-slate-500">No benchmark scores available for this model.</p>
          ) : (
            <div className="space-y-4">
              {scores.map((s) => (
                <ScoreBar
                  key={s.benchmark.id}
                  label={s.benchmark.name}
                  sub={s.benchmark.category}
                  score={s.score}
                  max={s.benchmark.maxScore}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}