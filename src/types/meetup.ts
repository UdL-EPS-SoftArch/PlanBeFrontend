import { Resource } from "halfred";
import type { Audited } from "@/types/hal";

/**
 * Minimal Meetup model for the public home ([0.5]).
 * [3.1] completes it (organizer, group, tags, recurrence, restrictions…).
 */

/** Catalog values (`category`, `status`) arrive embedded as `{ id }` objects or as plain ids. */
export type CatalogRef = string | { id: string; name?: string; label?: string };

export type Visibility = "PUBLIC" | "PRIVATE" | "GROUP";

export interface LocationEntity {
    name?: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}

export interface MeetupEntity extends Audited {
    uri?: string;
    id?: number;
    title: string;
    description?: string;
    capacity: number;
    category?: CatalogRef;
    status?: CatalogRef;
    visibility?: Visibility;
    startDate: string;
    endDate?: string;
    price?: number;
    location?: LocationEntity;
}

export type Meetup = MeetupEntity & Resource;

export function catalogId(ref: CatalogRef | undefined): string | undefined {
    if (!ref) return undefined;
    return typeof ref === "string" ? ref : ref.id;
}

export function catalogLabel(ref: CatalogRef | undefined): string | undefined {
    if (!ref) return undefined;
    if (typeof ref === "string") return humanize(ref);
    return ref.label || ref.name || humanize(ref.id);
}

function humanize(id: string): string {
    const text = id.replace(/[_-]+/g, " ").toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Numeric id of a meetup, read from `id` or from the end of its `uri`. */
export function meetupId(meetup: Pick<MeetupEntity, "id" | "uri">): string | undefined {
    if (meetup.id !== undefined) return String(meetup.id);
    return meetup.uri?.split("/").filter(Boolean).pop();
}
