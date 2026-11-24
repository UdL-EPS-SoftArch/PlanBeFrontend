"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { User } from "@/types/user";
import { RequireAuth } from "@/components/common/RequireAuth";

export default function UserDetailPage() {
    return (
        <RequireAuth>
            <UserDetail />
        </RequireAuth>
    );
}

function UserDetail() {
    const params = useParams();
    const userId = params?.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        new UsersService(clientAuthProvider())
            .getUserById(userId)
            .then(data => { if (active) setUser(data); })
            .catch(err => console.error(err))
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [userId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <p>User not found.</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main
                className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <div className="space-y-4 w-full">
                        <h1 className="text-2xl font-semibold">{user.username}</h1>

                        {user.email && (
                            <p className="text-gray-700">
                                <strong>Email:</strong> {user.email}
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
