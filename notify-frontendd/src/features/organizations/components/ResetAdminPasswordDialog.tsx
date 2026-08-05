"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Button } from "@/components/ui/button";

import {
    resetAdminPasswordSchema,
    ResetAdminPasswordFormValues,
} from "../schemas/organization.schema";

import { Organization } from "../types/organization.types";
import { useResetAdminPassword } from "../hooks/useOrganizationMutations";


interface ResetAdminPasswordDialogProps {
    organization: Organization | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export function ResetAdminPasswordDialog({
    organization,
    open,
    onOpenChange,
}: ResetAdminPasswordDialogProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const mutation = useResetAdminPassword();


    const form = useForm<ResetAdminPasswordFormValues>({
        resolver: zodResolver(resetAdminPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });


    const onSubmit = (
        values: ResetAdminPasswordFormValues
    ) => {

        if (!organization) return;


        mutation.mutate(
            {
                id: organization.id,
                payload: {
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                },
            },
            {
                onSuccess: () => {
                    form.reset();
                    setShowPassword(false);
                    setShowConfirmPassword(false);
                    onOpenChange(false);
                },
            }
        );
    };


    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    form.reset();
                    setShowPassword(false);
                    setShowConfirmPassword(false);
                }

                onOpenChange(value);
            }}
        >

            <DialogContent className="sm:max-w-[425px]">

                <DialogHeader>

                    <DialogTitle>
                        Set Organization Admin Password
                    </DialogTitle>

                    <DialogDescription>
                        Set a new password for{" "}
                        <span className="font-medium">
                            {organization?.admin?.email ?? "organization admin"}
                        </span>
                    </DialogDescription>

                </DialogHeader>


                <Form {...form}>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>

                                    <FormLabel>
                                        New Password
                                    </FormLabel>

                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                className="pr-10"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                onClick={() =>
                                                    setShowPassword((prev) => !prev)
                                                }
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>

                                    <FormMessage />

                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>

                                    <FormLabel>
                                        Confirm Password
                                    </FormLabel>

                                    <FormControl>
                                        <div className="relative">

                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm password"
                                                className="pr-10"
                                                {...field}
                                            />

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                onClick={() =>
                                                    setShowConfirmPassword((prev) => !prev)
                                                }
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>

                                        </div>
                                    </FormControl>

                                    <FormMessage />

                                </FormItem>
                            )}
                        />


                        <div className="rounded-md border bg-muted/40 p-3 text-sm">

                            <p className="mb-2 font-medium">
                                Password Rules
                            </p>

                            <ul className="space-y-1 text-muted-foreground">

                                <li>✓ Minimum 8 characters</li>
                                <li>✓ One uppercase letter</li>
                                <li>✓ One lowercase letter</li>
                                <li>✓ One number</li>

                            </ul>

                        </div>


                        <DialogFooter>

                            <Button
                                type="button"
                                variant="outline"
                                disabled={mutation.isPending}
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending
                                    ? "Updating..."
                                    : "Set Password"}
                            </Button>

                        </DialogFooter>


                    </form>

                </Form>


            </DialogContent>

        </Dialog>
    );
}