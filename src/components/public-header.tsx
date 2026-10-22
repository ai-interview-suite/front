import Link from "next/link";

export default function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white px-5 sm:px-8">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">
            InterviewPrep
          </span>

          <span className="hidden rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 sm:inline">
            AI Powered
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
