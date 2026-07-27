import { AlertTriangle } from 'lucide-react';

export function ErrorState({ message = 'Something went wrong.' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}