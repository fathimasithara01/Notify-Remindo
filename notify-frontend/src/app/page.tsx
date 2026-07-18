import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            NotifyRemindo
          </h1>

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Enterprise Notification & Reminder Management Platform
          </p>

          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl bg-black px-6 py-3 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Continue to Super Admin
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}