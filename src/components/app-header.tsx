"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const router = useRouter();

  function handleSignOut() {
    sessionStorage.removeItem("access_token");
    router.push("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white px-5 sm:px-8">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          InterviewPrep
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            New interview
          </Link>

          <Link
            href="/interviews"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            My interviews
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
