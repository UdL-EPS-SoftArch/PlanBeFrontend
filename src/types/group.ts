import { Resource } from "halfred";
import type { Audited } from "@/types/hal";
import type { Visibility } from "@/types/meetup";

/** `GET /groups/{id}`. Associations (`ownedBy`) arrive as HAL links. */
export interface GroupEntity extends Audited {
    id?: number;
    uri?: string;
    name: string;
    description?: string;
    visibility?: Visibility;
    avatarUrl?: string;
    /** Username or `/users/{username}` URI; the HAL link is the reliable form. */
    ownedBy?: string;
}

export type Group = GroupEntity & Resource;
