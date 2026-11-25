import halfred, { Resource } from "halfred";
import { toHalError } from "@/lib/errors";
import type { HalPage, PageInfo, QueryParams } from "@/types/hal";

/**
 * The only place in the app that calls `fetch` against the backend.
 * Services in `src/api/*Api.ts` use these helpers; components never call `fetch` directly.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://127.0.0.1:8080";

type AuthLike = { getAuth: () => Promise<string | null> };

type RequestOptions = {
    body?: string;
    contentType?: string;
};

/** Turns a relative path (`/users`) into an absolute URL and drops HAL URI templates (`{?projection}`). */
export function resolveUrl(path: string): string {
    const clean = stripTemplate(path);
    return clean.startsWith("http") ? clean : `${API_BASE_URL}${clean}`;
}

function stripTemplate(href: string): string {
    return href.replace(/\{[^}]*}/g, "");
}

/** Appends query params, skipping empty values, so pages never build `?a=b&c=` by hand. */
export function withQuery(path: string, params: QueryParams = {}): string {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue;
        search.append(key, String(value));
    }
    const query = search.toString();
    if (!query) return path;
    return `${path}${path.includes("?") ? "&" : "?"}${query}`;
}

async function request(method: string, path: string, authProvider: AuthLike, options: RequestOptions = {}): Promise<Response> {
    const url = resolveUrl(path);
    const authorization = await authProvider.getAuth();
    const res = await fetch(url, {
        method,
        headers: {
            Accept: "application/hal+json",
            ...(options.contentType ? { "Content-Type": options.contentType } : {}),
            ...(authorization ? { Authorization: authorization } : {}),
        },
        body: options.body,
        cache: "no-store",
    });
    if (!res.ok) {
        throw await toHalError(res);
    }
    return res;
}

/** Parses a HAL body; returns `null` for empty responses (204 No Content). */
async function parseHal(res: Response): Promise<Resource | null> {
    const text = await res.text();
    return text ? halfred.parse(JSON.parse(text)) : null;
}

export function mergeHal<T>(obj: Resource): (T & Resource) {
    return Object.assign(obj, halfred.parse(obj)) as T & Resource;
}

export function mergeHalArray<T>(objs: Resource[]): (T & Resource)[] {
    return objs.map(o => Object.assign(o, halfred.parse(o)) as T & Resource);
}

export async function getHal(path: string, authProvider: AuthLike): Promise<Resource> {
    const resource = await parseHal(await request("GET", path, authProvider));
    return resource ?? halfred.parse({});
}

export async function postHal(path: string, body: object, authProvider: AuthLike): Promise<Resource> {
    const res = await request("POST", path, authProvider, { body: JSON.stringify(body), contentType: "application/json" });
    return (await parseHal(res)) ?? halfred.parse({});
}

/** Full replacement of a resource. Returns the updated resource, or `null` if the backend answers 204. */
export async function putHal(path: string, body: object, authProvider: AuthLike): Promise<Resource | null> {
    return parseHal(await request("PUT", path, authProvider, { body: JSON.stringify(body), contentType: "application/json" }));
}

/** Partial update (`PATCH /users/{id}`). Returns the updated resource, or `null` if the backend answers 204. */
export async function patchHal(path: string, body: object, authProvider: AuthLike): Promise<Resource | null> {
    return parseHal(await request("PATCH", path, authProvider, { body: JSON.stringify(body), contentType: "application/json" }));
}

export async function deleteHal(path: string, authProvider: AuthLike): Promise<void> {
    await request("DELETE", path, authProvider);
}

/** Replaces a to-many association (e.g. `PUT /users/{id}/interests`) with the given resource URIs. */
export async function putUriList(path: string, uris: string[], authProvider: AuthLike): Promise<void> {
    await request("PUT", path, authProvider, { body: uris.map(stripTemplate).join("\n"), contentType: "text/uri-list" });
}

/** Adds resource URIs to a to-many association without removing the existing ones. */
export async function patchUriList(path: string, uris: string[], authProvider: AuthLike): Promise<void> {
    await request("PATCH", path, authProvider, { body: uris.map(stripTemplate).join("\n"), contentType: "text/uri-list" });
}

/** Items of an embedded relation (`_embedded.<rel>`), merged so they keep their HAL links. */
export function getEmbedded<T>(resource: Resource, rel: string): (T & Resource)[] {
    return mergeHalArray<T>(resource.embeddedArray(rel) || []);
}

function linkHref(resource: Resource, rel: string): string | undefined {
    const link = resource.link(rel);
    return link?.href ? stripTemplate(link.href) : undefined;
}

function toPage<T>(resource: Resource, rel: string): HalPage<T> {
    const original = resource.original() as { page?: PageInfo } | undefined;
    return {
        items: getEmbedded<T>(resource, rel),
        page: original?.page ?? null,
        links: {
            self: linkHref(resource, "self"),
            next: linkHref(resource, "next"),
            prev: linkHref(resource, "prev"),
            first: linkHref(resource, "first"),
            last: linkHref(resource, "last"),
        },
        rel,
    };
}

/** Reads one page of a collection or search (`getPage("/meetups", "meetups", auth, { page: 0, size: 12 })`). */
export async function getPage<T>(path: string, rel: string, authProvider: AuthLike, params: QueryParams = {}): Promise<HalPage<T>> {
    return toPage<T>(await getHal(withQuery(path, params), authProvider), rel);
}

/** Follows the HAL `next` link of a page; `null` when it is the last one. */
export async function getNextPage<T>(page: HalPage<T>, authProvider: AuthLike): Promise<HalPage<T> | null> {
    return page.links.next ? toPage<T>(await getHal(page.links.next, authProvider), page.rel) : null;
}

/** Follows the HAL `prev` link of a page; `null` when it is the first one. */
export async function getPrevPage<T>(page: HalPage<T>, authProvider: AuthLike): Promise<HalPage<T> | null> {
    return page.links.prev ? toPage<T>(await getHal(page.links.prev, authProvider), page.rel) : null;
}

/** Navigates a HAL link of a resource (`followLink<User>(meetup, "organizer", auth)`). */
export async function followLink<T>(resource: Resource, rel: string, authProvider: AuthLike): Promise<T & Resource> {
    const href = linkHref(resource, rel);
    if (!href) {
        throw new Error(`El recurso no tiene el enlace "${rel}".`);
    }
    return mergeHal<T>(await getHal(href, authProvider));
}
