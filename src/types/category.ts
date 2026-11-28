import { Resource } from "halfred";
import type { Audited } from "@/types/hal";

/**
 * Ids seeded by the backend in `/categories`. The catalog is managed at runtime, so new
 * values can be added; the `string & {}` member keeps autocomplete for the known values
 * while still accepting any other catalog id.
 *
 * `Meetup.category` is sent and received as this plain string (e.g. `"SPORTS"`), never as a
 * HAL URI or an embedded object: the backend deserializes catalogs from their id string.
 */
export type CategoryId =
    | "TECHNOLOGY"
    | "SPORTS"
    | "ARTS"
    | "CULTURE"
    | "EDUCATION"
    | "HEALTH"
    | "OTHER"
    | (string & {});

/** Known catalog values, in the order used by the backend seed data. */
export const CATEGORY_IDS: readonly CategoryId[] = [
    "TECHNOLOGY", "SPORTS", "ARTS", "CULTURE", "EDUCATION", "HEALTH", "OTHER",
];

/** HAL resource returned by `GET /categories`. */
export interface CategoryEntity extends Audited {
    /** Catalog id: the text used in `Meetup.category`. */
    id: CategoryId;
    uri?: string;
    description?: string;
    color?: string;
}

export type Category = CategoryEntity & Resource;

/** Human-readable fallback for a category id when the catalog has no label field. */
export function categoryLabel(category: CategoryId | undefined): string | undefined {
    if (!category) return undefined;
    const text = category.replace(/[_-]+/g, " ").toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
}
