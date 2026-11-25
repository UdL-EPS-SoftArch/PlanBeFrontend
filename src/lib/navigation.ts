import type { Role } from "@/types/user";

export type NavLink = {
    href: string;
    label: string;
    /** Shown only to users with any of these roles; omitted = shown to everyone. */
    roles?: Role[];
};

/** Main navigation. The account menu (profile, logout) lives in the login bar. */
export const NAV_LINKS: NavLink[] = [
    { href: "/", label: "Inicio" },
    { href: "/meetups", label: "Quedadas" },
    { href: "/groups", label: "Grupos" },
    { href: "/me/meetups", label: "Mis quedadas", roles: ["ROLE_USER", "ROLE_ADMIN"] },
    { href: "/admin", label: "Administración", roles: ["ROLE_ADMIN"] },
];

/** `/login?next=…` for a protected route. */
export function loginHref(nextPath: string): string {
    return `/login?next=${encodeURIComponent(nextPath)}`;
}

/**
 * Validates the `next` param after login: only same-site relative paths are allowed,
 * so `?next=https://evil.example` or `?next=//evil.example` cannot redirect off the app.
 */
export function safeNextPath(next: string | null | undefined): string | null {
    if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return null;
    return next;
}

export function isActivePath(pathname: string, href: string): boolean {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
