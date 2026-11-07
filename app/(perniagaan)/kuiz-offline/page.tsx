"use client";

import React, { useMemo, useState } from "react";
import { Download, Printer, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, EmptyState, Select } from "@/components/ui";
import { EduPageHeader } from "@/components/perniagaan/widgets";
import { trackAndDownload } from "@/components/perniagaan/widgets";
import { useEdu } from "@/lib/perniagaan/store";
import { Kesukaran, QuizQuestion, Tingkatan } from "@/lib/perniagaan/types";

function worksheetText(questions: QuizQuestion[], mode: "soalan" | "skema") {
  const lines: string[] = [];
  lines.push("PANITIA PERNIAGAAN - KUIZ LUAR TALIAN");
  lines.push("=".repeat(60));
  lines.push(mode === "soalan" ? "KERTAS SOALAN" : "SKEMA PEMARKAHAN");
  lines.push("");
  questions.forEach((q, i) => {
    lines.push(`${i + 1}. [${q.markah} markah] ${q.soalan}`);
    q.pilihan.forEach((p: string, j: number) => lines.push(`   ${String.fromCharCode(65 + j)}. ${p}`));
    if (mode === "skema") {
      lines.push(`   Jawapan: ${q.pilihan[q.jawapan]}`);
      lines.push(`   Penerangan: ${q.penerangan}`);
    } else {
      lines.push("   Jawapan: ....................................................");
    }
    lines.push("");
  });
  if (mode === "soalan") {
    lines.push("-".repeat(60));
    lines.push("Nama: ____________________________  Kelas: ____________  Markah: ______ /");
  }
  lines.push("Dokumen contoh untuk kegunaan pembelajaran.");
  return lines.join("\n");
}

export default function KuizOfflinePage() {
  const { data, ready, addDownload } = useEdu();
  const [tingkatan, setTingkatan] = useState<Tingkatan>("T4");
  const [bab, setBab] = useState("semua");
  const [jenis, setJenis] = useState<"semua" | "objektif" | "benar_salah">("semua");
  const [kesukaran, setKesukaran] = useState<Kesukaran | "semua">("semua");
  const [printMode, setPrintMode] = useState<"soalan" | "skema" | null>(null);

  const chapters = useMemo(() => data?.chapters.filter((c) => c.tingkatan === tingkatan) ?? [], [data, tingkatan]);

  const questions = useMemo(() => {
    if (!data) return [];
    let list = data.quizQuestions.filter((q) => q.tingkatan === tingkatan);
    if (bab !== "semua") list = list.filter((q) => String(q.bab) === bab);
    if (jenis !== "semua") list = list.filter((q) => q.jenis === jenis);
    if (kesukaran !== "semua") list = list.filter((q) => q.kesukaran === kesukaran);
    return list.slice(0, 20);
  }, [data, tingkatan, bab, jenis, kesukaran]);

  const print = (mode: "soalan" | "skema") => {
    setPrintMode(mode);
    window.setTimeout(() => window.print(), 50);
  };

  const download = (mode: "soalan" | "skema") => {
    const filename = `kuiz-offline-${tingkatan}-${mode}-${Date.now()}.txt`;
    trackAndDownload(
      { id: `offline-${mode}`, jenis: "muat_turun", label: `Kuiz offline ${mode}`, href: "/kuiz-offline", tarikh: new Date().toISOString() },
      filename,
      worksheetText(questions, mode)
    );
    addDownload({ id: `offline-${mode}`, jenis: "muat_turun", label: `Kuiz offline ${mode}`, href: "/kuiz-offline", tarikh: new Date().toISOString() });
  };

  if (!ready || !data) return <div className="py-20 text-center text-sm text-slate-400">Memuatkan kuiz luar talian...</div>;

  return (
    <div>
      <EduPageHeader
        title="Kuiz Offline / Boleh Cetak"
        subtitle="Jana kertas soalan dan skema jawapan untuk kegunaan kelas tanpa sambungan internet."
        actions={<Badge tone="lavender">Boleh dicetak / simpan PDF melalui pelayar</Badge>}
      />

      <div className="edu-no-print">
      <div className="mb-5 rounded-2xl border border-lavender-200 bg-lavender-50/70 p-4 text-sm text-lavender-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        <ShieldCheck className="mr-2 inline h-4 w-4" />
        Laman ini menyokong PWA. Setelah dimuatkan sekali, halaman yang telah dilawati boleh dibuka semula dalam talian.
      </div>

      <Card className="mb-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Tingkatan</span>
            <Select value={tingkatan} onChange={(e) => { setTingkatan(e.target.value as Tingkatan); setBab("semua"); }}>
              <option value="T4">Tingkatan 4</option>
              <option value="T5">Tingkatan 5</option>
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Bab</span>
            <Select value={bab} onChange={(e) => setBab(e.target.value)}>
              <option value="semua">Semua Bab</option>
              {chapters.map((c) => <option key={c.id} value={c.nombor}>Bab {c.nombor}</option>)}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Jenis</span>
            <Select value={jenis} onChange={(e) => setJenis(e.target.value as typeof jenis)}>
              <option value="semua">Semua Jenis</option>
              <option value="objektif">Objektif</option>
              <option value="benar_salah">Betul / Palsu</option>
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Kesukaran</span>
            <Select value={kesukaran} onChange={(e) => setKesukaran(e.target.value as Kesukaran | "semua")}>
              <option value="semua">Semua</option>
              <option value="mudah">Mudah</option>
              <option value="sederhana">Sederhana</option>
              <option value="sukar">Sukar</option>
            </Select>
          </label>
          <div className="flex items-end gap-2">
            <Button onClick={() => print("soalan")} disabled={questions.length === 0} className="flex-1"><Printer className="h-4 w-4" /> Kertas Soalan</Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => print("skema")} disabled={questions.length === 0}><Printer className="h-4 w-4" /> Cetak Skema</Button>
          <Button variant="outline" onClick={() => download("soalan")} disabled={questions.length === 0}><Download className="h-4 w-4" /> Muat Turun Soalan</Button>
          <Button variant="outline" onClick={() => download("skema")} disabled={questions.length === 0}><Download className="h-4 w-4" /> Muat Turun Skema</Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {questions.map((q, i) => (
          <Card key={q.id} className="p-5">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="purple">{i + 1}</Badge>
              <Badge tone="pink">{q.markah} markah</Badge>
              <Badge tone="lavender">{q.kesukaran}</Badge>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{q.soalan}</p>
            <div className="mt-3 space-y-1 text-sm text-slate-500 dark:text-slate-400">
              {q.pilihan.map((p, j) => <p key={j}>{String.fromCharCode(65 + j)}. {p}</p>)}
            </div>
          </Card>
        ))}
      </div>
      {questions.length === 0 && <Card><EmptyState title="Tiada soalan" message="Laraskan penapis untuk menjana kertas latihan." /></Card>}
      </div>

      <div className="edu-print-only mt-8 hidden">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-300 bg-white p-8 text-slate-900">
          <h1 className="text-center text-xl font-bold">PANITIA PERNIAGAAN - KUIZ LUAR TALIAN</h1>
          <p className="mt-1 text-center text-sm">{printMode === "skema" ? "SKEMA PEMARKAHAN" : "KERTAS SOALAN"} · {tingkatan === "T4" ? "Tingkatan 4" : "Tingkatan 5"}</p>
          <div className="mt-6 space-y-5">
            {questions.map((q, i) => (
              <div key={q.id}>
                <p className="font-semibold">{i + 1}. {q.soalan} <span className="font-normal">({q.markah} markah)</span></p>
                <div className="mt-2 space-y-1 pl-5 text-sm">
                  {q.pilihan.map((p, j) => <p key={j}>{String.fromCharCode(65 + j)}. {p}</p>)}
                </div>
                {printMode === "skema" && (
                  <p className="mt-2 pl-5 text-sm"><strong>Jawapan:</strong> {q.pilihan[q.jawapan]}<br /><strong>Penerangan:</strong> {q.penerangan}</p>
                )}
                {printMode === "soalan" && <p className="mt-2 pl-5 text-sm">Jawapan: ______________________</p>}
              </div>
            ))}
          </div>
          {printMode === "soalan" && (
            <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
              <p>Nama: ____________________________</p>
              <p>Kelas: ____________________________</p>
              <p className="col-span-2">Markah: __________________ / {questions.reduce((sum, q) => sum + q.markah, 0)}</p>
            </div>
          )}
          <p className="mt-8 text-center text-xs text-slate-500">Dokumen contoh untuk kegunaan pembelajaran. Sila sahkan kandungan dengan guru panitia.</p>
        </div>
      </div>
    </div>
  );
}
