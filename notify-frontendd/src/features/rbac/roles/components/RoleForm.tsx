'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { createRoleSchema, editRoleSchema } from '../schemas/role.schema';
import type { Role } from '../types/role.types';
import { ALL_PERMISSIONS } from '../../shared/constants';

export type RoleFormValues = {
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    permissionIds: string[];
};

interface RoleFormProps {
    mode: 'create' | 'edit';
    role?: Role;
    onSubmit: (values: RoleFormValues) => void;
    isSubmitting: boolean;
    onCancel: () => void;
}

export function RoleForm({ mode, role, onSubmit, isSubmitting, onCancel }: RoleFormProps) {
    const isEdit = mode === 'edit';

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(isEdit ? editRoleSchema : createRoleSchema) as Resolver<RoleFormValues>,
        defaultValues: {
            name: role?.name ?? '',
            description: role?.description ?? '',
            status: role?.status ?? 'active',
            permissionIds: role?.permissionIds ?? [],
        },
    });

    const selected = new Set(form.watch('permissionIds') ?? []);
    const grouped = ALL_PERMISSIONS.reduce<Record<string, typeof ALL_PERMISSIONS>>((acc, p) => {
        acc[p.module] = [...(acc[p.module] ?? []), p];
        return acc;
    }, {});

    const togglePermission = (id: string, checked: boolean) => {
        const current = new Set(form.getValues('permissionIds') ?? []);
        checked ? current.add(id) : current.delete(id);
        form.setValue('permissionIds', Array.from(current));
    };

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
                                <Input placeholder="e.g. Organization Admin" {...field} />
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
                                <Textarea placeholder="What can this role do?" rows={3} {...field} />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <div>
                    <label className="text-sm font-medium leading-none">Permissions</label>
                    <div className="mt-2 max-h-64 space-y-4 overflow-y-auto rounded-md border p-3">
                        {Object.entries(grouped).map(([moduleName, perms]) => (
                            <div key={moduleName}>
                                <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                                    {moduleName}
                                </p>
                                <div className="space-y-1">
                                    {perms.map((p) => (
                                        <label key={p.id} className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={selected.has(p.id)}
                                                onCheckedChange={(checked) => togglePermission(p.id, checked === true)}
                                            />
                                            {p.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

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