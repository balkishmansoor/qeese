"use client";

import React, { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, FileText, Download, Upload, FileQuestion } from "lucide-react";
import {
  Button, Card, Badge, Input, Select, Field, Modal,
  ConfirmDialog, EmptyState, SearchInput, useToast, uid, Table, THead, TBody, Tr, Th, Td,
} from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/lib/store";
import { ExamResource } from "@/lib/types";
import { formatTarikhPendek } from "@/lib/utils";

const emptyResource: Omit<ExamResource, "id" | "muatNaikPada" | "muatNaikOleh"> = {
  tajuk: "", subjek: "", tahun: new Date().getFullYear(), kertas: "Kertas 1",
  jenis: "Soalan Peperiksaan", topik: [], tahap: "Tingkatan 5", saiz: "",
};

const SUBJECTS = ["Matematik", "Bahasa Melayu", "Bahasa Inggeris", "Fizik", "Kimia", "Biologi", "Sains", "Sejarah", "Geografi", "Ekonomi", "Prinsip Perakaunan", "Pendidikan Islam"];
const TOPIK_SUGGEST = ["Algebra", "Fungsi", "Geometri", "Kefahaman", "Penulisan", "Inference", "Termodinamik", "Elektrik", "Kedaulatan Negara", "Rumus", "Graf", "Statistik"];

export default function SoalanPage() {
  const { get, add, update, remove, ready, session, data } = useStore();
  const toast = useToast();
  const resources = get("resources");

  const [search, setSearch] = useState("");
  const [subjekFilter, setSubjekFilter] = useState("semua");
  const [tahunFilter, setTahunFilter] = useState("semua");
  const [jenisFilter, setJenisFilter] = useState("semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ExamResource | null>(null);
  const [deleting, setDeleting] = useState<ExamResource | null>(null);
  const [form, setForm] = useState(emptyResource);
  const [topikInput, setTopikInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const years = useMemo(() => [...new Set(resources.map((r) => r.tahun))].sort((a, b) => b - a), [resources]);
  const subjekList = useMemo(() => [...new Set([...SUBJECTS, ...resources.map((r) => r.subjek)])].sort(), [resources]);

  const filtered = useMemo(() => {
    let list = resources;
    if (subjekFilter !== "semua") list = list.filter((r) => r.subjek === subjekFilter);
    if (tahunFilter !== "semua") list = list.filter((r) => String(r.tahun) === tahunFilter);
    if (jenisFilter !== "semua") list = list.filter((r) => r.jenis === jenisFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.tajuk.toLowerCase().includes(q) || r.topik.some((t) => t.toLowerCase().includes(q)));
    }
    return [...list].sort((a, b) => b.tahun - a.tahun || a.tajuk.localeCompare(b.tajuk));
  }, [resources, search, subjekFilter, tahunFilter, jenisFilter]);

  const currentUser = data?.users.find((u) => u.id === session?.userId);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyResource);
    setTopikInput("");
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (r: ExamResource) => {
    setEditing(r);
    const { id, muatNaikPada, muatNaikOleh, ...rest } = r;
    setForm(rest);
    setTopikInput(rest.topik.join(", "));
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    const e: Record<string, string> = {};
    if (!form.tajuk.trim()) e.tajuk = "Tajuk diperlukan";
    if (!form.subjek) e.subjek = "Subjek diperlukan";
    setErrors(e);
    if (Object.keys(e).length) return;
    const topik = topikInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (editing) {
      update("resources", editing.id, { ...form, topik });
      toast("Sumber peperiksaan dikemas kini");
    } else {
      add("resources", {
        ...form, topik, id: uid(),
        muatNaikPada: new Date().toISOString().slice(0, 10),
        muatNaikOleh: currentUser?.nama ?? "Pengguna",
      } as ExamResource);
      toast("Sumber baharu ditambah ke repositori");
    }
    setModalOpen(false);
  };

  const downloadSample = (r: ExamResource) => {
    // Demo mode: generate a placeholder PDF-like text file with metadata
    const content = `SOALAN ${r.subjek.toUpperCase()} - ${r.tahun}\n${"=".repeat(50)}\nTajuk: ${r.tajuk}\nKertas: ${r.kertas}\nJenis: ${r.jenis}\nTopik: ${r.topik.join(", ")}\n\n[Mod Demo] Fail ini ialah contoh metadata.\nMuat naik PDF sebenar melalui borang "Tambah Sumber".\nHanya muat naik dokumen yang anda mempunyai hak untuk dikongsi.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${r.subjek.replace(/\s/g, "_")}_${r.tahun}_${r.kertas.replace(/\s/g, "_")}.txt`;
    a.click();
    toast("Muat turun contoh dijana (mod demo)");
  };

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        title="Soalan Peperiksaan Sebenar SPM"
        subtitle="Repositori soalan dan skema pemarkahan — hanya dokumen yang dibenarkan disimpan"
        actions={<Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Tambah Sumber</Button>}
      />

      <div className="mb-4 rounded-xl border border-lavender-200 bg-lavender-50/60 p-3 text-xs text-lavender-700 flex items-start gap-2">
        <FileQuestion className="w-4 h-4 shrink-0 mt-0.5" />
        <p>Nota: Hanya muat naik kertas soalan dan skema pemarkahan yang anda mempunyai kebenaran untuk disimpan dan dikongsi. Sistem tidak memuat turun kandungan berhak cipta daripada sumber luaran.</p>
      </div>

      <Card className="p-4 mb-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari tajuk atau topik..." />
          <Select value={subjekFilter} onChange={(e) => setSubjekFilter(e.target.value)}>
            <option value="semua">Semua Subjek</option>
            {subjekList.map((s) => <option key={s}>{s}</option>)}
          </Select>
          <Select value={tahunFilter} onChange={(e) => setTahunFilter(e.target.value)}>
            <option value="semua">Semua Tahun</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
          <Select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)}>
            <option value="semua">Semua Jenis</option>
            <option>Soalan Peperiksaan</option><option>Skema Pemarkahan</option><option>Nota Pembelajaran</option>
          </Select>
          <p className="text-xs text-slate-400 self-center">{filtered.length} sumber dijumpai</p>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><EmptyState title="Tiada sumber ditemui" message="Cuba ubah penapis carian atau tambah sumber baharu." /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Card key={r.id} className="p-5 hover:shadow-pop transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="p-2.5 rounded-xl bg-softpink-100 text-magenta-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400" onClick={() => openEdit(r)}><Pencil className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-400" onClick={() => setDeleting(r)}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 leading-snug">{r.tajuk}</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge tone="magenta">{r.subjek}</Badge>
                <Badge tone="purple">{r.tahun}</Badge>
                <Badge tone="lavender">{r.kertas}</Badge>
                <Badge tone={r.jenis === "Skema Pemarkahan" ? "rose" : "slate"}>{r.jenis}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {r.topik.map((t) => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>)}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{r.tahap} · {r.saiz ?? "PDF"} · {formatTarikhPendek(r.muatNaikPada)}</span>
                <Button variant="soft" size="sm" onClick={() => downloadSample(r)}><Download className="w-3.5 h-3.5" /> Muat Turun</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Kemaskini Sumber" : "Tambah Sumber Peperiksaan"} wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tajuk Dokumen" required error={errors.tajuk} className="sm:col-span-2">
            <Input value={form.tajuk} onChange={(e) => setForm({ ...form, tajuk: e.target.value })} placeholder="cth: Soalan SPM 2024 - Matemik Kertas 1" />
          </Field>
          <Field label="Subjek" required error={errors.subjek}>
            <Select value={form.subjek} onChange={(e) => setForm({ ...form, subjek: e.target.value })}>
              <option value="">Pilih subjek</option>
              {subjekList.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Tahun Peperiksaan">
            <Select value={form.tahun} onChange={(e) => setForm({ ...form, tahun: Number(e.target.value) })}>
              {years.length ? years.map((y) => <option key={y} value={y}>{y}</option>) : <option>{new Date().getFullYear()}</option>}
              {!years.includes(new Date().getFullYear()) && <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>}
            </Select>
          </Field>
          <Field label="Kertas">
            <Select value={form.kertas} onChange={(e) => setForm({ ...form, kertas: e.target.value as ExamResource["kertas"] })}>
              <option>Kertas 1</option><option>Kertas 2</option><option>Kertas 3</option>
            </Select>
          </Field>
          <Field label="Jenis Dokumen">
            <Select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value as ExamResource["jenis"] })}>
              <option>Soalan Peperiksaan</option><option>Skema Pemarkahan</option><option>Nota Pembelajaran</option>
            </Select>
          </Field>
          <Field label="Tingkat / Kelas">
            <Select value={form.tahap} onChange={(e) => setForm({ ...form, tahap: e.target.value })}>
              <option>Tingkatan 4</option><option>Tingkatan 5</option><option>Semua Tingkatan</option>
            </Select>
          </Field>
          <Field label="Fail PDF (metadata)">
            <div className="flex items-center gap-2">
              <Input type="file" accept=".pdf" className="file:mr-3 file:rounded-lg file:border-0 file:bg-softpink-200 file:text-magenta-700 file:px-3 file:py-1 file:text-xs" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setForm({ ...form, saiz: `${(f.size / 1024 / 1024).toFixed(1)} MB` });
              }} />
            </div>
          </Field>
          <Field label="Topik (asingkan dengan koma)" className="sm:col-span-2">
            <Input value={topikInput} onChange={(e) => setTopikInput(e.target.value)} placeholder={TOPIK_SUGGEST.join(", ")} list="topik-list" />
            <datalist id="topik-list">{TOPIK_SUGGEST.map((t) => <option key={t} value={t} />)}</datalist>
            {form.topik?.length ? null : null}
          </Field>
          <label className="sm:col-span-2 flex items-start gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <Upload className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            Saya mengesahkan bahawa saya mempunyai kebenaran untuk menyimpan dan mengongsikan dokumen ini.
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
          <Button onClick={save}>{editing ? "Simpan" : "Tambah Sumber"}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            remove("resources", deleting.id);
            toast("Sumber dipadam");
          }
        }}
        message={`Padam sumber "${deleting?.tajuk}"?`}
      />
    </div>
  );
}
