"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { usePlanFeatures } from "../../hooks/plan-features/use-plan-features";

import { PlanFeatureWithDetails } from "../../types/plan-feature.types";

import { PlanFeatureRowActions } from "./plan-feature-row-actions";
import { RemovePlanFeatureDialog } from "./remove-plan-feature-dialog";
import { PlanFeatureSkeleton } from "./plan-feature-skeleton";
import { PlanFeatureEmpty } from "./plan-feature-empty";

interface PlanFeatureTableProps {
  planId: string;
  onAddFeature?: () => void;
}

export function PlanFeatureTable({
  planId,
  onAddFeature,
}: PlanFeatureTableProps) {
  const [selectedPlanFeature, setSelectedPlanFeature] =
    useState<PlanFeatureWithDetails | null>(null);

  const [removeDialogOpen, setRemoveDialogOpen] =
    useState(false);

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = usePlanFeatures(planId);

  const planFeatures = data?.items ?? [];

  const handleRemove = (
    planFeature: PlanFeatureWithDetails
  ) => {
    setSelectedPlanFeature(planFeature);
    setRemoveDialogOpen(true);
  };

  if (isLoading) {
    return <PlanFeatureSkeleton rows={5} />;
  }

  if (error) {
    return (
      <div
        className="
          flex
          min-h-[220px]
          items-center
          justify-center
          rounded-lg
          border
          border-destructive/30
          bg-destructive/5
          px-6
          text-center
        "
      >
        <div>
          <p className="font-medium text-destructive">
            Failed to load plan features
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (planFeatures.length === 0) {
    return (
      <>
        <PlanFeatureEmpty
          onAddFeature={onAddFeature}
        />

        <RemovePlanFeatureDialog
          open={removeDialogOpen}
          onOpenChange={setRemoveDialogOpen}
          planId={planId}
          planFeature={selectedPlanFeature}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Table Header */}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">
              Assigned Features
            </h3>

            <p className="text-sm text-muted-foreground">
              {planFeatures.length}{" "}
              {planFeatures.length === 1
                ? "feature"
                : "features"}{" "}
              assigned to this plan.
            </p>
          </div>

          {onAddFeature && (
            <Button
              size="sm"
              onClick={onAddFeature}
            >
              <Plus className="mr-2 h-4 w-4" />

              Add Feature
            </Button>
          )}
        </div>

        {/* Table */}

        <div className="relative rounded-lg border">
          {isFetching && (
            <div
              className="
                absolute
                inset-x-0
                top-0
                z-10
                h-0.5
                animate-pulse
                bg-primary
              "
            />
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Feature
                </TableHead>

                <TableHead>
                  Key
                </TableHead>

                <TableHead>
                  Value
                </TableHead>

                <TableHead>
                  Type
                </TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {planFeatures.map(
                (planFeature) => {
                  const feature =
                    planFeature.feature;

                  return (
                    <TableRow
                      key={
                        planFeature.id
                      }
                    >
                      {/* Feature */}

                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {feature?.label ??
                              "Unknown Feature"}
                          </p>

                          {feature?.description && (
                            <p
                              className="
                                mt-1
                                max-w-md
                                truncate
                                text-sm
                                text-muted-foreground
                              "
                            >
                              {
                                feature.description
                              }
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
                          "
                        >
                          {feature?.key ??
                            "-"}
                        </code>
                      </TableCell>

                      {/* Value */}

                      <TableCell>
                        <PlanFeatureValue
                          value={
                            planFeature.value
                          }
                          dataType={
                            feature?.dataType
                          }
                        />
                      </TableCell>

                      {/* Type */}

                      <TableCell>
                        <span
                          className="
                            rounded-md
                            bg-muted
                            px-2
                            py-1
                            text-xs
                            font-medium
                          "
                        >
                          {feature?.dataType ??
                            "-"}
                        </span>
                      </TableCell>

                      {/* Actions */}

                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <PlanFeatureRowActions
                            planFeature={
                              planFeature
                            }
                            onRemove={
                              handleRemove
                            }
                            disabled={
                              isFetching
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Remove Dialog */}

      <RemovePlanFeatureDialog
        open={removeDialogOpen}
        onOpenChange={
          (open) => {
            setRemoveDialogOpen(open);

            if (!open) {
              setSelectedPlanFeature(
                null
              );
            }
          }
        }
        planId={planId}
        planFeature={
          selectedPlanFeature
        }
      />
    </>
  );
}

/* =========================================================
 * Feature Value
 * ========================================================= */

interface PlanFeatureValueProps {
  value:
    | string
    | number
    | boolean
    | null
    | undefined;

  dataType?:
    | "boolean"
    | "string"
    | "number";
}

function PlanFeatureValue({
  value,
  dataType,
}: PlanFeatureValueProps) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return (
      <span className="text-muted-foreground">
        Not configured
      </span>
    );
  }

  if (
    dataType === "boolean" ||
    typeof value === "boolean"
  ) {
    return (
      <span
        className={
          value
            ? "font-medium text-emerald-600"
            : "font-medium text-muted-foreground"
        }
      >
        {value ? "Enabled" : "Disabled"}
      </span>
    );
  }

  return (
    <span className="font-medium">
      {String(value)}
    </span>
  );
}