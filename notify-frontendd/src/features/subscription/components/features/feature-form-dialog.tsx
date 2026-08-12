// components/features/feature-form-dialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createFeatureSchema,
  CreateFeatureFormValues,
} from "../../schemas/feature.schema";
import { Feature } from "../../types/feature.types";
import { useCreateFeature, useUpdateFeature } from "../../hooks/features/useFeature";
import { toast } from "sonner";

interface FeatureFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: Feature | null;
}

export function FeatureFormDialog({
  open,
  onOpenChange,
  feature,
}: FeatureFormDialogProps) {
  const isEdit = !!feature;
  const createFeature = useCreateFeature();
  const updateFeature = useUpdateFeature();

  const form = useForm<CreateFeatureFormValues>({
    resolver: zodResolver(createFeatureSchema),
    defaultValues: { title: "", description: "", category: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: feature?.title ?? "",
        description: feature?.description ?? "",
        category: feature?.category ?? "",
      });
    }
  }, [open, feature, form]);

  const isPending = createFeature.isPending || updateFeature.isPending;

  const onSubmit = (values: CreateFeatureFormValues) => {
    if (isEdit && feature) {
      updateFeature.mutate(
        { id: feature.id, payload: values },
        {
          onSuccess: () => {
            toast.success("Feature updated");
            onOpenChange(false);
          },
          onError: () => toast.error("Failed to update feature"),
        }
      );
    } else {
      createFeature.mutate(values, {
        onSuccess: () => {
          toast.success("Feature created");
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to create feature"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Feature" : "New Feature"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AI Auto-Reply" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. automation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEdit ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}