"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { useUpdateOrganization } from "../hooks/useOrganizationMutations";

import {
  editOrganizationSchema,
  EditOrganizationFormValues,
} from "../schemas/organization.schema";

import { Organization } from "../types/organization.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditOrganizationDialogProps {
  organization: Organization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOrganizationDialog({
  organization,
  open,
  onOpenChange,
}: EditOrganizationDialogProps) {
  const organizationId =
    organization?.id ?? "";

  const updateMutation =
    useUpdateOrganization(organizationId);

  const form =
    useForm<EditOrganizationFormValues>({
      resolver: zodResolver(
        editOrganizationSchema
      ),

      defaultValues: {
        name: "",
        businessEmail: "",
        businessPhone: "",
        address: "",
      },

      mode: "onBlur",
    });


  useEffect(() => {
    if (!organization) {
      form.reset({
        name: "",
        businessEmail: "",
        businessPhone: "",
        address: "",
      });

      return;
    }

    form.reset({
      name: organization.name ?? "",
      businessEmail:
        organization.businessEmail ?? "",
      businessPhone:
        organization.businessPhone ?? "",
      address:
        organization.address ?? "",
    });
  }, [organization, form]);

  const onSubmit = (
    values: EditOrganizationFormValues
  ) => {
    if (!organizationId) {
      return;
    }

    updateMutation.mutate(values, {
      onSuccess: () => {
        form.reset(values);
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (
    nextOpen: boolean
  ) => {
    if (
      updateMutation.isPending &&
      !nextOpen
    ) {
      return;
    }

    onOpenChange(nextOpen);
  };

  const handleCancel = () => {
    if (updateMutation.isPending) {
      return;
    }

    form.reset();

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-[620px]">

        <DialogHeader>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>

            <div>

              <DialogTitle>
                Edit Organization
              </DialogTitle>

              <DialogDescription>
                Update the organization&apos;s business
                and contact information.
              </DialogDescription>

            </div>

          </div>

        </DialogHeader>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {updateMutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Unable to update organization. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-6"
          >

            {/* ================================================= */}
            {/* BUSINESS INFORMATION */}
            {/* ================================================= */}

            <div className="space-y-4">

              <div className="border-b pb-3">

                <h3 className="text-sm font-semibold">
                  Business Information
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Update the organization&apos;s basic
                  business information.
                </p>

              </div>

              {/* Organization Name */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>
                      Organization Name
                    </FormLabel>

                    <FormControl>

                      <div className="relative">

                        <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          {...field}
                          disabled={
                            updateMutation.isPending
                          }
                          className="pl-9"
                          placeholder="Enter organization name"
                          autoComplete="organization"
                        />

                      </div>

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

              {/* Address */}

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>
                      Business Address
                    </FormLabel>

                    <FormControl>

                      <div className="relative">

                        <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                        <Input
                          {...field}
                          disabled={
                            updateMutation.isPending
                          }
                          className="pl-9"
                          placeholder="Enter business address"
                          autoComplete="street-address"
                        />

                      </div>

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

            </div>

            {/* ================================================= */}
            {/* BUSINESS CONTACT */}
            {/* ================================================= */}

            <div className="space-y-4">

              <div className="border-b pb-3">

                <h3 className="text-sm font-semibold">
                  Business Contact
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Contact information used for official
                  organization communication.
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Email */}

                <FormField
                  control={form.control}
                  name="businessEmail"
                  render={({ field }) => (
                    <FormItem>

                      <FormLabel>
                        Business Email
                      </FormLabel>

                      <FormControl>

                        <div className="relative">

                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                          <Input
                            {...field}
                            type="email"
                            disabled={
                              updateMutation.isPending
                            }
                            className="pl-9"
                            placeholder="info@company.com"
                            autoComplete="email"
                          />

                        </div>

                      </FormControl>

                      <FormMessage />

                    </FormItem>
                  )}
                />

                {/* Phone */}

                <FormField
                  control={form.control}
                  name="businessPhone"
                  render={({ field }) => (
                    <FormItem>

                      <FormLabel>
                        Business Phone
                      </FormLabel>

                      <FormControl>

                        <div className="relative">

                          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                          <Input
                            {...field}
                            type="tel"
                            disabled={
                              updateMutation.isPending
                            }
                            className="pl-9"
                            placeholder="+91 9876543210"
                            autoComplete="tel"
                          />

                        </div>

                      </FormControl>

                      <FormMessage />

                    </FormItem>
                  )}
                />

              </div>

            </div>

            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <DialogFooter className="gap-2 sm:gap-0">

              <Button
                type="button"
                variant="outline"
                disabled={
                  updateMutation.isPending
                }
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  updateMutation.isPending ||
                  !organizationId ||
                  !form.formState.isDirty
                }
              >

                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}

              </Button>

            </DialogFooter>

          </form>

        </Form>

      </DialogContent>
    </Dialog>
  );
}