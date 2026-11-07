"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Award, BookOpen, Download, FileQuestion, Lightbulb, Printer, ShieldCheck, Star } from "lucide-react";
import { Badge, Button, Card, EmptyState, Select } from "@/components/ui";
import { EduPageHeader } from "@/components/perniagaan/widgets";
import { downloadDataUrl, trackAndDownload } from "@/components/perniagaan/widgets";
import { useEdu } from "@/lib/perniagaan/store";
import { ESSENTIAL_T5_TOPICS, SPM_REVISION_TIPS } from "@/lib/perniagaan/data";
import { ExamPaper } from "@/lib/perniagaan/types";

function content(paper: ExamPaper, mode: "soalan" | "skema") {
  return [
    paper.tajuk.toUpperCase(),
    "=".repeat(60),
    `Tahun: ${paper.tahun}`,
    `Kertas: ${paper.kertas}`,
    `Jenis: ${paper.jenisDokumen}`,
    `Status: ${paper.status === "rasmi" ? "Dokumen rasmi" : "Slot placeholder"}`,
    "",
    mode === "soalan" ? "KERTAS SOALAN\n[Slot rujukan rasmi SPM. PDF asal akan dipaparkan apabila dimuat naik.]" : "SKEMA PEMARKAHAN\n[Slot skema rasmi SPM.]",
    "",
    "Nota: Jangan cipta soalan SPM. Hanya muat naik dokumen yang mempunyai hak untuk dikongsi.",
    "Hak cipta dokumen asal kekal pada Lembaga Peperiksaan Malaysia.",
  ].join("\n");
}

export default function SpmPage() {
  const { data, ready, addDownload, session } = useEdu();
  const [year, setYear] = useState<number | null>(null);
  const [kertas, setKertas] = useState("semua");

  const years = useMemo(() => [...(data?.spmYears ?? [])].sort((a, b) => b - a), [data]);
  const selectedYear = year ?? years[0] ?? new Date().getFullYear();

  const papers = useMemo(() => {
    if (!data) return [];
    let list = data.examPapers.filter((p) => p.kategori === "spm" && p.tahun === selectedYear);
    if (kertas !== "semua") list = list.filter((p) => p.kertas === kertas);
    return list.sort((a, b) => a.jenisDokumen.localeCompare(b.jenisDokumen));
  }, [data, selectedYear, kertas]);

  const download = (paper: ExamPaper, mode: "soalan" | "skema") => {
    const item = { id: `${paper.id}-${mode}`, jenis: "muat_turun" as const, label: `${paper.tajuk} ${mode}`, href: "/spm", tarikh: new Date().toISOString() };
    if (paper.failData && mode === "soalan") {
      downloadDataUrl(paper.failNama ?? `${paper.id}.pdf`, paper.failData);
      addDownload(item);
      return;
    }
    trackAndDownload(item, `${paper.id}-${mode}.txt`, content(paper, mode));
    addDownload(item);
  };

  const canManage = session?.peranan === "admin" || session?.peranan === "guru";

  if (!ready || !data) return <div className="py-20 text-center text-sm text-slate-400">Memuatkan soalan SPM...</div>;

  return (
    <div>
      <EduPageHeader
        title="Soalan SPM Sebenar 5 Tahun Lepas"
        subtitle="Rujukan kertas Peperiksaan Sijil Pelajaran Malaysia dengan slot dokumen rasmi dan skema pemarkahan."
        actions={canManage ? <Link href="/panel-admin?tab=peperiksaan"><Button variant="outline" size="sm"><ShieldCheck className="h-4 w-4" /> Urus Tahun & Dokumen</Button></Link> : undefined}
      />

      <div className="mb-5 grid gap-3 rounded-2xl border border-primary-100 bg-white p-4 dark:border-white/10 dark:bg-[#221a30] sm:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">Pilih Tahun SPM</p>
          <p className="text-xs text-slate-400">Lima tahun terkini yang dikonfigurasi oleh panel admin.</p>
        </div>
        <Select value={selectedYear} onChange={(e) => setYear(Number(e.target.value))} className="sm:w-48">
          {years.map((y) => <option key={y} value={y}>SPM {y}</option>)}
        </Select>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button size="sm" variant={kertas === "semua" ? "primary" : "outline"} onClick={() => setKertas("semua")}>Semua Kertas</Button>
        <Button size="sm" variant={kertas === "Kertas 1" ? "primary" : "outline"} onClick={() => setKertas("Kertas 1")}>Kertas 1</Button>
        <Button size="sm" variant={kertas === "Kertas 2" ? "primary" : "outline"} onClick={() => setKertas("Kertas 2")}>Kertas 2</Button>
        <Badge tone="amber">{papers.filter((p) => p.status === "placeholder").length} slot menunggu dokumen rasmi</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-magenta-500" />
            <h2 className="font-bold text-slate-900 dark:text-white">Dokumen SPM {selectedYear}</h2>
          </div>
          {papers.length === 0 ? (
            <Card><EmptyState title="Tiada dokumen untuk tahun ini" message="Pilih tahun lain atau tambah dokumen melalui Panel Admin." /></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {papers.map((paper) => (
                <Card key={paper.id} className="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-pop">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="rounded-xl bg-softpink-100 p-3 text-magenta-600 dark:bg-white/10 dark:text-lavender-200">
                      <FileQuestion className="h-5 w-5" />
                    </div>
                    <Badge tone={paper.status === "rasmi" ? "green" : "amber"}>{paper.status === "rasmi" ? "Rasmi" : "Placeholder"}</Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{paper.tajuk}</h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge tone="purple">{paper.tahun}</Badge>
                    <Badge tone="pink">{paper.kertas}</Badge>
                    <Badge tone="lavender">{paper.jenisDokumen}</Badge>
                    <Badge tone="rose">T5</Badge>
                  </div>
                  <p className="mt-3 flex-1 text-sm text-slate-500 dark:text-slate-400">{paper.catatan}</p>
                  {paper.failData && (
                    <a href={paper.failData} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-semibold text-primary-600 hover:underline">
                      Lihat fail: {paper.failNama}
                    </a>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
                    <Button size="sm" onClick={() => download(paper, "soalan")}><Download className="h-4 w-4" /> Soalan</Button>
                    <Button size="sm" variant="outline" onClick={() => download(paper, "skema")}><Printer className="h-4 w-4" /> Skema</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <h2 className="font-bold text-slate-900 dark:text-white">Topik Kerap Keluar</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {ESSENTIAL_T5_TOPICS.map((topic) => <Badge key={topic} tone="pink">{topic}</Badge>)}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary-500" />
              <h2 className="font-bold text-slate-900 dark:text-white">Tips Ulang Kaji SPM</h2>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {SPM_REVISION_TIPS.map((tip) => (
                <li key={tip} className="flex gap-2"><BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-magenta-500" />{tip}</li>
              ))}
            </ul>
          </Card>

          <Card className="border-red-100 bg-red-50/60 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-200">
            <p className="font-semibold">Nota Hak Cipta</p>
            <p className="mt-1">Jangan hasilkan semula soalan SPM palsu. Muat naik hanya dokumen rasmi atau bahan yang anda mempunyai hak untuk dikongsi.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
