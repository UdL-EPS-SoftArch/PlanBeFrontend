"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Check, CircleAlert } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { HalError, getErrorMessage } from "@/lib/errors";

type FormValues = {
    username: string;
    email: string;
    password: string;
};

const BENEFITS = [
    "Apúntate a quedadas cerca de ti",
    "Crea tus planes y decide quién los ve",
    "Recibe recomendaciones según tus intereses",
];

export default function RegistrationPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setServerError(null);
        try {
            await new UsersService(clientAuthProvider()).createUser(data as User);
            router.push("/login?registered=1");
        } catch (error) {
            if (error instanceof HalError && error.fieldErrors.length > 0) {
                let mapped = false;
                for (const field of ["username", "email", "password"] as const) {
                    const message = error.fieldMessage(field);
                    if (message) {
                        setError(field, { message });
                        mapped = true;
                    }
                }
                if (mapped) return;
            }
            if (error instanceof HalError && error.status === 409) {
                setServerError("Ya existe una cuenta con ese usuario o email.");
                return;
            }
            setServerError(getErrorMessage(error));
        }
    };

    return (
        <AuthShell
            aside={
                <ul className="flex max-w-[440px] flex-col gap-4">
                    {BENEFITS.map(text => (
                        <li key={text} className="flex gap-3 text-[17px] leading-normal">
                            <Check className="mt-0.5 size-[22px] shrink-0 text-[#f08a5d]" strokeWidth={2.4} aria-hidden="true" />
                            {text}
                        </li>
                    ))}
                </ul>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-[18px]">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-4xl font-bold tracking-[-0.025em]">Crear cuenta</h1>
                    <p className="text-[15px] text-ink-soft">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">Entrar</Link>
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                        id="username"
                        autoComplete="username"
                        className="h-12 text-base"
                        aria-invalid={!!errors.username}
                        aria-describedby="username-help"
                        {...register("username", {
                            required: "Elige un nombre de usuario.",
                            pattern: { value: /^\S+$/, message: "El usuario no puede tener espacios." },
                        })}
                    />
                    {errors.username
                        ? <p id="username-help" className="text-sm font-medium text-destructive">{errors.username.message}</p>
                        : <p id="username-help" className="text-[13px] text-muted-foreground">Sin espacios. Así te verán los demás.</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="h-12 text-base"
                        aria-invalid={!!errors.email}
                        {...register("email", {
                            required: "Escribe tu email.",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Este email no parece válido." },
                        })}
                    />
                    {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        className="h-12 text-base"
                        aria-invalid={!!errors.password}
                        aria-describedby="password-help"
                        {...register("password", {
                            required: "Elige una contraseña.",
                            minLength: { value: 8, message: "Mínimo 8 caracteres." },
                            maxLength: { value: 256, message: "Máximo 256 caracteres." },
                        })}
                    />
                    {errors.password
                        ? <p id="password-help" className="text-sm font-medium text-destructive">{errors.password.message}</p>
                        : <p id="password-help" className="text-[13px] text-muted-foreground">Mínimo 8 caracteres.</p>}
                </div>

                {serverError && (
                    <div role="alert" className="flex items-start gap-2.5 rounded-lg bg-destructive-soft px-3.5 py-3 text-sm text-destructive-soft-foreground">
                        <CircleAlert className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
                        {serverError}
                    </div>
                )}

                <Button type="submit" size="lg" className="mt-1" disabled={isSubmitting}>
                    {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
                </Button>
            </form>
        </AuthShell>
    );
}
