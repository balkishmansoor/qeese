"use client";

import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Users, Award, CalendarClock, MapPin, UserCheck } from "lucide-react";
import {
  Button, Card, Badge, Input, Textarea, Select, Field, Modal,
  ConfirmDialog, EmptyState, SearchInput, useToast, uid, Table, THead, TBody, Tr, Th, Td,
} from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/lib/store";
import { Course } from "@/lib/types";
import { formatTarikhMasa } from "@/lib/utils";
import { cn } from "@/components/ui";

const STATUS_TONE: Record<Course["status"], "green" | "purple" | "slate" | "red"> = {
  "Akan Datang": "purple",
  "Sedang Berlangsung": "green",
  "Selesai": "slate",
  "Dibatalkan": "red",
};

const emptyCourse: Omit<Course, "id"> = {
  tajuk: "", perihal: "", objektif: "", tarikhMasa: "", lokasi: "",
  fasilitator: "", sasaran: "", status: "Akan Datang",
  jumlahPenyertaan: 0, sijilDikeluarkan: 0, bahan: "", refleksi: "",
};

export default function KursusPage() {
  const { get, add, update, remove, ready } = useStore();
  const toast = useToast();
  const courses = get("courses");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [view, setView] = useState<"kad" | "jadual">("kad");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyCourse);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let list = courses;
    if (statusFilter !== "semua") list = list.filter((c) => c.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.tajuk.toLowerCase().includes(q) || c.fasilitator.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => a.tarikhMasa.localeCompare(b.tarikhMasa));
  }, [courses, search, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCourse);
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (c: Course) => {
    setEditing(c);
    const { id, ...rest } = c;
    setForm(rest);
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    const e: Record<string, string> = {};
    if (!form.tajuk.trim()) e.tajuk = "Tajuk kursus diperlukan";
    if (!form.tarikhMasa) e.tarikhMasa = "Tarikh & masa diperlukan";
    if (!form.fasilitator.trim()) e.fasilitator = "Fasilitator diperlukan";
    setErrors(e);
    if (Object.keys(e).length) return;
    if (editing) {
      update("courses", editing.id, { ...form });
      toast("Kursus dikemas kini");
    } else {
      add("courses", { ...form, id: uid() } as Course);
      toast("Kursus baharu ditambah");
    }
    setModalOpen(false);
  };

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        title="Kursus Pembangunan Profesionalisme"
        subtitle="Uruskan kursus dan latihan guru"
        actions={<Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Tambah Kursus</Button>}
      />

      <Card className="p-4 mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari kursus atau fasilitator..." className="flex-1 min-w-[200px]" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44">
          <option value="semua">Semua Status</option>
          <option>Akan Datang</option><option>Sedang Berlangsung</option><option>Selesai</option><option>Dibatalkan</option>
        </Select>
        <div className="flex rounded-xl border border-slate-200 overflow-hidden">
          {(["kad", "jadual"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn("px-3 py-2 text-sm font-medium", view === v ? "bg-magenta-500 text-white" : "bg-white text-slate-500 hover:bg-slate-50")}
            >
              {v === "kad" ? "Paparan Kad" : "Paparan Jadual"}
            </button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState title="Tiada kursus" message="Tambah kursus pembangunan profesionalisme baharu." action={<Button size="sm" onClick={openCreate}>Tambah Kursus</Button>} /></Card>
      ) : view === "kad" ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} className="p-5 flex flex-col hover:shadow-pop transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-400" onClick={() => setDeleting(c)}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 leading-snug">{c.tajuk}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.perihal}</p>
              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <p className="flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5 text-magenta-400" />{formatTarikhMasa(c.tarikhMasa)}</p>
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-lavender-500" />{c.lokasi}</p>
                <p className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-rose-400" />{c.fasilitator}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{c.jumlahPenyertaan} peserta</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" />{c.sijilDikeluarkan} sijil</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <THead><Tr><Th>Tajuk Kursus</Th><Th>Tarikh</Th><Th>Fasilitator</Th><Th>Status</Th><Th>Penyertaan</Th><Th className="text-right">Tindakan</Th></Tr></THead>
            <TBody>
              {filtered.map((c) => (
                <Tr key={c.id}>
                  <Td className="font-medium max-w-[260px] truncate">{c.tajuk}</Td>
                  <Td className="whitespace-nowrap">{formatTarikhMasa(c.tarikhMasa)}</Td>
                  <Td>{c.fasilitator}</Td>
                  <Td><Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge></Td>
                  <Td>{c.jumlahPenyertaan}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleting(c)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Kemaskini Kursus" : "Tambah Kursus"} wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tajuk Kursus" required error={errors.tajuk} className="sm:col-span-2">
            <Input value={form.tajuk} onChange={(e) => setForm({ ...form, tajuk: e.target.value })} />
          </Field>
          <Field label="Tarikh & Masa" required error={errors.tarikhMasa}>
            <Input type="datetime-local" value={form.tarikhMasa.slice(0, 16)} onChange={(e) => setForm({ ...form, tarikhMasa: new Date(e.target.value).toISOString() })} />
          </Field>
          <Field label="Lokasi">
            <Input value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
          </Field>
          <Field label="Fasilitator / Jurulatih" required error={errors.fasilitator}>
            <Input value={form.fasilitator} onChange={(e) => setForm({ ...form, fasilitator: e.target.value })} />
          </Field>
          <Field label="Sasaran Peserta">
            <Input value={form.sasaran} onChange={(e) => setForm({ ...form, sasaran: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Course["status"] })}>
              <option>Akan Datang</option><option>Sedang Berlangsung</option><option>Selesai</option><option>Dibatalkan</option>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Jumlah Penyertaan">
              <Input type="number" min={0} value={form.jumlahPenyertaan} onChange={(e) => setForm({ ...form, jumlahPenyertaan: Number(e.target.value) })} />
            </Field>
            <Field label="Sijil Dikeluarkan">
              <Input type="number" min={0} value={form.sijilDikeluarkan} onChange={(e) => setForm({ ...form, sijilDikeluarkan: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Perihal Kursus" className="sm:col-span-2">
            <Textarea value={form.perihal} onChange={(e) => setForm({ ...form, perihal: e.target.value })} />
          </Field>
          <Field label="Objektif Kursus" className="sm:col-span-2">
            <Textarea value={form.objektif} onChange={(e) => setForm({ ...form, objektif: e.target.value })} placeholder={"1. Objektif pertama\n2. Objektif kedua"} />
          </Field>
          <Field label="Bahan Kursus" className="sm:col-span-2">
            <Input value={form.bahan ?? ""} onChange={(e) => setForm({ ...form, bahan: e.target.value })} />
          </Field>
          <Field label="Refleksi / Hasil" className="sm:col-span-2">
            <Textarea value={form.refleksi ?? ""} onChange={(e) => setForm({ ...form, refleksi: e.target.value })} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
          <Button onClick={save}>{editing ? "Simpan" : "Tambah Kursus"}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            remove("courses", deleting.id);
            toast("Kursus dipadam");
          }
        }}
        message={`Padam kursus "${deleting?.tajuk}"?`}
      />
    </div>
  );
}
