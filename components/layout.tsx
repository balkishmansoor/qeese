"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Mail, FileText, CalendarDays, GraduationCap,
  FileQuestion, BarChart3, Clock, Users, Settings, Bell, Search,
  LogOut, Menu, X, School, ChevronDown, ShieldCheck,
} from "lucide-react";
import { cn } from "./ui";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/surat-jemputan", label: "Surat Jemputan Mesyuarat", icon: Mail },
  { href: "/minit-mesyuarat", label: "Minit Mesyuarat", icon: FileText },
  { href: "/takwim-tahunan", label: "Takwim Tahunan", icon: CalendarDays },
  { href: "/kursus-pdp", label: "Kursus PDP", icon: GraduationCap },
  { href: "/soalan-spm", label: "Soalan Peperiksaan SPM", icon: FileQuestion },
  { href: "/analisa-peperiksaan", label: "Analisa Peperiksaan", icon: BarChart3 },
  { href: "/kelas-tambahan", label: "Jadual Kelas Tambahan", icon: Clock },
  { href: "/pengurusan-pengguna", label: "Pengurusan Pengguna", icon: Users },
  { href: "/tetapan-sistem", label: "Tetapan Sistem", icon: Settings },
  { href: "/keselamatan", label: "Keselamatan", icon: ShieldCheck },
];

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  ketua_panitia: "Ketua Panitia",
  guru: "Guru",
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data, session, logout } = useStore();
  const router = useRouter();

  const user = data?.users.find((u) => u.id === session?.userId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-primary-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-magenta-500 flex items-center justify-center text-white shrink-0">
          <School className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-primary-700 text-sm leading-tight truncate">
            SPTK
          </p>
          <p className="text-[11px] text-slate-500 leading-tight truncate">
            Perancangan Tahunan Kurikulum
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-magenta-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-primary-50 hover:text-primary-700"
              )}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-lavender-200 text-lavender-700 flex items-center justify-center font-semibold text-sm shrink-0">
            {user?.nama?.charAt(0) ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.nama ?? "Tetamu"}</p>
            <p className="text-xs text-slate-400">{ROLE_LABEL[session?.role ?? ""] ?? ""}</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/log-masuk");
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
            title="Log keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { data, session, logout } = useStore();

  const user = data?.users.find((u) => u.id === session?.userId);
  const notifications = useMemo(() => {
    if (!data) return [];
    const list: { id: string; text: string; time: string }[] = [];
    data.events
      .filter((e) => e.peringatan)
      .slice(0, 4)
      .forEach((e) =>
        list.push({ id: e.id, text: `${e.tajuk} — ${e.tarikhMula}`, time: "Peristiwa akan datang" })
      );
    data.courses
      .filter((c) => c.status === "Akan Datang")
      .slice(0, 2)
      .forEach((c) => list.push({ id: c.id, text: `Kursus: ${c.tajuk}`, time: "Pembangunan profesionalisme" }));
    return list;
  }, [data]);

  const current = NAV.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"));

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-white border-r border-primary-100 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-primary-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-pop">
            <button
              className="absolute top-4 right-3 p-1.5 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-primary-100">
          <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
              <Link href="/dashboard" className="hover:text-primary-600">Utama</Link>
              {current && (
                <>
                  <span>/</span>
                  <span className="text-slate-800 font-medium truncate">{current.label}</span>
                </>
              )}
            </nav>
            <span className="sm:hidden font-semibold text-primary-700">SPTK</span>

            <div className="flex-1" />

            <GlobalSearch />

            {/* Notifications */}
            <div className="relative">
              <button
                className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setUserOpen(false);
                }}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-magenta-500 text-white text-[10px] flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-pop border border-slate-100 z-50 overflow-hidden">
                    <p className="px-4 py-3 text-sm font-semibold border-b border-slate-100">
                      Pemberitahuan
                    </p>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 && (
                        <p className="px-4 py-6 text-sm text-slate-400 text-center">Tiada pemberitahuan</p>
                      )}
                      {notifications.map((n) => (
                        <div key={n.id} className="px-4 py-3">
                          <p className="text-sm text-slate-700">{n.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100"
                onClick={() => {
                  setUserOpen((v) => !v);
                  setNotifOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                  {user?.nama?.charAt(0) ?? "?"}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>
              {userOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-pop border border-slate-100 z-50 p-2">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-slate-800">{user?.nama}</p>
                      <p className="text-xs text-slate-400">{user?.jawatan}</p>
                    </div>
                    <Link
                      href="/keselamatan"
                      className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                      onClick={() => setUserOpen(false)}
                    >
                      <Users className="w-4 h-4" /> Tetapan Akaun
                    </Link>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-2"
                      onClick={() => {
                        logout();
                        setUserOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" /> Log Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function GlobalSearch() {
  const router = useRouter();
  const { data } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!q.trim() || !data) return [];
    const needle = q.toLowerCase();
    const out: { label: string; href: string }[] = [];
    data.invitations
      .filter((i) => i.tajukMesyuarat.toLowerCase().includes(needle))
      .slice(0, 3)
      .forEach((i) => out.push({ label: `Surat: ${i.tajukMesyuarat}`, href: "/surat-jemputan" }));
    data.minutes
      .filter((m) => m.tajukMesyuarat.toLowerCase().includes(needle))
      .slice(0, 3)
      .forEach((m) => out.push({ label: `Minit: ${m.tajukMesyuarat}`, href: "/minit-mesyuarat" }));
    data.courses
      .filter((c) => c.tajuk.toLowerCase().includes(needle))
      .slice(0, 3)
      .forEach((c) => out.push({ label: `Kursus: ${c.tajuk}`, href: "/kursus-pdp" }));
    data.resources
      .filter((r) => r.tajuk.toLowerCase().includes(needle) || r.subjek.toLowerCase().includes(needle))
      .slice(0, 3)
      .forEach((r) => out.push({ label: `Soalan: ${r.tajuk}`, href: "/soalan-spm" }));
    data.classes
      .filter((c) => c.tajuk.toLowerCase().includes(needle))
      .slice(0, 3)
      .forEach((c) => out.push({ label: `Kelas: ${c.tajuk}`, href: "/kelas-tambahan" }));
    return out.slice(0, 8);
  }, [q, data]);

  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Cari dokumen, kursus, soalan..."
        className="w-64 lg:w-80 h-10 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-magenta-400 focus:bg-white focus:border-magenta-400"
      />
      {open && q.trim() && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-pop border border-slate-100 z-50 overflow-hidden">
            <div className="max-h-80 overflow-y-auto py-1">
              {results.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">Tiada hasil dijumpai</p>
              )}
              {results.map((r, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 flex items-center gap-2"
                  onClick={() => {
                    setOpen(false);
                    setQ("");
                    router.push(r.href);
                  }}
                >
                  <FileText className="w-4 h-4 text-magenta-400 shrink-0" />
                  <span className="truncate">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
