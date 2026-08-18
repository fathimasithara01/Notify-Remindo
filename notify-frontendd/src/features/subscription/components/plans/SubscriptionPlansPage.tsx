"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  useSubscriptionPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  useBlockSubscriptionPlan,
  useUnblockSubscriptionPlan,
} from "../../hooks/plans/useSubscriptionPlan";
import {
  SubscriptionPlan,
  SubscriptionPlanFilters,
  SubscriptionPlanStatus,
} from "../../types/subscription-plan.types";
import { CreateSubscriptionPlanFormValues } from "../../schemas/subscription-plan.schema";
import { SubscriptionPlanTable } from "./SubscriptionPlanTable";
import { SubscriptionPlanForm } from "./SubscriptionPlanForm";
import { SubscriptionPlanStatusBadge } from "./SubscriptionPlanStatusBadge";
import { useDebouncedValue } from "../../hooks/features/use-debounced-value";

import { useAuth } from "@/providers/AuthProvider";
import { PERMISSIONS } from "@/config/permissions";
import { useFeatures } from "../../hooks/features/useFeature";

const PAGE_LIMIT = 10;

export function SubscriptionPlansPage() {
  const { hasPermission } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubscriptionPlanStatus | undefined>();

  const debouncedSearch = useDebouncedValue(search, 400);

  const filters: SubscriptionPlanFilters = {
    page,
    limit: PAGE_LIMIT,
    search: debouncedSearch || undefined,
    status,
  };

  const { data, isLoading, isError, error } = useSubscriptionPlans(filters);

  const createPlan = useCreateSubscriptionPlan();
  const updatePlan = useUpdateSubscriptionPlan();
  const deletePlan = useDeleteSubscriptionPlan();
  const blockPlan = useBlockSubscriptionPlan();
  const unblockPlan = useUnblockSubscriptionPlan();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [actionPendingId, setActionPendingId] = useState<string | null>(null);


  const { data: featuresData } = useFeatures({ page: 1, limit: 100 });
  const allFeatures = featuresData?.items ?? [];

  const getFeatureNames = (featureIds: string[]) =>
    featureIds
      .map((id) => allFeatures.find((f) => f.id === id)?.title)
      .filter(Boolean) as string[];


  const [confirmAction, setConfirmAction] = useState<
    { type: "delete" | "block" | "unblock"; plan: SubscriptionPlan } | null
  >(null);

  const [viewingPlan, setViewingPlan] = useState<SubscriptionPlan | null>(null);

  const openViewModal = (plan: SubscriptionPlan) => {
    setViewingPlan(plan);
  };

  const closeViewModal = () => setViewingPlan(null);

  const plans = data?.items ?? [];
  // const total = data?.total ?? 0;
  // const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const openCreateForm = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const openEditForm = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = (values: CreateSubscriptionPlanFormValues) => {
    if (editingPlan) {
      updatePlan.mutate(
        { id: editingPlan.id, payload: values },
        { onSuccess: closeForm }
      );
    } else {
      createPlan.mutate(values, { onSuccess: closeForm });
    }
  };

  const handleDelete = (plan: SubscriptionPlan) => {
    setConfirmAction({ type: "delete", plan });
  };

  const handleToggleStatus = (plan: SubscriptionPlan) => {
    setConfirmAction({
      type: plan.status === SubscriptionPlanStatus.ACTIVE ? "block" : "unblock",
      plan,
    });
  };

  const runConfirmedAction = () => {
    if (!confirmAction) return;
    const { type, plan } = confirmAction;
    setActionPendingId(plan.id);
    const mutation =
      type === "delete" ? deletePlan : type === "block" ? blockPlan : unblockPlan;
    mutation.mutate(plan.id, {
      onSettled: () => setActionPendingId(null),
    });
    setConfirmAction(null);
  };

  const isSubmitting = createPlan.isPending || updatePlan.isPending;
  const mutationError =
    createPlan.error ?? updatePlan.error ?? deletePlan.error ??
    blockPlan.error ?? unblockPlan.error;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Subscription Plans</h1>
        {hasPermission(PERMISSIONS.PLAN_CREATE) && (
          <Button onClick={openCreateForm}>New plan</Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search plans..."
          className="w-64"
        />
        <Select
          value={status ?? "all"}
          onValueChange={(v) => {
            setStatus(v === "all" ? undefined : (v as SubscriptionPlanStatus));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={SubscriptionPlanStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={SubscriptionPlanStatus.INACTIVE}>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(isError || mutationError) && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {(error as Error)?.message ?? (mutationError as Error)?.message ?? "Something went wrong"}
        </div>
      )}

      <SubscriptionPlanTable
        plans={plans}
        isLoading={isLoading}
        actionPendingId={actionPendingId}
        onView={openViewModal}
        onEdit={openEditForm}
        // onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Page {page} of {totalPages} &middot; {total} total</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div> */}

      {/* Create / Edit form dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit plan" : "New plan"}</DialogTitle>
          </DialogHeader>
          <SubscriptionPlanForm
            plan={editingPlan}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>

      {/* Read-only view dialog */}
      <Dialog open={!!viewingPlan} onOpenChange={(open) => !open && closeViewModal()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewingPlan?.title}</DialogTitle>
          </DialogHeader>
          {viewingPlan && (
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <SubscriptionPlanStatusBadge status={viewingPlan.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span>
                  {viewingPlan.amountValue} {viewingPlan.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User Limit</span>
                <span>{viewingPlan.userLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage</span>
                <span>{viewingPlan.storageLimit} GB</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Features</span>
                {viewingPlan.featureIds.length === 0 ? (
                  <span className="text-muted-foreground">No features</span>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {getFeatureNames(viewingPlan.featureIds).map((name, idx) => (
                      <li
                        key={idx}
                        className="rounded-md bg-muted px-2 py-1 text-sm"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "delete" && "Delete plan?"}
              {confirmAction?.type === "block" && "Block plan?"}
              {confirmAction?.type === "unblock" && "Unblock plan?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "delete" &&
                `"${confirmAction.plan.title}" will be permanently deleted. This can't be undone.`}
              {confirmAction?.type === "block" &&
                `"${confirmAction.plan.title}" will be blocked and unavailable to subscribers.`}
              {confirmAction?.type === "unblock" &&
                `"${confirmAction.plan.title}" will be made available to subscribers again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={runConfirmedAction}
              className={
                confirmAction?.type === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}