"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@/app/components/authentication";
import Loginbar from "@/app/components/loginbar";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS, isActivePath } from "@/lib/navigation";
import { hasRole } from "@/types/user";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const links = NAV_LINKS.filter(({ roles }) => !roles || hasRole(user, ...roles));

    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
            <nav aria-label="Principal" className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center gap-7 px-5">
                <Logo />

                <ul className="hidden min-w-0 flex-1 items-center gap-1 md:flex">
                    {links.map(({ href, label }) => {
                        const active = isActivePath(pathname, href);
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "inline-flex h-10 items-center whitespace-nowrap rounded-lg px-3 text-[15px] transition-colors",
                                        active
                                            ? "bg-muted font-semibold text-foreground shadow-[inset_0_-2px_0_var(--primary)]"
                                            : "font-medium text-ink-soft hover:bg-muted hover:text-foreground",
                                    )}
                                >
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="ml-auto flex items-center gap-2 md:ml-0">
                    <Loginbar />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menú">
                                <Menu aria-hidden="true" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            <SheetHeader>
                                <SheetTitle>Menú</SheetTitle>
                            </SheetHeader>
                            <ul className="flex flex-col gap-1 px-4">
                                {links.map(({ href, label }) => {
                                    const active = isActivePath(pathname, href);
                                    return (
                                        <li key={href}>
                                            <Link
                                                href={href}
                                                onClick={() => setOpen(false)}
                                                aria-current={active ? "page" : undefined}
                                                className={cn(
                                                    "flex h-11 items-center rounded-lg px-3 text-base",
                                                    active ? "bg-accent font-semibold text-accent-foreground" : "font-medium hover:bg-muted",
                                                )}
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
