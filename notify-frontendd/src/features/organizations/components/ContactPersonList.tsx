'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  Pencil,
  Trash2,
  UserRound,
} from 'lucide-react';

import { useContactPersons } from '../hooks/useContactPersons';
import { organizationApi } from '../api/organization.api';
import { queryKeys } from '@/lib/query/query-keys';
import { ContactPerson } from '../types/organization.types';

import { AddContactPersonDialog } from './AddContactPersonDialog';
import { EditContactPersonDialog } from './EditContactPersonDialog';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface ContactPersonListProps {
  organizationId: string;
}

export function ContactPersonList({
  organizationId,
}: ContactPersonListProps) {
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [editingContact, setEditingContact] =
    useState<ContactPerson | null>(null);

  const {
    data: contacts,
    isLoading,
  } = useContactPersons(organizationId);

  const deleteContactMutation = useMutation({
    mutationFn: (contactId: string) =>
      organizationApi.removeContactPerson(
        organizationId,
        contactId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.organizations.contacts(
            organizationId
          ),
      });

      toast.success(
        'Contact person deleted successfully'
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
        'Failed to delete contact person'
      );
    },
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">

      {/* Empty State */}
      {!contacts || contacts.length === 0 ? (

        <EmptyState
          title="No contact persons found"
        />

      ) : (

        <div className="grid gap-4 md:grid-cols-2">

          {contacts.map((contact) => {

            const isDeleting =
              deleteContactMutation.isPending &&
              deleteContactMutation.variables ===
              contact.id;

            return (
              <Card key={contact.id}>

                <CardContent className="p-5">

                  <div className="flex items-start justify-between gap-4">

                    {/* Contact Info */}
                    <div className="flex gap-4">

                      {/* Avatar */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">

                        <UserRound className="h-5 w-5 text-muted-foreground" />

                      </div>

                      <div className="space-y-2">

                        {/* Name */}
                        <div>
                          <h4 className="font-semibold">
                            {contact.name}
                          </h4>

                          {contact.designation && (
                            <p className="text-sm text-muted-foreground">
                              {contact.designation}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        {contact.contactEmail && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>
                              {contact.contactEmail}
                            </span>
                          </div>
                        )}

                        {/* Phone */}
                        {contact.contactPhone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>
                              {contact.contactPhone}
                            </span>
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setEditingContact(contact)
                        }
                        disabled={isDeleting}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }

                        title="Delete contact person?"

                        description={`Are you sure you want to remove ${contact.name} from this organization? This action cannot be undone.`}

                        onConfirm={() =>
                          deleteContactMutation.mutate(
                            contact.id
                          )
                        }

                        isPending={isDeleting}
                      />

                    </div>

                  </div>

                </CardContent>

              </Card>
            );
          })}

        </div>

      )}

     
      {/* Edit Contact Person */}
      <EditContactPersonDialog
        organizationId={organizationId}
        contact={editingContact}
        open={Boolean(editingContact)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingContact(null);
          }
        }}
      />

    </div>
  );
}