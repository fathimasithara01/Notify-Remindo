'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { permissionApi } from '@/lib/api/permissions';
import { ApiClientError } from '@/lib/api/client';
import { Permission } from '@/lib/types/permission';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const editPermissionSchema = z.object({
    module: z.string().min(1, 'Module is required'),
    description: z.string().optional(),
});

type EditPermissionFormValues = z.infer<typeof editPermissionSchema>;

interface EditPermissionDialogProps {
    permission: Permission | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditPermissionDialog({ permission, open, onOpenChange }: EditPermissionDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm<EditPermissionFormValues>({
        resolver: zodResolver(editPermissionSchema),
        defaultValues: { module: '', description: '' },
    });

    useEffect(() => {
        if (permission) {
            form.reset({ module: permission.module, description: permission.description ?? '' });
        }
    }, [permission, form]);

    const updateMutation = useMutation({
        mutationFn: (values: EditPermissionFormValues) => {
            if (!permission) throw new Error('No permission selected');
            return permissionApi.update(permission.id, values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
            toast.success('Permission updated');
            onOpenChange(false);
        },
        onError: (error: ApiClientError) => toast.error(error.message),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Permission — {permission?.name}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="module"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Module</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                    <FormLabel>Description (optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}