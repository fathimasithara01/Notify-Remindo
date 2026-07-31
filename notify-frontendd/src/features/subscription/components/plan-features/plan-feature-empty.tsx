"use client";

import {
  Layers3,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface PlanFeatureEmptyProps {
  onAddFeature?: () => void;
}

export function PlanFeatureEmpty({
  onAddFeature,
}: PlanFeatureEmptyProps) {
  return (
    <div
      className="
        flex
        min-h-[280px]
        flex-col
        items-center
        justify-center
        rounded-lg
        border
        border-dashed
        px-6
        py-10
        text-center
      "
    >
      {/* Icon */}

      <div
        className="
          mb-4
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-muted
        "
      >
        <Layers3
          className="
            h-6
            w-6
            text-muted-foreground
          "
        />
      </div>

      {/* Title */}

      <h3
        className="
          text-base
          font-semibold
        "
      >
        No features assigned
      </h3>

      {/* Description */}

      <p
        className="
          mt-1
          max-w-sm
          text-sm
          text-muted-foreground
        "
      >
        This subscription plan doesn't
        have any features assigned yet.
        Add features to define what this
        plan includes.
      </p>

      {/* Action */}

      {onAddFeature && (
        <Button
          className="mt-5"
          onClick={onAddFeature}
        >
          <Plus
            className="
              mr-2
              h-4
              w-4
            "
          />

          Add Feature
        </Button>
      )}
    </div>
  );
}