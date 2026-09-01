"use client";

/**
 * Minimal localStorage-backed external store, generic over the state shape.
 * Used by `AdminDataContext` (and mirrors the pattern in `LocaleContext` /
 * `AdminAuthContext`) so every piece of admin state hydrates the same,
 * SSR-safe way: the server always sees `seed`, and the client corrects to
 * the real localStorage value in a re-render that happens before effects
 * run — no manual "restore on mount" effect, no hydration mismatch.
 */

type Listener = () => void;

export interface LocalStore<T> {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  subscribe: (listener: Listener) => () => void;
  setState: (updater: (prev: T) => T) => void;
}

export function createLocalStore<T>(key: string, seed: T): LocalStore<T> {
  let state: T = seed;
  let hydrated = false;
  const listeners = new Set<Listener>();

  function hydrate() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      // Malformed/unavailable storage — keep the seed.
    }
  }

  function persist() {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore — in-memory state still updates for the rest of this session.
    }
  }

  return {
    getSnapshot() {
      hydrate();
      return state;
    },
    getServerSnapshot() {
      return seed;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setState(updater) {
      hydrate();
      state = updater(state);
      persist();
      listeners.forEach((listener) => listener());
    },
  };
}
