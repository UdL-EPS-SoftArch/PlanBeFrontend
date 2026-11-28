import { Resource } from "halfred";
import type { Audited } from "@/types/hal";

/** Status ids of the participation catalog (RF-5). */
export type ParticipationStatus = "CONFIRMED" | "WAITING" | "CANCELLED" | (string & {});

/** A row of `GET /participations`. Associations arrive as HAL links, not inline values. */
export interface ParticipationEntity extends Audited {
    id?: number;
    uri?: string;
    participant?: string;
    meetup?: string;
    status?: ParticipationStatus;
    joinedAt?: string;
}

export type Participation = ParticipationEntity & Resource;

/** Only CONFIRMED and WAITING occupy a slot; CANCELLED rows are kept as history. */
export function isActiveParticipation(status: ParticipationStatus | undefined): boolean {
    return status === "CONFIRMED" || status === "WAITING";
}
