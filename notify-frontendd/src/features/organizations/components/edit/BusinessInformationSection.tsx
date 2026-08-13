"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, Mail, MapPin, Phone } from "lucide-react";

import { useUpdateOrganization } from "../../hooks/useOrganizationMutations";
import {
  editOrganizationSchema,
  EditOrganizationFormValues,
} from "../../schemas/organization.schema";
import { Organization } from "../../types/organization.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BusinessInformationSectionProps {
  organization: Organization;
}

export function BusinessInformationSection({
  organization,
}: BusinessInformationSectionProps) {
  const updateMutation = useUpdateOrganization(organization.id);

  const form = useForm<EditOrganizationFormValues>({
    resolver: zodResolver(editOrganizationSchema),
    defaultValues: {
      name: organization.name ?? "",
      businessEmail: organization.businessEmail ?? "",
      businessPhone: organization.businessPhone ?? "",
      address: organization.address ?? "",
    },
    mode: "onBlur",
  });

  // Keep the form in sync if the org data refetches (e.g. after a sibling
  // section's mutation invalidates the shared query).
  useEffect(() => {
    form.reset({
      name: organization.name ?? "",
      businessEmail: organization.businessEmail ?? "",
      businessPhone: organization.businessPhone ?? "",
      address: organization.address ?? "",
    });
  }, [organization, form]);

  const onSubmit = (values: EditOrganizationFormValues) => {
    updateMutation.mutate(values, {
      onSuccess: () => form.reset(values),
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="bold">Business Information</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {updateMutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Unable to update organization. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} disabled={updateMutation.isPending} className="pl-9" autoComplete="organization" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin aria-hidden className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea {...field} rows={3} disabled={updateMutation.isPending} className="pl-9" autoComplete="street-address" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...field} type="email" disabled={updateMutation.isPending} className="pl-9" autoComplete="email" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input {...field} type="tel" inputMode="tel" disabled={updateMutation.isPending} className="pl-9" autoComplete="tel" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateMutation.isPending || !form.formState.isDirty}
              >
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}