import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
    children: React.ReactNode;
    tone?: "solid" | "soft";
    className?: string;
};

export function Badge({
    children,
    tone = "solid",
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                tone === "solid"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                className,
            )}
        >
            {children}
        </span>
    );
}