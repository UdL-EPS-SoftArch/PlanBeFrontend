"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { User } from "@/types/user";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";

type AuthContextType = {
    user: User | null;
    /** `true` until the first `/identity` check finishes; guards wait for it to avoid flicker. */
    loading: boolean;
    setUser: (u: User | null) => void;
    /** Re-reads the session from `/identity`. */
    refresh: () => Promise<User | null>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AUTH_COOKIE = "MYAPP_AUTH";

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const current = await new UsersService(clientAuthProvider()).getCurrentUser();
            setUser(current);
            return current;
        } catch {
            // An invalid or expired cookie must not leave the app in a broken half-logged state.
            deleteCookie(AUTH_COOKIE);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        new UsersService(clientAuthProvider())
            .getCurrentUser()
            .then(current => { if (active) setUser(current); })
            .catch(() => {
                deleteCookie(AUTH_COOKIE);
                if (active) setUser(null);
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    const logout = useCallback(() => {
        deleteCookie(AUTH_COOKIE, { path: "/" });
        setUser(null);
        router.push("/");
        router.refresh();
    }, [router]);

    const value = useMemo(() => ({ user, loading, setUser, refresh, logout }), [user, loading, refresh, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}
