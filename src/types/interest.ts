import { Resource } from "halfred";
import type { CategoryId } from "@/types/category";
import type { Audited } from "@/types/hal";

/** `GET /interests` item. The backend exposes the catalog read-only to regular users. */
export interface InterestEntity extends Audited {
    id?: number;
    uri?: string;
    name: string;
    category?: CategoryId;
}

export type Interest = InterestEntity & Resource;

/** Value used by the filters UI; `ref` matches the URI stored in `Meetup.tags`. */
export interface InterestOption {
    ref: string;
    name: string;
}

/** Compares a meetup tag with a selected interest, ignoring absolute vs. relative URIs. */
export function sameInterestRef(tag: string, ref: string): boolean {
    const last = (value: string) => value.replace(/\/+$/, "").split("/").filter(Boolean).pop();
    return !!ref && (tag === ref || last(tag) === last(ref));
}
