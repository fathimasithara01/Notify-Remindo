'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { roleApi } from '@/lib/api/roles';
import { ApiClientError } from '@/lib/api/client';
import { Role } from '@/lib/types/roles';
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

const editRoleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
});

type EditRoleFormValues = z.infer<typeof editRoleSchema>;

interface EditRoleDialogProps {
    role: Role | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditRoleDialog({ role, open, onOpenChange }: EditRoleDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm<EditRoleFormValues>({
        resolver: zodResolver(editRoleSchema),
        defaultValues: { name: '', description: '' },
    });

    useEffect(() => {
        if (role) {
            form.reset({ name: role.name, description: role.description ?? '' });
        }
    }, [role, form]);

    const updateMutation = useMutation({
        mutationFn: (values: EditRoleFormValues) => {
            if (!role) throw new Error('No role selected');
            return roleApi.update(role.id, values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            toast.success('Role updated');
            onOpenChange(false);
        },
        onError: (error: ApiClientError) => toast.error(error.message),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
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