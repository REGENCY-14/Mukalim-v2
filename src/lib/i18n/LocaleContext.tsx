"use client";

/**
 * Client-side locale state for the language switcher. Deliberately not
 * URL-based (no `/fr` route prefix) — switching is instant and doesn't
 * regenerate the static page tree. Persisted to localStorage.
 *
 * Backed by `useSyncExternalStore` rather than `useState` + a mount effect:
 * the server (and the client's first hydration pass) always reads
 * `getServerSnapshot` → "en", so there's no hydration mismatch even though
 * a returning visitor's real locale lives in localStorage. After hydration,
 * React switches to `getSnapshot` and re-renders if it differs.
 */

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Locale } from "./translations";

const STORAGE_KEY = "mukalim-locale";
/** Same-tab change notification — the native `storage` event only fires in *other* tabs. */
const CHANGE_EVENT = "mukalim-locale-change";

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "fr";
}

function getSnapshot(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : "en";
  } catch {
    return "en";
  }
}

function getServerSnapshot(): Locale {
  return "en";
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function writeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // localStorage unavailable (private browsing, etc.) — the dispatched
    // event below still updates the UI for the rest of this session.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: writeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
