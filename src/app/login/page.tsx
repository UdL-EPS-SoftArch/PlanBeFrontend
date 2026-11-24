"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { CircleAlert, CircleCheck } from "lucide-react";
import { deleteCookie, setCookie } from "cookies-next";
import { AUTH_COOKIE, useAuth } from "@/app/components/authentication";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HalError } from "@/lib/errors";
import { safeNextPath } from "@/lib/navigation";

type FormValues = {
    username: string;
    password: string;
};

export default function LoginPage() {
    return (
        <AuthShell
            aside={
                <div className="flex max-w-[460px] flex-col gap-4">
                    <p className="font-display text-[clamp(32px,3.6vw,48px)] font-bold leading-[1.05] tracking-[-0.03em]">
                        Siempre hay un plan B. Y gente para hacerlo.
                    </p>
                    <p className="text-base leading-relaxed text-[#c9cbd1]">
                        Entra para apuntarte a quedadas, crear las tuyas y ver quién más va.
                    </p>
                </div>
            }
        >
            <Suspense>
                <LoginForm />
            </Suspense>
        </AuthShell>
    );
}

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refresh } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const next = safeNextPath(searchParams.get("next"));
    const justRegistered = searchParams.get("registered") === "1";

    const onSubmit: SubmitHandler<FormValues> = async ({ username, password }) => {
        setErrorMessage(null);
        setCookie(AUTH_COOKIE, `Basic ${btoa(`${username}:${password}`)}`, {
            path: "/",
            secure: true,
            sameSite: "strict",
            httpOnly: false,
        });
        try {
            const user = await refresh();
            if (!user) throw new HalError(401, "unauthorized");
            router.push(next ?? `/users/${user.username}`);
            router.refresh();
        } catch (error) {
            deleteCookie(AUTH_COOKIE, { path: "/" });
            setErrorMessage(
                error instanceof HalError && error.status !== 401
                    ? error.message
                    : "Usuario o contraseña incorrectos. Revísalos e inténtalo de nuevo.",
            );
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-4xl font-bold tracking-[-0.025em]">Entrar</h1>
                <p className="text-[15px] text-ink-soft">
                    ¿No tienes cuenta?{" "}
                    <Link href="/users/register" className="font-semibold text-primary hover:underline">Crear cuenta</Link>
                </p>
            </div>

            {justRegistered && !errorMessage && (
                <div role="status" className="flex items-start gap-2.5 rounded-lg bg-success-soft px-3.5 py-3 text-sm text-success-soft-foreground">
                    <CircleCheck className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
                    Cuenta creada. Ya puedes entrar.
                </div>
            )}

            {next && !errorMessage && !justRegistered && (
                <p className="rounded-lg bg-muted px-3.5 py-3 text-sm text-ink-soft">Inicia sesión para continuar.</p>
            )}

            <div className="flex flex-col gap-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                    id="username"
                    autoComplete="username"
                    className="h-12 text-base"
                    aria-invalid={!!errors.username}
                    {...register("username", { required: "Escribe tu usuario." })}
                />
                {errors.username && <p className="text-sm font-medium text-destructive">{errors.username.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-12 text-base"
                    aria-invalid={!!errors.password}
                    {...register("password", { required: "Escribe tu contraseña." })}
                />
                {errors.password && <p className="text-sm font-medium text-destructive">{errors.password.message}</p>}
            </div>

            {errorMessage && (
                <div role="alert" className="flex items-start gap-2.5 rounded-lg bg-destructive-soft px-3.5 py-3 text-sm leading-normal text-destructive-soft-foreground">
                    <CircleAlert className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
                    {errorMessage}
                </div>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Entrando…" : "Entrar"}
            </Button>
        </form>
    );
}
