/** A field-level validation error as returned by Spring Data REST (`RepositoryConstraintViolationExceptionMessage`). */
export type FieldError = {
    entity?: string;
    property?: string;
    invalidValue?: unknown;
    message: string;
};

/**
 * Error thrown by `src/api/halClient.ts` whenever the backend answers with a non-2xx status.
 * It carries the HTTP status, the human readable message sent by the backend and, for 400
 * responses, the list of field errors so forms can show them next to each input.
 */
export class HalError extends Error {
    readonly status: number;
    readonly fieldErrors: FieldError[];
    readonly body: unknown;

    constructor(status: number, message: string, fieldErrors: FieldError[] = [], body?: unknown) {
        super(message);
        this.name = "HalError";
        this.status = status;
        this.fieldErrors = fieldErrors;
        this.body = body;
    }

    /** Message for one form field (`property` in Spring Data REST errors), if any. */
    fieldMessage(property: string): string | undefined {
        return this.fieldErrors.find(e => e.property === property)?.message;
    }
}

const DEFAULT_MESSAGES: Record<number, string> = {
    400: "Revisa los datos del formulario.",
    401: "Tienes que iniciar sesión.",
    403: "No tienes permiso para hacer esto.",
    404: "No hemos encontrado lo que buscas.",
    409: "Ya existe un elemento con esos datos.",
    500: "El servidor ha tenido un problema. Inténtalo de nuevo en un momento.",
};

/** Builds a `HalError` from a failed `fetch` response, reading `message`/`errors` from the body. */
export async function toHalError(res: Response): Promise<HalError> {
    let body: unknown = undefined;
    try {
        const text = await res.text();
        body = text ? JSON.parse(text) : undefined;
    } catch {
        body = undefined;
    }
    const data = (body ?? {}) as { message?: unknown; errors?: unknown; error?: unknown };
    const fieldErrors: FieldError[] = Array.isArray(data.errors)
        ? (data.errors as FieldError[]).filter(e => e && typeof e.message === "string")
        : [];
    const message =
        fieldErrors.map(e => e.message).join(" ") ||
        (typeof data.message === "string" && data.message) ||
        DEFAULT_MESSAGES[res.status] ||
        (typeof data.error === "string" && data.error) ||
        `Error ${res.status}`;
    return new HalError(res.status, message, fieldErrors, body);
}

/** User-facing message for anything caught in a `try/catch` around a service call. */
export function getErrorMessage(error: unknown, fallback = "Algo ha ido mal. Inténtalo de nuevo."): string {
    if (error instanceof HalError) return error.message;
    if (error instanceof TypeError) return "No se puede conectar con el servidor.";
    if (error instanceof Error && error.message) return error.message;
    return fallback;
}
