'use client';

import { MoreHorizontal, KeyRound, Pencil, Trash2, Lock } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROLE_STATUS_META } from '../../shared/constants';
import type { Role } from '../types/role.types';

interface RoleTableProps {
    roles: Role[];
    isLoading: boolean;
    onView: (role: Role) => void;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
}

export function RoleTable({
    roles,
    isLoading,
    onView,
    onEdit,
    onDelete,
}: RoleTableProps) {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (roles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                <p className="text-sm font-medium">No roles found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your search or filters, or create a new role.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                       <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => {
                        const statusMeta = ROLE_STATUS_META[role.status];
                        return (
                            <TableRow
                                key={role.id}
                                className="cursor-pointer"
                                onClick={() => onView(role)}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {role.name}
                                        {role.isSystem && (
                                            <Badge variant="outline" className="gap-1 text-xs">
                                                <Lock className="h-3 w-3" />
                                                System
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-xs truncate text-muted-foreground">
                                    {role.description || '—'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => onEdit(role)}
                                                disabled={role.isSystem}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onDelete(role)}
                                                disabled={role.isSystem}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}