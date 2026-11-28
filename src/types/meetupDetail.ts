import type { GroupEntity } from "@/types/group";
import type { MeetupEntity } from "@/types/meetup";
import type { ParticipationStatus } from "@/types/participation";

/** Plain, serializable data passed from the Server Component to `MeetupActions`. */
export type MeetupSummary = {
    username: string;
    displayName?: string;
    city?: string;
};

export type GroupSummary = Pick<GroupEntity, "id" | "name" | "description" | "visibility"> & {
    ownedBy?: string;
};

export type InterestSummary = {
    ref: string;
    name: string;
};

export type MyParticipation = {
    id?: number;
    status?: ParticipationStatus;
};

export type MeetupPermissions = {
    canJoin: boolean;
    canLeave: boolean;
    canEdit: boolean;
    canCancel: boolean;
    canInvite: boolean;
    canComment: boolean;
    canRate: boolean;
    canChat: boolean;
};

/**
 * View model of `/meetups/[id]`: no HAL resources cross the server/client boundary, so there
 * are no hydration mismatches when the client component reuses this data after `router.refresh()`.
 */
export type MeetupDetailData = {
    meetup: MeetupEntity;
    organizer?: MeetupSummary;
    group?: GroupSummary;
    tags: InterestSummary[];
    participation?: MyParticipation;
    occupied: number;
    free: number;
    isFull: boolean;
    permissions: MeetupPermissions;
};
