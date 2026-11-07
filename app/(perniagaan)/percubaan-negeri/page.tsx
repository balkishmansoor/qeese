"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Download, FileQuestion, Printer, Search, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, EmptyState, Input, Select, usePagination, Pagination } from "@/components/ui";
import { EduPageHeader } from "@/components/perniagaan/widgets";
import { downloadDataUrl, trackAndDownload } from "@/components/perniagaan/widgets";
import { useEdu } from "@/lib/perniagaan/store";
import { NEGERI_PERCUBAAN } from "@/lib/perniagaan/data";
import { ExamPaper, Tingkatan } from "@/lib/perniagaan/types";

function paperContent(paper: ExamPaper, mode: "soalan" | "skema") {
  return [
    paper.tajuk.toUpperCase(),
    "=".repeat(60),
    `Negeri: ${paper.negeri ?? "Semua Negeri"}`,
    `Tahun: ${paper.tahun}`,
    `Tingkatan: ${paper.tingkatan === "T4" ? "Tingkatan 4" : paper.tingkatan === "T5" ? "Tingkatan 5" : "Semua Tingkatan"}`,
    `Kertas: ${paper.kertas}`,
    `Status: ${paper.status === "rasmi" ? "Dokumen rasmi" : "Slot placeholder"}`,
    "",
    mode === "soalan"
      ? "KERTAS SOALAN\n[Slot dokumen rasmi. PDF sebenar akan dipaparkan apabila dimuat naik oleh guru/admin.]"
      : "SKEMA PEMARKAHAN\n[Slot skema pemarkahan rasmi. Skema sebenar akan dipaparkan apabila dimuat naik oleh guru/admin.]",
    "",
    paper.catatan ?? "",
    "Hak cipta dokumen asal kekal pada penerbit/pihak berkuasa negeri yang berkaitan.",
  ].join("\n");
}

export default function PercubaanNegeriPage() {
  const { data, ready, addDownload, session } = useEdu();
  const [negeri, setNegeri] = useState("semua");
  const [tahun, setTahun] = useState("semua");
  const [tingkatan, setTingkatan] = useState<Tingkatan | "Semua">("Semua");
  const [kertas, setKertas] = useState("semua");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.examPapers.filter((p) => p.kategori === "percubaan");
    if (negeri !== "semua") list = list.filter((p) => p.negeri === negeri);
    if (tahun !== "semua") list = list.filter((p) => String(p.tahun) === tahun);
    if (tingkatan !== "Semua") list = list.filter((p) => p.tingkatan === tingkatan);
    if (kertas !== "semua") list = list.filter((p) => p.kertas === kertas);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.tajuk.toLowerCase().includes(q) || p.negeri?.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.tahun - a.tahun || (a.negeri ?? "").localeCompare(b.negeri ?? ""));
  }, [data, negeri, tahun, tingkatan, kertas, search]);

  const { page, setPage, totalPages, paged } = usePagination(filtered, 12);
  const years = data?.percubaanYears ?? [];
  const canManage = session?.peranan === "admin" || session?.peranan === "guru";

  const download = (paper: ExamPaper, mode: "soalan" | "skema") => {
    const item = { id: `${paper.id}-${mode}`, jenis: "muat_turun" as const, label: `${paper.tajuk} ${mode}`, href: "/percubaan-negeri", tarikh: new Date().toISOString() };
    if (paper.failData && mode === "soalan") {
      downloadDataUrl(paper.failNama ?? `${paper.id}.pdf`, paper.failData);
      addDownload(item);
      return;
    }
    trackAndDownload(item, `${paper.id}-${mode}.txt`, paperContent(paper, mode));
    addDownload(item);
  };

  if (!ready || !data) return <div className="py-20 text-center text-sm text-slate-400">Memuatkan kertas percubaan...</div>;

  return (
    <div>
      <EduPageHeader
        title="Soalan Percubaan Negeri"
        subtitle="Kertas percubaan mengikut negeri, tahun, tingkatan dan kertas peperiksaan."
        actions={canManage ? <Link href="/panel-admin?tab=peperiksaan"><Button variant="outline" size="sm"><ShieldCheck className="h-4 w-4" /> Urus Dokumen</Button></Link> : undefined}
      />

      <Card className="mb-5 border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
        <FileQuestion className="mr-2 inline h-4 w-4" />
        Kebanyakan rekod adalah slot placeholder untuk struktur bank soalan. Guru/admin boleh memuat naik PDF dan skema rasmi melalui Panel Admin.
      </Card>

      <Card className="mb-5 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_160px_160px_160px_160px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari negeri atau tajuk..." className="pl-9" />
          </div>
          <Select value={negeri} onChange={(e) => setNegeri(e.target.value)}>
            <option value="semua">Semua Negeri</option>
            {NEGERI_PERCUBAAN.map((n) => <option key={n} value={n}>{n}</option>)}
          </Select>
          <Select value={tahun} onChange={(e) => setTahun(e.target.value)}>
            <option value="semua">Semua Tahun</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
          <Select value={tingkatan} onChange={(e) => setTingkatan(e.target.value as Tingkatan | "Semua")}>
            <option value="Semua">Semua Tingkatan</option>
            <option value="T4">Tingkatan 4</option>
            <option value="T5">Tingkatan 5</option>
          </Select>
          <Select value={kertas} onChange={(e) => setKertas(e.target.value)}>
            <option value="semua">Semua Kertas</option>
            <option>Kertas 1</option>
            <option>Kertas 2</option>
          </Select>
        </div>
      </Card>

      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{filtered.length} rekod ditemui · Halaman {page}/{totalPages}</p>

      {paged.length === 0 ? (
        <Card><EmptyState title="Tiada kertas ditemui" message="Cuba ubah negeri, tahun atau kertas." /></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paged.map((paper) => (
            <Card key={paper.id} className="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-pop">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="rounded-xl bg-primary-50 p-3 text-primary-600 dark:bg-white/10 dark:text-lavender-200">
                  <FileQuestion className="h-5 w-5" />
                </div>
                <Badge tone={paper.status === "rasmi" ? "green" : "amber"}>{paper.status === "rasmi" ? "Rasmi" : "Placeholder"}</Badge>
              </div>
              <h3 className="font-semibold leading-snug text-slate-900 dark:text-white">{paper.tajuk}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="purple">{paper.negeri}</Badge>
                <Badge tone="pink">{paper.tahun}</Badge>
                <Badge tone="lavender">{paper.kertas}</Badge>
                <Badge tone="rose">{paper.tingkatan === "T4" ? "T4" : paper.tingkatan === "T5" ? "T5" : "Semua"}</Badge>
              </div>
              <p className="mt-3 flex-1 text-sm text-slate-500 dark:text-slate-400">{paper.catatan}</p>
              {paper.failData && (
                <a href={paper.failData} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-semibold text-primary-600 hover:underline">
                  Lihat fail: {paper.failNama}
                </a>
              )}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
                <Button size="sm" variant="soft" onClick={() => download(paper, "soalan")}><Download className="h-4 w-4" /> Soalan</Button>
                <Button size="sm" variant="outline" onClick={() => download(paper, "skema")}><Printer className="h-4 w-4" /> Skema</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-4"><Pagination page={page} totalPages={totalPages} onPage={setPage} /></div>
    </div>
  );
}
