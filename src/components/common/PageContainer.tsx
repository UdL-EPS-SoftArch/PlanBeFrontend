import { cn } from "@/lib/utils";

const WIDTHS = {
    narrow: "max-w-2xl",
    default: "max-w-5xl",
    wide: "max-w-[1240px]",
} as const;

/** Page wrapper with the shared max width and padding. Every page renders inside one. */
export function PageContainer({
    children,
    width = "wide",
    className,
}: {
    children: React.ReactNode;
    width?: keyof typeof WIDTHS;
    className?: string;
}) {
    return (
        <div className={cn("mx-auto w-full px-5 py-10 sm:py-12", WIDTHS[width], className)}>
            {children}
        </div>
    );
}
