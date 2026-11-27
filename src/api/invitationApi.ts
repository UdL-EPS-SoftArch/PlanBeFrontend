import { postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";

/** HAL service for invitations. Only the meetup organizer may create them. */
export class InvitationService {
    constructor(private authProvider: AuthProvider) {
    }

    async invite(meetupId: string | number, inviteeUsername: string): Promise<void> {
        const username = inviteeUsername.trim();
        if (!username) throw new Error("Escribe el nombre de usuario de la persona a invitar.");
        await postHal("/invitations", {
            invitee: `/users/${username}`,
            meetup: `/meetups/${meetupId}`,
        }, this.authProvider);
    }
}
