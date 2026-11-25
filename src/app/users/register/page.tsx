"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { UserFormData } from "@/types/user";
import { HalError } from "@/lib/errors";

type FormValues = {
    username: string;
    email: string;
    password: string;
    displayName?: string;
};

export default function RegistrationPage() {
    const service = new UsersService(clientAuthProvider())
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<FormValues>({
        mode: "onBlur",
        reValidateMode: "onBlur",
    });

    const router = useRouter();
    const { toast } = useToast();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const userData: UserFormData = {
            username: data.username,
            email: data.email,
            displayName: data.displayName,
        };

        try {
            const result = await service.createUser(userData);
            if (result.errors && Object.keys(result.errors).length > 0) {
                if (result.errors.email) setError('email', { message: result.errors.email });
                if (result.errors.displayName) setError('displayName', { message: result.errors.displayName });
                return;
            }
            // Register successful - show toast and redirect
            toast({
                title: " compte creada correctament",
                description: "Ja pots iniciar sessió.",
            });
            router.push("/login");
        } catch (error: any) {
            if (error instanceof HalError) {
                if (error.fieldErrors.length > 0) {
                    for (const fe of error.fieldErrors) {
                        if (fe.property) {
                            // Map backend field names to form field names
                            const fieldMap: Record<string, string> = {
                                'email': 'email',
                                'displayName': 'displayName',
                                'username': 'username',
                                'password': 'password',
                            };
                            const formField = fieldMap[fe.property];
                            if (formField) {
                                setError(formField as 'username' | 'email' | 'displayName' | 'password', { message: fe.message });
                            }
                        }
                    }
                } else {
                    toast({
                        title: "Error al registrar",
                        description: error.message,
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Error al registrar",
                    description: error.message || "Error desconeixer",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start sm:text-left">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        {...register("username", {
                                            required: "Username is required",
                                            pattern: {
                                                value: /^\S+$/,
                                                message: "Username cannot contain spaces",
                                            },
                                        })}
                                        placeholder="e.g., john_doe"
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input
                                        id="displayName"
                                        {...register("displayName")}
                                    />
                                    {errors.displayName && (
                                        <p className="text-sm text-red-600 mt-1">{errors.displayName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Invalid email address",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Minimum 8 characters" },
                                            maxLength: { value: 256, message: "Maximum 256 characters" }
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                        {isSubmitting ? "Registering..." : "Register"}
                                    </Button>
                                    <a
                                        href="/login"
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Already have an account?
                                    </a>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}