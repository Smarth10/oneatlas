export default function ScoreBar({
  label,
  score,
  max = 100,
  sub,
}: {
  label: string;
  score: number;
  max?: number;
  sub?: string;
}) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium text-slate-700">
          {label}
          {sub && <span className="ml-2 text-xs font-normal text-slate-400">{sub}</span>}
        </span>
        <span className="tabular-nums text-slate-900">{score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}