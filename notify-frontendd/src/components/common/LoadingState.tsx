import { Loader } from './Loader';

export function LoadingState({ label }: { label?: string }) {
    return (
        <div className="flex h-40 flex-col items-center justify-center gap-2">
            <Loader />
            {label && <p className="text-sm text-muted-foreground">{label}</p>}
        </div>
    );
}