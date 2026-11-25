import { cn } from "@/lib/utils";

/** Page title block: H1, optional description and actions aligned to the right. */
export function PageHeader({
    title,
    description,
    actions,
    className,
}: {
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
            <div className="flex min-w-0 flex-col gap-1.5">
                <h1 className="text-4xl font-bold tracking-[-0.025em]">{title}</h1>
                {description && <p className="text-[15px] text-ink-soft">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
    );
}
