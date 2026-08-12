// components/plans/subscription-plan-form-dialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    createSubscriptionPlanSchema,
    CreateSubscriptionPlanFormValues,
} from "../../schemas/subscription-plan.schema";
import { SubscriptionPlan } from "../../types/subscription-plan.types";
import { Feature } from "../../types/feature.types";
import {
    useCreateSubscriptionPlan,
    useUpdateSubscriptionPlan,
} from "../../hooks/plans/useSubscriptionPlan";
import { toast } from "sonner";

interface SubscriptionPlanFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan?: SubscriptionPlan | null;
    features: Feature[];
}

export function SubscriptionPlanFormDialog({
    open,
    onOpenChange,
    plan,
    features,
}: SubscriptionPlanFormDialogProps) {
    const isEdit = !!plan;
    const createPlan = useCreateSubscriptionPlan();
    const updatePlan = useUpdateSubscriptionPlan();

    const form = useForm<
        z.input<typeof createSubscriptionPlanSchema>,
        unknown,
        CreateSubscriptionPlanFormValues
    >({
        resolver: zodResolver(createSubscriptionPlanSchema),
        defaultValues: {
            title: "",
            description: "",
            amountValue: 0,
            currency: "USD",
            userLimit: 1,
            storageLimit: 1,
            featureIds: [],
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                title: plan?.title ?? "",
                description: plan?.description ?? "",
                amountValue: plan?.amountValue ?? 0,
                currency: plan?.currency ?? "USD",
                userLimit: plan?.userLimit ?? 1,
                storageLimit: plan?.storageLimit ?? 1,
                featureIds: plan?.featureIds ?? [],
            });
        }
    }, [open, plan, form]);

    const isPending = createPlan.isPending || updatePlan.isPending;

    const onSubmit = (values: CreateSubscriptionPlanFormValues) => {
        if (isEdit && plan) {
            updatePlan.mutate(
                { id: plan.id, payload: values },
                {
                    onSuccess: () => {
                        toast.success("Plan updated");
                        onOpenChange(false);
                    },
                    onError: () => toast.error("Failed to update plan"),
                }
            );
        } else {
            createPlan.mutate(values, {
                onSuccess: () => {
                    toast.success("Plan created");
                    onOpenChange(false);
                },
                onError: () => toast.error("Failed to create plan"),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Plan" : "New Plan"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Pro Plan" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amountValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                                value={typeof field.value === "number" && !Number.isNaN(field.value) ? field.value : ""}
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;
                                                    field.onChange(Number.isNaN(val) ? "" : val);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="INR">INR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="userLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Limit</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                                value={typeof field.value === "number" && !Number.isNaN(field.value) ? field.value : ""}
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;
                                                    field.onChange(Number.isNaN(val) ? "" : val);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="storageLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Storage Limit (GB)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                                value={typeof field.value === "number" && !Number.isNaN(field.value) ? field.value : ""}
                                                onChange={(e) => {
                                                    const val = e.target.valueAsNumber;
                                                    field.onChange(Number.isNaN(val) ? "" : val);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={2} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="featureIds"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Features</FormLabel>
                                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                                        {features.map((feature) => (
                                            <FormField
                                                key={feature.id}
                                                control={form.control}
                                                name="featureIds"
                                                render={({ field }) => {
                                                    const checked = field.value?.includes(feature.id);
                                                    return (
                                                        <FormItem className="flex items-center gap-2 space-y-0">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={checked}
                                                                    onCheckedChange={(isChecked) => {
                                                                        const next = isChecked
                                                                            ? [...(field.value ?? []), feature.id]
                                                                            : field.value?.filter((id) => id !== feature.id);
                                                                        field.onChange(next);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal text-sm">
                                                                {feature.title}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : isEdit ? "Save changes" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}