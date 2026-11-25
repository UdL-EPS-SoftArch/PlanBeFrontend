import Link from "next/link";
import { cn } from "@/lib/utils";

/** PlanBe mark: a map pin inside a tomato tile. Decorative; the wordmark carries the name. */
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 28 28" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
            <rect width="28" height="28" rx="8" className="fill-brand" />
            <path d="M14 6.5c-3.3 0-6 2.6-6 5.9 0 4.3 6 9.1 6 9.1s6-4.8 6-9.1c0-3.3-2.7-5.9-6-5.9z" fill="#fff" />
            <circle cx="14" cy="12.4" r="2.2" className="fill-brand" />
        </svg>
    );
}

export function Wordmark({ className }: { className?: string }) {
    return (
        <span className={cn("font-display text-[22px] font-bold tracking-[-0.02em]", className)}>
            Plan<span className="text-primary">Be</span>
        </span>
    );
}

/** Logo linking to the home page. */
export function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" aria-label="PlanBe, inicio" className={cn("inline-flex items-center gap-2.5 rounded-lg text-foreground", className)}>
            <LogoMark />
            <Wordmark />
        </Link>
    );
}
