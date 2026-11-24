import { getEmbedded, getHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Meetup } from "@/types/meetup";

export class MeetupService {
    constructor(private authProvider: AuthProvider) {
    }

    /**
     * Meetups the current visitor can see (`findVisibleMeetups` already applies the visibility
     * rules on the backend). Sorted by start date and limited to upcoming ones when `limit` is set.
     */
    async getVisibleMeetups(limit?: number): Promise<Meetup[]> {
        const resource = await getHal("/meetups/search/findVisibleMeetups", this.authProvider);
        const now = Date.now();
        const upcoming = getEmbedded<Meetup>(resource, "meetups")
            .filter(m => !m.startDate || new Date(m.startDate).getTime() >= now)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        return limit ? upcoming.slice(0, limit) : upcoming;
    }
}
