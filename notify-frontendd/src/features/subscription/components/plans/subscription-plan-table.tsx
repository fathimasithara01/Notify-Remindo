"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  useSubscriptionPlans,
} from "../../hooks/plans/use-subscription-plans";

import {
  useDeleteSubscriptionPlan,
} from "../../hooks/plans/use-delete-subscription-plan";

import {
  SubscriptionPlan,
} from "../../types/subscription-plan.types";

import {
  SubscriptionPlanToolbar,
  SubscriptionPlanFilters,
} from "./subscription-plan-toolbar";

import {
  SubscriptionPlanSkeleton,
} from "./subscription-plan-skeleton";

import {
  SubscriptionPlanEmpty,
} from "./subscription-plan-empty";

import {
  SubscriptionPlanStatusBadge,
} from "./subscription-plan-status-badge";

import {
  SubscriptionPlanRowActions,
} from "./subscription-plan-row-actions";

import {
  DeleteSubscriptionPlanDialog,
} from "./delete-subscription-plan-dialog";

import {
  SubscriptionPlanPagination,
} from "./subscription-plan-pagination";

import { ROUTES } from "@/config/routes";

interface SubscriptionPlanTableProps {
  onEdit?: (
    plan: SubscriptionPlan
  ) => void;

  onCreate?: () => void;
}

export function SubscriptionPlanTable({
  onEdit,
  onCreate,
}: SubscriptionPlanTableProps) {
  const [page, setPage] = useState(1);

  const [filters, setFilters] =
    useState<SubscriptionPlanFilters>({
      search: "",
      status: "all",
    });

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan | null>(null);

  /* ================================================= */
  /* FETCH PLANS */
  /* ================================================= */

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useSubscriptionPlans({
    page,
    limit: 10,
    search:
      filters.search || undefined,
    status:
      filters.status === "all"
        ? undefined
        : filters.status,
  });

  /* ================================================= */
  /* DELETE */
  /* ================================================= */

  const deleteMutation =
    useDeleteSubscriptionPlan();

  const plans =
    data?.items ?? [];

  /* ================================================= */
  /* INITIAL LOADING */
  /* ================================================= */

  if (isLoading) {
    return (
      <SubscriptionPlanSkeleton />
    );
  }

  /* ================================================= */
  /* EMPTY STATE */
  /* ================================================= */

  if (!plans.length) {
    return (
      <SubscriptionPlanEmpty
        onCreate={() =>
          onCreate?.()
        }
      />
    );
  }

  /* ================================================= */
  /* RENDER */
  /* ================================================= */

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* TOOLBAR */}
      {/* ================================================= */}

      <SubscriptionPlanToolbar
        filters={filters}
        total={data?.total ?? 0}
        isRefreshing={isFetching}
        onFiltersChange={(value) => {
          setPage(1);
          setFilters(value);
        }}
        onRefresh={refetch}
        onCreate={() =>
          onCreate?.()
        }
      />

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <Card>

        <CardContent className="p-0">

          <div className="overflow-x-auto">

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead className="w-[35%] font-semibold">
                    Plan
                  </TableHead>

                  <TableHead className="font-semibold">
                    Price
                  </TableHead>

                  <TableHead className="font-semibold">
                    Billing
                  </TableHead>

                  <TableHead className="font-semibold">
                    Trial
                  </TableHead>

                  <TableHead className="font-semibold">
                    Status
                  </TableHead>

                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {plans.map((plan) => {

                  const isDeleting =
                    deleteMutation.isPending &&
                    deleteMutation.variables ===
                    plan.id;

                  return (
                    <TableRow
                      key={plan.id}
                      className="transition-colors hover:bg-muted/40"
                    >

                      {/* ================================================= */}
                      {/* PLAN */}
                      {/* ================================================= */}

                      <TableCell>

                        <div className="space-y-1">

                          <Link
                            href={ROUTES.subscriptions.detail(
                              plan.id
                            )}
                            className="font-medium hover:underline"
                          >
                            {plan.name}
                          </Link>

                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {plan.description ||
                              "No description provided"}
                          </p>

                        </div>

                      </TableCell>

                      {/* ================================================= */}
                      {/* PRICE */}
                      {/* ================================================= */}

                      <TableCell>

                        <span className="font-medium">

                          {new Intl.NumberFormat(
                            "en-IN",
                            {
                              style: "currency",
                              currency:
                                plan.currency,
                            }
                          ).format(
                            plan.priceInMinorUnit /
                            100
                          )}

                        </span>

                      </TableCell>

                      {/* ================================================= */}
                      {/* BILLING */}
                      {/* ================================================= */}

                      <TableCell>

                        <span className="inline-flex rounded-full border bg-muted px-3 py-1 text-xs font-medium capitalize">

                          {plan.billingInterval}

                        </span>

                      </TableCell>

                      {/* ================================================= */}
                      {/* TRIAL */}
                      {/* ================================================= */}

                      <TableCell>

                        {plan.trialDays &&
                          plan.trialDays > 0 ? (
                          <span className="text-sm font-medium">
                            {plan.trialDays} days
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}

                      </TableCell>

                      {/* ================================================= */}
                      {/* STATUS */}
                      {/* ================================================= */}

                      <TableCell>

                        <SubscriptionPlanStatusBadge
                          status={plan.status}
                        />

                      </TableCell>

                      {/* ================================================= */}
                      {/* ACTIONS */}
                      {/* ================================================= */}

                      <TableCell className="text-right">

                        <SubscriptionPlanRowActions
                          plan={plan}
                          isDeleting={isDeleting}
                          onEdit={(selectedPlan) =>
                            onEdit?.(
                              selectedPlan
                            )
                          }
                          onDelete={(selectedPlan) =>
                            setSelectedPlan(
                              selectedPlan
                            )
                          }
                        />

                      </TableCell>

                    </TableRow>
                  );
                })}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

      {/* ================================================= */}
      {/* DELETE CONFIRMATION */}
      {/* ================================================= */}

      <DeleteSubscriptionPlanDialog
        open={Boolean(selectedPlan)}
        plan={selectedPlan}
        loading={
          deleteMutation.isPending
        }
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPlan(null);
          }
        }}
        onConfirm={() => {

          if (!selectedPlan) {
            return;
          }

          deleteMutation.mutate(
            selectedPlan.id,
            {
              onSuccess: () => {
                setSelectedPlan(null);
              },
            }
          );
        }}
      />

      {/* ================================================= */}
      {/* PAGINATION */}
      {/* ================================================= */}

      {data &&
        data.totalPages > 1 && (
          <SubscriptionPlanPagination
            currentPage={page}
            totalPages={
              data.totalPages
            }
            onPageChange={setPage}
          />
        )}

    </div>
  );
}