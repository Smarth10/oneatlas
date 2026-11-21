import Link from "next/link";

const sections = [
  { href: "/models", title: "Discover models", text: "Search and filter models by lab, provider, capability and type." },
  { href: "/compare", title: "Compare side by side", text: "Pricing, context length, capabilities and benchmarks for 2–4 models." },
  { href: "/rankings", title: "Rankings", text: "Leaderboards across benchmarks and categories." },
  { href: "/labs", title: "AI labs", text: "Browse research labs and the models they release." },
  { href: "/providers", title: "Providers", text: "See which providers serve each model, and at what price." },
];

export default function HomePage() {
  return (
    <div>
      <section className="py-10 text-center sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Find the right <span className="text-indigo-600">AI model</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          OneAtlas helps developers, AI engineers and researchers discover, compare and evaluate models across
          labs and providers.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/models" className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700">
            Browse models
          </Link>
          <Link href="/rankings" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium hover:bg-slate-100">
            View rankings
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <h2 className="font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{s.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}