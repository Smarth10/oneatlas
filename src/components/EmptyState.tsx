import Link from "next/link";

export default function EmptyState({
  title,
  message,
  href,
  cta,
}: {
  title: string;
  message: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
      {href && cta && (
        <Link href={href} className="mt-5 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          {cta}
        </Link>
      )}
    </div>
  );
}