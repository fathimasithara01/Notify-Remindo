"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface SubscriptionPlanPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SubscriptionPlanPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SubscriptionPlanPaginationProps) {
  return (
    <div className="flex items-center justify-between">

      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-2">

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(currentPage + 1)
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

      </div>

    </div>
  );
}