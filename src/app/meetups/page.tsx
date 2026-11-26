import Link from "next/link";
import { Suspense } from "react";
import { CalendarSearch, Plus } from "lucide-react";
import { MeetupService } from "@/api/meetupApi";
import { CategoryService } from "@/api/categoryApi";
import { InterestService } from "@/api/interestApi";
import { UsersService } from "@/api/userApi";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { CardGridSkeleton } from "@/components/common/LoadingState";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import { MeetupCard } from "@/components/meetups/MeetupCard";
import { MeetupFilters } from "@/components/meetups/MeetupFilters";
import { getErrorMessage } from "@/lib/errors";
import { serverAuthProvider } from "@/lib/authProvider";
import { catalogId, meetupId, type Meetup } from "@/types/meetup";
import { sameInterestRef } from "@/types/interest";

const PAGE_SIZE = 9;

type RawSearchParams = Record<string, string | string[] | undefined>;
type Filters = {
    category: string;
    city: string;
    startDate: string;
    interest: string;
    page: number;
};
type Results = {
    items: Meetup[];
    page: number;
    totalPages: number;
    totalElements: number;
    hasPrev: boolean;
    hasNext: boolean;
};

function first(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalize(params: RawSearchParams): Filters {
    return {
        category: first(params.category),
        city: first(params.city),
        startDate: first(params.startDate),
        interest: first(params.interest),
        page: Math.max(0, Number.parseInt(first(params.page), 10) || 0),
    };
}

function parseStartDate(value: string): Date | undefined {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Backend searches are used whenever a supported backend filter is present. The remaining
 * filters (interest, or combinations the backend cannot express in one query) refine that
 * result; visibility is always decided by the backend, never by the client.
 */
async function loadResults(filters: Filters): Promise<Results> {
    const service = new MeetupService(serverAuthProvider);
    const startDate = parseStartDate(filters.startDate);
    const hasBackendFilter = !!(filters.category || filters.city || startDate);

    if (!hasBackendFilter && !filters.interest) {
        const halPage = await service.getMeetupsPage(filters.page, PAGE_SIZE);
        const info = halPage.page;
        const totalElements = info?.totalElements ?? halPage.items.length;
        const totalPages = Math.max(1, info?.totalPages ?? Math.ceil(totalElements / PAGE_SIZE));
        return {
            items: halPage.items,
            page: info?.number ?? filters.page,
            totalPages,
            totalElements,
            hasPrev: !!halPage.links.prev,
            hasNext: !!halPage.links.next,
        };
    }

    let source: Meetup[];
    if (filters.category) source = await service.searchByCategory(filters.category);
    else if (filters.city) source = await service.searchByCity(filters.city);
    else if (startDate) source = await service.searchByStartDate(startDate);
    else source = await service.getAllMeetups();

    const filtered = source.filter(meetup =>
        (!filters.category || catalogId(meetup.category) === filters.category)
        && (!filters.city || meetup.location?.city?.toLowerCase() === filters.city.toLowerCase())
        && (!startDate || new Date(meetup.startDate).getTime() > startDate.getTime())
        && (!filters.interest || meetup.tags?.some(tag => sameInterestRef(tag, filters.interest)))
    );

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));
    const page = Math.min(filters.page, totalPages - 1);
    return {
        items: filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
        page,
        totalPages,
        totalElements,
        hasPrev: page > 0,
        hasNext: page < totalPages - 1,
    };
}

function pageHref(filters: Filters, page: number): string {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.interest) params.set("interest", filters.interest);
    params.set("page", String(page));
    return `/meetups?${params.toString()}`;
}

async function MeetupResults({ filters }: { filters: Filters }) {
    let results: Results;
    try {
        results = await loadResults(filters);
    } catch (error) {
        return (
            <ErrorState
                title="No hemos podido cargar las quedadas"
                message={getErrorMessage(error)}
                action={<Button asChild variant="outline"><Link href="/meetups">Reintentar</Link></Button>}
            />
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink-soft">
                <p role="status">
                    {results.totalElements === 0
                        ? "Sin resultados"
                        : `${results.totalElements} ${results.totalElements === 1 ? "quedada" : "quedadas"}`}
                </p>
                <p>Página {results.page + 1} de {results.totalPages}</p>
            </div>

            {results.items.length === 0 ? (
                <EmptyState
                    icon={<CalendarSearch />}
                    title="No hay quedadas con estos filtros"
                    description="Prueba con otra categoría, otra ciudad o una fecha desde más temprana."
                    action={<Button asChild variant="outline"><Link href="/meetups">Limpiar filtros</Link></Button>}
                />
            ) : (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                    {results.items.map((meetup, i) => (
                        <li key={meetupId(meetup) ?? i}>
                            <MeetupCard meetup={meetup} />
                        </li>
                    ))}
                </ul>
            )}

            {results.totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        {results.hasPrev && (
                            <PaginationItem>
                                <PaginationLink href={pageHref(filters, results.page - 1)} aria-label="Página anterior">
                                    Anterior
                                </PaginationLink>
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink href={pageHref(filters, results.page)} isActive aria-label={`Página ${results.page + 1}`}>
                                {results.page + 1}
                            </PaginationLink>
                        </PaginationItem>
                        {results.hasNext && (
                            <PaginationItem>
                                <PaginationLink href={pageHref(filters, results.page + 1)} aria-label="Página siguiente">
                                    Siguiente
                                </PaginationLink>
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}

export default async function MeetupsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
    const filters = normalize(await searchParams);
    const auth = serverAuthProvider;
    const [categories, interests, user] = await Promise.all([
        new CategoryService(auth).getCategories().catch(() => []),
        new InterestService(auth).getInterestOptions().catch(() => []),
        new UsersService(auth).getCurrentUser().catch(() => null),
    ]);

    return (
        <PageContainer>
            <PageHeader
                title="Quedadas"
                description="Descubre planes cerca de ti. Solo ves las quedadas que el backend te permite ver."
                actions={user && (
                    <Button asChild data-testid="create-meetup">
                        <Link href="/meetups/new"><Plus aria-hidden="true" /> Crear quedada</Link>
                    </Button>
                )}
            />

            <section aria-label="Filtros de quedadas" className="mb-8 rounded-xl border bg-card p-5">
                <MeetupFilters values={filters} categories={categories} interests={interests} />
            </section>

            <Suspense fallback={<CardGridSkeleton />}>
                <MeetupResults filters={filters} />
            </Suspense>
        </PageContainer>
    );
}
