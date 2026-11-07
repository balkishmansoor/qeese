"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./ui";
import { bulanList, toISODate, formatTarikhPendek } from "@/lib/utils";
import { CalendarEvent, EventCategory } from "@/lib/types";

export const CATEGORY_META: Record<EventCategory, { label: string; color: string; bg: string }> = {
  akademik: { label: "Akademik", color: "#802390", bg: "bg-primary-500" },
  mesyuarat: { label: "Mesyuarat", color: "#D13D96", bg: "bg-magenta-500" },
  peperiksaan: { label: "Peperiksaan", color: "#ED6F96", bg: "bg-rose-400" },
  pdp: { label: "PDP", color: "#B9AAFA", bg: "bg-lavender-400" },
  cuti: { label: "Cuti", color: "#94a3b8", bg: "bg-slate-400" },
  tarikh_akhir: { label: "Tarikh Akhir", color: "#f59e0b", bg: "bg-amber-400" },
};

const HARI = ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"];

export function MiniCalendar({
  events,
  selected,
  onSelect,
}: {
  events: CalendarEvent[];
  selected?: string;
  onSelect?: (date: string) => void;
}) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const days = useMemo(() => bulanList(view.y, view.m), [view]);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((e) => {
      const start = e.tarikhMula;
      const end = e.tarikhAkhir ?? e.tarikhMula;
      const d = new Date(start + "T00:00:00");
      const endD = new Date(end + "T00:00:00");
      while (d <= endD) {
        const key = toISODate(d);
        if (!map.has(key)) map.set(key, []);
        if (!map.get(key)!.some((x) => x.id === e.id)) map.get(key)!.push(e);
        d.setDate(d.getDate() + 1);
      }
    });
    return map;
  }, [events]);

  const monthName = new Date(view.y, view.m, 1).toLocaleDateString("ms-MY", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-slate-800 capitalize">{monthName}</p>
        <div className="flex gap-1">
          <button
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            onClick={() => {
              const d = new Date(view.y, view.m - 1, 1);
              setView({ y: d.getFullYear(), m: d.getMonth() });
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            onClick={() => {
              const d = new Date(view.y, view.m + 1, 1);
              setView({ y: d.getFullYear(), m: d.getMonth() });
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-400 mb-1">
        {HARI.map((h) => (
          <div key={h} className="py-1">{h}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const key = toISODate(d);
          const evs = byDate.get(key) ?? [];
          const inMonth = d.getMonth() === view.m;
          const isToday = key === toISODate(today);
          const isSel = key === selected;
          return (
            <button
              key={i}
              onClick={() => onSelect?.(key)}
              className={cn(
                "relative h-9 rounded-lg text-xs flex flex-col items-center justify-center gap-0.5 transition-colors",
                inMonth ? "text-slate-700" : "text-slate-300",
                isToday && "ring-2 ring-magenta-400 font-bold",
                isSel && !isToday && "bg-primary-50",
                onSelect && "hover:bg-softpink-100 cursor-pointer"
              )}
            >
              <span>{d.getDate()}</span>
              {evs.length > 0 && (
                <span className="flex gap-0.5">
                  {evs.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: CATEGORY_META[e.kategori].color }}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function EventList({
  events,
  emptyMessage = "Tiada peristiwa pada hari ini",
}: {
  events: CalendarEvent[];
  emptyMessage?: string;
}) {
  if (events.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-6">{emptyMessage}</p>;
  }
  return (
    <div className="space-y-2">
      {events.map((e) => {
        const meta = CATEGORY_META[e.kategori];
        return (
          <div key={e.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70">
            <div className={cn("w-1 self-stretch rounded-full shrink-0", meta.bg)} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 truncate">{e.tajuk}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatTarikhPendek(e.tarikhMula)}
                {e.masa ? ` · ${e.masa}` : ""}
                {e.tarikhAkhir && e.tarikhAkhir !== e.tarikhMula ? ` – ${formatTarikhPendek(e.tarikhAkhir)}` : ""}
              </p>
              {e.lokasi && <p className="text-xs text-slate-400">{e.lokasi}</p>}
            </div>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{ background: meta.color + "22", color: meta.color }}
            >
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CategoryLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {(Object.keys(CATEGORY_META) as EventCategory[]).map((k) => (
        <span key={k} className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className={cn("w-2.5 h-2.5 rounded-full", CATEGORY_META[k].bg)} />
          {CATEGORY_META[k].label}
        </span>
      ))}
    </div>
  );
}
