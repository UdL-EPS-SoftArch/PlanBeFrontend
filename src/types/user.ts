import { Resource } from "halfred";
import type { Audited } from "@/types/hal";

export interface AuthorityEntity {
    authority: string;
}

export type Role = "ROLE_USER" | "ROLE_ADMIN";

export interface UserEntity extends Audited {
    uri?: string;
    username: string;
    email?: string;
    password?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    city?: string;
    authorities?: AuthorityEntity[];
}

export type User = UserEntity & Resource;

export function hasRole(user: Pick<UserEntity, "authorities"> | null | undefined, ...roles: Role[]): boolean {
    return !!user?.authorities?.some(a => roles.includes(a.authority as Role));
}

/** Name to show in the UI: `displayName` when the user has set one, else the username. */
export function userLabel(user: Pick<UserEntity, "displayName" | "username">): string {
    return user.displayName?.trim() || user.username;
}

/** Up to two initials for avatar fallbacks ("Laia Martí" → "LM", "demo" → "DE"). */
export function userInitials(user: Pick<UserEntity, "displayName" | "username">): string {
    const words = userLabel(user).split(/\s+/).filter(Boolean);
    const letters = words.length > 1 ? words[0][0] + words[1][0] : userLabel(user).slice(0, 2);
    return letters.toUpperCase();
}
