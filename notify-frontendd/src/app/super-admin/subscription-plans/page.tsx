"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { SubscriptionPlanToolbar } from "@/features/subscription/components/plans/subscription-plan-toolbar";
import {getSubscriptionPlanColumns} from "@/features/subscription/components/plans/subscription-plan-columns";
import { SubscriptionPlanFormDialog } from "@/features/subscription/components/plans/subscription-plan-form-dialog";
import { DeleteSubscriptionPlanDialog } from "@/features/subscription/components/plans/delete-subscription-plan-dialog";
import { useBlockSubscriptionPlan, useSubscriptionPlans, useUnblockSubscriptionPlan } from "@/features/subscription/hooks/plans/useSubscriptionPlan";
import { useFeatures } from "@/features/subscription/hooks/features/useFeature";
import { Currency, SubscriptionPlan, SubscriptionPlanStatus } from "@/features/subscription/types/subscription-plan.types";

export default function SubscriptionPlansPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubscriptionPlanStatus | "all">("all");
  const [currency, setCurrency] = useState<Currency | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<SubscriptionPlan | null>(null);

  const { data: plansResult, isLoading } = useSubscriptionPlans({
    search,
    status: status === "all" ? undefined : status,
    currency: currency === "all" ? undefined : currency,
  });
  const { data: featuresResult } = useFeatures({});
  const blockPlan = useBlockSubscriptionPlan();
  const unblockPlan = useUnblockSubscriptionPlan();

  const plans = plansResult?.items ?? []; // TODO: confirm actual field name on PaginatedResult<T> (items/results/rows/data)
  const features = featuresResult?.items ?? [];

  const handleCreate = () => {
    setEditingPlan(null);
    setFormOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormOpen(true);
  };

  const columns = getSubscriptionPlanColumns({
    onEdit: handleEdit,
    onDelete: (plan) => setDeletingPlan(plan),
    onBlock: (plan) => blockPlan.mutate(plan.id),
    onUnblock: (plan) => unblockPlan.mutate(plan.id),
  });

  return (
    <div className="space-y-4 p-6">
      <SubscriptionPlanToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={handleCreate}
        status={status}
        onStatusChange={setStatus}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <DataTable
        columns={columns}
        data={plans}
        isLoading={isLoading}
      />

      <SubscriptionPlanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        plan={editingPlan}
        features={features}
      />

      <DeleteSubscriptionPlanDialog
        open={!!deletingPlan}
        plan={deletingPlan}
        onOpenChange={(open) => !open && setDeletingPlan(null)}
      />
    </div>
  );
}