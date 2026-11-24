"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import { hasRole, type Role } from "@/types/user";
import { loginHref } from "@/lib/navigation";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";

/**
 * Client Component guard. Without a session it redirects to `/login?next=<current route>`;
 * with `roles`, a signed-in user lacking them sees a friendly 403 instead of the content.
 */
export function RequireAuth(props: { children: React.ReactNode; roles?: Role[] }) {
    return (
        <Suspense fallback={<LoadingState label="Comprobando tu sesión…" />}>
            <Guard {...props} />
        </Suspense>
    );
}

function Guard({ children, roles = [] }: { children: React.ReactNode; roles?: Role[] }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!loading && !user) {
            const query = searchParams.toString();
            router.replace(loginHref(query ? `${pathname}?${query}` : pathname));
        }
    }, [loading, user, router, pathname, searchParams]);

    if (loading || !user) {
        return <LoadingState label="Comprobando tu sesión…" />;
    }

    if (roles.length > 0 && !hasRole(user, ...roles)) {
        return (
            <ErrorState
                title="No tienes acceso a esta página"
                message="Esta sección es solo para administradores. Si crees que es un error, habla con el equipo de PlanBe."
                action={<Button asChild variant="outline"><Link href="/">Volver al inicio</Link></Button>}
            />
        );
    }

    return <>{children}</>;
}
