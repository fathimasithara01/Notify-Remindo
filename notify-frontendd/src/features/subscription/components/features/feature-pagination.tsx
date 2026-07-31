"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface FeaturePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function FeaturePagination({
  page,
  totalPages,
  onPageChange,
}: FeaturePaginationProps) {

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (

    <div
      className="
        mt-6
        flex
        items-center
        justify-between
      "
    >

      <p className="text-sm text-muted-foreground">

        Page{" "}

        <span className="font-medium">
          {page}
        </span>

        {" "}of{" "}

        <span className="font-medium">
          {totalPages}
        </span>

      </p>

      <div className="flex items-center gap-2">

        <Button

          variant="outline"

          size="icon"

          disabled={page === 1}

          onClick={() =>
            onPageChange(page - 1)
          }

        >

          <ChevronLeft className="h-4 w-4" />

        </Button>

        {pages.map((pageNumber) => (

          <Button

            key={pageNumber}

            variant={
              pageNumber === page
                ? "default"
                : "outline"
            }

            size="icon"

            onClick={() =>
              onPageChange(pageNumber)
            }

          >

            {pageNumber}

          </Button>

        ))}

        <Button

          variant="outline"

          size="icon"

          disabled={page === totalPages}

          onClick={() =>
            onPageChange(page + 1)
          }

        >

          <ChevronRight className="h-4 w-4" />

        </Button>

      </div>

    </div>

  );

}