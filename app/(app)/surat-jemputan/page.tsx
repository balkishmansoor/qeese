"use client";

import React, { useMemo, useState } from "react";
import { Plus, Printer, Pencil, Trash2, Eye, Download } from "lucide-react";
import {
  Button, Card, Badge, Input, Textarea, Select, Field, Modal,
  ConfirmDialog, EmptyState, Table, THead, TBody, Tr, Th, Td,
  SearchInput, usePagination, Pagination, useToast, uid,
} from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { useStore } from "@/lib/store";
import { Invitation } from "@/lib/types";
import { formatTarikhMasa, formatTarikh, todayISO } from "@/lib/utils";

const emptyForm: Omit<Invitation, "id" | "diciptaPada"> = {
  tajukMesyuarat: "",
  tarikhMasa: "",
  lokasi: "",
  agenda: "",
  penganjur: "",
  rujukan: "",
  penerima: "",
  jawatanPenerima: "",
  alamatPenerima: "",
  namaSekolah: "Sekolah Menengah Kebangsaan Taman Siswa",
  alamatSekolah: "Jalan Kenanga 5, Taman Siswa, 43000 Kajang, Selangor",
  penutup: "Sekian, terima kasih.",
  namaPenandatangan: "",
  jawatanPenandatangan: "",
};

function SuratTemplate({ inv }: { inv: Invitation }) {
  return (
    <div className="bg-white text-slate-800 font-serif text-[13px] leading-relaxed p-8 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <p className="font-bold text-base uppercase">{inv.namaSekolah}</p>
        <p>{inv.alamatSekolah}</p>
      </div>
      <div className="border-t border-b border-slate-300 py-2 mb-6 text-center">
        <p className="font-bold tracking-widest uppercase text-sm">Surat Rasmi</p>
      </div>
      <div className="flex justify-between mb-4">
        <div>
          <p className="font-semibold">Rujukan Kami : {inv.rujukan || "—"}</p>
          <p className="font-semibold">Tarikh : {formatTarikh(inv.tarikhMasa)}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="font-semibold">{inv.penerima}</p>
        <p>{inv.jawatanPenerima}</p>
        <p>{inv.alamatPenerima}</p>
      </div>
      <p className="font-bold underline mb-3">Perkara : {inv.tajukMesyuarat}</p>
      <p className="mb-4">Dengan hormatnya,</p>
      <p className="mb-4">
        Pihak sekolah dengan sukacita menjemput kehadiran {inv.penerima.toLowerCase()} ke mesyuarat
        yang akan dianjurkan seperti butiran berikut:
      </p>
      <table className="w-full border border-slate-400 mb-4 text-[12px]">
        <tbody>
          {[
            ["Tarikh & Masa", formatTarikhMasa(inv.tarikhMasa)],
            ["Lokasi", inv.lokasi],
            ["Penganjur", inv.penganjur],
          ].map(([k, v]) => (
            <tr key={k}>
              <td className="border border-slate-400 px-3 py-1.5 font-semibold bg-slate-50 w-36">{k}</td>
              <td className="border border-slate-400 px-3 py-1.5">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-semibold mb-1">Agenda Mesyuarat:</p>
      <div className="whitespace-pre-line mb-4 pl-4">{inv.agenda}</div>
      <p className="mb-6">{inv.penutup}</p>
      <div className="mt-10">
        <p>Yang benar,</p>
        <div className="h-16" />
        <p className="font-bold">({inv.namaPenandatangan})</p>
        <p>{inv.jawatanPenandatangan}</p>
      </div>
    </div>
  );
}

export default function SuratJemputanPage() {
  const { get, add, update, remove, ready } = useStore();
  const toast = useToast();
  const invitations = get("invitations");

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState<Invitation | null>(null);
  const [editing, setEditing] = useState<Invitation | null>(null);
  const [deleting, setDeleting] = useState<Invitation | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () => invitations.filter((i) => i.tajukMesyuarat.toLowerCase().includes(search.toLowerCase())),
    [invitations, search]
  );
  const { page, setPage, totalPages, paged } = usePagination(filtered, 8);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, namaPenandatangan: "", jawatanPenandatangan: "Ketua Panitia Kurikulum" });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (inv: Invitation) => {
    setEditing(inv);
    const { id, diciptaPada, ...rest } = inv;
    setForm(rest);
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.tajukMesyuarat.trim()) e.tajukMesyuarat = "Tajuk mesyuarat diperlukan";
    if (!form.tarikhMasa) e.tarikhMasa = "Tarikh & masa diperlukan";
    if (!form.rujukan.trim()) e.rujukan = "Nombor rujukan diperlukan";
    if (!form.penerima.trim()) e.penerima = "Maklumat penerima diperlukan";
    if (!form.namaPenandatangan.trim()) e.namaPenandatangan = "Nama penandatangan diperlukan";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    if (editing) {
      update("invitations", editing.id, { ...form });
      toast("Surat jemputan dikemas kini");
    } else {
      add("invitations", { ...form, id: uid(), diciptaPada: todayISO() } as Invitation);
      toast("Surat jemputan baharu dicipta");
    }
    setModalOpen(false);
  };

  const printLetter = (inv: Invitation) => {
    const w = window.open("", "_blank");
    if (!w) return;
    const el = document.getElementById("print-letter-root");
    w.document.write(`<html><head><title>${inv.tajukMesyuarat}</title>
      <style>body{font-family:Georgia,serif;margin:40px;color:#1e293b}table{border-collapse:collapse;width:100%}</style>
      </head><body>${el?.innerHTML ?? ""}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  const exportCSV = () => {
    const rows = [
      ["Rujukan", "Tajuk Mesyuarat", "Tarikh & Masa", "Lokasi", "Penganjur", "Penerima"],
      ...invitations.map((i) => [i.rujukan, i.tajukMesyuarat, formatTarikhMasa(i.tarikhMasa), i.lokasi, i.penganjur, i.penerima]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "senarai-surat-jemputan.csv";
    a.click();
    toast("Fail CSV dimuat turun");
  };

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        title="Surat Jemputan Mesyuarat"
        subtitle="Uruskan surat jemputan rasmi mesyuarat sekolah"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCSV}>Eksport CSV</Button>
            <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Cipta Surat</Button>
          </>
        }
      />

      <Card>
        <div className="p-4 border-b border-slate-100">
          <SearchInput value={search} onChange={setSearch} placeholder="Cari tajuk mesyuarat..." className="max-w-sm" />
        </div>
        {paged.length === 0 ? (
          <EmptyState title="Tiada surat jemputan" message="Cipta surat jemputan mesyuarat baharu untuk bermula." action={<Button size="sm" onClick={openCreate}>Cipta Surat</Button>} />
        ) : (
          <Table>
            <THead><Tr><Th>Rujukan</Th><Th>Tajuk Mesyuarat</Th><Th>Tarikh & Masa</Th><Th>Penganjur</Th><Th className="text-right">Tindakan</Th></Tr></THead>
            <TBody>
              {paged.map((inv) => (
                <Tr key={inv.id}>
                  <Td className="font-mono text-xs">{inv.rujukan}</Td>
                  <Td className="font-medium max-w-[280px] truncate">{inv.tajukMesyuarat}</Td>
                  <Td className="whitespace-nowrap">{formatTarikhMasa(inv.tarikhMasa)}</Td>
                  <Td>{inv.penganjur}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" title="Pratonton" onClick={() => setPreview(inv)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" title="Cetak / PDF" onClick={() => { setPreview(inv); setTimeout(() => printLetter(inv), 100); }}><Printer className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" title="Kemaskini" onClick={() => openEdit(inv)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" title="Padam" className="text-red-500 hover:text-red-600" onClick={() => setDeleting(inv)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </Card>

      {/* Create / Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Kemaskini Surat Jemputan" : "Cipta Surat Jemputan"} wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tajuk Mesyuarat" required error={errors.tajukMesyuarat} className="sm:col-span-2">
            <Input value={form.tajukMesyuarat} onChange={(e) => setForm({ ...form, tajukMesyuarat: e.target.value })} />
          </Field>
          <Field label="Tarikh & Masa Mesyuarat" required error={errors.tarikhMasa}>
            <Input type="datetime-local" value={form.tarikhMasa.slice(0, 16)} onChange={(e) => setForm({ ...form, tarikhMasa: new Date(e.target.value).toISOString() })} />
          </Field>
          <Field label="Nombor Rujukan" required error={errors.rujukan}>
            <Input value={form.rujukan} onChange={(e) => setForm({ ...form, rujukan: e.target.value })} placeholder="cth: BP/SPTK/03/2025" />
          </Field>
          <Field label="Lokasi" className="sm:col-span-2">
            <Input value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
          </Field>
          <Field label="Agenda Mesyuarat" className="sm:col-span-2">
            <Textarea value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} placeholder={"1. Perkara pertama\n2. Perkara kedua"} />
          </Field>
          <Field label="Nama Penganjur" className="sm:col-span-2">
            <Input value={form.penganjur} onChange={(e) => setForm({ ...form, penganjur: e.target.value })} />
          </Field>
          <Field label="Penerima Surat" required error={errors.penerima} className="sm:col-span-2">
            <Input value={form.penerima} onChange={(e) => setForm({ ...form, penerima: e.target.value })} />
          </Field>
          <Field label="Jawatan Penerima">
            <Input value={form.jawatanPenerima} onChange={(e) => setForm({ ...form, jawatanPenerima: e.target.value })} />
          </Field>
          <Field label="Alamat Penerima" className="sm:col-span-2">
            <Input value={form.alamatPenerima} onChange={(e) => setForm({ ...form, alamatPenerima: e.target.value })} />
          </Field>
          <Field label="Nama Sekolah">
            <Input value={form.namaSekolah} onChange={(e) => setForm({ ...form, namaSekolah: e.target.value })} />
          </Field>
          <Field label="Alamat Sekolah">
            <Input value={form.alamatSekolah} onChange={(e) => setForm({ ...form, alamatSekolah: e.target.value })} />
          </Field>
          <Field label="Penutup Surat" className="sm:col-span-2">
            <Input value={form.penutup} onChange={(e) => setForm({ ...form, penutup: e.target.value })} />
          </Field>
          <Field label="Nama Penandatangan" required error={errors.namaPenandatangan}>
            <Input value={form.namaPenandatangan} onChange={(e) => setForm({ ...form, namaPenandatangan: e.target.value })} />
          </Field>
          <Field label="Jawatan Penandatangan">
            <Input value={form.jawatanPenandatangan} onChange={(e) => setForm({ ...form, jawatanPenandatangan: e.target.value })} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
          <Button onClick={save}>{editing ? "Simpan Perubahan" : "Cipta Surat"}</Button>
        </div>
      </Modal>

      {/* Preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Pratonton Surat Rasmi" wide>
        {preview && (
          <>
            <div id="print-letter-root"><SuratTemplate inv={preview} /></div>
            <div className="flex justify-end gap-2 mt-4 no-print">
              <Button variant="outline" onClick={() => setPreview(null)}>Tutup</Button>
              <Button onClick={() => printLetter(preview)}><Printer className="w-4 h-4" /> Cetak / Simpan PDF</Button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            remove("invitations", deleting.id);
            toast("Surat jemputan dipadam");
          }
        }}
        message={`Padam surat jemputan "${deleting?.tajukMesyuarat}"?`}
      />
    </div>
  );
}
