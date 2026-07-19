'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/lib/types/pagination';

interface PaginationControlsProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

export function PaginationControls({ meta, onPageChange }: PaginationControlsProps) {
    if (meta.totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages} · {meta.total} total
            </p>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(meta.page - 1)}
                    disabled={meta.page <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(meta.page + 1)}
                    disabled={meta.page >= meta.totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}