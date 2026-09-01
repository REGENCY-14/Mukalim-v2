"use client";

/**
 * Mock admin auth. There is no backend — `login()` checks the credentials
 * against a single hardcoded demo account and, on success, writes a session
 * object to localStorage. The role stored alongside it is what the "preview
 * as" dev-only role switcher in the topbar changes — it's independent of
 * *who* is logged in, by design (see the dashboard brief).
 *
 * Read via `useSyncExternalStore` for the same reason as `LocaleContext`:
 * the server (and the client's first hydration pass) must see "logged out"
 * so there's no mismatch, then React reconciles against localStorage after
 * hydration.
 */

import { createContext, useContext, type ReactNode } from "react";
import { useSyncExternalStore } from "react";
import type { AdminRole } from "./types";

const STORAGE_KEY = "mukalim-admin-session";
const CHANGE_EVENT = "mukalim-admin-session-change";

/** Demo-only credentials — there is no real account system behind this. */
export const DEMO_CREDENTIALS = {
  email: "admin@mukalim.com",
  password: "mukalim2026",
};

export interface AdminSession {
  name: string;
  email: string;
  role: AdminRole;
}

// `useSyncExternalStore`'s getSnapshot must return a referentially stable
// value when nothing has actually changed — parsing localStorage fresh on
// every call would return a new object each time even when the raw string
// is identical, which React treats as "changed" and re-renders forever.
// Cache against the raw string so unchanged storage returns the same
// object reference.
let cachedRaw: string | null = null;
let cachedSession: AdminSession | null = null;

function readSession(): AdminSession | null {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw === cachedRaw) return cachedSession;
  cachedRaw = raw;
  if (!raw) {
    cachedSession = null;
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<AdminSession>;
    cachedSession =
      parsed.email && parsed.role
        ? { name: parsed.name ?? "Admin User", email: parsed.email, role: parsed.role }
        : null;
  } catch {
    cachedSession = null;
  }
  return cachedSession;
}

function writeSession(session: AdminSession | null) {
  try {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore — the dispatched event below still updates the UI for this session.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot(): AdminSession | null {
  return null;
}

interface AdminAuthContextValue {
  session: AdminSession | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setRole: (role: AdminRole) => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  session: null,
  login: () => false,
  logout: () => {},
  setRole: () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  // getServerSnapshot returns null (server always renders "logged out"), and
  // React resolves the real localStorage value in a re-render immediately
  // after hydration, before effects run — so a guard effect reading
  // `session` never acts on a stale "logged out" value for a real session.
  const session = useSyncExternalStore(subscribe, readSession, getServerSnapshot);

  const login = (email: string, password: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
      return false;
    }
    writeSession({ name: "Amara Osei", email: DEMO_CREDENTIALS.email, role: "admin" });
    return true;
  };

  const logout = () => writeSession(null);

  const setRole = (role: AdminRole) => {
    if (!session) return;
    writeSession({ ...session, role });
  };

  return (
    <AdminAuthContext.Provider value={{ session, login, logout, setRole }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  return useContext(AdminAuthContext);
}
