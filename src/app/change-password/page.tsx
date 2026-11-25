"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";

type FormValues = {
    oldPassword: string;
    newPassword: string;
};

export default function ChangePasswordPage() {
    const router = useRouter();
    const { setUser, user } = useAuth();
    const { toast } = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const service = new UsersService(clientAuthProvider());
            const result = await service.changePassword(data.oldPassword, data.newPassword);

            if (result.success) {
                toast({
                    title: "Password changed!",
                    description: "Your password has been updated successfully.",
                });
                // Refresh user session
                const currentUser = await new UsersService(clientAuthProvider()).getCurrentUser();
                setUser(currentUser);
                router.push("/");
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to change password",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to change password",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-md flex-col items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start sm:text-left">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>change password</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                                {errors.oldPassword && (
                                    <p className="text-sm text-red-600 mt-1">{errors.oldPassword.message}</p>
                                )}
                                {errors.newPassword && (
                                    <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
                                )}

                                <div>
                                    <Label htmlFor="oldPassword">Old password</Label>
                                    <Input
                                        id="oldPassword"
                                        type="password"
                                        {...register("oldPassword", {
                                            required: "Old password is required",
                                        })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="newPassword">New password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        {...register("newPassword", {
                                            required: "New password is required",
                                            minLength: { value: 8, message: "Minimum 8 characters" },
                                            maxLength: { value: 256, message: "Maximum 256 characters" },
                                        })}
                                    />
                                </div>

                                <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Updating..." : "Change password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}