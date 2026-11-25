import { Resource } from "halfred";

/** Page metadata returned by Spring Data REST for paged collections. */
export interface PageInfo {
    size: number;
    totalElements: number;
    totalPages: number;
    /** Zero-based page index. */
    number: number;
}

/** A page of HAL items plus the links needed to move between pages. */
export interface HalPage<T> {
    items: (T & Resource)[];
    page: PageInfo | null;
    /** Absolute hrefs, without URI templates. */
    links: {
        self?: string;
        next?: string;
        prev?: string;
        first?: string;
        last?: string;
    };
    /** Embedded relation the items were read from (e.g. `meetups`). */
    rel: string;
}

/** Audit fields every PlanBe entity may expose (RNF-5). */
export interface Audited {
    created?: string;
    modified?: string;
}

/** Query string values accepted by `withQuery`; `undefined`, `null` and `""` are skipped. */
export type QueryParams = Record<string, string | number | boolean | null | undefined>;
