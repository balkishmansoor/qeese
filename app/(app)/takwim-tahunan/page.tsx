"use client";

import React, { useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash2, Printer } from "lucide-react";
import {
  Button, Card, Badge, Input, Textarea, Select, Field, Modal,
  ConfirmDialog, EmptyState, SearchInput, useToast, uid,
} from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/lib/store";
import { CalendarEvent, EventCategory } from "@/lib/types";
import { bulanList, toISODate, formatTarikhPendek, formatBulanTahun } from "@/lib/utils";
import { CATEGORY_META, CategoryLegend, EventList } from "@/components/calendar";
import { cn } from "@/components/ui";

const HARI = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];

const emptyEvent: Omit<CalendarEvent, "id"> = {
  tajuk: "", tarikhMula: "", tarikhAkhir: "", masa: "", lokasi: "",
  kategori: "akademik", peringatan: true, keterangan: "",
};

export default function TakwimPage() {
  const { get, add, update, remove, ready } = useStore();
  const toast = useToast();
  const events = get("events");

  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("semua");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [deleting, setDeleting] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState(emptyEvent);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let list = events;
    if (filterCat !== "semua") list = list.filter((e) => e.kategori === filterCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.tajuk.toLowerCase().includes(q) || (e.keterangan ?? "").toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => a.tarikhMula.localeCompare(b.tarikhMula));
  }, [events, search, filterCat]);

  const days = useMemo(() => bulanList(view.y, view.m), [view]);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((e) => {
      const s = new Date(e.tarikhMula + "T00:00:00");
      const en = new Date((e.tarikhAkhir ?? e.tarikhMula) + "T00:00:00");
      while (s <= en) {
        const k = toISODate(s);
        if (!map.has(k)) map.set(k, []);
        if (!map.get(k)!.some((x) => x.id === e.id)) map.get(k)!.push(e);
        s.setDate(s.getDate() + 1);
      }
    });
    return map;
  }, [events]);

  const dayEvents = selectedDate ? (byDate.get(selectedDate) ?? []) : [];

  const openCreate = (date?: string) => {
    setEditing(null);
    setForm({ ...emptyEvent, tarikhMula: date ?? toISODate(today) });
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (e: CalendarEvent) => {
    setEditing(e);
    const { id, ...rest } = e;
    setForm(rest);
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    const e: Record<string, string> = {};
    if (!form.tajuk.trim()) e.tajuk = "Tajuk diperlukan";
    if (!form.tarikhMula) e.tarikhMula = "Tarikh mula diperlukan";
    setErrors(e);
    if (Object.keys(e).length) return;
    if (editing) {
      update("events", editing.id, { ...form });
      toast("Peristiwa dikemas kini");
    } else {
      add("events", { ...form, id: uid() } as CalendarEvent);
      toast("Peristiwa baharu ditambah");
    }
    setModalOpen(false);
  };

  const printCalendar = () => {
    window.print();
  };

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        title="Takwim Tahunan"
        subtitle="Kalendar aktiviti kurikulum sekolah"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={printCalendar}><Printer className="w-4 h-4" /> Cetak</Button>
            <Button size="sm" onClick={() => openCreate()}><Plus className="w-4 h-4" /> Tambah Peristiwa</Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-slate-100" onClick={() => { const d = new Date(view.y, view.m - 1, 1); setView({ y: d.getFullYear(), m: d.getMonth() }); }}><ChevronLeft className="w-4 h-4" /></button>
              <h2 className="font-semibold text-slate-800 capitalize w-40 text-center">{formatBulanTahun(view.y, view.m)}</h2>
              <button className="p-2 rounded-lg hover:bg-slate-100" onClick={() => { const d = new Date(view.y, view.m + 1, 1); setView({ y: d.getFullYear(), m: d.getMonth() }); }}><ChevronRight className="w-4 h-4" /></button>
              <Button variant="outline" size="sm" onClick={() => { setView({ y: today.getFullYear(), m: today.getMonth() }); }}>Hari Ini</Button>
            </div>
            <CategoryLegend />
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400 mb-1">
            {HARI.map((h) => <div key={h} className="py-1">{h}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              const key = toISODate(d);
              const evs = byDate.get(key) ?? [];
              const inMonth = d.getMonth() === view.m;
              const isToday = key === toISODate(today);
              const isSel = key === selectedDate;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSel ? null : key)}
                  onDoubleClick={() => openCreate(key)}
                  className={cn(
                    "min-h-[64px] sm:min-h-[88px] rounded-xl border p-1 text-left align-top transition-colors",
                    inMonth ? "bg-white" : "bg-slate-50/50",
                    isToday ? "border-magenta-400" : "border-slate-100",
                    isSel ? "ring-2 ring-magenta-300" : "hover:border-lavender-300"
                  )}
                >
                  <span className={cn("text-xs font-medium", isToday ? "text-magenta-600" : inMonth ? "text-slate-600" : "text-slate-300")}>
                    {d.getDate()}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {evs.slice(0, 3).map((e) => (
                      <div
                        key={e.id}
                        className="text-[10px] leading-tight px-1 rounded truncate text-white"
                        style={{ background: CATEGORY_META[e.kategori].color }}
                      >
                        {e.tajuk}
                      </div>
                    ))}
                    {evs.length > 3 && <p className="text-[10px] text-slate-400 pl-1">+{evs.length - 3} lagi</p>}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3">Klik hari untuk melihat peristiwa · Klik dua kali untuk menambah peristiwa</p>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">
                {selectedDate ? formatTarikhPendek(selectedDate) : "Senarai Peristiwa"}
              </h3>
              {selectedDate && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>Semua</Button>
              )}
            </div>
            {selectedDate ? (
              <>
                <EventList events={dayEvents} emptyMessage="Tiada peristiwa pada hari ini" />
                <Button variant="soft" size="sm" className="mt-3 w-full" onClick={() => openCreate(selectedDate)}>
                  <Plus className="w-4 h-4" /> Tambah pada hari ini
                </Button>
              </>
            ) : (
              <div className="max-h-[420px] overflow-y-auto space-y-2">
                {filtered.length === 0 && <EmptyState title="Tiada peristiwa" />}
                {filtered.map((e) => {
                  const meta = CATEGORY_META[e.kategori];
                  return (
                    <div key={e.id} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 group">
                      <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: meta.color }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 truncate">{e.tajuk}</p>
                        <p className="text-xs text-slate-400">{formatTarikhPendek(e.tarikhMula)}{e.tarikhAkhir && e.tarikhAkhir !== e.tarikhMula ? ` – ${formatTarikhPendek(e.tarikhAkhir)}` : ""}</p>
                      </div>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500" onClick={() => openEdit(e)}><Pencil className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-red-100 text-red-400" onClick={() => setDeleting(e)}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex gap-2">
              <SearchInput value={search} onChange={setSearch} placeholder="Cari peristiwa..." className="flex-1" />
              <Select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="w-36">
                <option value="semua">Semua</option>
                {(Object.keys(CATEGORY_META) as EventCategory[]).map((k) => (
                  <option key={k} value={k}>{CATEGORY_META[k].label}</option>
                ))}
              </Select>
            </div>
          </Card>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Kemaskini Peristiwa" : "Tambah Peristiwa"}>
        <div className="space-y-4">
          <Field label="Tajuk Peristiwa" required error={errors.tajuk}>
            <Input value={form.tajuk} onChange={(e) => setForm({ ...form, tajuk: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tarikh Mula" required error={errors.tarikhMula}>
              <Input type="date" value={form.tarikhMula} onChange={(e) => setForm({ ...form, tarikhMula: e.target.value })} />
            </Field>
            <Field label="Tarikh Tamat (opsyenal)">
              <Input type="date" value={form.tarikhAkhir ?? ""} onChange={(e) => setForm({ ...form, tarikhAkhir: e.target.value || undefined })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Masa">
              <Input type="time" value={form.masa ?? ""} onChange={(e) => setForm({ ...form, masa: e.target.value })} />
            </Field>
            <Field label="Kategori">
              <Select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value as EventCategory })}>
                {(Object.keys(CATEGORY_META) as EventCategory[]).map((k) => (
                  <option key={k} value={k}>{CATEGORY_META[k].label}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Lokasi">
            <Input value={form.lokasi ?? ""} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
          </Field>
          <Field label="Keterangan">
            <Textarea value={form.keterangan ?? ""} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} className="min-h-[70px]" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.peringatan} onChange={(e) => setForm({ ...form, peringatan: e.target.checked })} className="w-4 h-4 accent-magenta-500" />
            Hantar peringatan
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
          <Button onClick={save}>Simpan</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            remove("events", deleting.id);
            toast("Peristiwa dipadam");
          }
        }}
        message={`Padam peristiwa "${deleting?.tajuk}"?`}
      />
    </div>
  );
}
