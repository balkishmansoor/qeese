"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { seedEduData } from "./data";
import {
  EduData,
  EduSession,
  EduUser,
  QuizAttempt,
  ProgressItem,
} from "./types";

const DB_KEY = "panitia_perniagaan_db_v1";
const SESSION_KEY = "panitia_perniagaan_session";
const STUDENT_KEY = "panitia_perniagaan_murid";

type DataKey = keyof EduData;

interface EduStoreValue {
  data: EduData | null;
  ready: boolean;
  session: EduSession | null;
  studentName: string;
  setStudentName: (name: string) => void;
  login: (email: string, password: string) => { ok: boolean; message?: string };
  logout: () => void;
  resetData: () => void;
  addItem: <K extends DataKey>(key: K, item: EduData[K][number]) => void;
  updateItem: <K extends DataKey>(key: K, id: string, patch: Partial<EduData[K][number]>) => void;
  removeItem: (key: DataKey, id: string) => void;
  recordAttempt: (attempt: Omit<QuizAttempt, "id" | "tarikh">) => void;
  toggleBookmark: (id: string) => void;
  addRecent: (item: ProgressItem) => void;
  addDownload: (item: ProgressItem) => void;
}

const EduContext = createContext<EduStoreValue | null>(null);

function loadData(): EduData {
  if (typeof window === "undefined") return seedEduData();
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as EduData;
      if (parsed && Array.isArray(parsed.chapters) && Array.isArray(parsed.examPapers)) {
        return { ...seedEduData(), ...parsed };
      }
    }
  } catch {
    /* ignore */
  }
  const seed = seedEduData();
  localStorage.setItem(DB_KEY, JSON.stringify(seed));
  return seed;
}

export function EduProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<EduData | null>(null);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<EduSession | null>(null);
  const [studentName, setStudentNameState] = useState("");

  useEffect(() => {
    setData(loadData());
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setSession(JSON.parse(s));
      const n = localStorage.getItem(STUDENT_KEY);
      if (n) setStudentNameState(n);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((updater: (prev: EduData) => EduData) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      localStorage.setItem(DB_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addItem = useCallback(
    <K extends DataKey>(key: K, item: EduData[K][number]) => {
      persist((prev) => ({
        ...prev,
        [key]: [...(prev[key] as unknown[]), item] as EduData[K],
      }));
    },
    [persist]
  );

  const updateItem = useCallback(
    <K extends DataKey>(key: K, id: string, patch: Partial<EduData[K][number]>) => {
      persist((prev) => ({
        ...prev,
        [key]: (prev[key] as { id: string }[]).map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ) as EduData[K],
      }));
    },
    [persist]
  );

  const removeItem = useCallback(
    <K extends DataKey>(key: K, id: string) => {
      persist((prev) => ({
        ...prev,
        [key]: (prev[key] as { id: string }[]).filter((item) => item.id !== id) as EduData[K],
      }));
    },
    [persist]
  );

  const login = useCallback((email: string, password: string) => {
    const all = loadData();
    const user: EduUser | undefined = all.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!user || user.kataLaluan !== password) {
      return { ok: false, message: "Email atau kata laluan tidak sah." };
    }
    const s: EduSession = { userId: user.id, nama: user.nama, peranan: user.peranan };
    setSession(s);
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    if (user.peranan === "murid") {
      setStudentNameState(user.nama);
      localStorage.setItem(STUDENT_KEY, user.nama);
    }
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const resetData = useCallback(() => {
    const seed = seedEduData();
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    setData(seed);
  }, []);

  const setStudentName = useCallback((name: string) => {
    setStudentNameState(name);
    localStorage.setItem(STUDENT_KEY, name);
  }, []);

  const recordAttempt = useCallback(
    (attempt: Omit<QuizAttempt, "id" | "tarikh">) => {
      persist((prev) => ({
        ...prev,
        attempts: [
          {
            ...attempt,
            id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            tarikh: new Date().toISOString(),
          },
          ...prev.attempts,
        ].slice(0, 200),
      }));
    },
    [persist]
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        bookmarks: prev.bookmarks.includes(id)
          ? prev.bookmarks.filter((x) => x !== id)
          : [...prev.bookmarks, id],
      }));
    },
    [persist]
  );

  const addRecent = useCallback(
    (item: ProgressItem) => {
      persist((prev) => ({
        ...prev,
        recentItems: [item, ...prev.recentItems.filter((x) => x.id !== item.id)].slice(0, 20),
      }));
    },
    [persist]
  );

  const addDownload = useCallback(
    (item: ProgressItem) => {
      persist((prev) => ({
        ...prev,
        downloads: [item, ...prev.downloads.filter((x) => x.id !== item.id)].slice(0, 100),
      }));
    },
    [persist]
  );

  const value = useMemo<EduStoreValue>(
    () => ({
      data,
      ready,
      session,
      studentName,
      setStudentName,
      login,
      logout,
      resetData,
      addItem,
      updateItem,
      removeItem,
      recordAttempt,
      toggleBookmark,
      addRecent,
      addDownload,
    }),
    [
      data,
      ready,
      session,
      studentName,
      setStudentName,
      login,
      logout,
      resetData,
      addItem,
      updateItem,
      removeItem,
      recordAttempt,
      toggleBookmark,
      addRecent,
      addDownload,
    ]
  );

  return <EduContext.Provider value={value}>{children}</EduContext.Provider>;
}

export function useEdu() {
  const ctx = useContext(EduContext);
  if (!ctx) throw new Error("useEdu mesti digunakan dalam EduProvider");
  return ctx;
}
