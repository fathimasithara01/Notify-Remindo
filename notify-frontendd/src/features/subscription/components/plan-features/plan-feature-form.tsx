"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  createPlanFeatureSchema,
  CreatePlanFeatureFormData,
} from "../../schemas/plan-feature.schema";

import { useFeatures } from "../../hooks/features/use-features";
import { useAddPlanFeature } from "../../hooks/plan-features/use-add-plan-feature";

import { Feature } from "../../types/feature.types";

interface PlanFeatureFormProps {
  planId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PlanFeatureForm({
  planId,
  onSuccess,
  onCancel,
}: PlanFeatureFormProps) {
  const form = useForm<CreatePlanFeatureFormData>({
    resolver: zodResolver(
      createPlanFeatureSchema
    ),

    defaultValues: {
      featureId: "",
      value: "",
    },
  });

  const addMutation =
    useAddPlanFeature();

  const {
    data: featuresData,
    isLoading: featuresLoading,
  } = useFeatures({
    page: 1,
    limit: 100,
    status: "active",
  });

  const features =
    featuresData?.items ?? [];

  const selectedFeatureId =
    form.watch("featureId");

  const selectedFeature = useMemo(
    () =>
      features.find(
        (feature) =>
          feature.id ===
          selectedFeatureId
      ),
    [
      features,
      selectedFeatureId,
    ]
  );

  /*
   * Reset value whenever the selected
   * feature changes.
   */
  useEffect(() => {
    form.setValue("value", "");
  }, [
    selectedFeatureId,
    form,
  ]);

  const onSubmit = (
    data: CreatePlanFeatureFormData
  ) => {
    let value:
      | string
      | number
      | boolean
      | null = data.value;

    /*
     * Convert the form value according
     * to the feature data type.
     */
    if (
      selectedFeature?.dataType ===
      "number"
    ) {
      value =
        data.value === ""
          ? 0
          : Number(data.value);
    }

    if (
      selectedFeature?.dataType ===
      "boolean"
    ) {
      value =
        data.value === true ||
        data.value === "true";
    }

    addMutation.mutate(
      {
        planId,

        data: {
          featureId:
            data.featureId,

          value,
        },
      },
      {
        onSuccess: () => {
          form.reset({
            featureId: "",
            value: "",
          });

          onSuccess?.();
        },
      }
    );
  };

  const isPending =
    addMutation.isPending ||
    featuresLoading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-6"
      >

        {/* Feature */}

        <FormField
          control={form.control}
          name="featureId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Feature
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={
                  field.onChange
                }
                disabled={
                  isPending
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        featuresLoading
                          ? "Loading features..."
                          : "Select a feature"
                      }
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>

                  {features.map(
                    (feature) => (
                      <SelectItem
                        key={
                          feature.id
                        }
                        value={
                          feature.id
                        }
                      >
                        {feature.label}
                      </SelectItem>
                    )
                  )}

                </SelectContent>
              </Select>

              <FormDescription>
                Select the feature that
                should be included in this
                plan.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selected feature information */}

        {selectedFeature && (
          <div
            className="
              rounded-lg
              border
              bg-muted/40
              p-4
              space-y-2
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <span className="font-medium">
                {selectedFeature.label}
              </span>

              <code
                className="
                  rounded
                  bg-background
                  px-2
                  py-1
                  text-xs
                "
              >
                {selectedFeature.key}
              </code>
            </div>

            {selectedFeature.description && (
              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                {
                  selectedFeature.description
                }
              </p>
            )}

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              Type:{" "}
              <span className="font-medium">
                {selectedFeature.dataType}
              </span>
            </p>
          </div>
        )}

        {/* Value */}

        {selectedFeature && (
          <FormField
            control={form.control}
            name="value"
            render={({
              field,
            }) => (
              <FormItem>

                <FormLabel>
                  Value
                </FormLabel>

                {selectedFeature.dataType ===
                  "boolean" && (
                  <Select
                    value={
                      field.value ===
                      true
                        ? "true"
                        : field.value ===
                            false
                          ? "false"
                          : ""
                    }
                    onValueChange={(
                      value
                    ) => {
                      field.onChange(
                        value ===
                          "true"
                      );
                    }}
                    disabled={
                      addMutation.isPending
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="true">
                        Enabled
                      </SelectItem>

                      <SelectItem value="false">
                        Disabled
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {selectedFeature.dataType ===
                  "number" && (
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1"
                      value={
                        field.value ===
                        undefined ||
                        field.value ===
                          null
                          ? ""
                          : String(
                              field.value
                            )
                      }
                      onChange={(
                        event
                      ) => {
                        const value =
                          event.target
                            .value;

                        field.onChange(
                          value === ""
                            ? ""
                            : Number(
                                value
                              )
                        );
                      }}
                      disabled={
                        addMutation.isPending
                      }
                      placeholder="Enter numeric value"
                    />
                  </FormControl>
                )}

                {selectedFeature.dataType ===
                  "string" && (
                  <FormControl>
                    <Input
                      type="text"
                      value={
                        field.value ===
                        undefined ||
                        field.value ===
                          null
                          ? ""
                          : String(
                              field.value
                            )
                      }
                      onChange={
                        field.onChange
                      }
                      disabled={
                        addMutation.isPending
                      }
                      placeholder="Enter value"
                    />
                  </FormControl>
                )}

                <FormDescription>
                  Value configured for this
                  feature in the selected
                  plan.
                </FormDescription>

                <FormMessage />

              </FormItem>
            )}
          />
        )}

        {/* Actions */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            pt-5
          "
        >
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={
                addMutation.isPending
              }
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            disabled={
              isPending ||
              !selectedFeature
            }
          >
            {addMutation.isPending ? (
              <>
                <Loader2
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Adding...
              </>
            ) : (
              "Add Feature"
            )}
          </Button>
        </div>

      </form>
    </Form>
  );
}