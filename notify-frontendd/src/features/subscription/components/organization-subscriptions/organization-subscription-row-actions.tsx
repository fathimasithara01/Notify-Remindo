"use client";

import {
    MoreHorizontal,
    RefreshCcw,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    OrganizationSubscription,
} from "../../types/organization-subscription.types";

interface OrganizationSubscriptionRowActionsProps {
    subscription: OrganizationSubscription;

    onRenew?: (
        subscription: OrganizationSubscription
    ) => void;

    onCancel?: (
        subscription: OrganizationSubscription
    ) => void;

    disabled?: boolean;
}

export function OrganizationSubscriptionRowActions({
    subscription,
    onRenew,
    onCancel,
    disabled = false,
}: OrganizationSubscriptionRowActionsProps) {
    const canRenew =
        subscription.status === "active" ||
        subscription.status === "expired";

    const canCancel =
        subscription.status === "active";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={disabled}
                >
                    <MoreHorizontal className="h-4 w-4" />

                    <span className="sr-only">
                        Open subscription actions
                    </span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-48"
            >
                {/* Renew */}

                <DropdownMenuItem
                    disabled={!canRenew || disabled}
                    onClick={() => {
                        if (canRenew) {
                            onRenew?.(subscription);
                        }
                    }}
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />

                    Renew Subscription
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Cancel */}

                <DropdownMenuItem
                    disabled={!canCancel || disabled}
                    className="
            text-destructive
            focus:text-destructive
          "
                    onClick={() => {
                        if (canCancel) {
                            onCancel?.(subscription);
                        }
                    }}
                >
                    <XCircle className="mr-2 h-4 w-4" />

                    Cancel Subscription
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}