import { patchHal, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";

/** HAL service for the participation actions of the meetup detail page (RF-5). */
export class ParticipationService {
    constructor(private authProvider: AuthProvider) {
    }

    /** Joins the waiting list; the backend decides CONFIRMED vs WAITING. */
    async join(meetupId: string | number): Promise<void> {
        await postHal("/participations", { meetup: `/meetups/${meetupId}` }, this.authProvider);
    }

    /** Leaves by cancelling the latest participation (CANCELLED rows are kept as history). */
    async leave(participationId: string | number): Promise<void> {
        await patchHal(`/participations/${participationId}`, { status: "CANCELLED" }, this.authProvider);
    }
}
