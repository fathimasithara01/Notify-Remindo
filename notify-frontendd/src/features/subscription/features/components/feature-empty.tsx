"use client";

import { Plus, PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FeatureEmptyProps {
  onCreate?: () => void;
}

export function FeatureEmpty({
  onCreate,
}: FeatureEmptyProps) {

  return (

    <div
      className="
        flex
        min-h-[350px]
        flex-col
        items-center
        justify-center
        rounded-lg
        border
        border-dashed
        bg-muted/20
        px-6
        py-12
        text-center
      "
    >

      <div
        className="
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-primary/10
        "
      >

        <PackageSearch
          className="
            h-8
            w-8
            text-primary
          "
        />

      </div>

      <h3
        className="
          text-lg
          font-semibold
        "
      >
        No Features Found
      </h3>

      <p
        className="
          mt-2
          max-w-md
          text-sm
          text-muted-foreground
        "
      >
        You haven't created any features yet.
        Create your first feature to start
        assigning capabilities to subscription
        plans.
      </p>

      {onCreate && (

        <Button
          className="mt-6"
          onClick={onCreate}
        >

          <Plus className="mr-2 h-4 w-4" />

          Create Feature

        </Button>

      )}

    </div>

  );

}