import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** A section that failed to load. Shows the backend message and, when possible, a retry. */
export function ErrorState({
    title = "No se ha podido cargar",
    message,
    action,
    className,
}: {
    title?: string;
    message?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <div role="alert" className={cn("flex flex-col items-center gap-3 rounded-xl bg-destructive-soft px-6 py-10 text-center text-destructive-soft-foreground", className)}>
            <CircleAlert className="size-7" aria-hidden="true" />
            <p className="font-display text-lg font-semibold">{title}</p>
            {message && <p className="max-w-md text-[15px] leading-relaxed">{message}</p>}
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}
