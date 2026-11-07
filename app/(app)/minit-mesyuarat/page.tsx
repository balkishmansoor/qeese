"use client";

import React, { useMemo, useState } from "react";
import { Plus, Printer, Pencil, Trash2, Eye, FileDown } from "lucide-react";
import {
  Button, Card, Badge, Input, Textarea, Select, Field, Modal,
  ConfirmDialog, EmptyState, Table, THead, TBody, Tr, Th, Td,
  SearchInput, usePagination, Pagination, useToast, uid,
} from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/lib/store";
import { Minute, ActionItem, MinuteAttendee } from "@/lib/types";
import { formatTarikhMasa, formatTarikh, todayISO } from "@/lib/utils";

function emptyMinute(): Omit<Minute, "id" | "diciptaPada"> {
  return {
    noMesyuarat: "",
    tajukMesyuarat: "",
    tarikhMasa: "",
    lokasi: "",
    kehadiran: [],
    agenda: [],
    tindakan: [],
    susulanMesyuaratLepas: "",
    direkodOleh: "",
  };
}

function MinitTemplate({ m }: { m: Minute }) {
  return (
    <div className="bg-white text-slate-800 font-serif text-[13px] leading-relaxed p-8 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <p className="font-bold text-base uppercase">Sekolah Menengah Kebangsaan Taman Siswa</p>
        <p className="mt-1">Jalan Kenanga 5, Taman Siswa, 43000 Kajang, Selangor</p>
      </div>
      <div className="border-t-2 border-slate-800 pt-3 mb-6 text-center">
        <p className="font-bold tracking-widest uppercase">Minit Mesyuarat</p>
        <p className="text-xs mt-1">No. Rujukan: {m.noMesyuarat}</p>
      </div>
      <table className="w-full text-[12px] mb-6 border border-slate-400">
        <tbody>
          {[
            ["Tajuk Mesyuarat", m.tajukMesyuarat],
            ["Tarikh & Masa", formatTarikhMasa(m.tarikhMasa)],
            ["Lokasi", m.lokasi],
            ["Direkod Oleh", m.direkodOleh],
          ].map(([k, v]) => (
            <tr key={k}>
              <td className="border border-slate-400 px-3 py-1.5 font-semibold bg-slate-50 w-40">{k}</td>
              <td className="border border-slate-400 px-3 py-1.5">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="font-bold mb-2">Kehadiran:</p>
      <table className="w-full text-[12px] border border-slate-400 mb-6">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-400 px-2 py-1 text-left">Bil</th>
            <th className="border border-slate-400 px-2 py-1 text-left">Nama</th>
            <th className="border border-slate-400 px-2 py-1 text-left">Jawatan</th>
            <th className="border border-slate-400 px-2 py-1 text-left">Kehadiran</th>
          </tr>
        </thead>
        <tbody>
          {m.kehadiran.map((a: MinuteAttendee, i) => (
            <tr key={i}>
              <td className="border border-slate-400 px-2 py-1">{i + 1}</td>
              <td className="border border-slate-400 px-2 py-1">{a.nama}</td>
              <td className="border border-slate-400 px-2 py-1">{a.jawatan}</td>
              <td className="border border-slate-400 px-2 py-1">{a.kehadiran}</td>
            </tr>
          ))}
          {m.kehadiran.length === 0 && (
            <tr><td colSpan={4} className="border border-slate-400 px-2 py-2 text-center text-slate-400">Tiada senarai kehadiran</td></tr>
          )}
        </tbody>
      </table>

      <p className="font-bold mb-2">Perbincangan & Keputusan:</p>
      <table className="w-full text-[12px] border border-slate-400 mb-6">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-400 px-2 py-1 text-left w-8">Bil</th>
            <th className="border border-slate-400 px-2 py-1 text-left">Perkara</th>
            <th className="border border-slate-400 px-2 py-1 text-left">Perbincangan</th>
            <th className="border border-slate-400 px-2 py-1 text-left">Keputusan</th>
          </tr>
        </thead>
        <tbody>
          {m.agenda.map((a, i) => (
            <tr key={i}>
              <td className="border border-slate-400 px-2 py-1 align-top">{i + 1}</td>
              <td className="border border-slate-400 px-2 py-1 align-top font-medium">{a.perkara}</td>
              <td className="border border-slate-400 px-2 py-1 align-top">{a.perbincangan}</td>
              <td className="border border-slate-400 px-2 py-1 align-top">{a.keputusan}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="font-bold mb-2">Tindakan Susulan:</p>
      <table className="w-full text-[12px] border border-slate-400 mb-6">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-400 px-2 py-1 text-left">Perkara</th>
            <th className="border border-slate-400 px-2 py-1 text-left">Bertanggungjawab</th>
            <th className="border border-slate-400 px-2 py-1 text-left">Tarikh Akhir</th>
            <th className="border border-slate-400 px-2 py-1 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {m.tindakan.map((t: ActionItem) => (
            <tr key={t.id}>
              <td className="border border-slate-400 px-2 py-1">{t.perkara}</td>
              <td className="border border-slate-400 px-2 py-1">{t.bertanggungjawab}</td>
              <td className="border border-slate-400 px-2 py-1">{formatTarikh(t.tarikhAkhir)}</td>
              <td className="border border-slate-400 px-2 py-1">{t.status}</td>
            </tr>
          ))}
          {m.tindakan.length === 0 && (
            <tr><td colSpan={4} className="border border-slate-400 px-2 py-2 text-center text-slate-400">Tiada tindakan</td></tr>
          )}
        </tbody>
      </table>

      {m.susulanMesyuaratLepas && (
        <div className="mb-6">
          <p className="font-bold mb-1">Susulan Mesyuarat Lepas:</p>
          <p className="whitespace-pre-line">{m.susulanMesyuaratLepas}</p>
        </div>
      )}

      <div className="mt-10">
        <p className="font-bold">Disahkan oleh,</p>
        <div className="h-16" />
        <p className="font-bold">(Pengerusi)</p>
        <div className="h-8" />
        <p className="font-bold">Disediakan oleh,</p>
        <div className="h-16" />
        <p className="font-bold">({m.direkodOleh})</p>
        <p>Setiausaha</p>
      </div>
    </div>
  );
}

export default function MinitPage() {
  const { get, add, update, remove, ready } = useStore();
  const toast = useToast();
  const minutes = get("minutes");

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState<Minute | null>(null);
  const [editing, setEditing] = useState<Minute | null>(null);
  const [deleting, setDeleting] = useState<Minute | null>(null);
  const [form, setForm] = useState(emptyMinute());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () => minutes.filter((m) => m.tajukMesyuarat.toLowerCase().includes(search.toLowerCase()) || m.noMesyuarat.toLowerCase().includes(search.toLowerCase())),
    [minutes, search]
  );
  const { page, setPage, totalPages, paged } = usePagination(filtered, 8);

  const setAttendee = (i: number, patch: Partial<MinuteAttendee>) =>
    setForm((f) => ({ ...f, kehadiran: f.kehadiran.map((a, j) => (j === i ? { ...a, ...patch } : a)) }));
  const setAgenda = (i: number, patch: Partial<{ perkara: string; perbincangan: string; keputusan: string }>) =>
    setForm((f) => ({ ...f, agenda: f.agenda.map((a, j) => (j === i ? { ...a, ...patch } : a)) }));
  const setAction = (i: number, patch: Partial<ActionItem>) =>
    setForm((f) => ({ ...f, tindakan: f.tindakan.map((a, j) => (j === i ? { ...a, ...patch } : a)) }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyMinute());
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (m: Minute) => {
    setEditing(m);
    const { id, diciptaPada, ...rest } = m;
    setForm(rest);
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.noMesyuarat.trim()) e.noMesyuarat = "No. mesyuarat diperlukan";
    if (!form.tajukMesyuarat.trim()) e.tajukMesyuarat = "Tajuk mesyuarat diperlukan";
    if (!form.tarikhMasa) e.tarikhMasa = "Tarikh & masa diperlukan";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const save = () => {
    if (!validate()) return;
    if (editing) {
      update("minutes", editing.id, { ...form });
      toast("Minit mesyuarat dikemas kini");
    } else {
      add("minutes", { ...form, id: uid(), diciptaPada: todayISO() } as Minute);
      toast("Minit mesyuarat baharu direkod");
    }
    setModalOpen(false);
  };

  const printMinit = (m: Minute) => {
    const w = window.open("", "_blank");
    if (!w) return;
    const el = document.getElementById("print-minit-root");
    w.document.write(`<html><head><title>Minit - ${m.tajukMesyuarat}</title>
      <style>body{font-family:Georgia,serif;margin:40px;color:#1e293b}table{border-collapse:collapse;width:100%}</style>
      </head><body>${el?.innerHTML ?? ""}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        title="Minit Mesyuarat"
        subtitle="Rekod dan uruskan minit mesyuarat sekolah"
        actions={
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Rekod Minit</Button>
        }
      />

      <Card>
        <div className="p-4 border-b border-slate-100">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari tajuk atau no. mesyuarat..." className="max-w-sm" />
        </div>
        {paged.length === 0 ? (
          <EmptyState title="Tiada minit mesyuarat" message="Rekod minit mesyuarat baharu untuk bermula." action={<Button size="sm" onClick={openCreate}>Rekod Minit</Button>} />
        ) : (
          <Table>
            <THead><Tr><Th>No. Mesyuarat</Th><Th>Tajuk</Th><Th>Tarikh</Th><Th>Lokasi</Th><Th className="text-right">Tindakan</Th></Tr></THead>
            <TBody>
              {paged.map((m) => (
                <Tr key={m.id}>
                  <Td className="font-mono text-xs">{m.noMesyuarat}</Td>
                  <Td className="font-medium max-w-[260px] truncate">{m.tajukMesyuarat}</Td>
                  <Td className="whitespace-nowrap">{formatTarikhMasa(m.tarikhMasa)}</Td>
                  <Td>{m.lokasi}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setPreview(m)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { setPreview(m); setTimeout(() => printMinit(m), 100); }}><Printer className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(m)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleting(m)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Kemaskini Minit" : "Rekod Minit Mesyuarat"} wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="No. Mesyuarat" required error={errors.noMesyuarat}>
            <Input value={form.noMesyuarat} onChange={(e) => setForm({ ...form, noMesyuarat: e.target.value })} placeholder="cth: JK/KUR/02/2025" />
          </Field>
          <Field label="Tarikh & Masa" required error={errors.tarikhMasa}>
            <Input type="datetime-local" value={form.tarikhMasa.slice(0, 16)} onChange={(e) => setForm({ ...form, tarikhMasa: new Date(e.target.value).toISOString() })} />
          </Field>
          <Field label="Tajuk Mesyuarat" required error={errors.tajukMesyuarat} className="sm:col-span-2">
            <Input value={form.tajukMesyuarat} onChange={(e) => setForm({ ...form, tajukMesyuarat: e.target.value })} />
          </Field>
          <Field label="Lokasi" className="sm:col-span-2">
            <Input value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
          </Field>
          <Field label="Direkod Oleh">
            <Input value={form.direkodOleh} onChange={(e) => setForm({ ...form, direkodOleh: e.target.value })} />
          </Field>
          <Field label="Susulan Mesyuarat Lepas">
            <Input value={form.susulanMesyuaratLepas} onChange={(e) => setForm({ ...form, susulanMesyuaratLepas: e.target.value })} />
          </Field>

          {/* Kehadiran */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">Senarai Kehadiran</p>
              <Button variant="soft" size="sm" onClick={() => setForm((f) => ({ ...f, kehadiran: [...f.kehadiran, { nama: "", jawatan: "", kehadiran: "Hadir" }] }))}>
                <Plus className="w-3.5 h-3.5" /> Tambah
              </Button>
            </div>
            <div className="space-y-2">
              {form.kehadiran.map((a, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input className="flex-1" placeholder="Nama" value={a.nama} onChange={(e) => setAttendee(i, { nama: e.target.value })} />
                  <Input className="w-36" placeholder="Jawatan" value={a.jawatan} onChange={(e) => setAttendee(i, { jawatan: e.target.value })} />
                  <Select className="w-32" value={a.kehadiran} onChange={(e) => setAttendee(i, { kehadiran: e.target.value as MinuteAttendee["kehadiran"] })}>
                    <option>Hadir</option><option>Tidak Hadir</option><option>Mohon Maaf</option>
                  </Select>
                  <button className="p-2 text-red-400 hover:text-red-600" onClick={() => setForm((f) => ({ ...f, kehadiran: f.kehadiran.filter((_, j) => j !== i) }))}><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">Perbincangan & Keputusan</p>
              <Button variant="soft" size="sm" onClick={() => setForm((f) => ({ ...f, agenda: [...f.agenda, { perkara: "", perbincangan: "", keputusan: "" }] }))}>
                <Plus className="w-3.5 h-3.5" /> Tambah Perkara
              </Button>
            </div>
            <div className="space-y-3">
              {form.agenda.map((a, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge tone="purple">Perkara {i + 1}</Badge>
                    <button className="p-1 text-red-400 hover:text-red-600" onClick={() => setForm((f) => ({ ...f, agenda: f.agenda.filter((_, j) => j !== i) }))}><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <Input placeholder="Perkara" value={a.perkara} onChange={(e) => setAgenda(i, { perkara: e.target.value })} />
                  <Textarea placeholder="Perbincangan" value={a.perbincangan} onChange={(e) => setAgenda(i, { perbincangan: e.target.value })} className="min-h-[60px]" />
                  <Textarea placeholder="Keputusan" value={a.keputusan} onChange={(e) => setAgenda(i, { keputusan: e.target.value })} className="min-h-[60px]" />
                </div>
              ))}
            </div>
          </div>

          {/* Action items */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">Tindakan Susulan</p>
              <Button variant="soft" size="sm" onClick={() => setForm((f) => ({ ...f, tindakan: [...f.tindakan, { id: uid(), perkara: "", bertanggungjawab: "", tarikhAkhir: "", status: "Belum Selesai" }] }))}>
                <Plus className="w-3.5 h-3.5" /> Tambah Tindakan
              </Button>
            </div>
            <div className="space-y-2">
              {form.tindakan.map((t, i) => (
                <div key={t.id} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center">
                  <Input className="col-span-2 sm:col-span-1" placeholder="Perkara" value={t.perkara} onChange={(e) => setAction(i, { perkara: e.target.value })} />
                  <Input placeholder="Bertanggungjawab" value={t.bertanggungjawab} onChange={(e) => setAction(i, { bertanggungjawab: e.target.value })} />
                  <Input type="date" value={t.tarikhAkhir} onChange={(e) => setAction(i, { tarikhAkhir: e.target.value })} />
                  <Select value={t.status} onChange={(e) => setAction(i, { status: e.target.value as ActionItem["status"] })}>
                    <option>Belum Selesai</option><option>Dalam Proses</option><option>Selesai</option>
                  </Select>
                  <button className="p-2 text-red-400 hover:text-red-600 justify-self-end" onClick={() => setForm((f) => ({ ...f, tindakan: f.tindakan.filter((_, j) => j !== i) }))}><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
          <Button onClick={save}>{editing ? "Simpan Perubahan" : "Simpan Minit"}</Button>
        </div>
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Pratonton Minit Mesyuarat" wide>
        {preview && (
          <>
            <div className="max-h-[65vh] overflow-y-auto border border-slate-200 rounded-xl"><div id="print-minit-root"><MinitTemplate m={preview} /></div></div>
            <div className="flex justify-end gap-2 mt-4 no-print">
              <Button variant="outline" onClick={() => setPreview(null)}>Tutup</Button>
              <Button variant="outline"><FileDown className="w-4 h-4" /> Eksport</Button>
              <Button onClick={() => printMinit(preview)}><Printer className="w-4 h-4" /> Cetak / PDF</Button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            remove("minutes", deleting.id);
            toast("Minit mesyuarat dipadam");
          }
        }}
        message={`Padam minit "${deleting?.tajukMesyuarat}"?`}
      />
    </div>
  );
}
