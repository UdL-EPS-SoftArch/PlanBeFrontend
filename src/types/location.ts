/**
 * RF-6: `Location` is an `@Embeddable` value object in the backend. It is embedded in
 * `Meetup` (not exposed as its own HAL resource), so it stays a plain typed object.
 */
export interface LocationEntity {
    name?: string;
    address?: string;
    city?: string;
    /** Latitude in [-90, 90]. */
    latitude?: number;
    /** Longitude in [-180, 180]. */
    longitude?: number;
}

export type Location = LocationEntity;
