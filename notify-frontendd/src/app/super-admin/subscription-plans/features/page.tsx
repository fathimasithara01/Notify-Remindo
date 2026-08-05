"use client";

import { useState } from "react";

import {
  Plus,
  Layers3,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Feature } from "@/features/subscription/types/feature.types";
import { FeatureToolbar } from "@/features/subscription/components/features/feature-toolbar";

import { FeatureTable } from "@/features/subscription/components/features/feature-table";

import { FeatureDialog } from "@/features/subscription/components/features/feature-dialog";


export default function FeaturesPage() {

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<
      "all" |
      "active" |
      "inactive"
    >("all");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [selectedFeature, setSelectedFeature] =
    useState<Feature | undefined>();


  /*
   * Create Feature
   */
  const handleCreate = () => {

    setSelectedFeature(undefined);

    setDialogOpen(true);

  };


  /*
   * Edit Feature
   */
  const handleEdit = (
    feature: Feature
  ) => {

    setSelectedFeature(feature);

    setDialogOpen(true);

  };


  /*
   * Search
   */
  const handleSearchChange = (
    value: string
  ) => {

    setSearch(value);

  };


  /*
   * Status filter
   */
  const handleStatusChange = (
    value: string
  ) => {

    setStatus(
      value as
      | "all"
      | "active"
      | "inactive"
    );

  };


  return (

    <div className="space-y-6">

      {/* ========================= */}
      {/* Page Header */}
      {/* ========================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                bg-primary/10
              "
            >

              <Layers3
                className="
                  h-5
                  w-5
                  text-primary
                "
              />

            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                "
              >
                Features
              </h1>

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Manage features and capabilities
                available for subscription plans.
              </p>

            </div>

          </div>

        </div>


        {/* Mobile / header create button */}

        <Button
          onClick={handleCreate}
          className="sm:hidden"
        >

          <Plus
            className="
              mr-2
              h-4
              w-4
            "
          />

          New Feature

        </Button>

      </div>


      {/* ========================= */}
      {/* Main Card */}
      {/* ========================= */}

      <Card>

        <CardHeader>

          <CardTitle>
            Feature Management
          </CardTitle>

          <CardDescription>
            Create and manage capabilities
            that can be assigned to subscription
            plans.
          </CardDescription>

        </CardHeader>


        <CardContent className="space-y-6">

          {/* ========================= */}
          {/* Toolbar */}
          {/* ========================= */}

          <FeatureToolbar

            search={search}

            onSearchChange={
              handleSearchChange
            }

            status={status}

            onStatusChange={
              handleStatusChange
            }

            onRefresh={() => {
              /*
               * FeatureTable / React Query
               * handles the actual refresh.
               *
               * We trigger a small state update
               * here so the toolbar remains reusable.
               */
              setSearch(
                (current) => current
              );
            }}

            onCreate={handleCreate}

          />


          {/* ========================= */}
          {/* Feature Table */}
          {/* ========================= */}

          <FeatureTable

            search={search}

            status={
              status === "all"
                ? undefined
                : status
            }

            onEdit={handleEdit}

            onCreate={handleCreate}

          />

        </CardContent>

      </Card>


      {/* ========================= */}
      {/* Create / Edit Dialog */}
      {/* ========================= */}

      <FeatureDialog

        open={dialogOpen}

        onOpenChange={(
          open
        ) => {

          setDialogOpen(open);

          if (!open) {
            setSelectedFeature(
              undefined
            );
          }

        }}

        feature={selectedFeature}

      />

    </div>

  );

}