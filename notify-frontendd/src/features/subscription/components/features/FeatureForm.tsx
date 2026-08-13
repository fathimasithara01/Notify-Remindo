"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFeatureSchema,
  CreateFeatureFormValues,
} from "../../schemas/feature.schema";
import { Feature } from "../../types/feature.types";

interface FeatureFormProps {
  feature?: Feature | null;
  isSubmitting: boolean;
  onSubmit: (values: CreateFeatureFormValues) => void;
  onCancel: () => void;
}

export function FeatureForm({
  feature,
  isSubmitting,
  onSubmit,
  onCancel,
}: FeatureFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFeatureFormValues>({
    resolver: zodResolver(createFeatureSchema),
    defaultValues: {
      title: feature?.title ?? "",
      description: feature?.description ?? "",
      category: feature?.category ?? "",
    },
  });

  useEffect(() => {
    reset({
      title: feature?.title ?? "",
      description: feature?.description ?? "",
      category: feature?.category ?? "",
    });
  }, [feature, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        {errors.title && (
          <span className="text-xs text-red-600">{errors.title.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="category"
          className="text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <input
          id="category"
          type="text"
          {...register("category")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        {errors.category && (
          <span className="text-xs text-red-600">
            {errors.category.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className="resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        {errors.description && (
          <span className="text-xs text-red-600">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : feature ? "Save changes" : "Create feature"}
        </button>
      </div>
    </form>
  );
}