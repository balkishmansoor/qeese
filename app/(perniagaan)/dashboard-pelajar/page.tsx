"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  ClipboardList,
  Clock,
  Download,
  FileText,
  History,
  Save,
  Target,
  TrendingUp,
  Trophy,
  User,
} from "lucide-react";
import { Badge, Button, Card, Input } from "@/components/ui";
import { EduPageHeader, EduStatCard } from "@/components/perniagaan/widgets";
import { useEdu } from "@/lib/perniagaan/store";
import { formatTarikhMasa } from "@/lib/utils";

export default function DashboardPelajarPage() {
  const { data, ready, studentName, setStudentName, session } = useEdu();

  const stats = useMemo(() => {
    if (!data) return null;
    const attempts = data.attempts.filter((a) => !studentName || a.namaMurid === studentName || studentName === "");
    const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.peratus, 0) / attempts.length) : 0;
    return {
      chapters: data.chapters.length,
      notes: data.noteResources.length,
      attempts: data.attempts.length,
      myAttempts: attempts.length,
      avg,
      bookmarks: data.bookmarks.length,
      downloads: data.downloads.length,
      recent: data.recentItems.slice(0, 6),
      history: data.attempts.slice(0, 8),
    };
  }, [data, studentName]);

  if (!ready || !data || !stats) return <div className="py-20 text-center text-sm text-slate-400">Memuatkan dashboard...</div>;

  return (
    <div>
      <EduPageHeader
        title="Dashboard Pembelajaran"
        subtitle="Pantau kemajuan, cubaan kuiz, nota tersimpan dan bahan muat turun anda."
        actions={
          <div className="flex items-center gap-2 rounded-2xl border border-primary-100 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <User className="h-4 w-4 text-primary-500" />
            <Input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nama murid"
              className="h-8 w-40 border-0 bg-transparent px-0 text-sm focus:ring-0"
            />
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EduStatCard icon={<FileText className="h-5 w-5" />} label="Bab KSSM" value={stats.chapters} href="/nota-t4" tone="purple" />
        <EduStatCard icon={<ClipboardList className="h-5 w-5" />} label="Cubaan Kuiz Saya" value={stats.myAttempts} href="/kuiz" tone="pink" />
        <EduStatCard icon={<TrendingUp className="h-5 w-5" />} label="Purata Skor" value={`${stats.avg}%`} href="/kuiz" tone="lavender" />
        <EduStatCard icon={<Bookmark className="h-5 w-5" />} label="Item Disimpan" value={stats.bookmarks} href="/nota-t4" tone="rose" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">Akses Pantas Pembelajaran</h2>
                <p className="text-sm text-slate-400">Sambung semula aktiviti terakhir anda</p>
              </div>
              <Badge tone="pink">{session ? `Log masuk: ${session.nama}` : "Mod tetamu"}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/nota-t4", title: "Nota Tingkatan 4", desc: "Baca dan muat turun nota bab KSSM", icon: FileText },
                { href: "/nota-t5", title: "Nota Tingkatan 5", desc: "Fokus bab SPM dan persediaan akhir", icon: Target },
                { href: "/kuiz", title: "Kuiz Online", desc: "Uji kefahaman dengan pemasa", icon: ClipboardList },
                { href: "/kuiz-offline", title: "Kuiz Offline", desc: "Cetak kertas soalan", icon: Download },
                { href: "/latih-tubi", title: "Latih Tubi", desc: "Struktur dan esei mengikut bab", icon: History },
                { href: "/spm", title: "Soalan SPM", desc: "Rujukan lima tahun terkini", icon: Trophy },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="group rounded-2xl border border-slate-100 p-4 transition-colors hover:border-lavender-300 hover:bg-lavender-50/50 dark:border-white/10 dark:hover:bg-white/5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-primary-50 p-2.5 text-primary-600 dark:bg-white/10 dark:text-lavender-200"><Icon className="h-5 w-5" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">Aktiviti Terkini</h2>
              <Clock className="h-5 w-5 text-slate-300" />
            </div>
            <div className="space-y-3">
              {stats.recent.length === 0 && <p className="text-sm text-slate-400">Belum ada aktiviti direkodkan.</p>}
              {stats.recent.map((item) => (
                <Link key={`${item.id}-${item.tarikh}`} href={item.href} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
                  <div className="rounded-lg bg-softpink-100 p-2 text-magenta-600 dark:bg-white/10 dark:text-lavender-200"><FileText className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                    <p className="text-xs text-slate-400">{formatTarikhMasa(item.tarikh)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 font-bold text-slate-900 dark:text-white">Sejarah Kuiz</h2>
            <div className="space-y-3">
              {stats.history.length === 0 && <p className="text-sm text-slate-400">Tiada percubaan lagi.</p>}
              {stats.history.map((attempt) => (
                <div key={attempt.id} className="rounded-2xl border border-slate-100 p-3 dark:border-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{attempt.namaMurid}</p>
                    <Badge tone={attempt.peratus >= 80 ? "green" : attempt.peratus >= 50 ? "pink" : "rose"}>{attempt.peratus}%</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{attempt.tingkatan} · {attempt.bab} · {attempt.jawapanBetul}/{attempt.jumlahSoalan} soalan</p>
                  <p className="text-xs text-slate-400">{formatTarikhMasa(attempt.tarikh)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Download className="h-5 w-5 text-primary-500" />
              <h2 className="font-bold text-slate-900 dark:text-white">Bahan Dimuat Turun</h2>
            </div>
            <div className="space-y-2">
              {data.downloads.length === 0 && <p className="text-sm text-slate-400">Tiada muat turun direkodkan.</p>}
              {data.downloads.slice(0, 6).map((item) => (
                <Link key={`${item.id}-${item.tarikh}`} href={item.href} className="block rounded-xl border border-slate-100 p-3 text-sm text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">
                  {item.label}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary-600 to-magenta-500 p-5 text-white">
            <Save className="h-6 w-6" />
            <h2 className="mt-3 font-bold">Teruskan Pembelajaran</h2>
            <p className="mt-1 text-sm text-primary-50">Simpan nota kegemaran dan semak semula topik yang mencabar.</p>
            <Link href="/nota-t5" className="mt-4 inline-flex"><Button className="bg-white text-primary-700 hover:bg-softpink-100">Buka Nota T5</Button></Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
