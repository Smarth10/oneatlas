import Link from "next/link";
import Badge from "./Badge";
import type { CompareModel } from "@/lib/types";
import { formatContext, formatDate, formatPrice } from "@/lib/format";

// Marks the best value(s) in a row; no highlight if fewer than 2 values or all equal
function bestFlags(values: (number | null)[], mode: "max" | "min"): boolean[] {
  const nums = values.filter((v): v is number => v !== null);
  if (nums.length < 2 || new Set(nums).size === 1) return values.map(() => false);
  const target = mode === "max" ? Math.max(...nums) : Math.min(...nums);
  return values.map((v) => v === target);
}

function cheapest(m: CompareModel, key: "inputPricePerM" | "outputPricePerM"): number | null {
  const vals = m.providers.map((p) => p[key]).filter((v) => v > 0);
  return vals.length ? Math.min(...vals) : null;
}

function Section({ title, span }: { title: string; span: number }) {
  return (
    <tr className="border-t border-slate-200 bg-slate-100">
      <th colSpan={span} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </th>
    </tr>
  );
}

function Line({ label, cells, best }: { label: string; cells: React.ReactNode[]; best?: boolean[] }) {
  return (
    <tr className="border-t border-slate-100">
      <th scope="row" className="whitespace-nowrap bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-600">
        {label}
      </th>
      {cells.map((c, i) => (
        <td key={i} className={`px-4 py-3 text-sm ${best?.[i] ? "bg-emerald-50 font-semibold text-emerald-700" : ""}`}>
          {c}
        </td>
      ))}
    </tr>
  );
}

export default function CompareTable({ models }: { models: CompareModel[] }) {
  const span = models.length + 1;

  const contexts = models.map((m) => m.contextWindow);
  const inputs = models.map((m) => cheapest(m, "inputPricePerM"));
  const outputs = models.map((m) => cheapest(m, "outputPricePerM"));

  const capabilities = [...new Set(models.flatMap((m) => m.capabilities))].sort();

  const benchmarkNames = new Map<string, string>();
  for (const m of models) for (const s of m.scores) benchmarkNames.set(s.benchmark.slug, s.benchmark.name);
  const benchmarks = [...benchmarkNames.entries()].sort((a, b) => a[1].localeCompare(b[1]));

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            <th className="bg-slate-50 px-4 py-4" />
            {models.map((m) => (
              <th key={m.slug} className="px-4 py-4 text-left align-top">
                <Link href={`/models/${m.slug}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                  {m.name}
                </Link>
                <p className="text-xs font-normal text-slate-500">{m.lab.name}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <Section title="Overview" span={span} />
          <Line label="Type" cells={models.map((m) => <Badge key={m.slug} tone="indigo">{m.type}</Badge>)} />
          <Line label="Released" cells={models.map((m) => formatDate(m.releaseDate))} />
          <Line label="Providers" cells={models.map((m) => m.providers.map((p) => p.provider.name).join(", ") || "—")} />

          <Section title="Context and pricing" span={span} />
          <Line label="Context window" cells={contexts.map((c) => formatContext(c))} best={bestFlags(contexts, "max")} />
          <Line label="Cheapest input / 1M" cells={inputs.map((v) => formatPrice(v))} best={bestFlags(inputs, "min")} />
          <Line label="Cheapest output / 1M" cells={outputs.map((v) => formatPrice(v))} best={bestFlags(outputs, "min")} />

          <Section title="Modalities" span={span} />
          <Line label="Input" cells={models.map((m) => m.inputModalities.join(", "))} />
          <Line label="Output" cells={models.map((m) => m.outputModalities.join(", "))} />

          <Section title="Capabilities" span={span} />
          {capabilities.map((c) => (
            <Line
              key={c}
              label={c}
              cells={models.map((m) =>
                m.capabilities.includes(c) ? (
                  <span key={m.slug} className="font-semibold text-emerald-600">✓</span>
                ) : (
                  <span key={m.slug} className="text-slate-300">—</span>
                )
              )}
            />
          ))}

          <Section title="Benchmarks" span={span} />
          {benchmarks.length === 0 && (
            <tr>
              <td colSpan={span} className="px-4 py-4 text-sm text-slate-500">No benchmark scores for the selected models.</td>
            </tr>
          )}
          {benchmarks.map(([slug, name]) => {
            const values = models.map((m) => m.scores.find((s) => s.benchmark.slug === slug)?.score ?? null);
            return (
              <Line
                key={slug}
                label={name}
                cells={values.map((v) => (v === null ? "—" : v))}
                best={bestFlags(values, "max")}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}