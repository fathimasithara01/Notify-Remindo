"use client";

import { useState } from "react";
import {
  useFeatures,
  useCreateFeature,
  useUpdateFeature,
  useDeleteFeature,
  useBlockFeature,
  useUnblockFeature,
} from "../../hooks/features/useFeature";
import { Feature, FeatureFilters, FeatureStatus } from "../../types/feature.types";
import { CreateFeatureFormValues } from "../../schemas/feature.schema";
import { FeatureTable } from "./FeatureTable";
import { FeatureForm } from "./FeatureForm";
import { useDebouncedValue } from "../../hooks/features/use-debounced-value";

const PAGE_LIMIT = 10;

export function FeaturesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FeatureStatus | undefined>(undefined);

  const debouncedSearch = useDebouncedValue(search, 400);

  const filters: FeatureFilters = {
    page,
    limit: PAGE_LIMIT,
    search: debouncedSearch || undefined,
    status,
  };

  const { data, isLoading, isError, error } = useFeatures(filters);

  const createFeature = useCreateFeature();
  const updateFeature = useUpdateFeature();
  const deleteFeature = useDeleteFeature();
  const blockFeature = useBlockFeature();
  const unblockFeature = useUnblockFeature();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [actionPendingId, setActionPendingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    { type: "delete" | "block" | "unblock"; feature: Feature } | null
  >(null);

  const features = data?.items ?? [];
  // const total = data?.total ?? 0;
  // const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: FeatureStatus | undefined) => {
    setStatus(value);
    setPage(1);
  };

  const openCreateForm = () => {
    setEditingFeature(null);
    setIsFormOpen(true);
  };

  const openEditForm = (feature: Feature) => {
    setEditingFeature(feature);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingFeature(null);
  };

  const handleSubmit = (values: CreateFeatureFormValues) => {
    if (editingFeature) {
      updateFeature.mutate(
        { id: editingFeature.id, payload: values },
        { onSuccess: closeForm }
      );
    } else {
      createFeature.mutate(values, { onSuccess: closeForm });
    }
  };

  const handleDelete = (feature: Feature) => {
    setConfirmAction({ type: "delete", feature });
  };

  const handleToggleStatus = (feature: Feature) => {
    setConfirmAction({
      type: feature.status === FeatureStatus.ACTIVE ? "block" : "unblock",
      feature,
    });
  };

  const runConfirmedAction = () => {
    if (!confirmAction) return;
    const { type, feature } = confirmAction;
    setActionPendingId(feature.id);
    const mutation =
      type === "delete" ? deleteFeature : type === "block" ? blockFeature : unblockFeature;
    mutation.mutate(feature.id, {
      onSettled: () => setActionPendingId(null),
    });
    setConfirmAction(null);
  };

  const isSubmitting = createFeature.isPending || updateFeature.isPending;
  const mutationError =
    createFeature.error ??
    updateFeature.error ??
    deleteFeature.error ??
    blockFeature.error ??
    unblockFeature.error;

  const confirmCopy = confirmAction && {
    title:
      confirmAction.type === "delete"
        ? "Delete feature?"
        : confirmAction.type === "block"
        ? "Block feature?"
        : "Unblock feature?",
    description:
      confirmAction.type === "delete"
        ? `"${confirmAction.feature.title}" will be permanently deleted. This can't be undone.`
        : confirmAction.type === "block"
        ? `"${confirmAction.feature.title}" will be blocked and unavailable.`
        : `"${confirmAction.feature.title}" will be made available again.`,
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Features</h1>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          New feature
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search features..."
          className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        <select
          value={status ?? ""}
          onChange={(e) =>
            handleStatusChange(
              e.target.value ? (e.target.value as FeatureStatus) : undefined
            )
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value={FeatureStatus.ACTIVE}>Active</option>
          <option value={FeatureStatus.INACTIVE}>Inactive</option>
        </select>
      </div>

      {(isError || mutationError) && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {(error as Error)?.message ??
            (mutationError as Error)?.message ??
            "Something went wrong"}
        </div>
      )}

      <FeatureTable
        features={features}
        isLoading={isLoading}
        actionPendingId={actionPendingId}
        onEdit={openEditForm}
        // onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Page {page} of {totalPages} &middot; {total} total
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-md border border-gray-300 px-3 py-1.5 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-md border border-gray-300 px-3 py-1.5 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div> */}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {editingFeature ? "Edit feature" : "New feature"}
            </h2>
            <FeatureForm
              feature={editingFeature}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      {confirmCopy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              {confirmCopy.title}
            </h2>
            <p className="mb-6 text-sm text-gray-600">{confirmCopy.description}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={runConfirmedAction}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                  confirmAction?.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}