"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Feature }from "../../types/feature.types";

import { useFeatures } from "../../hooks/features/use-features";

import { FeatureStatusBadge } from "../../components/features/feature-status-badge";
import { FeatureRowActions } from "../../components/features/feature-row-actions";
import { FeatureSkeleton } from "../../components/features/feature-skeleton";
import { FeatureEmpty } from "../../components/features/feature-empty";
import { FeaturePagination } from "../../components/features/feature-pagination";
import { DeleteFeatureDialog } from "../../components/features/delete-feature-dialog";

interface FeatureTableProps {
  search?: string;
  status?: "active" | "inactive";
  onEdit: (feature: Feature) => void;
  onCreate: () => void;
}

export function FeatureTable({
  search = "",
  status,
  onEdit,
  onCreate,
}: FeatureTableProps) {
  const [page, setPage] = useState(1);

  const [deleteFeature, setDeleteFeature] =
    useState<Feature | undefined>();

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const {
    data,
    isLoading,
    isFetching,
  } = useFeatures({
    page,
    limit: 10,
    search: search || undefined,
    status,
  });

  const features = data?.items ?? [];

  const handleDelete = (feature: Feature) => {
    setDeleteFeature(feature);
    setDeleteOpen(true);
  };

  /*
   * When search/filter changes, return to page 1.
   */
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  /*
   * Initial loading state
   */
  if (isLoading) {
    return <FeatureSkeleton rows={8} />;
  }

  /*
   * Empty state
   */
  if (features.length === 0) {
    return (
      <FeatureEmpty
        onCreate={onCreate}
      />
    );
  }

  return (
    <div className="space-y-4">

      {/* Table */}

      <div className="relative overflow-hidden rounded-lg border bg-background">

        {isFetching && (
          <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-primary animate-pulse" />
        )}

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead className="min-w-[220px]">
                Feature
              </TableHead>

              <TableHead className="min-w-[180px]">
                Key
              </TableHead>

              <TableHead className="min-w-[140px]">
                Category
              </TableHead>

              <TableHead className="min-w-[120px]">
                Data Type
              </TableHead>

              <TableHead className="min-w-[100px]">
                Order
              </TableHead>

              <TableHead className="min-w-[110px]">
                Status
              </TableHead>

              <TableHead className="w-[70px] text-right">
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {features.map((feature) => (

              <TableRow
                key={feature.id}
                className="group"
              >

                {/* Feature */}

                <TableCell>

                  <div className="space-y-1">

                    <p className="font-medium">
                      {feature.label}
                    </p>

                    {feature.description && (
                      <p
                        className="
                          max-w-[320px]
                          truncate
                          text-sm
                          text-muted-foreground
                        "
                        title={feature.description}
                      >
                        {feature.description}
                      </p>
                    )}

                  </div>

                </TableCell>

                {/* Key */}

                <TableCell>

                  <code
                    className="
                      rounded
                      bg-muted
                      px-2
                      py-1
                      text-xs
                      font-medium
                    "
                  >
                    {feature.key}
                  </code>

                </TableCell>

                {/* Category */}

                <TableCell>

                  {feature.category ? (
                    <span className="text-sm">
                      {feature.category}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      —
                    </span>
                  )}

                </TableCell>

                {/* Data Type */}

                <TableCell>

                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      capitalize
                    "
                  >
                    {feature.dataType}
                  </span>

                </TableCell>

                {/* Display Order */}

                <TableCell>

                  <span className="text-sm">
                    {feature.displayOrder ?? 0}
                  </span>

                </TableCell>

                {/* Status */}

                <TableCell>

                  <FeatureStatusBadge
                    status={feature.status}
                  />

                </TableCell>

                {/* Actions */}

                <TableCell className="text-right">

                  <FeatureRowActions
                    feature={feature}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                  />

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

      {/* Pagination */}

      <FeaturePagination
        page={data?.page ?? page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={handlePageChange}
      />

      {/* Delete Dialog */}

      <DeleteFeatureDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);

          if (!open) {
            setDeleteFeature(undefined);
          }
        }}
        feature={deleteFeature}
      />

    </div>
  );
}