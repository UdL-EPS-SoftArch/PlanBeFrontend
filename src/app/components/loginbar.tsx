"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Plus, UserRound } from "lucide-react";
import { useAuth } from "@/app/components/authentication";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/common/UserAvatar";
import { userLabel } from "@/types/user";

/** Session area of the navbar: account menu when signed in, Entrar / Crear cuenta otherwise. */
export default function Loginbar() {
    const { user, loading, logout } = useAuth();

    if (loading) {
        return <Skeleton className="h-10 w-36 rounded-full" aria-hidden="true" />;
    }

    if (!user) {
        return (
            <div className="flex items-center gap-1.5">
                <Button asChild variant="ghost">
                    <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="hidden sm:inline-flex">
                    <Link href="/users/register">Crear cuenta</Link>
                </Button>
            </div>
        );
    }

    const name = userLabel(user);

    return (
        <div className="flex items-center gap-2.5">
            <Button asChild className="hidden lg:inline-flex">
                <Link href="/meetups/new"><Plus aria-hidden="true" />Crear quedada</Link>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        aria-label={`Tu cuenta: ${name}`}
                        className="inline-flex h-11 items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 text-sm font-semibold hover:bg-muted"
                    >
                        <UserAvatar user={user} />
                        <span className="hidden max-w-32 truncate sm:inline">{name}</span>
                        <ChevronDown className="size-4 text-ink-soft" aria-hidden="true" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex flex-col">
                        <span>{name}</span>
                        <span className="text-xs font-normal text-muted-foreground">@{user.username}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={`/users/${user.username}`}><UserRound aria-hidden="true" />Mi perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="lg:hidden">
                        <Link href="/meetups/new"><Plus aria-hidden="true" />Crear quedada</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={logout}>
                        <LogOut aria-hidden="true" />Cerrar sesión
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
