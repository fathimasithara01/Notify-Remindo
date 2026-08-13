"use client";

import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSubscriptionPlan } from "@/features/subscription/hooks/plans/useSubscriptionPlan";
import { useFeatures } from "@/features/subscription/hooks/features/useFeature";
import { SubscriptionPlanStatus } from "@/features/subscription/types/subscription-plan.types";

export default function SubscriptionPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: plan, isLoading } = useSubscriptionPlan(id);
  const { data: featuresResult } = useFeatures({});
  const allFeatures = featuresResult?.items ?? [];

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!plan) {
    return <div className="p-6">Plan not found.</div>;
  }

  const planFeatures = allFeatures.filter((f) => plan.featureIds.includes(f.id));

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{plan.title}</h1>
        <Badge
          variant={plan.status === SubscriptionPlanStatus.ACTIVE ? "default" : "secondary"}
        >
          {plan.status}
        </Badge>
      </div>

      {plan.description && (
        <p className="text-muted-foreground">{plan.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div>
          <div className="text-sm text-muted-foreground">Price</div>
          <div className="font-medium">
            {plan.amountValue} {plan.currency}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">User Limit</div>
          <div className="font-medium">{plan.userLimit}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Storage Limit</div>
          <div className="font-medium">{plan.storageLimit} GB</div>
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground mb-2">Features</div>
        {planFeatures.length ? (
          <div className="flex flex-wrap gap-2">
            {planFeatures.map((f) => (
              <Badge key={f.id} variant="outline">
                {f.title}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No features assigned.</div>
        )}
      </div>
    </div>
  );
}