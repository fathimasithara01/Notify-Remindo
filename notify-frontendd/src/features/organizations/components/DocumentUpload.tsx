'use client';

import { useRef } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useUploadOrganizationDocument } from '../hooks/useOrganizationDocumentMutations';

interface DocumentUploadProps {
  organizationId: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

export function DocumentUpload({
  organizationId,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation =
    useUploadOrganizationDocument(organizationId);

  const uploadFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert('Only PDF, PNG and JPG files are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('Maximum file size is 10 MB.');
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    uploadFile(file);

    e.target.value = '';
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    uploadFile(file);
  };

  return (
    <div className="space-y-4">

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="rounded-lg border-2 border-dashed bg-muted/20 p-10 text-center transition hover:border-primary"
      >
        <UploadCloud className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

        <h3 className="font-semibold">
          Upload Organization Documents
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Drag & drop files here or browse from your computer.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          PDF, JPG, PNG • Maximum 10 MB
        </p>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleInput}
        />

        <Button
          className="mt-6"
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Choose File'
          )}
        </Button>
      </div>

    </div>
  );
}