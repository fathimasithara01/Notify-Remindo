"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import { useOrganizationSubscriptions } from "../../hooks/use-organization-subscriptions";


import {
  OrganizationSubscription,
  OrganizationSubscriptionStatus,
} from "../../types/organization-subscription.types";

import { OrganizationSubscriptionStatusBadge } from "./organization-subscription-status-badge";

import { OrganizationSubscriptionRowActions } from "./organization-subscription-row-actions";

import { RenewOrganizationSubscriptionDialog } from "./renew-organization-subscription-dialog";

import { CancelOrganizationSubscriptionDialog } from "./cancel-organization-subscription-dialog";

import { OrganizationSubscriptionSkeleton } from "./organization-subscription-skeleton";

import { OrganizationSubscriptionEmpty } from "./organization-subscription-empty";
import { useOrganizationSubscriptions } from "../../hooks/organization-subscriptions/use-organization-subscriptions";

interface OrganizationSubscriptionTableProps {
  organizationId: string;

  onCreateSubscription?: () => void;
}

export function OrganizationSubscriptionTable({
  organizationId,
  onCreateSubscription,
}: OrganizationSubscriptionTableProps) {
  const [page, setPage] =
    useState(1);

  const [status, setStatus] =
    useState<
      OrganizationSubscriptionStatus | "all"
    >("all");

  const [
    selectedSubscription,
    setSelectedSubscription,
  ] =
    useState<OrganizationSubscription | null>(
      null
    );

  const [
    renewDialogOpen,
    setRenewDialogOpen,
  ] = useState(false);

  const [
    cancelDialogOpen,
    setCancelDialogOpen,
  ] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } =
    useOrganizationSubscriptions({
      organizationId,
      page,
      limit: 10,
      status,
    });

  const subscriptions =
    data?.items ?? [];

  const handleRenew = (
    subscription: OrganizationSubscription
  ) => {
    setSelectedSubscription(
      subscription
    );

    setRenewDialogOpen(true);
  };

  const handleCancel = (
    subscription: OrganizationSubscription
  ) => {
    setSelectedSubscription(
      subscription
    );

    setCancelDialogOpen(true);
  };

  const handleRenewDialogChange = (
    open: boolean
  ) => {
    setRenewDialogOpen(open);

    if (!open) {
      setSelectedSubscription(null);
    }
  };

  const handleCancelDialogChange = (
    open: boolean
  ) => {
    setCancelDialogOpen(open);

    if (!open) {
      setSelectedSubscription(null);
    }
  };

  if (isLoading) {
    return (
      <OrganizationSubscriptionSkeleton
        rows={5}
      />
    );
  }

  if (isError) {
    return (
      <div
        className="
          flex
          min-h-[240px]
          items-center
          justify-center
          rounded-lg
          border
          border-destructive/30
          bg-destructive/5
          p-6
          text-center
        "
      >
        <div>
          <p className="font-medium text-destructive">
            Failed to load subscriptions
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <>
        <OrganizationSubscriptionEmpty
          onCreateSubscription={
            onCreateSubscription
          }
        />

        <RenewOrganizationSubscriptionDialog
          open={renewDialogOpen}
          onOpenChange={
            handleRenewDialogChange
          }
          subscription={
            selectedSubscription
          }
        />

        <CancelOrganizationSubscriptionDialog
          open={cancelDialogOpen}
          onOpenChange={
            handleCancelDialogChange
          }
          subscription={
            selectedSubscription
          }
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">
              Subscription History
            </h3>

            <p className="text-sm text-muted-foreground">
              View and manage this organization's
              subscription history.
            </p>
          </div>

          {onCreateSubscription && (
            <Button
              size="sm"
              onClick={
                onCreateSubscription
              }
            >
              Assign Subscription
            </Button>
          )}
        </div>

        {/* Status Filter */}

        <div className="flex items-center gap-2">
          <Button
            variant={
              status === "all"
                ? "secondary"
                : "outline"
            }
            size="sm"
            onClick={() => {
              setStatus("all");
              setPage(1);
            }}
          >
            All
          </Button>

          <Button
            variant={
              status === "active"
                ? "secondary"
                : "outline"
            }
            size="sm"
            onClick={() => {
              setStatus("active");
              setPage(1);
            }}
          >
            Active
          </Button>

          <Button
            variant={
              status === "expired"
                ? "secondary"
                : "outline"
            }
            size="sm"
            onClick={() => {
              setStatus("expired");
              setPage(1);
            }}
          >
            Expired
          </Button>

          <Button
            variant={
              status === "cancelled"
                ? "secondary"
                : "outline"
            }
            size="sm"
            onClick={() => {
              setStatus("cancelled");
              setPage(1);
            }}
          >
            Cancelled
          </Button>
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
                  Plan
                </TableHead>

                <TableHead>
                  Price
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Start Date
                </TableHead>

                <TableHead>
                  End Date
                </TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {subscriptions.map(
                (subscription) => (
                  <TableRow
                    key={
                      subscription.id
                    }
                  >
                    {/* Plan */}

                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {subscription.plan
                            ?.name ??
                            "Unknown Plan"}
                        </p>

                        {subscription.plan
                          ?.description && (
                          <p
                            className="
                              mt-1
                              max-w-[280px]
                              truncate
                              text-sm
                              text-muted-foreground
                            "
                          >
                            {
                              subscription
                                .plan
                                .description
                            }
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Price */}

                    <TableCell>
                      {subscription.plan ? (
                        <div>
                          <p className="font-medium">
                            {
                              subscription
                                .plan
                                .currency
                            }{" "}
                            {(
                              subscription
                                .plan
                                .priceInMinorUnit /
                              100
                            ).toFixed(2)}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            per{" "}
                            {
                              subscription
                                .plan
                                .billingInterval
                            }
                          </p>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Status */}

                    <TableCell>
                      <OrganizationSubscriptionStatusBadge
                        status={
                          subscription.status
                        }
                      />
                    </TableCell>

                    {/* Start Date */}

                    <TableCell>
                      <DateCell
                        value={
                          subscription.startDate
                        }
                      />
                    </TableCell>

                    {/* End Date */}

                    <TableCell>
                      <DateCell
                        value={
                          subscription.endDate
                        }
                      />
                    </TableCell>

                    {/* Actions */}

                    <TableCell className="text-right">
                      <OrganizationSubscriptionRowActions
                        subscription={
                          subscription
                        }
                        onRenew={
                          handleRenew
                        }
                        onCancel={
                          handleCancel
                        }
                        disabled={
                          isFetching
                        }
                      />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}

        <SubscriptionPagination
          page={page}
          totalPages={
            data?.totalPages ?? 1
          }
          onPageChange={setPage}
          disabled={isFetching}
        />
      </div>

      {/* Renew Dialog */}

      <RenewOrganizationSubscriptionDialog
        open={renewDialogOpen}
        onOpenChange={
          handleRenewDialogChange
        }
        subscription={
          selectedSubscription
        }
      />

      {/* Cancel Dialog */}

      <CancelOrganizationSubscriptionDialog
        open={cancelDialogOpen}
        onOpenChange={
          handleCancelDialogChange
        }
        subscription={
          selectedSubscription
        }
      />
    </>
  );
}

/* =========================================================
 * Date Cell
 * ========================================================= */

interface DateCellProps {
  value?: string | null;
}

function DateCell({
  value,
}: DateCellProps) {
  if (!value) {
    return (
      <span className="text-muted-foreground">
        -
      </span>
    );
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return (
      <span className="text-muted-foreground">
        -
      </span>
    );
  }

  return (
    <span className="text-sm">
      {new Intl.DateTimeFormat(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ).format(date)}
    </span>
  );
}

/* =========================================================
 * Pagination
 * ========================================================= */

interface SubscriptionPaginationProps {
  page: number;

  totalPages: number;

  onPageChange: (
    page: number
  ) => void;

  disabled?: boolean;
}

function SubscriptionPagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: SubscriptionPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={
            disabled ||
            page <= 1
          }
          onClick={() =>
            onPageChange(
              Math.max(1, page - 1)
            )
          }
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={
            disabled ||
            page >= totalPages
          }
          onClick={() =>
            onPageChange(
              Math.min(
                totalPages,
                page + 1
              )
            )
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}