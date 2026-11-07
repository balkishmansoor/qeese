"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Mail, FileText, CalendarDays, GraduationCap, FileQuestion,
  BarChart3, Clock, ArrowRight, TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { MiniCalendar, EventList, CATEGORY_META } from "@/components/calendar";
import { BarChartCard, PieChartCard } from "@/components/charts";
import { useStore } from "@/lib/store";
import { formatTarikhPendek, formatTarikhMasa, toISODate } from "@/lib/utils";
import { CalendarEvent } from "@/lib/types";

const MODULES = [
  { href: "/surat-jemputan", label: "Surat Jemputan", icon: Mail, color: "text-magenta-500 bg-magenta-50" },
  { href: "/minit-mesyuarat", label: "Minit Mesyuarat", icon: FileText, color: "text-primary-500 bg-primary-50" },
  { href: "/takwim-tahunan", label: "Takwim Tahunan", icon: CalendarDays, color: "text-lavender-600 bg-lavender-50" },
  { href: "/kursus-pdp", label: "Kursus PDP", icon: GraduationCap, color: "text-rose-500 bg-rose-50" },
  { href: "/soalan-spm", label: "Soalan SPM", icon: FileQuestion, color: "text-amber-600 bg-amber-50" },
  { href: "/analisa-peperiksaan", label: "Analisa Peperiksaan", icon: BarChart3, color: "text-emerald-600 bg-emerald-50" },
  { href: "/kelas-tambahan", label: "Kelas Tambahan", icon: Clock, color: "text-sky-600 bg-sky-50" },
];

function StatCard({
  icon, label, value, href, accent,
}: {
  icon: React.ReactNode; label: string; value: string | number; href: string; accent: string;
}) {
  return (
    <Link href={href}>
      <Card className="p-4 sm:p-5 hover:shadow-pop hover:-translate-y-0.5 transition-all group">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl ${accent}`}>{icon}</div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-magenta-400 transition-colors" />
        </div>
        <p className="mt-3 text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { data, ready } = useStore();
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));

  const stats = useMemo(() => {
    if (!data) return null;
    const now = new Date();
    const upcoming = data.events.filter((e) => e.tarikhMula >= toISODate(now)).length;
    const avgMark = data.results.length
      ? Math.round(data.results.reduce((s, r) => s + r.markah, 0) / data.results.length)
      : 0;
    return {
      mesyuarat: data.invitations.length + data.minutes.length,
      minit: data.minutes.length,
      events: upcoming,
      kursus: data.courses.filter((c) => c.status !== "Selesai" && c.status !== "Dibatalkan").length,
      analisis: new Set(data.results.map((r) => r.peperiksaan)).size,
      kelas: data.classes.filter((c) => c.status === "Dijadualkan").length,
      avgMark,
    };
  }, [data]);

  const selectedEvents = useMemo(() => {
    if (!data) return [] as CalendarEvent[];
    return data.events.filter((e) => {
      const end = e.tarikhAkhir ?? e.tarikhMula;
      return selectedDate >= e.tarikhMula && selectedDate <= end;
    });
  }, [data, selectedDate]);

  const recentActivities = useMemo(() => {
    if (!data) return [];
    const items: { icon: React.ReactNode; text: string; time: string; href: string }[] = [];
    data.invitations.slice(0, 2).forEach((i) =>
      items.push({ icon: <Mail className="w-4 h-4" />, text: `Surat jemputan baharu: ${i.tajukMesyuarat}`, time: formatTarikhPendek(i.diciptaPada), href: "/surat-jemputan" })
    );
    data.minutes.forEach((m) =>
      items.push({ icon: <FileText className="w-4 h-4" />, text: `Minit direkod: ${m.tajukMesyuarat}`, time: formatTarikhPendek(m.diciptaPada), href: "/minit-mesyuarat" })
    );
    data.courses.slice(0, 2).forEach((c) =>
      items.push({ icon: <GraduationCap className="w-4 h-4" />, text: `Kursus: ${c.tajuk}`, time: c.tarikhMasa.slice(0, 10), href: "/kursus-pdp" })
    );
    data.classes.slice(0, 2).forEach((c) =>
      items.push({ icon: <Clock className="w-4 h-4" />, text: `Kelas tambahan: ${c.tajuk}`, time: c.tarikh, href: "/kelas-tambahan" })
    );
    return items.slice(0, 6);
  }, [data]);

  const subjectPerf = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, { sum: number; n: number }>();
    data.results.forEach((r) => {
      const e = map.get(r.subjek) ?? { sum: 0, n: 0 };
      e.sum += r.markah; e.n += 1; map.set(r.subjek, e);
    });
    return [...map.entries()].map(([subjek, v]) => ({
      subjek, purata: Math.round((v.sum / v.n) * 10) / 10,
    }));
  }, [data]);

  const gradeDist = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, number>();
    data.results.forEach((r) => {
      const g = r.gred ?? "Lain-lain";
      map.set(g, (map.get(g) ?? 0) + 1);
    });
    const order = ["A+", "A", "B+", "B", "C+", "C", "D", "E", "G"];
    return order.filter((g) => map.has(g)).map((g) => ({ name: g, value: map.get(g)! }));
  }, [data]);

  const upcomingEvents = useMemo(() => {
    if (!data) return [] as CalendarEvent[];
    const today = toISODate(new Date());
    return [...data.events]
      .filter((e) => e.tarikhMula >= today)
      .sort((a, b) => a.tarikhMula.localeCompare(b.tarikhMula))
      .slice(0, 6);
  }, [data]);

  if (!ready || !data || !stats) {
    return <div className="text-sm text-slate-400 py-20 text-center">Memuatkan papan pemuka...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Papan Pemuka"
        subtitle="Gambaran keseluruhan perancangan dan pengurusan kurikulum sekolah"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard icon={<Mail className="w-5 h-5" />} label="Mesyuarat & Surat" value={stats.mesyuarat} href="/surat-jemputan" accent="text-magenta-500 bg-magenta-50" />
        <StatCard icon={<FileText className="w-5 h-5" />} label="Minit Mesyuarat" value={stats.minit} href="/minit-mesyuarat" accent="text-primary-500 bg-primary-50" />
        <StatCard icon={<CalendarDays className="w-5 h-5" />} label="Peristiwa Akan Datang" value={stats.events} href="/takwim-tahunan" accent="text-lavender-600 bg-lavender-50" />
        <StatCard icon={<GraduationCap className="w-5 h-5" />} label="Kursus PDP Aktif" value={stats.kursus} href="/kursus-pdp" accent="text-rose-500 bg-rose-50" />
        <StatCard icon={<FileQuestion className="w-5 h-5" />} label="Analisis Peperiksaan" value={stats.analisis} href="/analisa-peperiksaan" accent="text-emerald-600 bg-emerald-50" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Kelas Tambahan" value={stats.kelas} href="/kelas-tambahan" accent="text-sky-600 bg-sky-50" />
      </div>

      {/* Modules quick access */}
      <Card className="p-4 sm:p-5">
        <p className="text-sm font-semibold text-slate-700 mb-3">Modul Utama</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className={`p-2.5 rounded-xl ${m.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-600 text-center leading-tight">{m.label}</span>
              </Link>
            );
          })}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Takwim Akademik</CardTitle>
            <Link href="/takwim-tahunan" className="text-xs font-medium text-magenta-600 hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <MiniCalendar events={data.events} selected={selectedDate} onSelect={setSelectedDate} />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {formatTarikhPendek(selectedDate)}
            </p>
            <EventList events={selectedEvents} />
          </div>
        </Card>

        {/* Upcoming events */}
        <Card className="p-5">
          <CardTitle className="mb-4">Peristiwa Akan Datang</CardTitle>
          <div className="space-y-3">
            {upcomingEvents.length === 0 && <p className="text-sm text-slate-400 text-center py-6">Tiada peristiwa akan datang</p>}
            {upcomingEvents.map((e) => {
              const meta = CATEGORY_META[e.kategori];
              return (
                <div key={e.id} className="flex gap-3">
                  <div className="flex flex-col items-center w-12 shrink-0">
                    <span className="text-lg font-bold text-slate-800 leading-none">
                      {new Date(e.tarikhMula + "T00:00:00").getDate()}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">
                      {new Date(e.tarikhMula + "T00:00:00").toLocaleDateString("ms-MY", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pb-3 border-b border-slate-50 last:border-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{e.tajuk}</p>
                    <p className="text-xs mt-0.5" style={{ color: meta.color }}>{meta.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Subject performance */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <CardTitle>Pencapaian Mengikut Subjek</CardTitle>
            <Badge tone="magenta"><TrendingUp className="w-3 h-3 mr-1" />Purata {stats.avgMark}%</Badge>
          </div>
          <BarChartCard data={subjectPerf} xKey="subjek" yKey="purata" color="#802390" height={240} />
        </Card>

        {/* Grade distribution */}
        <Card className="p-5">
          <CardTitle className="mb-2">Taburan Gred Pelajar</CardTitle>
          <PieChartCard data={gradeDist} height={240} />
        </Card>
      </div>

      {/* Recent activities */}
      <Card className="p-5">
        <CardTitle className="mb-4">Aktiviti Terkini</CardTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentActivities.map((a, i) => (
            <Link
              key={i}
              href={a.href}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-magenta-200 hover:bg-softpink-50/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary-50 text-primary-600 shrink-0">{a.icon}</div>
              <div className="min-w-0">
                <p className="text-sm text-slate-700 leading-snug">{a.text}</p>
                <p className="text-xs text-slate-400 mt-1">{formatTarikhPendek(a.time)}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
