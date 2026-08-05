'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    createRoleSchema,
    editRoleSchema,
    type CreateRoleFormValues,
    type EditRoleFormValues,
} from '../schemas/role.schema';
import type { Role } from '../types/role.types';

interface RoleFormProps {
    mode: 'create' | 'edit';
    role?: Role;
    onSubmit: (values: CreateRoleFormValues | EditRoleFormValues) => void;
    isSubmitting: boolean;
    onCancel: () => void;
}

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

export function RoleForm({ mode, role, onSubmit, isSubmitting, onCancel }: RoleFormProps) {
    const isEdit = mode === 'edit';
    // Once the slug has been hand-edited, stop auto-syncing it from the name.
    const [slugTouched, setSlugTouched] = useState(isEdit);

    const form = useForm<CreateRoleFormValues | EditRoleFormValues>({
        resolver: zodResolver(isEdit ? editRoleSchema : createRoleSchema),
        defaultValues: isEdit
            ? {
                name: role?.name ?? '',
                slug: role?.slug ?? '',
                description: role?.description ?? '',
                status: role?.status ?? 'active',
            }
            : {
                name: '',
                slug: '',
                description: '',
                status: 'active',
            },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. Organization Admin"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        if (!isEdit && !slugTouched) {
                                            form.setValue('slug', slugify(e.target.value));
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="org-admin"
                                    {...field}
                                    onChange={(e) => {
                                        setSlugTouched(true);
                                        field.onChange(e);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Used internally to reference this role. Lowercase, hyphenated.
                            </FormDescription>
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
                                <Textarea
                                    placeholder="What can this role do?"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create role'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}