import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Generic loading block for a page or section, announced to screen readers. */
export function LoadingState({ label = "Cargando…", className }: { label?: string; className?: string }) {
    return (
        <div role="status" aria-live="polite" className={cn("flex flex-col gap-3", className)}>
            <span className="sr-only">{label}</span>
            <Skeleton className="h-9 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
        </div>
    );
}

/** Placeholder grid while meetup cards load. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div role="status" aria-live="polite" className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            <span className="sr-only">Cargando quedadas…</span>
            {Array.from({ length: count }, (_, i) => (
                <Skeleton key={i} className="h-[340px] rounded-xl" />
            ))}
        </div>
    );
}
