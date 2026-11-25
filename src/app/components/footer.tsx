import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/brand/Logo";

export default function Footer() {
    return (
        <footer className="border-t bg-muted">
            <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-start justify-between gap-x-12 gap-y-6 px-5 py-10">
                <div className="flex max-w-sm flex-col gap-2.5">
                    <span className="inline-flex items-center gap-2">
                        <LogoMark className="size-6" />
                        <Wordmark className="text-lg" />
                    </span>
                    <p className="text-sm text-ink-soft">Quedadas con gente que comparte tus planes.</p>
                </div>
                <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 text-sm font-medium">
                    <Link href="/meetups" className="py-2.5 hover:text-primary">Quedadas</Link>
                    <Link href="/groups" className="py-2.5 hover:text-primary">Grupos</Link>
                    <Link href="/meetups/new" className="py-2.5 hover:text-primary">Crear quedada</Link>
                </nav>
                <p className="basis-full text-[13px] text-muted-foreground">
                    © {new Date().getFullYear()} PlanBe · Proyecto de Arquitectura del Software, Universitat de Lleida
                </p>
            </div>
        </footer>
    );
}
