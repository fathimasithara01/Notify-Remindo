"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createFeatureSchema,
  CreateFeatureFormData,
} from "../../schemas/feature.schema"

import {
  Feature,
  FeatureDataType,
} from "../../types/feature.types";

import { useCreateFeature } from "../../hooks/features/use-create-feature";
import { useUpdateFeature } from "../../hooks/features/use-update-feature";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

import { Loader2 } from "lucide-react";

interface FeatureFormProps {
  feature?: Feature;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultValues: CreateFeatureFormData = {
  key: "",
  label: "",
  description: "",
  category: "",
  dataType: "boolean",
  displayOrder: 0,
  status: "active",
};

export function FeatureForm({
  feature,
  onSuccess,
  onCancel,
}: FeatureFormProps) {
  const isEdit = Boolean(feature);

  const createMutation = useCreateFeature();

  const updateMutation = useUpdateFeature();

  const form = useForm<CreateFeatureFormData>({
    resolver: zodResolver(createFeatureSchema),

    defaultValues,
  });

  /*
   * Populate form when editing.
   */
  useEffect(() => {
    if (!feature) {
      form.reset(defaultValues);
      return;
    }

    form.reset({
      key: feature.key,
      label: feature.label,
      description: feature.description ?? "",
      category: feature.category ?? "",
      dataType: feature.dataType,
      displayOrder: feature.displayOrder ?? 0,
      status: feature.status,
    });
  }, [feature, form]);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  const onSubmit = (
    data: CreateFeatureFormData
  ) => {
    /*
     * Update existing feature
     */
    if (isEdit && feature) {
      updateMutation.mutate(
        {
          id: feature.id,
          data,
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );

      return;
    }

    /*
     * Create new feature
     */
    createMutation.mutate(data, {
      onSuccess: () => {
        form.reset(defaultValues);
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Feature Key */}

        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Feature Key
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder="max_users"
                  disabled={isPending}
                />
              </FormControl>

              <FormDescription>
                Unique internal identifier used by
                the application.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feature Label */}

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Feature Name
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder="Maximum Users"
                  disabled={isPending}
                />
              </FormControl>

              <FormDescription>
                The name displayed to administrators
                and customers.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description
              </FormLabel>

              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Maximum number of users allowed..."
                  rows={3}
                  disabled={isPending}
                  className="resize-none"
                />
              </FormControl>

              <FormDescription>
                Optional explanation of what this
                feature controls.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Category
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder="Users"
                  disabled={isPending}
                />
              </FormControl>

              <FormDescription>
                Optional category used to group
                related features.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data Type */}

        <FormField
          control={form.control}
          name="dataType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Data Type
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={(
                  value: FeatureDataType
                ) => field.onChange(value)}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="boolean">
                    Boolean
                  </SelectItem>

                  <SelectItem value="string">
                    String
                  </SelectItem>

                  <SelectItem value="number">
                    Number
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormDescription>
                Determines what type of value this
                feature stores.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display Order */}

        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Display Order
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={field.value ?? 0}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    field.onChange(
                      value === ""
                        ? 0
                        : Number(value)
                    );
                  }}
                  disabled={isPending}
                />
              </FormControl>

              <FormDescription>
                Controls the order in which features
                appear.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Status
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="active">
                    Active
                  </SelectItem>

                  <SelectItem value="inactive">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormDescription>
                Inactive features cannot be assigned
                to new plans.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}

        <div className="flex justify-end gap-3 border-t pt-5">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                {isEdit
                  ? "Updating..."
                  : "Creating..."}
              </>
            ) : (
              <>
                {isEdit
                  ? "Update Feature"
                  : "Create Feature"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}