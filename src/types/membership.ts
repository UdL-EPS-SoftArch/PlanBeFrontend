import { Resource } from "halfred";
import type { Audited } from "@/types/hal";

export type MembershipStatus = "PENDING" | "ACTIVE" | (string & {});
export type GroupRole = "OWNER" | "ADMIN" | "MEMBER" | (string & {});

/** `GET /memberships` and `GET /memberships/search/findByGroupId`. */
export interface MembershipEntity extends Audited {
    id?: number;
    uri?: string;
    group?: string | number;
    /** Username of the member (HAL link in responses). */
    member?: string;
    status?: MembershipStatus;
    role?: GroupRole;
}

export type Membership = MembershipEntity & Resource;

export function isActiveMembership(status: MembershipStatus | undefined): boolean {
    return status === "ACTIVE";
}

/** Group owners and active ADMIN/OWNER members may manage the group's meetups. */
export function managesGroup(membership: Pick<MembershipEntity, "role" | "status">): boolean {
    return isActiveMembership(membership.status) && (membership.role === "OWNER" || membership.role === "ADMIN");
}
