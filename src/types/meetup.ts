import { Resource } from "halfred";
import type { CategoryId } from "@/types/category";
import type { Audited } from "@/types/hal";
import type { LocationEntity } from "@/types/location";

export type { LocationEntity } from "@/types/location";

/**
 * Catalog references (`category`, `status`) are sent as plain strings, e.g.
 * `"SPORTS"` / `"OPEN"`. The object form is only tolerated when reading legacy HAL
 * responses; payloads written by this client must use the string form.
 */
export type CatalogRef = string | { id: string; name?: string; label?: string };

export type Visibility = "PUBLIC" | "PRIVATE" | "GROUP";

/** Status catalog ids. New ids can be added at runtime through `/meetupStatuses`. */
export type MeetupStatus =
    | "DRAFT"
    | "OPEN"
    | "FULL"
    | "CANCELLED"
    | "FINISHED"
    | (string & {});

export type Recurrence = "NONE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

/** Backend `Gender` enum used by the optional audience restriction. */
export type TargetGender = "MALE" | "FEMALE" | "NON_BINARY" | "UNDISCLOSED";

/** All fields of the backend `Meetup` entity (RF-3.1, RF-3.6–3.8, RF-6). */
export interface MeetupEntity extends Audited {
    uri?: string;
    id?: number;
    title: string;
    description?: string;
    capacity: number;

    /** Catalog id as text (e.g. `SPORTS`), not a HAL URI. */
    category?: CategoryId;
    /** Catalog id as text (e.g. `OPEN`), not a HAL URI. */
    status?: MeetupStatus;

    visibility?: Visibility;
    /** Username or `/users/{username}` URI of the organizer. */
    organizer?: string;
    /** Group id/URI owning a GROUP meetup. */
    group?: string | number;
    /** Interest URIs sent to/from the `tags` association. */
    tags?: string[];

    location?: LocationEntity;
    minAge?: number;
    maxAge?: number;
    targetGender?: TargetGender;
    /** Price per person; `undefined`/`null` means free. */
    price?: number;

    /** ISO-8601 instants (`Instant` in the backend). */
    startDate: string;
    endDate: string;

    recurrence?: Recurrence;
    /** Last recurring date (`YYYY-MM-DD`, backend `LocalDate`). */
    recurrenceEnd?: string;
    /** Read-only occurrence this one was generated from. */
    previousOccurrence?: number;
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
