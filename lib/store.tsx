"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { StoreData, GradeScale } from "./types";
import { seedData } from "./seed";
import { uid } from "./utils";

const DB_KEY = "sptk_db_v1";
const SESSION_KEY = "sptk_session";

type DataKey = keyof StoreData;

interface StoreContextValue {
  data: StoreData | null;
  ready: boolean;
  get: <K extends DataKey>(key: K) => StoreData[K];
  add: <K extends DataKey>(key: K, item: StoreData[K][number]) => void;
  update: <K extends DataKey>(key: K, id: string, patch: Partial<StoreData[K][number]>) => void;
  remove: (key: DataKey, id: string) => void;
  reset: () => void;
  setGradeScales: (scales: GradeScale[]) => void;
  session: { userId: string; role: string } | null;
  login: (userId: string) => void;
  logout: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadDB(): StoreData {
  if (typeof window === "undefined") return seedData();
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as StoreData;
  } catch {
    /* ignore */
  }
  const seed = seedData();
  localStorage.setItem(DB_KEY, JSON.stringify(seed));
  return seed;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreData | null>(null);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<{ userId: string; role: string } | null>(null);

  useEffect(() => {
    setData(loadDB());
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setSession(JSON.parse(s));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: StoreData) => {
    setData(next);
    localStorage.setItem(DB_KEY, JSON.stringify(next));
  }, []);

  const get = useCallback(
    <K extends DataKey>(key: K): StoreData[K] => {
      return (data?.[key] ?? []) as StoreData[K];
    },
    [data]
  );

  const add = useCallback(
    <K extends DataKey>(key: K, item: StoreData[K][number]) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = { ...prev, [key]: [...(prev[key] as unknown[]), item] };
        localStorage.setItem(DB_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const update = useCallback(
    <K extends DataKey>(key: K, id: string, patch: Record<string, unknown>) => {
      setData((prev) => {
        if (!prev) return prev;
        const arr = prev[key] as { id: string }[];
        const next = {
          ...prev,
          [key]: arr.map((it) => (it.id === id ? { ...it, ...patch } : it)),
        };
        localStorage.setItem(DB_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const remove = useCallback((key: DataKey, id: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const arr = prev[key] as { id: string }[];
      const next = { ...prev, [key]: arr.filter((it) => it.id !== id) };
      localStorage.setItem(DB_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const seed = seedData();
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    setData(seed);
  }, []);

  const setGradeScales = useCallback((scales: GradeScale[]) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = { ...prev, gradeScales: scales };
      localStorage.setItem(DB_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const login = useCallback((userId: string) => {
    setData((prev) => {
      const u = prev?.users.find((x) => x.id === userId);
      const s = u ? { userId: u.id, role: u.peranan } : null;
      setSession(s);
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      return prev;
    });
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const value: StoreContextValue = {
    data,
    ready,
    get,
    add,
    update,
    remove,
    reset,
    setGradeScales,
    session,
    login,
    logout,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore mesti digunakan dalam StoreProvider");
  return ctx;
}

export { uid };
