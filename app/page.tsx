"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ClipboardList,
  FileQuestion,
  FileText,
  GraduationCap,
  Printer,
  School,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { SiteShell } from "@/components/perniagaan/site-shell";
import { EduStatCard } from "@/components/perniagaan/widgets";
import { useEdu } from "@/lib/perniagaan/store";

const QUICK_LINKS = [
  { href: "/nota-t4", label: "Nota Tingkatan 4", desc: "Nota dan ringkasan KSSM", icon: BookOpen, tone: "from-primary-500 to-lavender-400" },
  { href: "/nota-t5", label: "Nota Tingkatan 5", desc: "Nota dan ringkasan KSSM", icon: FileText, tone: "from-magenta-500 to-rose-400" },
  { href: "/kuiz", label: "Kuiz Online", desc: "Uji kefahaman secara interaktif", icon: ClipboardList, tone: "from-lavender-400 to-primary-500" },
  { href: "/kuiz-offline", label: "Kuiz Offline", desc: "Cetak dan jawab tanpa internet", icon: Printer, tone: "from-rose-400 to-magenta-500" },
  { href: "/latih-tubi", label: "Soalan Latih Tubi", desc: "Objektif, struktur dan esei", icon: FileQuestion, tone: "from-primary-400 to-softpink-300" },
  { href: "/percubaan-negeri", label: "Soalan Percubaan Negeri", desc: "Kertas percubaan mengikut negeri", icon: School, tone: "from-magenta-400 to-lavender-300" },
  { href: "/spm", label: "Soalan SPM", desc: "Rujukan lima tahun terkini", icon: GraduationCap, tone: "from-rose-400 to-lavender-400" },
];

export default function HomePage() {
  const { data, ready, studentName, session } = useEdu();

  const stats = useMemo(() => {
    if (!data) return null;
    const attempts = data.attempts;
    const avg = attempts.length
      ? Math.round(attempts.reduce((sum, a) => sum + a.peratus, 0) / attempts.length)
      : 0;
    return {
      chapters: data.chapters.length,
      notes: data.noteResources.length,
      quizzes: data.quizQuestions.length,
      practice: data.practiceQuestions.length,
      papers: data.examPapers.length,
      attempts: attempts.length,
      avg,
      bookmarks: data.bookmarks.length,
    };
  }, [data]);

  const featured = useMemo(() => {
    if (!data) return [];
    return [...data.noteResources]
      .sort((a, b) => b.tarikhMuatNaik.localeCompare(a.tarikhMuatNaik))
      .slice(0, 3);
  }, [data]);

  const announcements = useMemo(() => {
    if (!data) return [];
    return [...data.announcements].sort((a, b) => {
      if (a.disemat !== b.disemat) return a.disemat ? -1 : 1;
      return b.tarikh.localeCompare(a.tarikh);
    }).slice(0, 4);
  }, [data]);

  if (!ready || !data || !stats) {
    return (
      <SiteShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-primary-600">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-primary-500 to-magenta-500" />
            <p className="text-sm text-slate-400">Memuatkan portal pembelajaran...</p>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-700 via-primary-600 to-magenta-500 px-5 py-10 text-white shadow-pop sm:px-8 lg:px-12 lg:py-14">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-softpink-200/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-lavender-300/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Badge className="mb-4 border border-white/20 bg-white/10 text-white">Portal Pembelajaran KSSM</Badge>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              PANITIA PERNIAGAAN
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-primary-50 sm:text-lg">
              Meneroka Dunia Perniagaan, Membina Masa Depan
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-100 sm:text-base">
              Selamat datang, {studentName || session?.nama || "Guru dan Murid"}. Akses nota, kuiz,
              soalan latihan serta bahan peperiksaan untuk Perniagaan Tingkatan 4 dan Tingkatan 5.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/kuiz">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-softpink-100">
                  Mula Kuiz <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/nota-t4">
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                  Terokai Nota
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/15 p-3"><Store className="h-7 w-7" /></div>
                <div>
                  <p className="font-semibold">Ekosistem Pembelajaran</p>
                  <p className="text-xs text-primary-100">Nota • Kuiz • Latihan • Peperiksaan</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/10 p-3"><p className="text-2xl font-bold">{stats.chapters}</p><p className="text-xs text-primary-100">Bab KSSM</p></div>
                <div className="rounded-2xl bg-white/10 p-3"><p className="text-2xl font-bold">{stats.practice}</p><p className="text-xs text-primary-100">Soalan Latihan</p></div>
                <div className="rounded-2xl bg-white/10 p-3"><p className="text-2xl font-bold">{stats.papers}</p><p className="text-xs text-primary-100">Dokumen Peperiksaan</p></div>
                <div className="rounded-2xl bg-white/10 p-3"><p className="text-2xl font-bold">{stats.avg}%</p><p className="text-xs text-primary-100">Purata Kuiz</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick access */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-magenta-500">Akses Pantas</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Terokai Sumber Pembelajaran</h2>
          </div>
          <Link href="/dashboard-pelajar" className="hidden items-center gap-1 text-sm font-medium text-magenta-600 hover:underline sm:flex">
            Dashboard saya <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group">
                <Card className="flex h-full flex-col items-center p-4 text-center transition-all hover:-translate-y-1 hover:shadow-pop">
                  <div className={`mb-3 rounded-2xl bg-gradient-to-br ${item.tone} p-3 text-white shadow-sm transition-transform group-hover:scale-105`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-slate-800">{item.label}</p>
                  <p className="mt-1 text-xs leading-snug text-slate-400">{item.desc}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <EduStatCard icon={<BookOpen className="h-5 w-5" />} label="Bab KSSM" value={stats.chapters} href="/nota-t4" tone="purple" />
        <EduStatCard icon={<FileText className="h-5 w-5" />} label="Sumber Nota" value={stats.notes} href="/nota-t5" tone="pink" />
        <EduStatCard icon={<ClipboardList className="h-5 w-5" />} label="Soalan Kuiz" value={stats.quizzes} href="/kuiz" tone="lavender" />
        <EduStatCard icon={<FileQuestion className="h-5 w-5" />} label="Soalan Latih Tubi" value={stats.practice} href="/latih-tubi" tone="rose" />
        <EduStatCard icon={<School className="h-5 w-5" />} label="Kertas Peperiksaan" value={stats.papers} href="/percubaan-negeri" tone="purple" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Sumber Pembelajaran Pilihan</h2>
                <p className="text-sm text-slate-400">Nota digital yang disusun mengikut bab KSSM</p>
              </div>
              <Badge tone="pink">Contoh / Muat Naik</Badge>
            </div>
            <div className="space-y-3">
              {featured.map((note) => (
                <Link
                  key={note.id}
                  href={`/nota-${note.tingkatan.toLowerCase()}?nota=${note.id}`}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 transition-colors hover:border-lavender-300 hover:bg-lavender-50/50"
                >
                  <div className="rounded-xl bg-primary-50 p-3 text-primary-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-800">{note.tajuk}</p>
                      <Badge tone={note.status === "rasmi" ? "green" : "lavender"}>{note.status === "rasmi" ? "Rasmi" : "Contoh"}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{note.ringkasan}</p>
                    <p className="mt-2 text-xs text-slate-400">{note.dimuatNaikOleh} · {note.tarikhMuatNaik}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-magenta-500" />
              <h2 className="font-bold text-slate-900">Kemajuan Pembelajaran</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-softpink-100 p-4">
                <p className="text-2xl font-bold text-magenta-700">{stats.attempts}</p>
                <p className="text-xs text-magenta-600">Cubaan Kuiz</p>
              </div>
              <div className="rounded-2xl bg-lavender-100 p-4">
                <p className="text-2xl font-bold text-lavender-700">{stats.avg}%</p>
                <p className="text-xs text-lavender-700">Purata Skor</p>
              </div>
              <div className="rounded-2xl bg-primary-50 p-4">
                <p className="text-2xl font-bold text-primary-700">{stats.bookmarks}</p>
                <p className="text-xs text-primary-600">Item Disimpan</p>
              </div>
            </div>
            <Link href="/dashboard-pelajar">
              <Button variant="outline" className="mt-4 w-full">
                Lihat Dashboard Lengkap <TrendingUp className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Pengumuman</h2>
              <BadgeCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-800">{a.tajuk}</p>
                    <Badge tone={a.jenis === "Penting" ? "rose" : a.jenis === "Peperiksaan" ? "purple" : "pink"}>{a.jenis}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{a.isi}</p>
                  <p className="mt-2 text-xs text-slate-400">{a.tarikh}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="bg-gradient-to-r from-lavender-200 to-softpink-200 p-5">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary-700" />
                <div>
                  <p className="font-bold text-primary-800">Untuk Guru & Pentadbir</p>
                  <p className="text-sm text-primary-700">Urus nota, soalan dan dokumen peperiksaan</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm text-slate-500">
                Panel admin membolehkan guru memuat naik bahan, mengemas kini pengumuman dan menguruskan
                sumber pembelajaran mengikut tingkatan serta bab.
              </p>
              <Link href="/panel-admin">
                <Button className="w-full">
                  Buka Panel Admin <ShieldCheckFallback />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-primary-100 bg-white p-6 dark:border-white/10 dark:bg-[#221a30]">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex gap-3">
            <Target className="mt-1 h-5 w-5 shrink-0 text-magenta-500" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Pembelajaran Berstruktur</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Nota disusun mengikut bab buku teks KSSM untuk memudahkan ulang kaji.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-primary-500" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Latihan Bersepadu</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Kuiz dalam talian dan bahan luar talian untuk belajar di mana-mana.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <School className="mt-1 h-5 w-5 shrink-0 text-rose-500" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Bahan Peperiksaan</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Rujukan percubaan negeri dan SPM lima tahun dengan slot dokumen rasmi.</p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function ShieldCheckFallback() {
  return <BadgeCheck className="h-4 w-4" />;
}
