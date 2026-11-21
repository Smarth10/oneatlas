import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} OneAtlas · Model data is illustrative demo data.</p>
        <nav className="flex gap-4">
          <Link href="/models" className="hover:text-slate-800">Models</Link>
          <Link href="/rankings" className="hover:text-slate-800">Rankings</Link>
          <Link href="/labs" className="hover:text-slate-800">Labs</Link>
          <Link href="/providers" className="hover:text-slate-800">Providers</Link>
        </nav>
      </div>
    </footer>
  );
}