"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  ChevronDown,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  Home,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Store,
  Sun,
  X,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/components/ui";
import { useEdu } from "@/lib/perniagaan/store";
import { Tingkatan } from "@/lib/perniagaan/types";

const PRIMARY_NAV = [
  { href: "/", label: "Utama", icon: Home },
  { href: "/kuiz", label: "Kuiz", icon: ClipboardList },
  { href: "/latih-tubi", label: "Latih Tubi", icon: FileQuestion },
  { href: "/percubaan-negeri", label: "Percubaan Negeri", icon: GraduationCap },
  { href: "/spm", label: "SPM", icon: BookOpen },
  { href: "/dashboard-pelajar", label: "Dashboard", icon: LayoutDashboard },
  { href: "/panel-admin", label: "Panel Admin", icon: ShieldCheck },
];

const NOTE_LINKS = [
  { href: "/nota-t4", label: "Nota Tingkatan 4", tingkatan: "T4" as Tingkatan },
  { href: "/nota-t5", label: "Nota Tingkatan 5", tingkatan: "T5" as Tingkatan },
];

const ALL_NAV = [
  { href: "/", label: "Utama", icon: Home },
  { href: "/nota-t4", label: "Nota T4", icon: BookOpen },
  { href: "/nota-t5", label: "Nota T5", icon: BookOpen },
  ...PRIMARY_NAV.slice(1, -1),
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);
  return null;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data, session, logout } = useEdu();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("panitia_theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("panitia_theme", dark ? "dark" : "light");
  }, [dark]);

  const current = ALL_NAV.find((n) => isActive(pathname, n.href));
  const notifications = useMemo(() => {
    if (!data) return [];
    const items: { id: string; title: string; desc: string; time: string; href: string; badge: string; isNew: boolean }[] = [];
    [...data.announcements]
      .sort((a, b) => {
        if (a.disemat !== b.disemat) return a.disemat ? -1 : 1;
        return b.tarikh.localeCompare(a.tarikh);
      })
      .slice(0, 5)
      .forEach((a) => items.push({ id: `ann-${a.id}`, title: a.tajuk, desc: a.isi, time: a.tarikh, href: "/", badge: a.jenis, isNew: a.disemat }));
    [...data.noteResources]
      .sort((a, b) => b.tarikhMuatNaik.localeCompare(a.tarikhMuatNaik))
      .slice(0, 3)
      .forEach((n) => items.push({ id: `note-${n.id}`, title: `Sumber nota: ${n.tajuk}`, desc: n.ringkasan, time: n.tarikhMuatNaik, href: `/nota-${n.tingkatan.toLowerCase()}?nota=${n.id}`, badge: "Sumber", isNew: n.status === "muat_naik" }));
    data.examPapers
      .filter((p) => p.tarikhMuatNaik)
      .sort((a, b) => (b.tarikhMuatNaik ?? "").localeCompare(a.tarikhMuatNaik ?? ""))
      .slice(0, 3)
      .forEach((p) => items.push({ id: `paper-${p.id}`, title: `Dokumen baharu: ${p.tajuk}`, desc: p.catatan ?? p.kertas, time: p.tarikhMuatNaik ?? "", href: p.kategori === "spm" ? "/spm" : "/percubaan-negeri", badge: p.kategori === "spm" ? "SPM" : "Percubaan", isNew: true }));
    return items.slice(0, 8);
  }, [data]);

  const canAdmin = session?.peranan === "admin" || session?.peranan === "guru";

  return (
    <div className="min-h-screen bg-[#faf7fc] text-slate-800 transition-colors dark:bg-[#17111f] dark:text-slate-100">
      <PwaRegister />
      <header className="edu-no-print sticky top-0 z-40 border-b border-primary-100 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#1d1528]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-magenta-500 to-rose-400 text-white shadow-pop">
              <Store className="h-5 w-5" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold text-primary-700 dark:text-lavender-300 sm:text-base">
                PANITIA PERNIAGAAN
              </p>
              <p className="hidden truncate text-[11px] text-slate-500 dark:text-slate-400 sm:block">
                Meneroka Dunia Perniagaan, Membina Masa Depan
              </p>
            </div>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 xl:flex">
            {PRIMARY_NAV.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-softpink-200 text-magenta-700 dark:bg-white/10 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-white/10"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <div className="relative">
              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  NOTE_LINKS.some((n) => isActive(pathname, n.href))
                    ? "bg-softpink-200 text-magenta-700 dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-white/10"
                )}
                onClick={() => setNoteOpen((v) => !v)}
                aria-expanded={noteOpen}
              >
                <BookOpen className="h-4 w-4" />
                Nota
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", noteOpen && "rotate-180")} />
              </button>
              {noteOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNoteOpen(false)} />
                  <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-pop dark:border-white/10 dark:bg-[#2a1f3d]">
                    {NOTE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setNoteOpen(false)}
                        className={cn(
                          "block rounded-xl px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/10",
                          isActive(pathname, link.href)
                            ? "font-semibold text-primary-700 dark:text-lavender-200"
                            : "text-slate-600 dark:text-slate-300"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {PRIMARY_NAV.slice(5, 6).map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-softpink-200 text-magenta-700 dark:bg-white/10 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-white/10"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
            {canAdmin && (
              <Link
                href="/panel-admin"
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, "/panel-admin")
                    ? "bg-softpink-200 text-magenta-700 dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-white/10"
                )}
              >
                Panel Admin
              </Link>
            )}
          </nav>

          <div className="flex-1" />

          <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} className="hidden sm:inline-flex">
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Cari</span>
          </Button>
          <button
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            onClick={() => setDark((v) => !v)}
            aria-label={dark ? "Tukar ke mod cerah" : "Tukar ke mod gelap"}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Pemberitahuan"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-magenta-500 px-1 text-[10px] font-bold text-white">
                  {notifications.length}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-pop dark:border-white/10 dark:bg-[#2a1f3d]">
                  <p className="px-3 py-2 text-sm font-semibold text-slate-800 dark:text-white">
                    Pemberitahuan & Sumber Baharu
                  </p>
                  <div className="max-h-80 space-y-1 overflow-y-auto">
                    {notifications.length === 0 && <p className="px-3 py-6 text-center text-sm text-slate-400">Tiada pemberitahuan</p>}
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.href}
                        onClick={() => setNotifOpen(false)}
                        className="block rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{n.title}</p>
                          {n.isNew && <Badge tone="pink">Baharu</Badge>}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{n.desc}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-300 dark:text-slate-500">{n.badge} · {n.time}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {session ? (
            <div className="hidden items-center gap-2 rounded-2xl border border-primary-100 bg-white px-3 py-1.5 sm:flex dark:border-white/10 dark:bg-white/5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-rose-400 text-sm font-bold text-white">
                {session.nama.charAt(0)}
              </div>
              <div className="hidden leading-tight md:block">
                <p className="max-w-28 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{session.nama}</p>
                <p className="text-[10px] capitalize text-slate-400">{session.peranan}</p>
              </div>
              <button className="text-xs font-medium text-magenta-600 hover:underline" onClick={logout}>
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/panel-admin"
              className="hidden rounded-xl bg-gradient-to-r from-primary-500 to-magenta-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] sm:block"
            >
              Log Masuk
            </Link>
          )}
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            <div className="absolute inset-0 bg-primary-900/40" onClick={() => setMobileOpen(false)} />
            <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-pop dark:bg-[#211832]">
              <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-white/10">
                <p className="font-bold text-primary-700 dark:text-white">Menu</p>
                <button className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {ALL_NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                        isActive(pathname, item.href)
                          ? "bg-softpink-200 text-magenta-700 dark:bg-white/10 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/10"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                {canAdmin ? (
                  <Link
                    href="/panel-admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    <ShieldCheck className="h-4 w-4" /> Panel Admin
                  </Link>
                ) : (
                  <Link
                    href="/panel-admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    <ShieldCheck className="h-4 w-4" /> Log Masuk Panel
                  </Link>
                )}
              </nav>
            </aside>
          </div>
        )}
      </header>

      {/* Breadcrumb */}
      <div className="edu-no-print border-b border-slate-100 bg-white/60 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs text-slate-500 dark:text-slate-400 sm:px-6">
          <Link href="/" className="hover:text-primary-600 dark:hover:text-lavender-300">Utama</Link>
          {current && current.href !== "/" && (
            <>
              <span>/</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{current.label}</span>
            </>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>

      <footer className="edu-no-print mt-10 border-t border-primary-100 bg-white dark:border-white/10 dark:bg-[#1d1528]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-rose-400 text-white">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-primary-700 dark:text-white">PANITIA PERNIAGAAN</p>
                <p className="text-xs text-slate-400">Portal Pembelajaran Perniagaan KSSM</p>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Platform pembelajaran untuk guru dan murid Perniagaan Tingkatan 4 serta Tingkatan 5. Kandungan
              contoh disediakan untuk tujuan pembangunan dan perlu disahkan oleh guru panitia.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Pembelajaran</p>
            <div className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <Link href="/nota-t4" className="block hover:text-primary-600">Nota T4</Link>
              <Link href="/nota-t5" className="block hover:text-primary-600">Nota T5</Link>
              <Link href="/kuiz" className="block hover:text-primary-600">Kuiz Online</Link>
              <Link href="/latih-tubi" className="block hover:text-primary-600">Soalan Latih Tubi</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Peperiksaan</p>
            <div className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <Link href="/percubaan-negeri" className="block hover:text-primary-600">Percubaan Negeri</Link>
              <Link href="/spm" className="block hover:text-primary-600">Soalan SPM 5 Tahun</Link>
              <Link href="/dashboard-pelajar" className="block hover:text-primary-600">Dashboard Murid</Link>
              <Link href="/panel-admin" className="block hover:text-primary-600">Panel Guru/Admin</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 px-4 py-4 text-center text-xs text-slate-400 dark:border-white/10">
          Hak Cipta Terpelihara © {new Date().getFullYear()} PANITIA PERNIAGAAN. Dokumen rasmi tertakluk kepada hak cipta pemilik asal.
        </div>
      </footer>

      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

function GlobalSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, addRecent } = useEdu();
  const router = useRouter();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (!data || !q.trim()) return [];
    const needle = q.toLowerCase();
    const out: { id: string; label: string; desc: string; href: string }[] = [];
    data.chapters
      .filter((c) => c.tajuk.toLowerCase().includes(needle) || c.konsep.join(" ").toLowerCase().includes(needle))
      .forEach((c) => out.push({ id: c.id, label: c.tajuk, desc: `Bab ${c.nombor} · ${c.tingkatan === "T4" ? "Tingkatan 4" : "Tingkatan 5"}`, href: `/nota-${c.tingkatan.toLowerCase()}?bab=${c.id}` }));
    data.noteResources
      .filter((n) => n.tajuk.toLowerCase().includes(needle) || n.kandungan.toLowerCase().includes(needle))
      .slice(0, 5)
      .forEach((n) => out.push({ id: n.id, label: n.tajuk, desc: n.jenis, href: `/nota-${n.tingkatan.toLowerCase()}?nota=${n.id}` }));
    data.quizQuestions
      .filter((x) => x.soalan.toLowerCase().includes(needle))
      .slice(0, 4)
      .forEach((x) => out.push({ id: x.id, label: x.soalan, desc: "Kuiz online", href: "/kuiz" }));
    data.practiceQuestions
      .filter((x) => x.soalan.toLowerCase().includes(needle))
      .slice(0, 4)
      .forEach((x) => out.push({ id: x.id, label: x.soalan, desc: `Latih tubi ${x.jenis}`, href: "/latih-tubi" }));
    data.examPapers
      .filter((p) => p.tajuk.toLowerCase().includes(needle))
      .slice(0, 4)
      .forEach((p) => out.push({ id: p.id, label: p.tajuk, desc: p.kategori === "spm" ? "SPM" : "Percubaan negeri", href: p.kategori === "spm" ? "/spm" : "/percubaan-negeri" }));
    return out.slice(0, 12);
  }, [data, q]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-20">
      <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nota, soalan, bab atau kertas peperiksaan..."
            className="w-full bg-transparent text-sm outline-none"
          />
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {q.trim() && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-slate-400">Tiada hasil dijumpai.</p>
          )}
          {!q.trim() && (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              Taip kata kunci untuk mencari sumber pembelajaran.
            </p>
          )}
          {results.map((r) => (
            <button
              key={r.id}
              className="flex w-full flex-col rounded-xl px-4 py-3 text-left hover:bg-slate-50"
              onClick={() => {
                addRecent({ id: r.id, jenis: "nota", label: r.label, href: r.href, tarikh: new Date().toISOString() });
                onClose();
                router.push(r.href);
              }}
            >
              <span className="text-sm font-medium text-slate-800">{r.label}</span>
              <span className="text-xs text-slate-400">{r.desc}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
