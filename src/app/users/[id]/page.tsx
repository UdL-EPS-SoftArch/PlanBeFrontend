"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { getErrorMessage, HalError } from "@/lib/errors";
import { User, userLabel } from "@/types/user";
import { useAuth } from "@/app/components/authentication";
import { RequireAuth } from "@/components/common/RequireAuth";
import { PageContainer } from "@/components/common/PageContainer";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { ComingSoon } from "@/components/common/ComingSoon";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";

export default function UserDetailPage() {
    return (
        <PageContainer width="default">
            <RequireAuth>
                <Profile />
            </RequireAuth>
        </PageContainer>
    );
}

function Profile() {
    const params = useParams();
    const userId = params?.id as string;
    const { user: me } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let active = true;
        new UsersService(clientAuthProvider())
            .getUserById(userId)
            .then(data => { if (active) setUser(data); })
            .catch(err => { if (active) setError(err); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [userId]);

    if (loading) return <LoadingState label="Cargando perfil…" />;

    if (error || !user) {
        const notFound = error instanceof HalError && error.status === 404;
        return (
            <ErrorState
                title={notFound ? "Este perfil no existe" : "No hemos podido cargar el perfil"}
                message={notFound ? `No hay ningún usuario llamado “${userId}”.` : getErrorMessage(error)}
                action={<Button asChild variant="outline"><Link href="/">Volver al inicio</Link></Button>}
            />
        );
    }

    const isMe = me?.username === user.username;

    return (
        <div className="flex flex-col gap-10">
            <section className="flex flex-wrap items-start gap-7 border-b pb-8">
                <UserAvatar user={user} size="lg" />
                <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-2.5">
                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-4xl font-bold tracking-[-0.02em]">{userLabel(user)}</h1>
                        <p className="flex flex-wrap items-center gap-x-3 text-[15px] text-ink-soft">
                            <span>@{user.username}</span>
                            {user.city && <span className="inline-flex items-center gap-1"><MapPin className="size-4" aria-hidden="true" />{user.city}</span>}
                        </p>
                    </div>
                    {user.bio && <p className="max-w-[620px] text-base leading-relaxed">{user.bio}</p>}
                    {isMe && user.email && <p className="text-sm text-muted-foreground">{user.email} · solo lo ves tú</p>}
                </div>
            </section>
            {isMe && <ComingSoon what="Editar tu perfil e intereses" issue="[2.1] #44" />}
        </div>
    );
}
