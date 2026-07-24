import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileQuestion
            className="h-6 w-6 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <p className="mt-6 text-sm font-medium text-muted-foreground">
          Error 404
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The page you're looking for doesn't exist or may have
          been moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft
            className="h-4 w-4"
            aria-hidden="true"
          />

          Back to home
        </Link>
      </div>
    </main>
  );
}