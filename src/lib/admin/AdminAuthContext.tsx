"use client";

/**
 * Real admin auth against the mukalimv2-backend API. The backend is the
 * source of truth via an httpOnly session cookie, this context never reads
 * or writes storage itself, it just mirrors what the API says:
 *
 * - On mount, `GET /auth/session` tells us whether the cookie the browser
 *   is already holding (if any) is still valid, this is what survives a
 *   page refresh, not localStorage.
 * - `login`/`logout` call the matching endpoints and update local state from
 *   the response; the cookie itself is set/cleared by the backend, invisible
 *   to this code (httpOnly).
 *
 * `status` exists so consumers can tell "haven't checked yet" apart from
 * "checked, and you're logged out", conflating them would either flash
 * real dashboard content before the check resolves, or bounce an
 * already-authenticated visitor to /sign-in for one frame on every refresh.
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, ApiError } from "@/lib/api/client";
import type { AdminRole } from "./types";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

/** A real seeded demo account (mukalimv2-backend's `db:seed`), powers the sign-in form's "autofill demo login" shortcut. Password matches the backend's `SEED_DEMO_PASSWORD` default. */
export const DEMO_CREDENTIALS = {
  email: "amara@mukalim.com",
  password: "Password123!",
};

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface SessionResponse {
  user: AdminSession;
}

interface AdminAuthContextValue {
  session: AdminSession | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  acceptInvite: (token: string, password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  session: null,
  status: "loading",
  login: async () => false,
  logout: async () => {},
  acceptInvite: async () => {},
  requestPasswordReset: async () => "",
  resetPassword: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let cancelled = false;
    api
      .get<SessionResponse>("/auth/session")
      .then(({ user }) => {
        if (cancelled) return;
        setSession(user);
        setStatus("authenticated");
      })
      .catch(() => {
        // 401 (no/expired session) is the expected case for a logged-out
        // visitor; a network/server error also just means "can't confirm
        // you're logged in", either way, treat as unauthenticated rather
        // than leaving the app stuck on "loading" forever.
        if (cancelled) return;
        setSession(null);
        setStatus("unauthenticated");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { user } = await api.post<SessionResponse>("/auth/login", { email, password });
      setSession(user);
      setStatus("authenticated");
      return true;
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
      // 401 invalid credentials, or a network/server error, the sign-in
      // form shows the same inline message for any of these today.
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setSession(null);
      setStatus("unauthenticated");
    }
  }, []);

  // Unlike `login`, lets `ApiError` propagate uncaught, the accept-invite
  // page needs to distinguish an invalid/expired token (no `details`) from a
  // real Zod validation failure (`details.fieldErrors`) from a rate limit,
  // and a boolean can't carry that.
  const acceptInvite = useCallback(async (token: string, password: string): Promise<void> => {
    const { user } = await api.post<SessionResponse>("/auth/accept-invite", { token, password });
    setSession(user);
    setStatus("authenticated");
  }, []);

  // Deliberately enumeration-safe on the backend, always 200 with the same
  // message regardless of whether the email matches an account. No session
  // change here; this only ever sends an email.
  const requestPasswordReset = useCallback(async (email: string): Promise<string> => {
    const { message } = await api.post<{ message: string }>("/auth/forgot-password", { email });
    return message;
  }, []);

  // Same shape as acceptInvite: lets ApiError propagate so the reset-password
  // page can distinguish an invalid/expired token from a real validation
  // failure or a rate limit.
  const resetPassword = useCallback(async (token: string, password: string): Promise<void> => {
    const { user } = await api.post<SessionResponse>("/auth/reset-password", { token, password });
    setSession(user);
    setStatus("authenticated");
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ session, status, login, logout, acceptInvite, requestPasswordReset, resetPassword }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  return useContext(AdminAuthContext);
}
