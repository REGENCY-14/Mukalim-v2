/**
 * Thin fetch wrapper for the mukalimv2-backend API.
 *
 * - Base URL: server-side calls hit the real backend directly
 *   (`NEXT_PUBLIC_API_URL`, defaulting to the local backend's `/api` mount in
 *   dev); browser calls go through this app's own `/api/*`, proxied to the
 *   backend by the rewrite in `next.config.ts` — see `effectiveBaseUrl()`
 *   below for why (Safari's third-party-cookie blocking).
 * - `credentials: "include"` on every request: the backend authenticates via
 *   httpOnly session cookies (`mukalim_access`/`mukalim_refresh`), not a
 *   bearer token, so the browser needs to be told to send/accept them.
 * - Every backend error is `{ error: { code, message, details? } }`
 *   (`src/middleware/errorHandler.ts` in the backend) — this throws an
 *   `ApiError` carrying those fields so callers can branch on
 *   `error.status`/`error.code` instead of re-parsing the body.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

/**
 * Browser requests go through this app's own `/api/*` — proxied server-side
 * to the real backend via the rewrite in `next.config.ts` — instead of
 * hitting the backend cross-origin directly. The auth cookie is already
 * spec-correct (`SameSite=None; Secure`, no explicit `Domain`), but Safari's
 * Intelligent Tracking Prevention still blocks/purges third-party
 * `SameSite=None` cookies regardless of correct attributes. Routing through
 * this same-origin path makes the browser's request same-origin, so the
 * cookie is set as an ordinary first-party one — Safari never sees a
 * cross-site request to police at all.
 *
 * Server-side code (Server Components, `generateStaticParams`) has no
 * browser/cookie concept to begin with — no reason to add a proxy hop, it
 * calls the backend directly via `API_BASE_URL`.
 */
function effectiveBaseUrl(): string {
  return typeof window === "undefined" ? API_BASE_URL : "/api";
}

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

/**
 * The access-token cookie is short-lived (15m — `JWT_ACCESS_EXPIRES_IN` in
 * the backend) and nothing was ever calling `POST /auth/refresh` to renew
 * it, so any session just died with a raw 401 the moment 15 minutes passed
 * — easy to hit on mobile (backgrounding, the phone locking) even though
 * it's the same bug on desktop.
 *
 * Shared across concurrent requests: if three calls all 401 around the same
 * moment (e.g. a page firing several fetches right as the token expires),
 * they wait on the same in-flight refresh instead of each independently
 * hitting the endpoint and racing to rotate the cookies.
 */
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${effectiveBaseUrl()}/auth/refresh`, { method: "POST", credentials: "include" })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { body, headers, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${effectiveBaseUrl()}${path}`, {
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

    // A 401 here most likely just means the access token expired, not that
    // the refresh token (30d) has too — silently refresh and retry this
    // exact request once before surfacing "you're logged out". Never for
    // /auth/login (a fresh 401 there means wrong credentials, not an
    // expired session) or /auth/refresh itself (would recurse).
    const isAuthLifecycleEndpoint = path.startsWith("/auth/login") || path.startsWith("/auth/refresh");
    if (res.status === 401 && !isRetry && !isAuthLifecycleEndpoint) {
      const refreshed = await attemptRefresh();
      if (refreshed) return request<T>(path, options, true);
    }

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
