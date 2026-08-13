"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserRound, Loader2 } from "lucide-react";

import { useUpdateOrganizationAdmin } from "../../hooks/useOrganizationMutations";
import { Organization } from "../../types/organization.types";

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

const editAdminSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
});

type EditAdminFormValues = z.infer<typeof editAdminSchema>;

interface EditAdministratorDialogProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAdministratorDialog({
  organization,
  open,
  onOpenChange,
}: EditAdministratorDialogProps) {
  const updateAdmin = useUpdateOrganizationAdmin(organization.id);
  const admin = organization.admin;

  const form = useForm<EditAdminFormValues>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      firstName: admin?.firstName ?? "",
      lastName: admin?.lastName ?? "",
      email: admin?.email ?? "",
      phone: admin?.phone ?? "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      firstName: admin?.firstName ?? "",
      lastName: admin?.lastName ?? "",
      email: admin?.email ?? "",
      phone: admin?.phone ?? "",
    });
  }, [open, admin, form]);

  const confirmDiscardIfDirty = () =>
    !form.formState.isDirty || window.confirm("Discard unsaved changes?");

  const handleOpenChange = (nextOpen: boolean) => {
    if (updateAdmin.isPending && !nextOpen) return;
    if (!nextOpen && !confirmDiscardIfDirty()) return;
    onOpenChange(nextOpen);
  };

  const onSubmit = (values: EditAdminFormValues) => {
    updateAdmin.mutate(values, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <UserRound className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit Administrator</DialogTitle>
              <DialogDescription>
                Update the administrator&apos;s contact details.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {updateAdmin.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {updateAdmin.error instanceof Error
                ? updateAdmin.error.message
                : "Unable to update administrator. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={updateAdmin.isPending} autoComplete="given-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={updateAdmin.isPending} autoComplete="family-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled={updateAdmin.isPending} autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" inputMode="tel" disabled={updateAdmin.isPending} autoComplete="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                disabled={updateAdmin.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateAdmin.isPending || !form.formState.isDirty}>
                {updateAdmin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updateAdmin.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}