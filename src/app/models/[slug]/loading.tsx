export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-200 lg:col-span-2" />
      </div>
    </div>
  );
}