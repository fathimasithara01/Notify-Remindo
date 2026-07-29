'use client';

import {
  Download,
  FileText,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

import { formatDate } from '@/lib/utils/format-date';

import { useOrganizationDocuments } from '../hooks/useOrganizationDocuments';

import {
  useDeleteOrganizationDocument,
  useDownloadOrganizationDocument,
} from '../hooks/useOrganizationDocumentMutations';

interface Props {
  organizationId: string;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentList({
  organizationId,
}: Props) {
  const {
    data,
    isLoading,
  } = useOrganizationDocuments(
    organizationId,
  );

  const downloadMutation =
    useDownloadOrganizationDocument(
      organizationId,
    );

  const deleteMutation =
    useDeleteOrganizationDocument(
      organizationId,
    );

  if (isLoading) {
    return <LoadingState />;
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="No documents uploaded"
      />
    );
  }

  return (
    <div className="space-y-3">

      {data.map((document) => {

        const deleting =
          deleteMutation.isPending &&
          deleteMutation.variables ===
            document.id;

        const downloading =
          downloadMutation.isPending &&
          downloadMutation.variables ===
            document.id;

        return (

          <div
            key={document.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >

            <div className="flex items-start gap-3">

              <FileText className="mt-1 h-5 w-5 text-primary" />

              <div>

                <p className="font-medium">
                  {document.fileName}
                </p>

                <div className="mt-1 flex flex-wrap gap-2">

                  <Badge variant="secondary">
                    {document.documentType}
                  </Badge>

                  <Badge variant="outline">
                    {formatFileSize(
                      document.fileSize,
                    )}
                  </Badge>

                </div>

                <p className="mt-2 text-xs text-muted-foreground">

                  Uploaded by{' '}
                  {document.uploadedByName ??
                    'System'}

                  {' • '}

                  {formatDate(
                    document.createdAt,
                  )}

                </p>

              </div>

            </div>

            <div className="flex gap-2">

              <Button
                variant="outline"
                size="sm"
                disabled={downloading}
                onClick={() =>
                  downloadMutation.mutate(
                    document.id,
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>

              <ConfirmDialog
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
                title="Delete document?"
                description="This document will be permanently removed."
                onConfirm={() =>
                  deleteMutation.mutate(
                    document.id,
                  )
                }
                isPending={deleting}
              />

            </div>

          </div>

        );

      })}

    </div>
  );
}