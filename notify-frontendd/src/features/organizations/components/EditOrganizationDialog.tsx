'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateOrganization } from '../hooks/useOrganizationMutations';
import { editOrganizationSchema, EditOrganizationFormValues } from '../schemas/organization.schema';
import { Organization } from '../types/organization.types';
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
    const updateMutation = useUpdateOrganization(organization?.id ?? '');

    const form = useForm<EditOrganizationFormValues>({
        resolver: zodResolver(editOrganizationSchema),
        defaultValues: { name: '', contactEmail: '', contactPhone: '', address: '' },
    });

    useEffect(() => {
        if (organization) {
            form.reset({
                name: organization.name,
                contactEmail: organization.contactEmail,
                contactPhone: organization.contactPhone,
                address: organization.address ?? '',
            });
        }
    }, [organization, form]);

    const onSubmit = (values: EditOrganizationFormValues) => {
        updateMutation.mutate(values, { onSuccess: () => onOpenChange(false) });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Organization</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Phone</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                    <FormLabel>Address (optional)</FormLabel>
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