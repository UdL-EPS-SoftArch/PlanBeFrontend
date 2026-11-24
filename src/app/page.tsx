import Link from "next/link";
import { Suspense } from "react";
import { CalendarSearch } from "lucide-react";
import { MeetupService } from "@/api/meetupApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { getErrorMessage } from "@/lib/errors";
import { MeetupCard } from "@/components/meetups/MeetupCard";
import { CardGridSkeleton } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { meetupId, type Meetup } from "@/types/meetup";

const STEPS = [
    { title: "Busca", text: "Filtra por categoría, ciudad o fecha. Si completas tus intereses, te recomendamos planes." },
    { title: "Apúntate", text: "Si hay plaza, quedas confirmado. Si está completa, entras en la lista de espera y te avisamos." },
    { title: "Queda", text: "Habla con el grupo en los comentarios y, después, valora la experiencia." },
];

async function loadUpcoming(): Promise<{ meetups: Meetup[]; error: unknown }> {
    try {
        return { meetups: await new MeetupService(serverAuthProvider).getVisibleMeetups(6), error: null };
    } catch (error) {
        return { meetups: [], error };
    }
}

async function UpcomingMeetups() {
    const { meetups, error } = await loadUpcoming();
    if (error) {
        return (
            <ErrorState
                title="No hemos podido cargar las quedadas"
                message={getErrorMessage(error)}
                action={<Button asChild variant="outline"><Link href="/">Reintentar</Link></Button>}
            />
        );
    }
    if (meetups.length === 0) {
        return (
            <EmptyState
                icon={<CalendarSearch />}
                title="Todavía no hay quedadas próximas"
                description="Sé la primera persona en proponer un plan. Las quedadas públicas aparecerán aquí."
                action={<Button asChild><Link href="/meetups/new">Crear quedada</Link></Button>}
            />
        );
    }
    return (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            {meetups.map((meetup, i) => (
                <li key={meetupId(meetup) ?? i}>
                    <MeetupCard meetup={meetup} />
                </li>
            ))}
        </ul>
    );
}

export default function Home() {
    return (
        <main className="flex flex-col">
            <section className="mx-auto flex w-full max-w-[1240px] flex-col px-5 pb-16 pt-14 sm:pt-[72px]">
                <div className="flex max-w-3xl flex-col gap-6">
                    <span className="self-start rounded-full bg-accent px-3 py-1.5 text-[13px] font-semibold text-accent-foreground">
                        Quedadas en tu ciudad
                    </span>
                    <h1 className="text-[clamp(40px,5.6vw,72px)] font-bold leading-[1.02] tracking-[-0.035em]">
                        Haz planes con gente{" "}
                        <span className="bg-[linear-gradient(transparent_62%,#fbc4ae_62%)] dark:bg-[linear-gradient(transparent_62%,#7a3519_62%)]">cerca de ti</span>.
                    </h1>
                    <p className="max-w-[520px] text-lg leading-relaxed text-ink-soft">
                        Encuentra quedadas que encajan con tus intereses, apúntate en un clic y conoce a gente que quiere hacer lo mismo que tú.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg"><Link href="/meetups">Explorar quedadas</Link></Button>
                        <Button asChild size="lg" variant="outline"><Link href="/users/register">Crear cuenta</Link></Button>
                    </div>
                </div>

            </section>

            <section aria-labelledby="proximas" className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-5 pb-[72px] pt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 id="proximas" className="text-[32px] font-bold tracking-[-0.02em]">Próximas quedadas</h2>
                    <Link href="/meetups" className="py-2.5 text-[15px] font-semibold text-primary hover:underline">Ver todas →</Link>
                </div>
                <Suspense fallback={<CardGridSkeleton />}>
                    <UpcomingMeetups />
                </Suspense>
            </section>

            <section aria-labelledby="como-funciona" className="bg-muted">
                <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-9 px-5 py-[72px]">
                    <h2 id="como-funciona" className="text-[32px] font-bold tracking-[-0.02em]">Cómo funciona</h2>
                    <ol className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8">
                        {STEPS.map((step, i) => (
                            <li key={step.title} className="flex flex-col gap-2.5">
                                <span className="font-display text-[44px] font-bold leading-none text-brand" aria-hidden="true">{i + 1}</span>
                                <span className="text-lg font-semibold">{step.title}</span>
                                <span className="text-[15px] leading-relaxed text-ink-soft">{step.text}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1240px] px-5 py-[72px]">
                <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-[#16181d] p-8 text-white sm:p-12">
                    <div className="flex flex-[1_1_420px] flex-col gap-2">
                        <p className="font-display text-[clamp(26px,3vw,36px)] font-bold leading-tight tracking-[-0.02em]">¿Tienes un plan? Ponle fecha.</p>
                        <p className="text-base text-[#c9cbd1]">Crea una quedada, elige quién puede verla y deja que la gente se apunte.</p>
                    </div>
                    <Button asChild size="lg" className="bg-[#f08a5d] font-bold text-[#16181d] hover:bg-[#f39b74]">
                        <Link href="/meetups/new">Crear quedada</Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}
