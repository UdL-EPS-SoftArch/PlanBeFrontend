import { LogoMark, Wordmark } from "@/components/brand/Logo";
import Link from "next/link";

/** Two-panel layout shared by Entrar and Crear cuenta: brand panel + form. */
export function AuthShell({ aside, children }: { aside: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="flex flex-1 flex-wrap">
            <section className="flex min-h-[280px] flex-[1_1_480px] flex-col justify-between gap-12 bg-[#16181d] p-10 text-white sm:p-12">
                <Link href="/" aria-label="PlanBe, inicio" className="inline-flex items-center gap-2.5 self-start">
                    <LogoMark />
                    <Wordmark className="text-2xl [&>span]:text-[#f08a5d]" />
                </Link>
                {aside}
            </section>
            <section className="flex flex-[1_1_480px] items-center justify-center px-6 py-12">
                <div className="w-full max-w-[400px]">{children}</div>
            </section>
        </div>
    );
}
