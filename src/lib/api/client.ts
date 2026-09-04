/**
 * Thin fetch wrapper for the mukalimv2-backend API.
 *
 * - Base URL comes from `NEXT_PUBLIC_API_URL` (defaults to the local
 *   backend's `/api` mount in dev — see `src/app.ts` in the backend repo).
 * - `credentials: "include"` on every request: the backend authenticates via
 *   httpOnly session cookies (`mukalim_access`/`mukalim_refresh`), not a
 *   bearer token, so the browser needs to be told to send/accept them.
 * - Every backend error is `{ error: { code, message, details? } }`
 *   (`src/middleware/errorHandler.ts` in the backend) — this throws an
 *   `ApiError` carrying those fields so callers can branch on
 *   `error.status`/`error.code` instead of re-parsing the body.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

/** Origin only (no `/api` suffix) — uploaded files are served from
 * `/uploads/*` directly off the Express app root (`src/app.ts`'s
 * `express.static`), not under `/api`. */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Resolves a URL the backend returned against the backend's own origin.
 * Uploaded media comes back as a path like `/uploads/xyz.jpg`
 * (`mediaService.create`) — that's relative to the *API server*, not this
 * Next.js app, which has nothing at that path itself. Frontend-local seed
 * defaults (e.g. `/mukalim/icon-cosmetics.svg`, served from this app's own
 * `/public`) and already-absolute URLs pass through unchanged.
 */
export function resolveMediaUrl(url: string): string {
  if (/^https?:\/\//.test(url) || url.startsWith("blob:")) return url;
  if (url.startsWith("/uploads/")) return `${API_ORIGIN}${url}`;
  return url;
}

/** True when `resolveMediaUrl` points at the backend's own origin — Next's
 * built-in image optimizer refuses unconfigured external hostnames, and
 * there's no `next.config.ts` remotePatterns entry for the (dev-only,
 * port-configurable) API origin, so these render as plain `<img>`-equivalent
 * unoptimized instead. */
export function isBackendMediaUrl(url: string): boolean {
  return url.startsWith("/uploads/") || url.startsWith("blob:");
}

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JSON-serializable by default; pass a `FormData` instance to send multipart (e.g. media uploads) instead. */
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        ...(!isFormData && body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    // Network failure / server unreachable — not a backend error response.
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the API server.", cause);
  }

  // 204 No Content and empty 200s (e.g. logout) have no JSON body.
  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const err = data?.error ?? { code: "UNKNOWN_ERROR", message: res.statusText };
    throw new ApiError(res.status, err.code, err.message, err.details);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
