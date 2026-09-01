"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { createLocalStore } from "./createLocalStore";
import {
  seedActivity,
  seedCategories,
  seedContent,
  seedMedia,
  seedSettings,
  seedUsers,
} from "./mockData";
import type {
  ActivityEntry,
  AdminCategory,
  AdminContentItem,
  AdminMediaItem,
  AdminSettings,
  AdminUser,
} from "./types";

interface AdminDataState {
  categories: AdminCategory[];
  content: AdminContentItem[];
  media: AdminMediaItem[];
  users: AdminUser[];
  activity: ActivityEntry[];
  settings: AdminSettings;
}

const seedState: AdminDataState = {
  categories: seedCategories,
  content: seedContent,
  media: seedMedia,
  users: seedUsers,
  activity: seedActivity,
  settings: seedSettings,
};

const store = createLocalStore<AdminDataState>("mukalim-admin-data", seedState);

function nowIso(): string {
  return new Date().toISOString();
}

function logEntry(actor: string, actorRole: ActivityEntry["actorRole"], action: string, target: string): ActivityEntry {
  return { id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, actor, actorRole, action, target, timestamp: nowIso() };
}

interface AdminDataContextValue extends AdminDataState {
  addCategory: (category: Omit<AdminCategory, "id" | "contentCount" | "updatedAt">, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;
  updateCategory: (id: string, patch: Partial<AdminCategory>, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;
  deleteCategory: (id: string, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;
  toggleCategoryActive: (id: string, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;

  addContent: (item: Omit<AdminContentItem, "id" | "updatedAt">, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;
  updateContent: (id: string, patch: Partial<AdminContentItem>, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;
  deleteContent: (id: string, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;

  addMedia: (item: Omit<AdminMediaItem, "id" | "uploadedAt">, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;
  updateMediaAltText: (id: string, altText: AdminMediaItem["altText"]) => void;
  deleteMedia: (id: string, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;

  addUser: (user: Omit<AdminUser, "id" | "lastLogin" | "status" | "avatarColor">, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;
  updateUser: (id: string, patch: Partial<AdminUser>, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;
  deleteUser: (id: string, actor: { name: string; role: ActivityEntry["actorRole"] }) => void;

  updateSettings: (patch: Partial<AdminSettings>) => void;
}

const AVATAR_COLORS = ["bg-brand-gold", "bg-admin-terracotta", "bg-admin-green", "bg-brand-brown", "bg-admin-warm-grey"];

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const addCategory = useCallback<AdminDataContextValue["addCategory"]>((category, actor) => {
    store.setState((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        { ...category, id: `cat-${Date.now()}`, contentCount: 0, updatedAt: nowIso() },
      ],
      activity: [logEntry(actor.name, actor.role, "created the", `'${category.name.en || category.name.fr}' category`), ...prev.activity],
    }));
  }, []);

  const updateCategory = useCallback<AdminDataContextValue["updateCategory"]>((id, patch, actor) => {
    store.setState((prev) => {
      const target = prev.categories.find((c) => c.id === id);
      return {
        ...prev,
        categories: prev.categories.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: nowIso() } : c)),
        activity: target
          ? [logEntry(actor.name, actor.role, "updated the", `'${target.name.en || target.name.fr}' category`), ...prev.activity]
          : prev.activity,
      };
    });
  }, []);

  const deleteCategory = useCallback<AdminDataContextValue["deleteCategory"]>((id, actor) => {
    store.setState((prev) => {
      const target = prev.categories.find((c) => c.id === id);
      return {
        ...prev,
        categories: prev.categories.filter((c) => c.id !== id),
        activity: target
          ? [logEntry(actor.name, actor.role, "deleted the", `'${target.name.en || target.name.fr}' category`), ...prev.activity]
          : prev.activity,
      };
    });
  }, []);

  const toggleCategoryActive = useCallback<AdminDataContextValue["toggleCategoryActive"]>((id, actor) => {
    store.setState((prev) => {
      const target = prev.categories.find((c) => c.id === id);
      if (!target) return prev;
      const nextActive = !target.active;
      return {
        ...prev,
        categories: prev.categories.map((c) => (c.id === id ? { ...c, active: nextActive, updatedAt: nowIso() } : c)),
        activity: [
          logEntry(actor.name, actor.role, nextActive ? "set to active the" : "set to inactive the", `'${target.name.en || target.name.fr}' category`),
          ...prev.activity,
        ],
      };
    });
  }, []);

  const addContent = useCallback<AdminDataContextValue["addContent"]>((item, actor) => {
    store.setState((prev) => ({
      ...prev,
      content: [{ ...item, id: `content-${Date.now()}`, updatedAt: nowIso() }, ...prev.content],
      categories: prev.categories.map((c) =>
        c.id === item.categoryId ? { ...c, contentCount: c.contentCount + 1 } : c,
      ),
      activity: [logEntry(actor.name, actor.role, "created", `'${item.title.en || item.title.fr}'`), ...prev.activity],
    }));
  }, []);

  const updateContent = useCallback<AdminDataContextValue["updateContent"]>((id, patch, actor) => {
    store.setState((prev) => {
      const target = prev.content.find((c) => c.id === id);
      return {
        ...prev,
        content: prev.content.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: nowIso() } : c)),
        activity: target
          ? [logEntry(actor.name, actor.role, "updated", `'${target.title.en || target.title.fr}'`), ...prev.activity]
          : prev.activity,
      };
    });
  }, []);

  const deleteContent = useCallback<AdminDataContextValue["deleteContent"]>((id, actor) => {
    store.setState((prev) => {
      const target = prev.content.find((c) => c.id === id);
      return {
        ...prev,
        content: prev.content.filter((c) => c.id !== id),
        categories: target
          ? prev.categories.map((cat) =>
              cat.id === target.categoryId ? { ...cat, contentCount: Math.max(0, cat.contentCount - 1) } : cat,
            )
          : prev.categories,
        activity: target
          ? [logEntry(actor.name, actor.role, "deleted", `'${target.title.en || target.title.fr}'`), ...prev.activity]
          : prev.activity,
      };
    });
  }, []);

  const addMedia = useCallback<AdminDataContextValue["addMedia"]>((item, actor) => {
    store.setState((prev) => ({
      ...prev,
      media: [{ ...item, id: `media-${Date.now()}`, uploadedAt: nowIso() }, ...prev.media],
      activity: [logEntry(actor.name, actor.role, "uploaded", `'${item.filename}' to Media Library`), ...prev.activity],
    }));
  }, []);

  const updateMediaAltText = useCallback<AdminDataContextValue["updateMediaAltText"]>((id, altText) => {
    store.setState((prev) => ({
      ...prev,
      media: prev.media.map((m) => (m.id === id ? { ...m, altText } : m)),
    }));
  }, []);

  const deleteMedia = useCallback<AdminDataContextValue["deleteMedia"]>((id, actor) => {
    store.setState((prev) => {
      const target = prev.media.find((m) => m.id === id);
      return {
        ...prev,
        media: prev.media.filter((m) => m.id !== id),
        activity: target
          ? [logEntry(actor.name, actor.role, "deleted", `'${target.filename}' from Media Library`), ...prev.activity]
          : prev.activity,
      };
    });
  }, []);

  const addUser = useCallback<AdminDataContextValue["addUser"]>((user, actor) => {
    store.setState((prev) => ({
      ...prev,
      users: [
        ...prev.users,
        {
          ...user,
          id: `user-${Date.now()}`,
          status: "invited",
          lastLogin: null,
          avatarColor: AVATAR_COLORS[prev.users.length % AVATAR_COLORS.length],
        },
      ],
      activity: [logEntry(actor.name, actor.role, "invited", `${user.name} as ${user.role[0].toUpperCase()}${user.role.slice(1)}`), ...prev.activity],
    }));
  }, []);

  const updateUser = useCallback<AdminDataContextValue["updateUser"]>((id, patch, actor) => {
    store.setState((prev) => {
      const target = prev.users.find((u) => u.id === id);
      return {
        ...prev,
        users: prev.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        activity: target
          ? [logEntry(actor.name, actor.role, "updated", `user ${target.name}`), ...prev.activity]
          : prev.activity,
      };
    });
  }, []);

  const deleteUser = useCallback<AdminDataContextValue["deleteUser"]>((id, actor) => {
    store.setState((prev) => {
      const target = prev.users.find((u) => u.id === id);
      return {
        ...prev,
        users: prev.users.filter((u) => u.id !== id),
        activity: target
          ? [logEntry(actor.name, actor.role, "removed", `user ${target.name}`), ...prev.activity]
          : prev.activity,
      };
    });
  }, []);

  const updateSettings = useCallback<AdminDataContextValue["updateSettings"]>((patch) => {
    store.setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const value = useMemo<AdminDataContextValue>(
    () => ({
      ...state,
      addCategory,
      updateCategory,
      deleteCategory,
      toggleCategoryActive,
      addContent,
      updateContent,
      deleteContent,
      addMedia,
      updateMediaAltText,
      deleteMedia,
      addUser,
      updateUser,
      deleteUser,
      updateSettings,
    }),
    [
      state,
      addCategory,
      updateCategory,
      deleteCategory,
      toggleCategoryActive,
      addContent,
      updateContent,
      deleteContent,
      addMedia,
      updateMediaAltText,
      deleteMedia,
      addUser,
      updateUser,
      deleteUser,
      updateSettings,
    ],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
