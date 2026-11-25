"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/app/components/authentication";
import { deleteCookie, setCookie } from "cookies-next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { safeNextPath } from "@/lib/navigation";

type FormValues = {
    username: string;
    password: string;
};

export default function LoginPage() {
    // useSearchParams needs a Suspense boundary so the page can still be prerendered.
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const router = useRouter();
    const next = safeNextPath(useSearchParams().get("next"));
    const { setUser, user, loading: authLoading, refresh } = useAuth();
    const { toast } = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            // Set Basic Auth cookie
            const authorization = `Basic ${btoa(`${data.username}:${data.password}`)}`;
            setCookie("MYAPP_AUTH", authorization, {
                path: "/",
                secure: true,
                sameSite: "lax",
                httpOnly: false,
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            // Use the UsersService to authenticate - it checks /identity
            const service = new UsersService(clientAuthProvider());
            const currentUser = await service.getCurrentUser();

            if (!currentUser) {
                // Invalid credentials - clear any stale cookie
                deleteCookie("MYAPP_AUTH", { path: "/" });
                setUser(null);
                toast({
                    title: "Login failed",
                    description: "Invalid username or password",
                    variant: "destructive",
                });
                return;
            }

            // Successful login - user is set from /identity
            setUser(currentUser);
            toast({
                title: "Welcome back!",
                description: `Welcome, ${currentUser.username || currentUser.displayName || ""}`,
            });
            router.push(next ?? `/users/${currentUser.username ?? ""}`);
        } catch (error: any) {
            // Handle authentication errors
            deleteCookie("MYAPP_AUTH", { path: "/" });
            setUser(null);
            toast({
                title: "Login failed",
                description: error.message || "Invalid username or password",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start sm:text-left">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                                {authLoading ? (
                                    <p className="text-sm text-zinc-500">Checking session...</p>
                                ) : (
                                    <>
                                        {errors.username && (
                                            <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                                        )}
                                        {errors.password && (
                                            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                                        )}

                                        <div>
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                {...register("username", {
                                                    required: "Username is required",
                                                })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                {...register("password", {
                                                    required: "Password is required",
                                                })}
                                            />
                                        </div>
                                    </>
                                )}

                                <Button type="submit" className="mt-2 w-full" disabled={isSubmitting || authLoading}>
                                    {isSubmitting ? "logging in..." : "login"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}