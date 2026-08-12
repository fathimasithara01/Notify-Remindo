// app/(dashboard)/subscription/features/page.tsx
"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { FeatureToolbar } from "@/features/subscription/components/features/feature-toolbar";
import { getFeatureColumns } from "@/features/subscription/components/features/feature-columns";
import { FeatureFormDialog } from "@/features/subscription/components/features/feature-form-dialog";
import { DeleteFeatureDialog } from "@/features/subscription/components/features/delete-feature-dialog";
import {
  useFeatures,
  useBlockFeature,
  useUnblockFeature,
} from "@/features/subscription/hooks/features/useFeature";
import { Feature, FeatureStatus } from "@/features/subscription/types/feature.types";

export default function FeaturesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FeatureStatus | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [deletingFeature, setDeletingFeature] = useState<Feature | null>(null);

  const { data: featuresResult, isLoading } = useFeatures({
    search,
    status: status === "all" ? undefined : status,
  });
  const blockFeature = useBlockFeature();
  const unblockFeature = useUnblockFeature();

  const features = featuresResult?.items ?? []; // TODO: confirm actual field name on PaginatedResult<T>

  const handleCreate = () => {
    setEditingFeature(null);
    setFormOpen(true);
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormOpen(true);
  };

  const columns = getFeatureColumns({
    onEdit: handleEdit,
    onDelete: (feature) => setDeletingFeature(feature),
    onBlock: (feature) => blockFeature.mutate(feature.id),
    onUnblock: (feature) => unblockFeature.mutate(feature.id),
  });

  return (
    <div className="space-y-4 p-6">
      <FeatureToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={handleCreate}
        status={status}
        onStatusChange={setStatus}
      />

      <DataTable columns={columns} data={features} isLoading={isLoading} />

      <FeatureFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        feature={editingFeature}
      />

      <DeleteFeatureDialog
        open={!!deletingFeature}
        feature={deletingFeature}
        onOpenChange={(open) => !open && setDeletingFeature(null)}
      />
    </div>
  );
}