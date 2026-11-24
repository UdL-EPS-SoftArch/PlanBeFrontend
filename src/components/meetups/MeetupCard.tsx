import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { catalogId, catalogLabel, meetupId, type MeetupEntity } from "@/types/meetup";

const TIME_ZONE = "Europe/Madrid";

const STATUS: Record<string, { label: string; variant: "success" | "warning" | "danger" | "muted" }> = {
    OPEN: { label: "Abierta", variant: "success" },
    FULL: { label: "Completa", variant: "warning" },
    CANCELLED: { label: "Cancelada", variant: "danger" },
    FINISHED: { label: "Finalizada", variant: "muted" },
    DRAFT: { label: "Borrador", variant: "muted" },
};

const VISIBILITY: Record<string, string> = { PUBLIC: "Pública", PRIVATE: "Privada", GROUP: "Grupo" };

export function MeetupStatusBadge({ status }: { status?: MeetupEntity["status"] }) {
    const id = catalogId(status);
    if (!id) return null;
    const s = STATUS[id] ?? { label: catalogLabel(status) ?? id, variant: "muted" as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
}

function formatWhen(start: string, end?: string): string {
    const startDate = new Date(start);
    const day = startDate.toLocaleDateString("es-ES", { weekday: "short", timeZone: TIME_ZONE });
    const time = (d: Date) => d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE });
    const label = day.charAt(0).toUpperCase() + day.slice(1).replace(".", "");
    return end ? `${label} · ${time(startDate)} – ${time(new Date(end))}` : `${label} · ${time(startDate)}`;
}

/** Card used in every meetup list. The whole card links to the detail page. */
export function MeetupCard({ meetup }: { meetup: MeetupEntity }) {
    const start = new Date(meetup.startDate);
    const day = start.toLocaleDateString("es-ES", { day: "2-digit", timeZone: TIME_ZONE });
    const month = start.toLocaleDateString("es-ES", { month: "short", timeZone: TIME_ZONE }).replace(".", "");
    const place = [meetup.location?.name || meetup.location?.address, meetup.location?.city].filter(Boolean).join(", ");
    const category = catalogLabel(meetup.category);
    const id = meetupId(meetup);

    return (
        <Link
            href={id ? `/meetups/${id}` : "/meetups"}
            className="group flex h-full flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgba(22,24,29,0.04)] transition-shadow hover:shadow-[0_1px_2px_rgba(22,24,29,0.06),0_8px_24px_rgba(22,24,29,0.08)]"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex h-16 w-[60px] shrink-0 flex-col items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <span className="font-display text-2xl font-bold leading-none">{day}</span>
                    <span className="mt-1 text-xs font-semibold uppercase tracking-[0.08em]">{month}</span>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                    {category && <Badge variant="muted" className="rounded-md">{category}</Badge>}
                    {meetup.visibility && meetup.visibility !== "PUBLIC" && (
                        <Badge variant="outline" className="rounded-md">{VISIBILITY[meetup.visibility]}</Badge>
                    )}
                    <MeetupStatusBadge status={meetup.status} />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold leading-snug group-hover:text-primary">{meetup.title}</h3>
                <span className="flex items-center gap-2 text-sm text-ink-soft">
                    <Clock className="size-4" aria-hidden="true" />
                    {formatWhen(meetup.startDate, meetup.endDate)}
                </span>
                {place && (
                    <span className="flex items-center gap-2 text-sm text-ink-soft">
                        <MapPin className="size-4" aria-hidden="true" />
                        {place}
                    </span>
                )}
            </div>
            <div className="mt-auto flex items-center gap-2 border-t pt-3 text-sm text-ink-soft">
                <Users className="size-4" aria-hidden="true" />
                {meetup.capacity === 1 ? "1 plaza" : `${meetup.capacity} plazas`}
                {meetup.price ? <span className="ml-auto font-semibold text-foreground">{meetup.price} €</span> : <span className="ml-auto font-semibold text-foreground">Gratis</span>}
            </div>
        </Link>
    );
}
