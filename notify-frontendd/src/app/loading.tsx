import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="flex min-h-[50vh] items-center justify-center"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="h-6 w-6 animate-spin text-muted-foreground"
          aria-hidden="true"
        />

        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
      </div>
    </main>
  );
}