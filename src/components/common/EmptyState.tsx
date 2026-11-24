import { cn } from "@/lib/utils";

/** Empty list or not-yet-available section. Always says what to do next. */
export function EmptyState({
    title,
    description,
    action,
    icon,
    className,
}: {
    title: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col items-center gap-3 rounded-xl border border-dashed border-input bg-muted/50 px-6 py-12 text-center", className)}>
            {icon && <div className="text-ink-soft [&_svg]:size-8" aria-hidden="true">{icon}</div>}
            <p className="font-display text-xl font-semibold">{title}</p>
            {description && <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">{description}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
