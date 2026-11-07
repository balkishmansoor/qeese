"use client";

import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Printer, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Button, Card, Badge, Input, Textarea, Select, Field, Modal,
  ConfirmDialog, EmptyState, SearchInput, useToast, uid,
  Table, THead, TBody, Tr, Th, Td,
} from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/lib/store";
import { AdditionalClass } from "@/lib/types";
import { toISODate, todayISO } from "@/lib/utils";
import { cn } from "@/components/ui";

const SUBJECT_COLORS: Record<string, string> = {
  "Matematik": "#802390", "Bahasa Melayu": "#D13D96", "Bahasa Inggeris": "#ED6F96",
  "Sains": "#B9AAFA", "Fizik": "#9d89f5", "Kimia": "#7f64ee", "Sejarah": "#c68fe2",
};
function subjColor(s: string) {
  return SUBJECT_COLORS[s] ?? "#802390";
}

const DAYS = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];

const emptyClass: Omit<AdditionalClass, "id"> = {
  tajuk: "", subjek: "", guru: "", kelas: "", tarikh: todayISO(),
  masaMula: "15:00", masaAkhir: "16:30", lokasi: "", objektif: "",
  status: "Dijadualkan",
};

function overlaps(a: { tarikh: string; masaMula: string; masaAkhir: string; lokasi: string }, b: { tarikh: string; masaMula: string; masaAkhir: string; lokasi: string }) {
  if (a.tarikh !== b.tarikh) return false;
  return a.masaMula < b.masaAkhir && b.masaMula < a.masaAkhir;
}

export default function KelasTambahanPage() {
  const { get, add, update, remove, ready } = useStore();
  const toast = useToast();
  const classes = get("classes");
  const users = get("users");

  const [search, setSearch] = useState("");
  const [subjekFilter, setSubjekFilter] = useState("semua");
  const [view, setView] = useState<"senarai" | "minggu">("senarai");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdditionalClass | null>(null);
  const [deleting, setDeleting] = useState<AdditionalClass | null>(null);
  const [attendanceFor, setAttendanceFor] = useState<AdditionalClass | null>(null);
  const [form, setForm] = useState(emptyClass);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attendees, setAttendees] = useState<{ nama: string; status: "Hadir" | "Tidak Hadir" }[]>([]);

  const subjekList = useMemo(() => [...new Set(classes.map((c) => c.subjek))].sort(), [classes]);
  const guruList = users.filter((u) => u.peranan !== "admin").map((u) => u.nama);

  const filtered = useMemo(() => {
    let list = classes;
    if (subjekFilter !== "semua") list = list.filter((c) => c.subjek === subjekFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.tajuk.toLowerCase().includes(q) || c.guru.toLowerCase().includes(q) || c.kelas.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => `${a.tarikh}T${a.masaMula}`.localeCompare(`${b.tarikh}T${b.masaMula}`));
  }, [classes, search, subjekFilter]);

  // conflict detection
  const conflicts = useMemo(() => {
    const set = new Set<string>();
    classes.filter((c) => c.status === "Dijadualkan").forEach((c) => {
      classes.forEach((o) => {
        if (o.id !== c.id && o.status === "Dijadualkan" && overlaps(c, o) && o.guru === c.guru) set.add(c.id);
      });
    });
    return set;
  }, [classes]);

  // weekly view
  const weekStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d;
  }, []);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(d.getDate() + i); return d;
  }), [weekStart]);
  const weekClasses = useMemo(() => {
    const start = toISODate(weekStart);
    const end = toISODate(new Date(weekStart.getTime() + 6 * 86400000));
    return classes.filter((c) => c.tarikh >= start && c.tarikh <= end && c.status !== "Dibatalkan");
  }, [classes, weekStart]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyClass);
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (c: AdditionalClass) => {
    setEditing(c);
    const { id, kehadiran, ...rest } = c;
    setForm(rest);
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    const e: Record<string, string> = {};
    if (!form.tajuk.trim()) e.tajuk = "Tajuk kelas diperlukan";
    if (!form.subjek) e.subjek = "Subjek diperlukan";
    if (!form.guru) e.guru = "Guru diperlukan";
    if (!form.kelas) e.kelas = "Kelas diperlukan";
    if (!form.tarikh) e.tarikh = "Tarikh diperlukan";
    if (form.masaAkhir <= form.masaMula) e.masaAkhir = "Masa tamat mesti selepas masa mula";
    setErrors(e);
    if (Object.keys(e).length) return;

    // conflict check for same teacher same time
    const conflict = classes.find((c) =>
      c.id !== editing?.id && c.status === "Dijadualkan" && c.guru === form.guru && overlaps(c, form)
    );
    if (conflict) {
      toast(`Konflik jadual: bertindih dengan "${conflict.tajuk}" pada masa yang sama`, "error");
      return;
    }

    if (editing) {
      update("classes", editing.id, { ...form });
      toast("Kelas dikemas kini");
    } else {
      add("classes", { ...form, id: uid() } as AdditionalClass);
      toast("Kelas tambahan baharu dijadualkan");
    }
    setModalOpen(false);
  };

  const saveAttendance = () => {
    if (!attendanceFor) return;
    update("classes", attendanceFor.id, { kehadiran: attendees });
    setAttendanceFor(null);
    toast("Kehadiran disimpan");
  };

  const printSchedule = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rows = filtered.map((c) =>
      `<tr><td style="border:1px solid #ccc;padding:6px">${c.tarikh}</td><td style="border:1px solid #ccc;padding:6px">${c.masaMula}-${c.masaAkhir}</td><td style="border:1px solid #ccc;padding:6px">${c.subjek}</td><td style="border:1px solid #ccc;padding:6px">${c.kelas}</td><td style="border:1px solid #ccc;padding:6px">${c.guru}</td><td style="border:1px solid #ccc;padding:6px">${c.lokasi}</td></tr>`
    ).join("");
    w.document.write(`<html><head><title>Jadual Kelas Tambahan</title>
      <style>body{font-family:sans-serif;margin:40px}h1{color:#802390}table{border-collapse:collapse;width:100%;font-size:12px}</style>
      </head><body><h1>Jadual Kelas Tambahan</h1><p>SMK Taman Siswa — Dijana pada ${todayISO()}</p>
      <table><thead><tr><th style="border:1px solid #ccc;padding:6px">Tarikh</th><th style="border:1px solid #ccc;padding:6px">Masa</th><th style="border:1px solid #ccc;padding:6px">Subjek</th><th style="border:1px solid #ccc;padding:6px">Kelas</th><th style="border:1px solid #ccc;padding:6px">Guru</th><th style="border:1px solid #ccc;padding:6px">Lokasi</th></tr></thead><tbody>${rows}</tbody></table>
      </body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        title="Jadual Kelas Tambahan"
        subtitle="Uruskan jadual, kehadiran dan penugasan kelas tambahan"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={printSchedule}><Printer className="w-4 h-4" /> Cetak Jadual</Button>
            <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Jadual Kelas</Button>
          </>
        }
      />

      <Card className="p-4 mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari tajuk, guru atau kelas..." className="flex-1 min-w-[200px]" />
        <Select value={subjekFilter} onChange={(e) => setSubjekFilter(e.target.value)} className="w-44">
          <option value="semua">Semua Subjek</option>
          {subjekList.map((s) => <option key={s}>{s}</option>)}
        </Select>
        <div className="flex rounded-xl border border-slate-200 overflow-hidden">
          {(["senarai", "minggu"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn("px-3 py-2 text-sm font-medium", view === v ? "bg-magenta-500 text-white" : "bg-white text-slate-500 hover:bg-slate-50")}>
              {v === "senarai" ? "Senarai" : "Minggu Ini"}
            </button>
          ))}
        </div>
      </Card>

      {view === "senarai" ? (
        filtered.length === 0 ? (
          <Card><EmptyState title="Tiada kelas tambahan" message="Jadualkan kelas tambahan baharu." action={<Button size="sm" onClick={openCreate}>Jadual Kelas</Button>} /></Card>
        ) : (
          <Card>
            <Table>
              <THead><Tr><Th>Tarikh</Th><Th>Masa</Th><Th>Subjek</Th><Th>Kelas</Th><Th>Guru</Th><Th>Lokasi</Th><Th>Status</Th><Th className="text-right">Tindakan</Th></Tr></THead>
              <TBody>
                {filtered.map((c) => (
                  <Tr key={c.id} className={cn(conflicts.has(c.id) && "bg-red-50/50")}>
                    <Td className="whitespace-nowrap">{c.tarikh}</Td>
                    <Td className="whitespace-nowrap">{c.masaMula}–{c.masaAkhir}</Td>
                    <Td>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: subjColor(c.subjek) }} />
                        {c.subjek}
                      </span>
                    </Td>
                    <Td>{c.kelas}</Td>
                    <Td>{c.guru}</Td>
                    <Td>{c.lokasi}</Td>
                    <Td>
                      <div className="flex flex-col gap-1">
                        <Badge tone={c.status === "Selesai" ? "green" : c.status === "Dibatalkan" ? "red" : "purple"}>{c.status}</Badge>
                        {conflicts.has(c.id) && <Badge tone="red"><AlertTriangle className="w-3 h-3 mr-1" />Konflik</Badge>}
                      </div>
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Kehadiran" onClick={() => { setAttendanceFor(c); setAttendees(c.kehadiran ?? []); }}><Users className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleting(c)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </Card>
        )
      ) : (
        <Card className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((d) => {
              const key = toISODate(d);
              const dayClasses = weekClasses.filter((c) => c.tarikh === key);
              return (
                <div key={key} className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500 text-center mb-2">
                    {DAYS[d.getDay()]} {d.getDate()}
                  </p>
                  <div className="space-y-1.5">
                    {dayClasses.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => openEdit(c)}
                        className="w-full text-left p-2 rounded-lg text-white text-[11px] leading-tight hover:opacity-90"
                        style={{ background: subjColor(c.subjek) }}
                      >
                        <p className="font-semibold truncate">{c.masaMula}</p>
                        <p className="truncate">{c.subjek} — {c.kelas}</p>
                      </button>
                    ))}
                    {dayClasses.length === 0 && <div className="h-10 rounded-lg bg-slate-50" />}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Kemaskini Kelas" : "Jadualkan Kelas Tambahan"} wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tajuk Kelas" required error={errors.tajuk} className="sm:col-span-2">
            <Input value={form.tajuk} onChange={(e) => setForm({ ...form, tajuk: e.target.value })} />
          </Field>
          <Field label="Subjek" required error={errors.subjek}>
            <Select value={form.subjek} onChange={(e) => setForm({ ...form, subjek: e.target.value })}>
              <option value="">Pilih subjek</option>
              {[...new Set([...Object.keys(SUBJECT_COLORS), ...subjekList])].sort().map((s) => <option key={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Guru Bertugas" required error={errors.guru}>
            <Select value={form.guru} onChange={(e) => setForm({ ...form, guru: e.target.value })}>
              <option value="">Pilih guru</option>
              {guruList.map((g) => <option key={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="Kelas / Kumpulan" required error={errors.kelas}>
            <Input value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} placeholder="cth: 5 Bestari" />
          </Field>
          <Field label="Tarikh" required error={errors.tarikh}>
            <Input type="date" value={form.tarikh} onChange={(e) => setForm({ ...form, tarikh: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Masa Mula" required>
              <Input type="time" value={form.masaMula} onChange={(e) => setForm({ ...form, masaMula: e.target.value })} />
            </Field>
            <Field label="Masa Tamat" required error={errors.masaAkhir}>
              <Input type="time" value={form.masaAkhir} onChange={(e) => setForm({ ...form, masaAkhir: e.target.value })} />
            </Field>
          </div>
          <Field label="Lokasi">
            <Input value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AdditionalClass["status"] })}>
              <option>Dijadualkan</option><option>Selesai</option><option>Dibatalkan</option>
            </Select>
          </Field>
          <Field label="Objektif Kelas" className="sm:col-span-2">
            <Textarea value={form.objektif} onChange={(e) => setForm({ ...form, objektif: e.target.value })} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
          <Button onClick={save}>{editing ? "Simpan" : "Jadualkan"}</Button>
        </div>
      </Modal>

      {/* Attendance modal */}
      <Modal open={!!attendanceFor} onClose={() => setAttendanceFor(null)} title={`Kehadiran — ${attendanceFor?.tajuk ?? ""}`}>
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {attendees.map((a, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input className="flex-1" placeholder="Nama pelajar" value={a.nama} onChange={(e) => setAttendees(attendees.map((x, j) => j === i ? { ...x, nama: e.target.value } : x))} />
              <Select className="w-32" value={a.status} onChange={(e) => setAttendees(attendees.map((x, j) => j === i ? { ...x, status: e.target.value as "Hadir" | "Tidak Hadir" } : x))}>
                <option>Hadir</option><option>Tidak Hadir</option>
              </Select>
              <button className="p-2 text-red-400" onClick={() => setAttendees(attendees.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <Button variant="soft" size="sm" onClick={() => setAttendees([...attendees, { nama: "", status: "Hadir" }])}>
            <Plus className="w-3.5 h-3.5" /> Tambah Pelajar
          </Button>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setAttendanceFor(null)}>Batal</Button>
          <Button onClick={saveAttendance}><CheckCircle2 className="w-4 h-4" /> Simpan Kehadiran</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            update("classes", deleting.id, { status: "Dibatalkan" });
            toast("Kelas dibatalkan");
          }
        }}
        title="Batalkan kelas?"
        message={`Kelas "${deleting?.tajuk}" akan ditandakan sebagai dibatalkan.`}
      />
    </div>
  );
}
