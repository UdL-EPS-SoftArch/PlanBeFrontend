import "server-only";
import { redirect } from "next/navigation";
import { serverAuthProvider } from "@/lib/authProvider";
import { UsersService } from "@/api/userApi";
import { hasRole, Role, User } from "@/types/user";
import { loginHref } from "@/lib/navigation";

/**
 * Server Component guard: returns the signed-in user or redirects to `/login?next=<nextPath>`.
 * With `roles`, a signed-in user without any of them is sent to `/acceso-denegado`.
 *
 *     const user = await requireUser("/meetups/new");
 */
export async function requireUser(nextPath: string, roles: Role[] = []): Promise<User> {
    let user: User | null = null;
    try {
        user = await new UsersService(serverAuthProvider).getCurrentUser();
    } catch {
        user = null;
    }
    if (!user) redirect(loginHref(nextPath));
    if (roles.length > 0 && !hasRole(user, ...roles)) redirect("/acceso-denegado");
    return user;
}
