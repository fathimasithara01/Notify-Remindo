import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">{title}</p>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {action}
        </div>
    );
}