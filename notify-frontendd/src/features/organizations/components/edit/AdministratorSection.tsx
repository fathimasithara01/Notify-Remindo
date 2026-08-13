"use client";

import { useState } from "react";
import { UserRound, Mail, Phone, KeyRound, Send, Pencil } from "lucide-react";

import { useResendInvite } from "../../hooks/useOrganizationMutations";
import { Organization } from "../../types/organization.types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { ResetAdminPasswordDialog } from "../ResetAdminPasswordDialog";
import { EditAdministratorDialog } from "./EditAdministratorDialog";

interface AdministratorSectionProps {
  organization: Organization;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  active: "default",
  invited: "secondary",
  inactive: "destructive",
};

export function AdministratorSection({ organization }: AdministratorSectionProps) {
  const admin = organization.admin;

  const resendInvite = useResendInvite();
  const [resetOpen, setResetOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <UserRound className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Administrator</CardTitle>
              <CardDescription>
                The contact person who administers this organization.
              </CardDescription>
            </div>
          </div>

          {admin && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Edit administrator"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!admin && (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            No administrator assigned.
          </div>
        )}

        {admin && (
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-medium">
                  {admin.firstName} {admin.lastName}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> {admin.email}
                </p>
                {admin.phone && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {admin.phone}
                  </p>
                )}
              </div>
              {/* <Badge variant={statusVariant[admin.status] ?? "secondary"}>
                {admin.status}
              </Badge> */}
            </div>

            {/* <div className="mt-4 flex flex-wrap gap-2">
              {admin.status === "invited" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={resendInvite.isPending}
                  onClick={() => resendInvite.mutate(organization.id)}
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Resend Invite
                </Button>
              )}

              {admin.status === "active" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setResetOpen(true)}
                >
                  <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                  Reset Password
                </Button>
              )}
            </div> */}
          </div>
        )}
      </CardContent>

      <ResetAdminPasswordDialog
        organization={organization}
        open={resetOpen}
        onOpenChange={setResetOpen}
      />

      <EditAdministratorDialog
        organization={organization}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </Card>
  );
}