"use client";

import { Feature, FeatureStatus } from "../../types/feature.types";
import { FeatureStatusBadge } from "./FeatureStatusBadge";

interface FeatureTableProps {
  features: Feature[];
  isLoading: boolean;
  actionPendingId: string | null;
  onEdit: (feature: Feature) => void;
//   onDelete: (feature: Feature) => void;
  onToggleStatus: (feature: Feature) => void;
}

export function FeatureTable({
  features,
  isLoading,
  actionPendingId,
  onEdit,
//   onDelete,
  onToggleStatus,
}: FeatureTableProps) {
  if (isLoading && features.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-500">
        Loading features...
      </div>
    );
  }

  if (!isLoading && features.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-500">
        No features found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Updated</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {features.map((feature) => {
            const isPending = actionPendingId === feature.id;
            const isActive = feature.status === FeatureStatus.ACTIVE;

            return (
              <tr key={feature.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{feature.title}</td>
                <td className="px-4 py-3 max-w-xs">
                  <div className="line-clamp-1 text-gray-600">
                    {feature.description ?? "—"}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{feature.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <FeatureStatusBadge status={feature.status} />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(feature.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(feature)}
                      disabled={isPending}
                      className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onToggleStatus(feature)}
                      disabled={isPending}
                      className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      {isPending ? "..." : isActive ? "Block" : "Unblock"}
                    </button>
                    {/* <button
                      onClick={() => onDelete(feature)}
                      disabled={isPending}
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button> */}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}