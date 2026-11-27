import type { ReactNode } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Euro,
    Eye,
    MapPin,
    MessageCircle,
    MessageSquare,
    Star,
    Tag,
    UserRound,
    Users,
} from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { PageContainer } from "@/components/common/PageContainer";
import { Badge } from "@/components/ui/badge";
import { catalogId, catalogLabel } from "@/types/meetup";
import type { MeetupDetailData } from "@/types/meetupDetail";
import { userLabel } from "@/types/user";
import { MeetupActions } from "./MeetupActions";
import { MeetupStatusBadge } from "./MeetupCard";

const TIME_ZONE = "Europe/Madrid";

const CATEGORY_LABELS: Record<string, string> = {
    TECHNOLOGY: "Tecnología",
    SPORTS: "Deporte",
    ARTS: "Arte",
    CULTURE: "Cultura",
    EDUCATION: "Educación",
    HEALTH: "Salud",
    OTHER: "Otros",
};

const VISIBILITY_LABELS: Record<string, string> = {
    PUBLIC: "Pública",
    PRIVATE: "Privada",
    GROUP: "Del grupo",
};

function categoryLabel(ref: string | undefined): string {
    const id = catalogId(ref);
    if (!id) return "Sin categoría";
    return CATEGORY_LABELS[id] ?? catalogLabel(ref) ?? id;
}

function formatDate(iso: string): string {
    const text = new Date(iso).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: TIME_ZONE,
    });
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TIME_ZONE,
    });
}

function DetailItem({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
    return (
        <div className="flex gap-3">
            <span className="mt-0.5 text-ink-soft [&_svg]:size-5" aria-hidden="true">{icon}</span>
            <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">{label}</dt>
                <dd className="mt-1 text-[15px] font-medium">{value}</dd>
            </div>
        </div>
    );
}

function Placeholder({
    id,
    title,
    description,
    icon,
}: {
    id: string;
    title: string;
    description: string;
    icon: ReactNode;
}) {
    return (
        <section id={id} aria-label={title} className="scroll-mt-8 rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold">{title}</h2>
                <Badge variant="muted">Muy pronto</Badge>
            </div>
            <EmptyState icon={icon} title={`${title}: muy pronto`} description={description} />
        </section>
    );
}

/** Server Component: all data arrives as plain props from `src/api/meetupDetailApi.ts`. */
export function MeetupDetail({ data }: { data: MeetupDetailData }) {
    const { meetup, organizer, group, tags, occupied, free, isFull, permissions, participation } = data;
    const capacity = Math.max(0, meetup.capacity ?? 0);
    const percent = capacity > 0 ? Math.min(100, Math.round((occupied / capacity) * 100)) : 0;
    const location = meetup.location;
    const place = [location?.name, location?.address, location?.city].filter(Boolean).join(" · ");
    const coordinates = location?.latitude !== undefined && location?.longitude !== undefined
        ? `(${location.latitude}, ${location.longitude})`
        : undefined;
    const when = `${formatDate(meetup.startDate)} · ${formatTime(meetup.startDate)}`
        + (meetup.endDate ? ` – ${formatTime(meetup.endDate)}` : "");

    return (
        <PageContainer>
            <Link href="/meetups" className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-foreground">
                <ArrowLeft className="size-4" aria-hidden="true" /> Volver a quedadas
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="flex min-w-0 flex-col gap-6">
                    <header>
                        <div className="flex flex-wrap items-center gap-2">
                            <MeetupStatusBadge status={meetup.status} />
                            <Badge variant="outline">
                                {VISIBILITY_LABELS[meetup.visibility ?? "PUBLIC"] ?? meetup.visibility}
                            </Badge>
                            <Badge variant="muted">{categoryLabel(meetup.category)}</Badge>
                            {isFull && <Badge variant="warning">Completa</Badge>}
                            {participation?.status === "WAITING" && <Badge variant="accent">En lista de espera</Badge>}
                        </div>
                        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{meetup.title}</h1>
                        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                            {meetup.description || "Esta quedada aún no tiene descripción."}
                        </p>
                    </header>

                    <section aria-label="Información de la quedada" className="rounded-xl border bg-card p-5">
                        <h2 className="font-display text-xl font-semibold">Información</h2>
                        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                            <DetailItem icon={<CalendarDays />} label="Fecha" value={when} />
                            <DetailItem icon={<Clock />} label="Fin" value={meetup.endDate ? formatDate(meetup.endDate) : "—"} />
                            <DetailItem
                                icon={<UserRound />}
                                label="Organizador"
                                value={organizer
                                    ? <Link className="underline-offset-4 hover:underline" href={`/users/${organizer.username}`}>{userLabel(organizer)}</Link>
                                    : "—"}
                            />
                            <DetailItem icon={<Users />} label="Grupo" value={group?.name ?? "Sin grupo"} />
                            <DetailItem icon={<MapPin />} label="Ubicación" value={place ? <>{place}{coordinates && <span className="block text-sm font-normal text-ink-soft">{coordinates}</span>}</> : "—"} />
                            <DetailItem icon={<Euro />} label="Precio" value={meetup.price ? `${meetup.price} €` : "Gratis"} />
                            <DetailItem icon={<Eye />} label="Visibilidad" value={VISIBILITY_LABELS[meetup.visibility ?? "PUBLIC"] ?? meetup.visibility ?? "—"} />
                            <DetailItem icon={<Users />} label="Aforo" value={`${capacity} ${capacity === 1 ? "plaza" : "plazas"}`} />
                        </dl>
                    </section>

                    <section aria-label="Etiquetas e intereses" className="rounded-xl border bg-card p-5">
                        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                            <Tag className="size-5" aria-hidden="true" /> Etiquetas e intereses
                        </h2>
                        {tags.length > 0 ? (
                            <div data-testid="meetup-tags" className="mt-4 flex flex-wrap gap-2">
                                {tags.map(tag => <Badge key={tag.ref} variant="accent">{tag.name}</Badge>)}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-ink-soft">Esta quedada no tiene etiquetas.</p>
                        )}
                    </section>

                    <Placeholder
                        id="comentarios"
                        title="Comentarios"
                        description="Aquí podrás leer y escribir comentarios cuando se active la sección de comentarios."
                        icon={<MessageCircle />}
                    />
                    <Placeholder
                        id="valoraciones"
                        title="Valoraciones"
                        description={permissions.canRate
                            ? "Podrás valorar la quedada cuando la sección de valoraciones esté disponible."
                            : "Las valoraciones se abrirán para quienes hayan participado con plaza confirmada."}
                        icon={<Star />}
                    />
                    <Placeholder
                        id="chat"
                        title="Chat"
                        description={permissions.canChat
                            ? "El chat estará disponible aquí para las personas con plaza confirmada."
                            : "El chat se abre solo para las personas con plaza confirmada."}
                        icon={<MessageSquare />}
                    />
                </div>

                <aside className="flex flex-col gap-6">
                    <section aria-label="Plazas de la quedada" className="rounded-xl border bg-card p-5">
                        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                            <Users className="size-5" aria-hidden="true" /> Plazas
                        </h2>
                        <p data-testid="meetup-occupancy" className="mt-3 font-display text-2xl font-bold">
                            {occupied} / {capacity}
                        </p>
                        <p className="mt-1 text-sm text-ink-soft">
                            {isFull ? "Completa: no quedan plazas libres" : `${free} ${free === 1 ? "plaza libre" : "plazas libres"}`}
                        </p>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                        </div>
                    </section>

                    <MeetupActions
                        meetupId={meetup.id !== undefined ? String(meetup.id) : String(meetup.uri?.split("/").filter(Boolean).pop() ?? "")}
                        permissions={permissions}
                        participationId={participation?.id}
                    />
                </aside>
            </div>
        </PageContainer>
    );
}
