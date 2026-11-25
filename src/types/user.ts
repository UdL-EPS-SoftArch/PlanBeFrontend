import { Resource } from "halfred";
import type { Audited } from "@/types/hal";
import type { FieldError } from "@/lib/errors";

export interface AuthorityEntity {
    authority: string;
}

export type Role = "ROLE_USER" | "ROLE_ADMIN";

export interface UserEntity extends Audited {
    uri?: string;
    username: string;
    email?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    city?: string;
    showPersonalData?: boolean;
    birthDate?: string;
    age?: number;
    gender?: string;
    interests?: string[];
    authorities?: AuthorityEntity[];
}

export type User = UserEntity & Resource;

/** Errores de validación del backend (RF-1.1, RF-1.2) */
export interface UserValidationErrors {
    email?: string;
    displayName?: string;
    bio?: string;
    city?: string;
    birthDate?: string;
    age?: string;
    gender?: string;
    interests?: string;
}

/** Campos requeridos para crear/actualizar un usuario */
export interface UserFormData {
    username: string;
    email: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    city?: string;
    showPersonalData?: boolean;
    birthDate?: string;
    age?: string;
    gender?: string;
    interests?: string[];
}

// Re-export FieldError for convenience
export type { FieldError };

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
