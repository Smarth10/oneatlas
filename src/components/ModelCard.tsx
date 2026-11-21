import Link from "next/link";
import Badge from "./Badge";
import type { ModelListItem } from "@/lib/types";
import { formatContext, formatDate, formatPrice } from "@/lib/format";

export default function ModelCard({ model }: { model: ModelListItem }) {
  const cheapest = model.providers.length
    ? model.providers.reduce((a, b) => (a.inputPricePerM <= b.inputPricePerM ? a : b))
    : null;

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/models/${model.slug}`} className="block truncate font-semibold text-slate-900 hover:text-indigo-600">
            {model.name}
          </Link>
          <Link href={`/labs/${model.lab.slug}`} className="text-sm text-slate-500 hover:text-indigo-600">
            {model.lab.name}
          </Link>
        </div>
        <Badge tone="indigo">{model.type}</Badge>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{model.description}</p>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-xs text-slate-400">Context</dt>
          <dd className="font-medium">{formatContext(model.contextWindow)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Input / 1M</dt>
          <dd className="font-medium">{formatPrice(cheapest?.inputPricePerM)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Output / 1M</dt>
          <dd className="font-medium">{formatPrice(cheapest?.outputPricePerM)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {model.capabilities.slice(0, 4).map((c) => (
          <Badge key={c}>{c}</Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-500">
        <span>Released {formatDate(model.releaseDate)}</span>
        <Link href={`/compare?models=${model.slug}`} className="font-medium text-indigo-600 hover:text-indigo-800">
          + Compare
        </Link>
      </div>
    </article>
  );
}