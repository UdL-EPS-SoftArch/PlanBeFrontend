import type { Resource } from "halfred";
import { getEmbedded, getHal, withQuery } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { GroupEntity } from "@/types/group";
import type { InterestEntity } from "@/types/interest";
import type { MembershipEntity, MembershipStatus, GroupRole } from "@/types/membership";
import { isActiveMembership, managesGroup } from "@/types/membership";
import type { MeetupEntity } from "@/types/meetup";
import type {
    GroupSummary,
    InterestSummary,
    MeetupDetailData,
    MeetupPermissions,
    MeetupSummary,
    MyParticipation,
} from "@/types/meetupDetail";
import type { ParticipationEntity } from "@/types/participation";
import { isActiveParticipation } from "@/types/participation";
import { hasRole, type UserEntity } from "@/types/user";

type GroupMemberView = {
    username?: string;
    status?: MembershipStatus;
    role?: GroupRole;
};

/** Copies the enumerable fields of a HAL resource so only plain data crosses into Client Components. */
function plain<T>(value: unknown): T {
    return (value && typeof value === "object" ? { ...(value as Record<string, unknown>) } : {}) as T;
}

function lastSegment(value: string | number | undefined): string | undefined {
    if (value === undefined || value === null) return undefined;
    const segment = String(value).replace(/[?#].*$/, "").replace(/\/+$/, "").split("/").filter(Boolean).pop();
    return segment || undefined;
}

function hrefOf(resource: Resource, rel: string): string | undefined {
    return resource.link(rel)?.href;
}

function numericId(value: string | number | undefined): number | undefined {
    const segment = lastSegment(value);
    if (!segment) return undefined;
    const parsed = Number.parseInt(segment, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Builds the whole read model for `/meetups/[id]`. Visibility is checked by `GET /meetups/{id}`
 * on the backend; this service only resolves the associations and derives UI permissions from
 * the authenticated identity, matching the rules enforced server-side by `MeetupSecurity`.
 */
export class MeetupDetailService {
    constructor(private authProvider: AuthProvider) {
    }

    async load(id: string | number, user: UserEntity): Promise<MeetupDetailData> {
        const resource = await getHal(`/meetups/${id}`, this.authProvider);
        const meetup = plain<MeetupEntity>(resource);
        const meetupId = String(meetup.id ?? lastSegment(meetup.uri) ?? id);

        const [organizer, group, tags, participation, activeParticipations] = await Promise.all([
            this.loadOrganizer(resource),
            this.loadGroup(resource, meetup),
            this.loadTags(resource),
            this.loadMyParticipation(meetupId, user.username),
            this.loadActiveParticipations(meetupId),
        ]);

        const groupId = group?.id ?? numericId(meetup.group);
        const members = groupId ? await this.loadGroupMembers(groupId) : [];
        const permissions = this.permissions(meetup, user, organizer, group, members, participation);

        const capacity = Math.max(0, meetup.capacity ?? 0);
        const occupied = meetup.status === "FULL"
            ? Math.max(capacity, activeParticipations || (isActiveParticipation(participation?.status) ? 1 : 0))
            : activeParticipations || (isActiveParticipation(participation?.status) ? 1 : 0);
        const free = Math.max(0, capacity - occupied);

        return {
            meetup,
            organizer,
            group,
            tags,
            participation: participation ? {
                id: participation.id ?? numericId(participation.uri),
                status: participation.status,
            } as MyParticipation : undefined,
            occupied,
            free,
            isFull: meetup.status === "FULL" || (capacity > 0 && free === 0),
            permissions,
        };
    }

    private async loadOrganizer(resource: Resource): Promise<MeetupSummary | undefined> {
        try {
            const href = hrefOf(resource, "organizer");
            if (!href) return undefined;
            const organizer = plain<UserEntity>(await getHal(href, this.authProvider));
            if (!organizer.username) return undefined;
            return { username: organizer.username, displayName: organizer.displayName, city: organizer.city };
        } catch {
            return undefined;
        }
    }

    private async loadGroup(resource: Resource, meetup: MeetupEntity): Promise<GroupSummary | undefined> {
        try {
            const href = hrefOf(resource, "group");
            if (!href) return undefined;
            const resourceGroup = await getHal(href, this.authProvider);
            const group = plain<GroupEntity>(resourceGroup);
            if (!group.name) return undefined;

            let ownedBy = lastSegment(group.ownedBy);
            const ownerHref = hrefOf(resourceGroup, "ownedBy");
            if (ownerHref) {
                try {
                    const owner = plain<UserEntity>(await getHal(ownerHref, this.authProvider));
                    ownedBy = owner.username ?? ownedBy;
                } catch {
                    // The group may have no visible owner for this user; keep the link id if any.
                }
            }

            return {
                id: group.id ?? numericId(meetup.group) ?? numericId(href),
                name: group.name,
                description: group.description,
                visibility: group.visibility,
                ownedBy,
            };
        } catch {
            return undefined;
        }
    }

    private async loadTags(resource: Resource): Promise<InterestSummary[]> {
        try {
            const href = hrefOf(resource, "tags");
            if (!href) return [];
            const tagsResource = await getHal(href, this.authProvider);
            return getEmbedded<InterestEntity>(tagsResource, "interests")
                .map(interest => {
                    const ref = interest.uri ?? (interest.id !== undefined ? `/interests/${interest.id}` : "");
                    return { ref, name: interest.name || lastSegment(ref) || "" };
                })
                .filter(tag => !!tag.ref && !!tag.name);
        } catch {
            return [];
        }
    }

    private async loadMyParticipation(
        meetupId: string,
        username: string,
    ): Promise<ParticipationEntity & Resource | undefined> {
        try {
            const path = withQuery("/participations/search/findByParticipantIdAndMeetupId", {
                participantId: username,
                meetupId,
            });
            const resource = await getHal(path, this.authProvider);
            const embedded = getEmbedded<ParticipationEntity>(resource, "participations");
            const found = embedded[0] ?? plain<ParticipationEntity & Resource>(resource);
            return found?.status ? found : undefined;
        } catch {
            // Spring Data REST answers 404 when the Optional is empty.
            return undefined;
        }
    }

    /** Counts active rows the backend lets this user see; the organizer/admin sees all of them. */
    private async loadActiveParticipations(meetupId: string): Promise<number> {
        try {
            const resource = await getHal(withQuery("/participations", { size: 100 }), this.authProvider);
            const rows = getEmbedded<ParticipationEntity>(resource, "participations")
                .filter(participation => isActiveParticipation(participation.status))
                .slice(0, 100);
            const checks = await Promise.all(rows.map(async row => {
                try {
                    const href = hrefOf(row, "meetup");
                    if (!href) return false;
                    const parent = plain<MeetupEntity>(await getHal(href, this.authProvider));
                    return String(parent.id ?? lastSegment(parent.uri)) === meetupId;
                } catch {
                    return false;
                }
            }));
            return checks.filter(Boolean).length;
        } catch {
            return 0;
        }
    }

    private async loadGroupMembers(groupId: number): Promise<GroupMemberView[]> {
        try {
            const resource = await getHal(withQuery("/memberships/search/findByGroupId", {
                groupId,
                size: 100,
            }), this.authProvider);
            const rows = getEmbedded<MembershipEntity>(resource, "memberships").slice(0, 100);
            return await Promise.all(rows.map(async row => {
                let username = lastSegment(row.member);
                const href = hrefOf(row, "member");
                if (href) {
                    try {
                        const member = plain<UserEntity>(await getHal(href, this.authProvider));
                        username = member.username ?? username;
                    } catch {
                        // Keep the id from the inline value when the user is not visible.
                    }
                }
                return { username, status: row.status, role: row.role };
            }));
        } catch {
            return [];
        }
    }

    private permissions(
        meetup: MeetupEntity,
        user: UserEntity,
        organizer: MeetupSummary | undefined,
        group: GroupSummary | undefined,
        members: GroupMemberView[],
        participation: ParticipationEntity | undefined,
    ): MeetupPermissions {
        const isAdmin = hasRole(user, "ROLE_ADMIN");
        const isOrganizer = organizer?.username === user.username;
        const isGroupOwner = !!group?.ownedBy && group.ownedBy === user.username;
        const mine = members.filter(member => member.username === user.username);
        const isGroupManager = mine.some(managesGroup);
        const isActiveGroupMember = mine.some(member => isActiveMembership(member.status));
        const canManage = isAdmin || isOrganizer || isGroupOwner || isGroupManager;

        const status = meetup.status;
        const closed = status === "CANCELLED" || status === "FINISHED";
        const visibility = meetup.visibility ?? "PUBLIC";
        const activeParticipation = isActiveParticipation(participation?.status);

        return {
            canJoin: !closed && visibility !== "PRIVATE" && !activeParticipation
                && (visibility !== "GROUP" || isActiveGroupMember || canManage),
            canLeave: activeParticipation && !closed,
            canEdit: canManage,
            canCancel: canManage && !closed,
            canInvite: isOrganizer && !closed,
            canComment: true,
            canRate: status === "FINISHED" && participation?.status === "CONFIRMED",
            canChat: participation?.status === "CONFIRMED",
        };
    }
}
