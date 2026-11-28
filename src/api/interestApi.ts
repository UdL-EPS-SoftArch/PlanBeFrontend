import { getEmbedded, getHal, withQuery } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Interest, InterestEntity, InterestOption } from "@/types/interest";

/** HAL service for the `/interests` catalog (used to populate the meetup interest filter). */
export class InterestService {
    constructor(private authProvider: AuthProvider) {
    }

    async getInterests(): Promise<Interest[]> {
        const resource = await getHal(withQuery("/interests", { size: 100 }), this.authProvider);
        return getEmbedded<InterestEntity>(resource, "interests");
    }

    /** Options with a stable reference that can be compared with `Meetup.tags`. */
    async getInterestOptions(): Promise<InterestOption[]> {
        return (await this.getInterests())
            .map(interest => ({
                ref: interestRef(interest),
                name: interest.name,
            }))
            .filter(option => option.ref !== "" && option.name !== "");
    }
}

/** `/interests/7` from either a HAL self link or the entity `uri` property. */
function interestRef(interest: Interest): string {
    const href = interest.link("self")?.href ?? interest.uri;
    if (!href) return "";
    const clean = href.replace(/\{[^}]*}/g, "");
    return new URL(clean, "http://localhost").pathname;
}
