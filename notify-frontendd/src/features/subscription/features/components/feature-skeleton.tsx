"use client";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FeatureSkeletonProps {
  rows?: number;
}

export function FeatureSkeleton({
  rows = 8,
}: FeatureSkeletonProps) {

  return (

    <div className="rounded-lg border bg-background">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>
              Label
            </TableHead>

            <TableHead>
              Key
            </TableHead>

            <TableHead>
              Category
            </TableHead>

            <TableHead>
              Data Type
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="w-16" />

          </TableRow>

        </TableHeader>

        <TableBody>

          {Array.from({
            length: rows,
          }).map((_, index) => (

            <TableRow key={index}>

              <TableCell>

                <div className="space-y-2">

                  <Skeleton className="h-4 w-40" />

                  <Skeleton className="h-3 w-56" />

                </div>

              </TableCell>

              <TableCell>

                <Skeleton className="h-4 w-32" />

              </TableCell>

              <TableCell>

                <Skeleton className="h-4 w-28" />

              </TableCell>

              <TableCell>

                <Skeleton className="h-8 w-24 rounded-full" />

              </TableCell>

              <TableCell>

                <Skeleton className="h-8 w-20 rounded-full" />

              </TableCell>

              <TableCell>

                <Skeleton className="ml-auto h-8 w-8 rounded-md" />

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>

  );

}