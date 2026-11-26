import type { Resource } from "halfred";
import { deleteHal, getEmbedded, getHal, mergeHal, patchHal, postHal, withQuery } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { CategoryId } from "@/types/category";
import type { Meetup, MeetupEntity } from "@/types/meetup";

/**
 * HAL service for meetups. Every search below is one of the endpoints listed in the backend
 * README; visibility is always enforced there, never reimplemented in the client.
 */
export class MeetupService {
    constructor(private authProvider: AuthProvider) {
    }

    async getMeetups(): Promise<Meetup[]> {
        return this.readMeetups(await getHal("/meetups", this.authProvider));
    }

    async getMeetupById(id: string | number): Promise<Meetup> {
        return mergeHal<MeetupEntity>(await getHal(`/meetups/${id}`, this.authProvider));
    }

    async createMeetup(meetup: MeetupEntity): Promise<Meetup> {
        return mergeHal<MeetupEntity>(await postHal("/meetups", meetup, this.authProvider));
    }

    async updateMeetup(id: string | number, changes: Partial<MeetupEntity>): Promise<Meetup> {
        const resource = await patchHal(`/meetups/${id}`, changes, this.authProvider);
        // Spring Data REST answers 204 to PATCH, so read the resource back when there is no body.
        return resource ? mergeHal<MeetupEntity>(resource) : this.getMeetupById(id);
    }

    async deleteMeetup(id: string | number): Promise<void> {
        await deleteHal(`/meetups/${id}`, this.authProvider);
    }

    /** `GET /meetups/search/findByCategoryAndVisibility?category=...` (id sent as text). */
    async searchByCategory(category: CategoryId): Promise<Meetup[]> {
        const path = withQuery("/meetups/search/findByCategoryAndVisibility", { category });
        return this.readMeetups(await getHal(path, this.authProvider));
    }

    /** `GET /meetups/search/findByCityAndVisibility?city=...`. */
    async searchByCity(city: string): Promise<Meetup[]> {
        const path = withQuery("/meetups/search/findByCityAndVisibility", { city });
        return this.readMeetups(await getHal(path, this.authProvider));
    }

    /** `GET /meetups/search/findByStartDateAfterAndVisibility?startDate=...` (ISO-8601). */
    async searchByStartDate(startDate: string | Date): Promise<Meetup[]> {
        const value = startDate instanceof Date ? startDate.toISOString() : startDate;
        const path = withQuery("/meetups/search/findByStartDateAfterAndVisibility", { startDate: value });
        return this.readMeetups(await getHal(path, this.authProvider));
    }

    /** `GET /meetups/search/findByOrganizerAndVisibility?organizerId=...`. */
    async searchByOrganizer(organizerId: string | number): Promise<Meetup[]> {
        const path = withQuery("/meetups/search/findByOrganizerAndVisibility", { organizerId });
        return this.readMeetups(await getHal(path, this.authProvider));
    }

    /** `GET /meetups/search/recommended`: the backend selects by the authenticated user. */
    async getRecommended(): Promise<Meetup[]> {
        return this.readMeetups(await getHal("/meetups/search/recommended", this.authProvider));
    }

    /**
     * Meetups the current visitor can see (`findVisibleMeetups` already applies the visibility
     * rules on the backend). Sorted by start date and limited to upcoming ones when `limit` is set.
     */
    async getVisibleMeetups(limit?: number): Promise<Meetup[]> {
        const resource = await getHal("/meetups/search/findVisibleMeetups", this.authProvider);
        const now = Date.now();
        const upcoming = this.readMeetups(resource)
            .filter(m => !m.startDate || new Date(m.startDate).getTime() >= now)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        return limit ? upcoming.slice(0, limit) : upcoming;
    }

    /** All meetup searches return `List<Meetup>`, embedded under the `meetups` relation. */
    private readMeetups(resource: Resource): Meetup[] {
        return getEmbedded<MeetupEntity>(resource, "meetups");
    }
}
