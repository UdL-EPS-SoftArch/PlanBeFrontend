import type { Metadata } from "next";
import Link from "next/link";
import { UsersService } from "@/api/userApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { requireUser } from "@/lib/session";
import { getErrorMessage } from "@/lib/errors";
import { userLabel, type User } from "@/types/user";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { UserAvatar } from "@/components/common/UserAvatar";

export const metadata: Metadata = { title: "Personas" };

export default async function UsersPage() {
    await requireUser("/users");

    let users: User[] = [];
    let error: unknown = null;
    try {
        users = await new UsersService(serverAuthProvider).getUsers();
    } catch (e) {
        error = e;
    }

    const content = error
        ? <ErrorState message={getErrorMessage(error)} />
        : users.length === 0
            ? <EmptyState title="Todavía no hay nadie" description="Cuando alguien se registre, aparecerá aquí." />
            : (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
                    {users.map(user => (
                        <li key={user.username}>
                            <Link href={`/users/${user.username}`} className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted">
                                <UserAvatar user={user} />
                                <span className="flex min-w-0 flex-col">
                                    <span className="truncate font-semibold">{userLabel(user)}</span>
                                    <span className="truncate text-sm text-muted-foreground">@{user.username}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            );

    return (
        <PageContainer width="default">
            <PageHeader title="Personas" />
            {content}
        </PageContainer>
    );
}
